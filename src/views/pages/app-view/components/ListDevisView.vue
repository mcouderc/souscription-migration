<template>
  <v-container>
    <template v-if="isAuthenticatedComputed">
      <h1 class="title-helios">{{ $t('page.listDevis.title') }}</h1>
      <v-container v-on:keyup.enter="loadDevisList" class="border-2 border-grey bg-white px-5 mb-5">
        <FormInputGeneric3></FormInputGeneric3>
        <v-row>
          searchModelRef: {{ searchModelRef.searchInput }}
          <v-col cols="4">
            <InputGeneric
              v-model="searchModelRef.searchInput"
              name="searchInput"
              label="Recherche"
              type="text"
              value=""
              :is-required="true"
              input-id="devisNumber"
              :title="$tc('forms.labels.search')"
              input-type="text"
            />
          </v-col>
          <v-col cols="4">
            <PermissionForAllRolesButBroker>
              <ComboboxGeneric
                v-model="searchModelRef.iaCodeInput"
                :title="$tc('forms.labels.iaCode')"
                :items="iasList"
                :itemsKeys="['iaCodes', 'keyIaCode', 'valueIaCode']"
                :isClearable="true"
                :isMultiple="true"
                input-id="iaCode"
                :return-object="false"
              />
            </PermissionForAllRolesButBroker>
          </v-col>

          <v-col cols="4">
            <PermissionForAllRolesButBroker>
              <ComboboxGeneric
                v-model="searchModelRef.groupeComptable"
                :title="$tc('forms.labels.groupeComptable')"
                :items="delegations"
                :isClearable="true"
                :isMultiple="true"
                input-id="delegation"
                :return-object="false"
              />
            </PermissionForAllRolesButBroker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-menu
              v-model="menuRangeRef"
              :light="true"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <label>{{ $t('forms.labels.dateRange') }}</label>
                <v-text-field
                  class="datepicker pt-0 mt-0"
                  :light="true"
                  :value="searchModelRef.dateInput"
                  placeholder="JJ-MM-AAAA"
                  append-icon="mdi-calendar-month"
                  readonly
                  clearable
                  v-bind="props"
                  @click:clear="clearRange()"
                ></v-text-field>
              </template>
              <!-- <v-date-picker
                class="datepicker pt-0 pb-0"
                v-model="searchModelRef.dateInput"
                no-title
                range
              ></v-date-picker> -->
            </v-menu>
          </v-col>
          <v-col cols="4">
            <SelectGeneric
              v-model="searchModelRef.statutInput"
              input-id="status"
              :title="$tc('forms.labels.status')"
              :items="statutsComputed"
              :itemsKeys="['status', 'text', 'value']"
              :is-multiple="true"
              :is-clearable="true"
              @click:clear="clearStatut()"
            />
          </v-col>
          <v-col cols="4">
            <SelectGeneric
              v-model="searchModelRef.byInput"
              input-id="status"
              :title="$tc('forms.labels.by')"
              :items="redacteursRef"
              :is-clearable="true"
              @click:clear="clearBy()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center items-center justify-end h-100">
              <v-btn color="primary" small @click="searchDevis()">
                <v-icon class="mr-2" small>mdi-magnify</v-icon>
                {{ $t('forms.buttons.search') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <div class="d-flex justify-end my-5 pr-5">
        <v-btn color="success" small :disabled="devisListRef.length <= 0" @click="exportExcel()">
          <v-icon class="mr-2" small>mdi-microsoft-excel</v-icon>
          {{ $t('forms.buttons.exportExcel') }}
        </v-btn>
      </div>

      <div class="border-2 border-grey bg-white py-5">
        <div class="d-flex justify-end pr-5 pb-5">
          <v-menu :light="true" :close-on-content-click="false" offset-x>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" small v-bind="props">
                <v-icon class="mr-2" small>mdi-filter-variant</v-icon>
                {{ $t('forms.buttons.filters') }}
              </v-btn>
            </template>
            <v-card :light="true">
              <v-list>
                <v-list-item v-for="key in Object.keys(displayHeadersRef)" :key="key">
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
          <template v-if="getTotalPages() > 1">
            <h3>paginationRef.sortBy: {{ paginationRef.sortBy }}</h3>
            <h3>TestSortBy: {{ TestSortBy }}</h3>
          </template>
          <v-data-table
            v-if="getTotalPages() > 1"
            v-bind:class="{ 'data-table': getTotalPages() > 1 }"
            :page="pageNumber"
            :items-per-page="pageSize"
            :sort-by="paginationRef.sortBy"
            :headers="headersComputed"
            :items="devisListRef"
            must-sort
            calculate-widths
            :loading="isLoadingListDevis"
            :server-items-length="totalDevis"
            @update:sort-by="sortDevis()"
          >
            <template #bottom></template>

            <template v-slot:[`item.souscripteurPersonneMorale.raisonSociale`]="{ item }">
              <span v-if="isPersonnePhysique(item.value)">
                {{
                  customer(
                    item.value.souscripteurPersonnePhysique.nom,
                    item.value.souscripteurPersonnePhysique.prenom
                  )
                }}
              </span>
              <span v-else>
                {{ textTruncate(item.value.souscripteurPersonneMorale.raisonSociale) }}
              </span>
            </template>
            <template v-slot:[`item.numero`]="{ item }">
              <v-btn
                title
                :ripple="false"
                class="font-weight-regular text-body no-background-hover"
                :to="{ name: 'OverviewDevis', query: { id: item.value.id } }"
              >
                {{ item.value.numeroDevis }}
              </v-btn>
            </template>
            <template v-slot:[`item.numeroContrat`]="{ item }">
              {{ item.value.numeroContrat || '-' }}</template
            >
            <template v-slot:[`item.formuleSouscrite.nomFormule`]="{ item }">
              {{ item.value.formuleSouscrite.nomFormule || '-' }}
            </template>
            <template v-slot:[`item.codeCourtier`]="{ item }">
              {{ item.value.codeCourtier || '-' }}
            </template>
            <template v-slot:[`item.distributeur`]="{ item }">
              {{ item.value.distributeur || '-' }}
            </template>
            <template v-slot:[`item.dateFinValidite`]="{ item }">
              {{ formatDate(item.value.dateFinValidite) || '-' }}
            </template>
            <template v-slot:[`item.dateCreation`]="{ item }">
              {{ formatDate(item.value.dateCreation) || '-' }}
            </template>
            <template v-slot:[`item.telephone`]="{ item }">
              <span v-if="isPersonnePhysique(item.value)">
                {{ item.value.souscripteurPersonnePhysique.telephone1 || '-' }}
              </span>
              <span v-else>
                {{ item.value.souscripteurPersonneMorale.telephone1 || '-' }}
              </span>
            </template>
            <template v-slot:[`item.mail`]="{ item }">
              <span v-if="isPersonnePhysique(item.value)">
                {{ item.value.souscripteurPersonnePhysique.mail || '-' }}
              </span>
              <span v-else>
                {{ item.value.souscripteurPersonneMorale.mail || '-' }}
              </span>
            </template>
            <template v-slot:[`item.emisPar`]="{ item }">
              {{ textTruncate(item.value.emisPar || '-') }}</template
            >
            <template v-slot:[`item.souscripteurPersonneMorale.identifiantLegal`]="{ item }">
              {{ item.value.souscripteurPersonneMorale.identifiantLegal || '-' }}
            </template>
            <template v-slot:[`item.statut`]="{ item }">
              <v-chip class="status" outlined label :color="getColor(item.value.statut)" dark small>
                {{ getLabel(item.value.statut) }}
              </v-chip>
            </template>
            <!-- <template v-slot:[`item.actions`]="{ item }">
              <ListActions :item-devis="item" @action="execAction($event)" />
            </template> -->
            <template v-slot:[`item.primeTtc`]="{ item }">
              <span v-if="item.value.primeTtc && item.value.primeTtc !== ''">
                {{ formatAmount(item.value.primeTtc) }}
              </span>
              <span v-else> - </span>
            </template>
          </v-data-table>
        </div>
        paginationRef: {{ paginationRef }}
        <v-pagination
          v-if="getTotalPages() > 1"
          v-model="paginationRef.page"
          class="mt-8"
          :length="getTotalPages()"
          :show-first-last-page="true"
          total-visible="7"
          next-icon="mdi-menu-right"
          prev-icon="mdi-menu-left"
          @update:model-value="searchDevis(paginationRef.page)"
        ></v-pagination>
      </div>
      <!-- <DialogDuplication /> -->
      <!-- <DialogDevisTreatment @action="updateSelectedDevis($event)" /> -->
    </template>
  </v-container>
</template>

<script setup lang="ts">
import FormInputGeneric3 from '@/components/devis/forms/FormInputGeneric3.vue';
// import ListActions from '@/components/common/table/ListActions.vue';
// import DialogDevisTreatment from '@/components/devis/forms/DialogDevisTreatment.vue';
// import DialogDuplication from '@/components/devis/forms/DialogDuplication.vue';
import PermissionForAllRolesButBroker from '@/components/permission/PermissionForAllRolesButBroker.vue';
import useAuth from '@/composables/authenticate/useAuth';
import useIasAndRole from '@/composables/authenticate/useIasAndRole';
import usePermission from '@/composables/authenticate/usePermission';
import useUser from '@/composables/authenticate/useUser';
import useDevis from '@/composables/useDevis';
import useExport from '@/composables/useExport';
import useRoutageProduit from '@/composables/useRoutageProduit';
import useSnackBar from '@/composables/useSnackBar';
import useStatus from '@/composables/useStatus';
import useLoader from '@/composables/useLoader';
import { useApiCall } from '@/composables/api-call/useApiCall';
import type { IQueryRoutage } from '@/models/IQueryRoutage';
import { format } from 'date-fns';
import eventBus from '@/plugins/eventBus';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { devisApi, getExportApi } from '@/plugins/open-api';
import type { Courtier } from 'open-api-espace-partenaire-souscription-typescript';
import {
  DevisEntrepriseStatutEnum,
  DevisEntrepriseTypeRisqueEnum,
  type DevisDevisPaginated,
  type DevisEntreprise,
  type Export
} from 'open-api-souscription-typescript';
import { computed, onMounted, ref, watch } from 'vue';
import type { VDataTable } from 'vuetify/labs/VDataTable';
// import type { DataOptions, DataTableHeader } from 'vuetify';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import router from '@/router';
import { toRaw } from 'vue';

export interface ISearchModel {
  searchInput: string;
  dateInput: any[];
  statutInput: string[];
  byInput: string;
  iaCodeInput: string[];
  groupeComptable: string[];
}

type UnwrapReadonlyArrayType<A> = A extends Readonly<Array<infer I>>
  ? UnwrapReadonlyArrayType<I>
  : A;
type DT = InstanceType<typeof VDataTable>;
type ReadonlyDataTableHeader = UnwrapReadonlyArrayType<DT['headers']>;
type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };
type DataTableHeader = DeepMutable<ReadonlyDataTableHeader>;

export interface IDisplayHeaders {
  phone: DataTableHeader;
  mail: DataTableHeader;
  siret: DataTableHeader;
  by: DataTableHeader;
  dateCreation?: DataTableHeader;
  contractNum?: DataTableHeader;
}

export interface DataOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order?: boolean | 'asc' | 'desc' };
  sortDesc: boolean[];
  groupDesc: boolean[];
  mustSort: boolean;
}

