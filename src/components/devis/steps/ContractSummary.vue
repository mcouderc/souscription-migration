<template>
  <ContainerModel1 :overlay="overlayRef">
    <template #Header>
      <HeaderModel1>
        <template #Header-Title>{{ $t('page.summary.title') }}</template>
      </HeaderModel1>
    </template>
    <template #Body>
      <v-row class="px-5 my-0 py-2">
        <v-col class="col-border col-visu-contrat" cols="4">
          <v-row v-for="{ label, value } in summaryRef.slice(0, 3)" :key="label" class="px-3">
            <v-col class="col-visu-contrat">
              <label class="text-sm">{{ label }} :</label>
              <br />
              <label class="text-sm font-semibold">{{ value }}</label>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-border col-visu-contrat" cols="4">
          <v-row v-for="{ label, value } in summaryRef.slice(3, 7)" :key="label" class="px-3">
            <v-col class="col-visu-contrat">
              <label class="text-sm">{{ label }} :</label>
              <br />
              <label class="text-sm font-semibold">{{ value }}</label>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-visu-contrat" cols="4">
          <v-row v-for="{ label, value } in summaryRef.slice(7, 10)" :key="label" class="px-3">
            <v-col class="col-visu-contrat">
              <label class="text-sm">{{ label }} :</label>
              <br />
              <label class="text-sm font-semibold">{{
                formatAmountContractSummaryDifferentType(value)
              }}</label>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="btn-row">
            <template v-if="!isAlreadySignRef">
              <PermissionForAllRolesButConsultation>
                <div class="btn-row">
                  <v-btn type="button" color="success" @click="openSignatureModal()">
                    {{ $t('page.summary.withSignin') }}
                  </v-btn>

                  <v-btn type="button" color="primary" :to="{ name: 'subscription' }">
                    {{ $t('page.summary.withoutSignin') }}
                  </v-btn>
                </div>
              </PermissionForAllRolesButConsultation>
            </template>
            <v-btn
              color="primary"
              :disabled="isLoadingDocs() || !downloadArchiveAvailableRef"
              @click="downloadArchive()"
            >
              <v-icon v-show="isLoadingDocs()" class="mr-2 rotate" small>mdi-reload</v-icon>
              <v-icon v-show="!isLoadingDocs()" class="mr-2" small>mdi-download</v-icon>
              {{ $t('forms.buttons.downloadAllDocumentsFromContratSummary') }}
            </v-btn>
          </div>
          <DialogSignature
            :devis="devis"
            :is-already-sign="isAlreadySignRef"
            @submitEvent="removeSignatureBtn()"
          />
        </v-col>
      </v-row>
    </template>
    <template #Column>
      <ColumnSlot>
        <DocumentsDownload
          v-if="devis.id"
          :devis-id="devis.id"
          :devis-status="devis.statut"
          :devis-status-has-just-change="devisStatusHasJustChange"
          @documents-available-and-loaded="manageArchiveButton()"
          ref="childComponentDocumentsDownloadRef"
        >
          {{ $t('page.devisOverview.documents.downloads') }}
        </DocumentsDownload>
      </ColumnSlot>
      <ColumnSlot class="card-garantie">
        <ConsultGaranties />
      </ColumnSlot>
      <CommissionPanel :devis="devis" :date="timePeriodComputed" />
    </template>
  </ContainerModel1>
</template>

<script setup lang="ts">
import type { IConsultDevisDataChild } from '@/models/form_validate/interface/IConsultDevisDataChild';
import ContainerModel1 from '@/components/common/templates/ContainerModel1.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ColumnSlot from '@/components/common/templates/ColumnSlot.vue';
import CommissionPanel from '@/components/common/CommissionPanel.vue';
import DocumentsDownload from '@/components/devis/DocumentsDownload.vue';
import DialogSignature from '@/components/devis/forms/DialogSignature.vue';
import { computed, onMounted, ref } from 'vue';
import { SignatureElectroniqueStatutEnum } from 'open-api-souscription-typescript';
import { format, subDays } from 'date-fns';
import { signatureElectroniqueApi } from '@/plugins/open-api';
import { useI18n } from 'vue-i18n';
import useSnackBar from '@/composables/useSnackBar';
import { useRoute } from 'vue-router';
import useDevis from '@/composables/useDevis';
import ConsultGaranties from '@/components/devis/garanties/ConsultGaranties.vue';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import PermissionForAllRolesButConsultation from '@/components/permission/PermissionForAllRolesButConsultation.vue';
import eventBus from '@/plugins/eventBus';

const { devis } = useDevis();
const { addMessageErrorSnackBarAction } = useSnackBar();
const { formatAmountContractSummaryDifferentType } = formatDataConsultDevis();
const { t } = useI18n();

