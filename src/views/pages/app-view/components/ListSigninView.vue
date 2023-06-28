<template>
  <v-container>
    <h1 class="title-helios">{{ $t('page.signatures.title') }}</h1>
    <v-container v-on:keyup.enter="loadSignatures" class="border-2 border-grey bg-white px-5 mb-5">
      <v-row>
        <v-col cols="4">
          <SelectGeneric
            v-model="searchModelRef.statut"
            input-id="statut"
            :title="$tc('forms.labels.status')"
            :items="statutsComputed"
            :isClearable="true"
            @click:clear="clearStatut()"
          />
        </v-col>
        <v-col cols="4">
          <InputGeneric
            v-model="searchModelRef.contractNum"
            input-id="numContrat"
            input="numContrat"
            :title="$tc('forms.labels.contractNum')"
            input-type="text"
          />
        </v-col>
        <v-col cols="4">
          <InputGeneric
            v-model="searchModelRef.signatoryName"
            input-id="nomSignature"
            input="nomSignature"
            :title="$tc('forms.labels.signinName')"
            input-type="text"
          />
        </v-col>
        <v-col cols="12">
          <div class="d-flex align-center items-center justify-end h-100">
            <v-btn color="primary" small @click="searchSignature()">
              <v-icon class="mr-2" small>mdi-magnify</v-icon>
              {{ $t('forms.buttons.search') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="border-2 border-grey bg-white py-5">
      <div class="d-flex justify-end pr-5">
        <v-menu :light="true" :close-on-content-click="false" offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" small v-bind="attrs" v-on="on">
              <v-icon class="mr-2" small>mdi-filter-variant</v-icon>
              {{ $t('forms.buttons.filters') }}
            </v-btn>
          </template>
          <v-card :light="true">
            <v-list>
              <v-list-item v-for="key in getObjectKeys(displayHeadersRef)" :key="key">
                <v-list-item-action>
                  <v-switch v-model="displayHeadersRef[key].sortable" color="primary"></v-switch>
                </v-list-item-action>
                <v-list-item-title>
                  {{ displayHeadersRef[key].text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
      <div class="devis-list__container">
        <v-data-table
          :class="{ 'data-table': getTotalPages() > 1 }"
          :light="true"
          :headers="headersComputed"
          :items="signatureRef"
          calculate-widths
          :loading="isLoadingListSignElec"
          must-sort
          :items-per-page="pageSize"
          :server-items-length="totalSignatures"
          :options.sync="paginationRef"
          :hide-default-footer="true"
          @update:sort-desc="sortSignatures()"
        >
          <template v-slot:[`item.client`]="{ item }">
            <span v-if="item.representantPersonnePhysique">
              {{
                customer(
                  item.representantPersonnePhysique.nom,
                  item.representantPersonnePhysique.prenom
                )
              }}
            </span>
          </template>
          <template v-slot:[`item.numero`]="{ item }">
            <v-btn
              text
              :ripple="false"
              class="font-weight-regular text-body no-background-hover"
              :to="{ name: 'OverviewDevis', query: { id: item.id } }"
            >
              {{ item.numeroDevis }}
            </v-btn>
          </template>
          <template v-slot:[`item.statut`]="{ item }">
            <v-chip class="status" outlined label :color="getColor(item.statut)" dark small>
              {{ getLabel(item.statut) }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <SigningListActions
              v-if="item.statut !== SignatureElectroniqueStatutEnum.Abandonne"
              :signature="item"
              :actions="actions"
              @action="execAction($event)"
            />
          </template>
          <template v-slot:[`item.dateCreationTechnique`]="{ item }">
            {{ formatDate(item.dateCreationTechnique) || '-' }}
          </template>
          <template v-slot:[`item.dateExpiration`]="{ item }">
            {{ formatDate(item.dateExpiration) || '-' }}
          </template>
        </v-data-table>
      </div>
      <v-pagination
        v-if="getTotalPages() > 1"
        class="mt-8"
        v-model="paginationRef.page"
        :length="getTotalPages()"
        :show-first-last-page="true"
        total-visible="7"
        circle
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        @input="searchSignature($event)"
      ></v-pagination>
    </div>
  </v-container>
</template>
<script setup lang="ts">
import useStatus from '@/composables/useStatus';
import { useI18n } from 'vue-i18n';
import { signatureElectroniqueApi } from '@/plugins/open-api';
import {
  SignatureElectroniqueStatutEnum,
  type SignatureElectronique,
  type SignatureElectroniqueIdNom,
  type SignatureElectroniqueSignatureElectroniquePaginated
} from 'open-api-souscription-typescript';
import SigningListActions from '@/components/common/table/SigningListActions.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { format } from 'date-fns';
import type VueI18n from 'vue-i18n';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import useSnackBar from '@/composables/useSnackBar';
import useLoader from '@/composables/useLoader';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useConstante from '@/composables/useConstante';
import type { DataOptions, DataTableHeader } from 'vuetify';

export interface ISearchModel {
  contractNum: string;
  signatoryName: string;
  statut: any;
  byInput: string;
}

export interface IDisplayHeaders {
  phone: DataTableHeader;
  mail: DataTableHeader;
}

interface IAction {
  title: VueI18n.TranslateResult;
  icon: string;
  cypress: string;
  action: string;
  color?: string;
}

const searchModelRef = ref<ISearchModel>({
  contractNum: '',
  signatoryName: '',
  statut: null,
  byInput: ''
});

const { SIGNATURE_ACTIONS } = useConstante();
const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const { setLoaderGlobal } = useLoader();
const { getColor, getLabel } = useStatus();
const paginationRef = ref<DataOptions>();
const pageSize = 10;
const totalSignatures = ref<number>(0);
const signatureRef = ref<SignatureElectronique[]>([]);
const actions: IAction[] = [
  {
    title: `${i18n.t('forms.buttons.followUpSignin')}`,
    icon: 'mdi-email',
    cypress: '',
    action: ''
  },
  {
    title: `${i18n.t('forms.buttons.dropOutSignin')}`,
    icon: 'mdi-pencil-remove',
    color: 'error--text',
    cypress: '',
    action: ''
  }
];

const displayHeadersRef = ref<IDisplayHeaders>({
  phone: { text: i18n.tc('forms.labels.signinPhone'), value: 'false', sortable: false },
  mail: { text: i18n.tc('forms.labels.signinMail'), value: 'false', sortable: false }
});

const {
  isLoading: isLoadingListSignElec,
  isError: isErrorListSignElec,
  data: listSignElec,
  doFetch: doFetchListSignElec
} = useApiCall<SignatureElectroniqueSignatureElectroniquePaginated>({
  route: signatureElectroniqueApi().listSignatureElectronique
});

const {
  isLoading: isLoadingAbortSign,
  isError: isErrorAbortSign,
  data: abortSignResponse,
  doFetch: doFetchAbortSign
} = useApiCall<SignatureElectronique>({
  route: signatureElectroniqueApi().abortSignature
});

const {
  isLoading: isLoadingRelanceSign,
  isError: isErrorRelanceSign,
  data: relanceSignResponse,
  doFetch: doFetchRelanceSign
} = useApiCall<SignatureElectroniqueIdNom>({
  route: signatureElectroniqueApi().relanceSignature
});

const headersComputed = computed(() => {
  const headers: DataTableHeader[] = [
    {
      text: i18n.tc('forms.labels.idContrat'),
      align: 'start',
      value: 'numeroContrat'
    },
    { text: 'Nom signataire', value: 'signataire.nom' }
  ];
  headers.push({ text: i18n.tc('forms.labels.signinLaunch'), value: 'dateCreationTechnique' });
  if (displayHeadersRef.value.phone.sortable) {
    headers.push({
      text: i18n.tc('forms.labels.signinPhone'),
      value: 'signataire.portable',
      sortable: false
    });
  }
  if (displayHeadersRef.value.mail.sortable) {
    headers.push({
      text: i18n.tc('forms.labels.signinMail'),
      value: 'signataire.mail',
      sortable: false
    });
  }
  headers.push(
    { text: i18n.tc('forms.labels.status'), value: 'statut' },
    { text: i18n.tc('forms.labels.dateExpire'), value: 'dateExpiration', sortable: false },
    { text: '', value: 'actions', sortable: false }
  );
  return headers;
});

const statutsComputed = computed(() => {
  const output: DataTableHeader[] = [
    { text: i18n.tc('enums.status.current'), value: SignatureElectroniqueStatutEnum.EnCours },
    {
      text: i18n.tc('enums.status.archive'),
      value: SignatureElectroniqueStatutEnum.Archive
    },
    { text: i18n.tc('enums.status.abandoned'), value: SignatureElectroniqueStatutEnum.Abandonne },
    { text: i18n.tc('enums.status.ended'), value: SignatureElectroniqueStatutEnum.Termine }
  ];

  return output;
});

onMounted(() => {
  paginationRef.value = {
    ...paginationRef.value,
    sortBy: ['dateCreationTechnique'],
    sortDesc: [true]
  };
  loadSignatures();
});

const getObjectKeys = (displayHeadersRef) => {
  return Object.keys(displayHeadersRef);
};

const getTotalPages = () => {
  return Math.ceil(totalSignatures.value / pageSize);
};

const searchSignature = (currentPage?: number) => {
  paginationRef.value = { ...paginationRef.value, page: currentPage ?? 1 };
  loadSignatures();
};

const loadSignatures = async () => {
  const sortOptions = getSortOptions();

  await doFetchListSignElec(
    searchModelRef.value.contractNum,
    searchModelRef.value.signatoryName,
    searchModelRef.value.statut ? [searchModelRef.value.statut] : [],
    paginationRef.value.page,
    paginationRef.value.itemsPerPage,
    sortOptions
  );
  if (isErrorListSignElec.value) {
    addMessageErrorSnackBarAction(i18n.tc('Signin.error'));
  }
  if (listSignElec.value) {
    signatureRef.value = listSignElec.value.data;
    totalSignatures.value = listSignElec.value.total;
    window.scrollTo(0, 0);
  }
};

const getSortOptions = (): string => {
  const sortKey =
    paginationRef.value.sortBy[0] === 'signataire.nom' ? 'nom' : paginationRef.value.sortBy[0];
  return `${sortKey}:${paginationRef.value.sortDesc[0] ? 'desc' : 'asc'}`;
};

const clearStatut = () => {
  searchModelRef.value.statut = [];
};

const customer = (name: string, firstname: string) => {
  return `${name} ${firstname}`;
};

const formatDate = (date: string): string => {
  if (date) {
    return format(new Date(date), 'dd-MM-yyyy').toString();
  }
};

const execAction = (event: any) => {
  switch (event.action) {
    case SIGNATURE_ACTIONS.ABANDON: {
      abondonSignature(event.item.id);
      break;
    }
    case SIGNATURE_ACTIONS.RAISE: {
      raiseSigner(event.item.id);
      break;
    }
    case SIGNATURE_ACTIONS.DOWNLOAD: {
      downloadDoc(event.item.lienTelechargement);
      break;
    }
  }
};

const abondonSignature = async (id: number) => {
  await doFetchAbortSign(id);
  if (isErrorAbortSign.value) {
    addMessageErrorSnackBarAction(i18n.tc('Signin.abandon.error'));
  }
  if (abortSignResponse.value) {
    const selectedSignatureIndex = signatureRef.value.findIndex((e: any) => e.id === id);
    signatureRef.value[selectedSignatureIndex].statut = abortSignResponse.value.statut;
    addMessageSuccesSnackBarAction(i18n.tc('Signin.abandon.succes'));
  }
};

const raiseSigner = async (id: number) => {
  await doFetchRelanceSign(id);
  if (isErrorRelanceSign.value) {
    addMessageErrorSnackBarAction(i18n.tc('Signin.raise.error'));
  }
  if (relanceSignResponse.value) {
    addMessageSuccesSnackBarAction(i18n.tc('Signin.raise.succes'));
  }
};

const downloadDoc = (downloadLink: string) => {
  if (downloadLink) {
    window.location.assign(downloadLink);
  } else {
    addMessageErrorSnackBarAction(i18n.tc('Signin.download.error'));
  }
};

const sortSignatures = (): boolean => {
  searchSignature();
  return paginationRef.value.sortDesc[0];
};

watch(
  () => [isLoadingAbortSign.value, isLoadingRelanceSign.value],
  ([isLoadingAbortSign, isLoadingRelanceSign]) => {
    setLoaderGlobal({
      isLoading: isLoadingAbortSign || isLoadingRelanceSign
    });
  }
);
</script>

<style scoped>
.status {
  display: block;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.data-table {
  min-height: 33rem;
}
</style>