const { isAuthenticatedComputed, relog } = useAuth();
const { onRouteToCorrectTemplate } = useRoutageProduit();
const { formatAmount } = formatDataConsultDevis();
const { setLoaderGlobal } = useLoader();
const { iasStore } = useIasAndRole();
const { setExportPath, exportPath, downloadFile } = useExport();
const { user } = useUser();
const { getColor, getLabel } = useStatus();
const { setDevisAction, getModel } = useDevis();
const { addMessageErrorSnackBarAction } = useSnackBar();
const { doesHavePermissionAmongAllRolesButBroker, doesHavePermissionAmongRoleBroker } =
  usePermission();
const { t } = useI18n();
const menuRangeRef = ref(false);
const redacteursRef = ref([]);
const devisListRef = ref<DevisEntreprise[]>([]);
const paginationRef = ref<DataOptions>();
const lengthTruncate = ref<number>(20);
const delegations = ref<string[]>([]);
const pageSize = 10;
const pageNumber = 1;
const TestSortBy = { key: 'dateCreation' };
const totalDevis = ref<number>(0);
const currentDate = ref(format(new Date(), 'yyyy-MM-dd').toString());
const now = ref(new Date());
const year = ref(now.value.getFullYear());
const currentDatePlusDeuxSemaines = ref(
  format(now.value.setDate(now.value.getDate() + 14), 'yyyy-MM-dd').toString()
);