const summaryRef = ref<IConsultDevisDataChild[]>([]);
const isAlreadySignRef = ref(true);
const route = useRoute();
const devisStatusHasJustChange = route?.query?.step === 'validation-date-d-effet';
const downloadArchiveAvailableRef = ref(false);
const childComponentDocumentsDownloadRef = ref(null);
const overlayRef = ref(false);

const souscriptorComputed = computed((): string => {
  if (devis.value.souscripteurPersonnePhysique.civilite) {
    return `${devis.value.souscripteurPersonnePhysique.civilite || ''} ${
      devis.value.souscripteurPersonnePhysique.prenom || ''
    } ${devis.value.souscripteurPersonnePhysique.nom || ''}`;
  } else {
    return `${devis.value.souscripteurPersonneMorale.formeJuridique || ''} ${
      devis.value.souscripteurPersonneMorale.raisonSociale || ''
    }`;
  }
});

const mailComputed = computed((): string => {
  if (devis.value.souscripteurPersonnePhysique.mail === '') {
    return devis.value.souscripteurPersonneMorale.mail;
  } else {
    return devis.value.souscripteurPersonnePhysique.mail;
  }
});

const removeSignatureBtn = () => {
  isAlreadySignRef.value = true;
};

const produitComputed = computed((): string => {
  return `${devis.value.formuleSouscrite.nomProduit || ''} ${
    devis.value.formuleSouscrite.nomFormule || ''
  }`;
});

const dateReduceComputed = computed((): string => {
  return `01/${devis.value?.informationPaiement?.echeancePrincipale <= 9 ? 0 : ''}${
    devis.value?.informationPaiement?.echeancePrincipale
  }`;
});

const timePeriodComputed = computed((): string => {
  return `Du ${format(new Date(devis.value.dateEffet), 'dd-MM-yyyy')} au ${format(
    subDays(new Date(devis.value?.informationPaiement?.dateProchaineEcheance), 1),
    'dd-MM-yyyy'
  )}`;
});

const openSignatureModal = () => {
  eventBus.emit('open-modal');
};

const manageArchiveButton = () => {
  downloadArchiveAvailableRef.value = true;
};
const downloadArchive = () => {
  //here we just call child component method
  childComponentDocumentsDownloadRef.value.downloadArchive();
};

onMounted(async () => {
  overlayRef.value = true;
  signatureElectroniqueApi()
    .listSignatureElectronique(devis.value.numeroContrat)
    .then((response: any) => {
      isAlreadySignRef.value =
        response.data.data.length > 0 &&
        response.data.data[0].statut !== SignatureElectroniqueStatutEnum.Abandonne;
    })
    .catch(() => {
      addMessageErrorSnackBarAction(t('Signin.errorGetSign'));
    })
    .finally(() => {
      overlayRef.value = false;
    });

  if (route.query.id) {
    summaryRef.value = [
      {
        label: t('page.summary.subscriber'),
        value: souscriptorComputed.value || '-'
      },
      {
        label: t('page.summary.mail'),
        value: mailComputed.value || '-'
      },
      {
        label: t('page.summary.product'),
        value: produitComputed.value || '-'
      },
      {
        label: t('page.summary.idContract'),
        value: devis.value.numeroContrat || '-'
      },
      {
        label: t('page.summary.date'),
        value: format(new Date(devis.value.dateEffet), 'dd-MM-yyyy') || '-'
      },
      {
        label: t('page.summary.deadline'),
        value: dateReduceComputed.value || '-'
      },
      {
        label: t('page.summary.splitting'),
        value: devis.value?.informationPaiement?.fractionnement || '-'
      },
      {
        label: t('page.summary.primeTTC'),
        value: `${devis.value.primeTtc.toFixed(2)}€` || '-'
      },
      {
        label: t('page.summary.prorata'),
        value: `${devis.value?.informationPaiement?.prorataPrime.toFixed(2)}€` || '-'
      },
      {
        label: t('page.summary.period'),
        value: timePeriodComputed.value || '-'
      }
    ];
  }
});

const isLoadingDocs = (): boolean => {
  return childComponentDocumentsDownloadRef.value?.downloadArchiveInProgressRef;
};
</script>
<style scoped>
.btn-row {
  display: flex;
  padding: 20px 10px;
  justify-content: space-around;
  flex-wrap: wrap;
  grid-gap: 10px;
}
.v-btn {
  white-space: initial;
  flex: none;
  text-align: left;
  min-height: 36px;
  padding: 10px 16px !important;
}
.v-btn__content {
  flex: auto;
  letter-spacing: initial;
}

.col-border {
  border-right: 1px solid #dcdfe1;
}

.col .col-4 .col-visu-contrat {
  padding: 1px !important;
  margin-bottom: 5%;
}

.rotate {
  animation: rotate 1.1s linear infinite;
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