const displayHeadersRef = ref<IDisplayHeaders>({
  phone: {
    key: 'phone',
    title: t('forms.labels.phone'),
    value: 'false',
    sortable: false
  },
  mail: { key: 'mail', title: t('forms.labels.mail'), value: 'false', sortable: false },
  siret: { key: 'siret', title: t('forms.labels.siret'), value: 'false', sortable: false },
  by: { key: 'by', title: t('forms.labels.by'), value: 'false', sortable: false },
  contractNum: {
    key: 'contractNumber',
    title: t('forms.labels.contractNum'),
    value: 'false',
    sortable: false
  }
});

const searchModelRef = ref<ISearchModel>({
  searchInput: '',
  dateInput: [],
  statutInput: [],
  byInput: '',
  iaCodeInput: [],
  groupeComptable: []
});

const {
  isLoading: isLoadingExportpath,
  data: exportPathResponse,
  doFetch: doFetchExportpath
} = useApiCall<Export>({
  route: getExportApi().exportpath
});

const {
  isLoading: isLoadingListRedacteurs,
  isError: isErrorListRedacteurs,
  data: listRedacteurs,
  doFetch: doFetchListRedacteurs
} = useApiCall<string[]>({
  route: devisApi().listRedacteurs
});

const {
  isLoading: isLoadingListDevis,
  isError: isErrorListDevis,
  data: listDevisResponse,
  doFetch: doFetchListDevis
} = useApiCall<DevisDevisPaginated>({
  route: devisApi().listDevis
});

const iasList = iasStore.value.map((obj) => {
  const keyIaCode = obj?.nom + ' - ' + obj?.code;
  return { keyIaCode, valueIaCode: obj?.code?.toString() };
});

const setDelegation = (iaCodesList: Courtier[]): void => {
  const delegationMap = Object.keys(iaCodesList).map((v) => iaCodesList[v].groupeComptable);
  delegations.value = [...new Set(delegationMap)].sort();
};
setDelegation(iasStore.value);

const exportExcel = () => {
  const status =
    searchModelRef.value.statutInput && searchModelRef.value.statutInput.length > 0
      ? `?statut=${searchModelRef.value.statutInput}`
      : `?statut=${DevisEntrepriseStatutEnum.BrouillonAValider},${DevisEntrepriseStatutEnum.BrouillonEnCours},${DevisEntrepriseStatutEnum.Emis},${DevisEntrepriseStatutEnum.Expire},${DevisEntrepriseStatutEnum.EnEtudeN1},${DevisEntrepriseStatutEnum.EnEtudeN2},${DevisEntrepriseStatutEnum.Refuse},${DevisEntrepriseStatutEnum.Transforme}`;
  const by = searchModelRef.value.byInput ? `&emisPar=${searchModelRef.value.byInput}` : '';
  const creationBefore = searchModelRef.value.dateInput[0]
    ? `&creationBefore=${searchModelRef.value.dateInput[0]}`
    : '';
  const creationAfter = searchModelRef.value.dateInput[1]
    ? `&creationAfter=${searchModelRef.value.dateInput[1]}`
    : '';
  const search = searchModelRef.value.searchInput
    ? `&search=${searchModelRef.value.searchInput}`
    : '';
  const iaCode = `&codeIa=${
    doesHavePermissionAmongRoleBroker() ? user.value.codeIa : searchModelRef.value.iaCodeInput
  }`;
  const groupeComptable = searchModelRef.value.groupeComptable
    ? `&groupeComptable=${searchModelRef.value.groupeComptable}`
    : '';
  const exportData = `${exportPath.value}${status}${by}${creationBefore}${creationAfter}${search}${iaCode}${groupeComptable}`;
  downloadFile(exportData);
};

const textTruncate = (text: string): string => {
  return text.length > lengthTruncate.value ? `${text.substring(0, 20)} ...` : text;
};

const headersComputed = computed<DataTableHeader[]>(() => {
  const headers: DataTableHeader[] = [
    {
      key: 'numeroDevis',
      title: t('forms.labels.idDevis'),
      align: 'start',
      value: 'numeroDevis'
    },
    {
      key: 'raisonSociale',
      title: t('forms.labels.customer'),
      value: 'souscripteurPersonneMorale.raisonSociale',
      sortable: false
    }
  ];
  if (doesHavePermissionAmongAllRolesButBroker()) {
    headers.push(
      {
        key: 'codeCourtier',
        title: t('forms.labels.codeCourtier'),
        value: 'codeCourtier',
        sortable: false
      },
      {
        key: 'distributeur',
        title: t('forms.labels.distributeur'),
        value: 'distributeur',
        sortable: false
      }
    );
  }
  if (displayHeadersRef.value.phone.sortable) {
    headers.push({
      key: 'telephone',
      title: t('forms.labels.phone'),
      value: 'telephone',
      sortable: false
    });
  }
  if (displayHeadersRef.value.mail.sortable) {
    headers.push({
      key: 'mail',
      title: t('forms.labels.mail'),
      value: 'mail',
      sortable: false
    });
  }

  headers.push(
    { key: 'nomProduit', title: t('forms.labels.product'), value: 'formuleSouscrite.nomProduit' },
    {
      key: 'nomFormule',
      title: t('forms.labels.nomFormule'),
      value: 'formuleSouscrite.nomFormule',
      sortable: false
    }
  );
  if (displayHeadersRef.value.siret.sortable) {
    headers.push({
      key: 'identifiantLegal',
      title: 'Siren/Siret/Rci',
      value: 'souscripteurPersonneMorale.identifiantLegal',
      sortable: false
    });
  }
  // headers.push(
  //   { key: 'dateCreation', title: t('forms.labels.createBefore'), value: 'dateCreation' },
  //   {
  //     key: 'dateFinValidite',
  //     title: t('forms.labels.createAfter'),
  //     value: 'dateFinValidite',
  //     sortable: false
  //   }
  // );
  if (displayHeadersRef.value.by.sortable) {
    headers.push({ key: 'emisPar', title: t('forms.labels.by'), value: 'emisPar' });
  }
  if (displayHeadersRef.value.contractNum.sortable) {
    headers.push({
      key: 'numeroContrat',
      title: t('forms.labels.contractNum'),
      value: 'numeroContrat',
      sortable: true
    });
  }
  headers.push({
    key: 'primeTtc',
    title: t('forms.labels.prime'),
    value: 'primeTtc'
  });
  headers.push(
    { key: 'statut', title: t('forms.labels.status'), value: 'statut' },
    { key: 'actions', title: '', value: 'actions', sortable: false }
  );
  return headers;
});

const statutsComputed = computed(() => {
  return [
    {
      text: t('enums.status.create'),
      value: `${DevisEntrepriseStatutEnum.BrouillonAValider},${DevisEntrepriseStatutEnum.BrouillonEnCours}`
    },
    { text: t('enums.status.enEtudeN1'), value: DevisEntrepriseStatutEnum.EnEtudeN1 },
    { text: t('enums.status.enEtudeN2'), value: DevisEntrepriseStatutEnum.EnEtudeN2 },
    { text: t('enums.status.etudeValidee'), value: DevisEntrepriseStatutEnum.EtudeValidee },
    { text: t('enums.status.send'), value: DevisEntrepriseStatutEnum.Emis },
    { text: t('enums.status.expire'), value: DevisEntrepriseStatutEnum.Expire },
    { text: t('enums.status.transformed'), value: DevisEntrepriseStatutEnum.Transforme },
    { text: t('enums.status.refuse'), value: DevisEntrepriseStatutEnum.Refuse }
  ];
});

onMounted(async () => {
  relog().then(() => {
    if (isAuthenticatedComputed.value) {
      runlistDevisView();
    }
  });
});

const runlistDevisView = () => {
  initSearch();
  loadDevisList();
  loadRedactors();
  getExportDevisPath();
};

const initSearch = () => {
  if (router.currentRoute.value.query?.statut === DevisEntrepriseStatutEnum.Emis) {
    searchModelRef.value.statutInput = [DevisEntrepriseStatutEnum.Emis];
    searchModelRef.value.iaCodeInput.push(user.value.codeIa);
  }

  if (router.currentRoute.value.query?.statut === DevisEntrepriseStatutEnum.Expire) {
    searchModelRef.value.statutInput = [DevisEntrepriseStatutEnum.Expire];
    searchModelRef.value.dateInput = [currentDate.value, currentDatePlusDeuxSemaines.value];
    searchModelRef.value.iaCodeInput.push(user.value.codeIa);
  }

  if (router.currentRoute.value.query?.statut === DevisEntrepriseStatutEnum.Transforme) {
    searchModelRef.value.statutInput = [DevisEntrepriseStatutEnum.Transforme];
    searchModelRef.value.dateInput = [year.value + '-01-01', currentDate.value];
    searchModelRef.value.iaCodeInput.push(user.value.codeIa);
  }

  if (!searchModelRef.value.statutInput.length) {
    searchModelRef.value.statutInput = [
      `${DevisEntrepriseStatutEnum.BrouillonAValider},${DevisEntrepriseStatutEnum.BrouillonEnCours}`,
      DevisEntrepriseStatutEnum.EnEtudeN1,
      DevisEntrepriseStatutEnum.Emis
    ];
  }
  paginationRef.value = {
    ...paginationRef.value,
    sortBy: ['dateCreation'],
    sortDesc: [true],
    page: pageNumber,
    itemsPerPage: pageSize
  };
};

const getTotalPages = () => {
  return Math.ceil(totalDevis.value / pageSize);
};

const loadRedactors = async () => {
  await doFetchListRedacteurs();
  if (isErrorListRedacteurs.value) {
    addMessageErrorSnackBarAction(t('page.listDevis.redactorError'));
  }
  if (listRedacteurs.value) {
    redacteursRef.value = listRedacteurs.value;
  }
};

const getExportDevisPath = async () => {
  await doFetchExportpath();
  if (exportPathResponse.value) {
    setExportPath(exportPathResponse.value.url);
  }
};

const searchDevis = (currentPage?: number) => {
  paginationRef.value = { ...paginationRef.value, page: currentPage ?? 1 };
  loadDevisList();
};

const formatDate = (date: string): string => {
  if (date) {
    return format(new Date(date), 'dd-MM-yyyy').toString();
  }
};

const sortDevis = () => {
  searchDevis();
  return paginationRef.value.sortDesc[0];
};

const getSortOptions = (): string => {
  console.log(
    '🚀 getSortOptions ~ paginationRef.value?.sortBy:',
    toRaw(paginationRef.value?.sortBy)
  );
  let sortKey = '';
  if (toRaw(paginationRef.value?.sortBy)[0] === 'numeroDevis') {
    sortKey = 'numero';
  } else if (paginationRef.value?.sortBy[0] === 'formuleSouscrite.nomProduit') {
    sortKey = 'produit';
  } else if (paginationRef.value?.sortBy[0]) {
    sortKey = paginationRef.value?.sortBy[0];
  }
  return `${sortKey}:${paginationRef.value?.sortDesc[0] ? 'desc' : 'asc'}`;
};

const loadDevisList = async () => {
  const sortOptions = getSortOptions();
  const params = {
    pageNumber: paginationRef.value.page,
    pageSize: paginationRef.value.itemsPerPage,
    emisPar: searchModelRef.value.byInput || '',
    codeIa: searchModelRef.value?.iaCodeInput,
    statut: searchModelRef.value?.statutInput,
    creationBefore: searchModelRef.value.dateInput[0] || undefined,
    creationAfter: searchModelRef.value.dateInput[1] || undefined,
    sort: sortOptions,
    search: searchModelRef.value.searchInput || '',
    groupeComptable: searchModelRef.value?.groupeComptable
  };
  console.log('🚀 loadDevisList ~ params:', JSON.stringify(params));

  await doFetchListDevis(
    params.pageNumber,
    params.pageSize,
    params.emisPar,
    params.codeIa,
    params.statut,
    params.creationBefore,
    params.creationAfter,
    params.sort,
    params.search,
    params.groupeComptable
  );
  if (isErrorListDevis.value) {
    addMessageErrorSnackBarAction(t('page.listDevis.devisError'));
  }
  if (listDevisResponse.value) {
    devisListRef.value = listDevisResponse.value.data;
    totalDevis.value = listDevisResponse.value.total;
    window.scrollTo(0, 0);
  }
};

const isPersonnePhysique = (item: DevisEntreprise): boolean => {
  return (
    item.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier ||
    (item.typeRisque === DevisEntrepriseTypeRisqueEnum.Proprietaire &&
      item.souscripteurPersonnePhysique.nom !== '')
  );
};

const customer = (name: string, firstname: string): string => {
  return textTruncate(`${name} ${firstname}`);
};

const clearRange = () => {
  searchModelRef.value.dateInput = [];
};

const clearStatut = () => {
  searchModelRef.value.statutInput = [];
};

const clearBy = () => {
  searchModelRef.value.byInput = '';
};

const updateSelectedDevis = (devis: DevisEntreprise) => {
  const selectedSignatureIndex = devisListRef.value.findIndex((e: any) => e.id === devis.id);
  devisListRef.value[selectedSignatureIndex] = devis;
  loadDevisList();
};

// todo;

const execAction = async (selected: { item: any; action: any }) => {
  await relog(selected.item.codeCourtier);

  let query: IQueryRoutage = { step: '' };
  setDevisAction(selected.item);
  switch (selected.action) {
    case 'update-date': {
      query = {
        step: 'date-d-effet',
        id: selected.item.id
      };
      router.push(
        onRouteToCorrectTemplate(
          selected.item.typeRisque,
          selected.item.formuleSouscrite.idProduit,
          query,
          true
        )
      );
      break;
    }
    case 'update-offer': {
      query = {
        step: 'tarification',
        id: selected.item.id
      };
      router.push(
        onRouteToCorrectTemplate(
          selected.item.typeRisque,
          selected.item.formuleSouscrite.idProduit,
          query,
          true,
          '1'
        )
      );
      break;
    }
    case 'update-infos': {
      query = {
        step: 'info-complementaire',
        id: selected.item.id
      };
      router.push(
        onRouteToCorrectTemplate(
          selected.item.typeRisque,
          selected.item.formuleSouscrite.idProduit,
          query,
          true
        )
      );
      break;
    }
    case 'duplicate': {
      setDevisAction(selected.item);
      eventBus.emit('open-duplication-dialog');
      break;
    }
    case 'viewer': {
      if (selected.item.statut === DevisEntrepriseStatutEnum.Transforme) {
        query = {
          step: 'signature',
          id: selected.item.id
        };
        router.push(
          onRouteToCorrectTemplate(
            selected.item.typeRisque,
            selected.item.formuleSouscrite.idProduit,
            query
          )
        );
      } else {
        router.replace({ name: 'OverviewDevis', query: { id: selected.item.id } });
      }
      break;
    }
    case 'treatment': {
      eventBus.emit('open-treatment-dialog', selected.item.id);
      break;
    }
    case 'transform-contrat': {
      query = {
        step: 'validation-date-d-effet',
        id: selected.item.id
      };
      router.push(
        onRouteToCorrectTemplate(
          selected.item.typeRisque,
          selected.item.formuleSouscrite.idProduit,
          query,
          false
        )
      );
      break;
    }
    case 'new': {
      setDevisAction(_.merge(getModel(), selected.item));
      router.replace({
        name: 'SouscriptionMarketProduct',
        params: {
          market: selected.item.typeRisque,
          product: selected.item.formuleSouscrite.idProduit
        },
        query: {
          new: 'true'
        }
      });
      break;
    }
    default:
      '';
  }
};

watch(
  () => isAuthenticatedComputed.value,
  (_isAuthenticated) => {
    if (_isAuthenticated) {
      runlistDevisView();
    }
  }
);

watch(
  () => user?.value?.codeIa,
  (_codeIa) => {
    if (_codeIa) {
      searchModelRef.value.iaCodeInput.push(_codeIa);
      initSearch();
    }
  }
);

watch(
  () => [isLoadingExportpath.value, isLoadingListRedacteurs.value],
  ([isLoadingExportpath, isLoadingListRedacteurs]) => {
    setLoaderGlobal({
      isLoading: isLoadingExportpath || isLoadingListRedacteurs
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
