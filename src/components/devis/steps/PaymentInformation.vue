<template>
  <div>
    <v-container v-if="Object.keys(devisRef).length > 0">
      <h1 class="title-helios capitalize">{{ $t('page.payment.title') }}</h1>
      <v-container class="border-2 border-grey bg-white">
        <ValidationObserver ref="observerInfoPaymentRef">
          <v-expansion-panels v-model="panelOpenRef" flat multiple accordion readonly>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-col cols="12" class="pa-0">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.payment.information') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="4">
                    <InputGeneric
                      input-id="idDevis"
                      :value="devisRef.numeroDevis"
                      :title="$tc('forms.labels.idDevis')"
                      input-type="text"
                      :is-disabled="true"
                    />
                  </v-col>
                  <v-col cols="4">
                    <InputGeneric
                      input-id="taxe"
                      :value="contractTypeComputed"
                      :title="$tc('forms.labels.contractType')"
                      input-type="text"
                      :is-disabled="true"
                    />
                  </v-col>
                  <v-col cols="4">
                    <InputGeneric
                      input-id="dateEffet"
                      :value="devisRef.dateEffet"
                      :title="$tc('page.summary.date')"
                      input-type="date"
                      :is-disabled="true"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-col cols="12" class="pa-0">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.payment.pricing') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="4">
                    <InputGeneric
                      input-id="primeHT"
                      :value="currencyConvert(devisRef.primeHt)"
                      :title="$tc('forms.labels.htPrimePerYear')"
                      input-type="text"
                      :is-disabled="true"
                    />
                  </v-col>
                  <v-col cols="4">
                    <InputGeneric
                      input-id="taxe"
                      :value="currencyConvert(devisRef.formuleSouscrite.tarif.montantTaxe)"
                      :title="$tc('forms.labels.taxe')"
                      input-type="text"
                      :is-disabled="true"
                    />
                  </v-col>
                  <v-col cols="4">
                    <InputGeneric
                      input-id="primeAnnuelleTtc"
                      :value="currencyConvert(devisRef.primeTtc)"
                      :title="$tc('forms.labels.ttcPerYear')"
                      input-type="text"
                      :is-disabled="true"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-col cols="12" class="pa-0">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.payment.payment') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="4" class="tarif-line">
                    <SelectGeneric
                      v-model="getEcheanceRef"
                      input-id="echeancePrincipale"
                      :title="$tc('forms.labels.mainDeadline')"
                      :items="selectEcheancesRef"
                      :menu-props="{ bottom: true, offsetY: true }"
                      :is-required="true"
                      :is-clearable="false"
                      :is-disabled="isStatusTransformed()"
                      @input="getEcheance(getEcheanceRef)"
                    />
                  </v-col>
                  <v-col cols="4" class="tarif-line">
                    <SelectGeneric
                      v-model="modelRef.fractionnement"
                      input-id="fractionnement"
                      :title="$tc('forms.labels.splitting')"
                      :items="selectFractionnementRef"
                      :menu-props="{ bottom: true, offsetY: true }"
                      :is-required="true"
                      :is-clearable="false"
                      :is-disabled="isStatusTransformed()"
                      @input="sendInfoContrat()"
                    />
                  </v-col>
                  <v-col cols="4" class="tarif-line">
                    <SelectGeneric
                      v-model="PAYMENT_MEANS_DEFAULT_VALUE"
                      :value="PAYMENT_MEANS[modelRef.moyenDePaiement]"
                      input-id="moyenDePaiement"
                      :items="selectPaiementRef"
                      :title="$tc('forms.labels.paymentMethod')"
                      :menu-props="{ bottom: true, offsetY: true }"
                      :is-required="true"
                      :is-clearable="false"
                      :is-disabled="isStatusTransformed()"
                      @input="selectPaymentMeans($event)"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-show="!pendingInfoRef" cols="12">
                    <v-row class="mb-1">
                      <v-col cols="6">
                        <InputGeneric
                          v-model="dateProchaineEcheanceFrRef"
                          :title="$tc('forms.labels.dateNextPayment')"
                          input-type="text"
                          input-id="dateProchaineEcheance"
                          :is-readonly="true"
                          :is-disabled="!modelRef.dateProchaineEcheance"
                        />
                      </v-col>
                      <v-col cols="6">
                        <InputGeneric
                          :value="currencyConvert(modelRef.prorataPrime)"
                          :title="$tc('forms.labels.prorata')"
                          input-type="text"
                          input-id="prorataPrime"
                          :is-readonly="true"
                          :is-disabled="!modelRef.prorataPrime"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-show="pendingInfoRef" cols="12" class="relative py-10">
                    <v-overlay :absolute="true" opacity="0">
                      <v-progress-circular
                        color="grey-darken-1"
                        indeterminate
                        size="32"
                      ></v-progress-circular>
                    </v-overlay>
                  </v-col>
                </v-row>
                <v-row
                  v-if="modelRef.moyenDePaiement === 'PRELEVEMENT_CFDP'"
                  class="renseignement-block mt-5 mb-1"
                >
                  <v-col cols="12">
                    <h2 class="text-primary text-h6 text-capitalize">
                      {{ $t('page.payment.depository') }}
                    </h2>
                  </v-col>
                  <v-col cols="12">
                    <InputGeneric
                      v-model="modelRef.titulaireDuCompte"
                      input-id="titulaire"
                      :value="modelRef.titulaireDuCompte"
                      :title="$tc('forms.labels.owner')"
                      input-type="text"
                      :is-required="true"
                      :is-disabled="isStatusTransformed()"
                      @input="onEventInputAction(modelRef)"
                    />
                  </v-col>
                  <v-col cols="12">
                    <InputGeneric
                      v-model="modelRef.iban"
                      input-id="iban"
                      :value="modelRef.iban"
                      :max-length="42"
                      :min-length="17"
                      :regex="REGEX.IBAN"
                      :title="$tc('forms.labels.iban')"
                      input-type="text"
                      :is-required="true"
                      :is-disabled="isStatusTransformed()"
                      @input="onEventInputAction(modelRef), formatIBAN()"
                    />
                  </v-col>
                  <v-col cols="12">
                    <InputGeneric
                      v-model="modelRef.bic"
                      input-id="bic"
                      :value="modelRef.bic"
                      :regex="REGEX.BIC"
                      :title="$tc('forms.labels.bic')"
                      input-type="text"
                      :is-required="true"
                      :is-disabled="isStatusTransformed()"
                      @input="onEventInputAction(modelRef)"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-row class="mt-1 mb-1">
            <v-col cols="12" class="d-flex justify-space-between">
              <v-btn color="error" :to="{ name: 'OverviewDevis', query: { id: devisRef.id } }">
                {{ $t('forms.buttons.cancel') }}
              </v-btn>
              <v-btn color="primary" @click="validateDevis()">
                {{ $t('forms.buttons.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
    </v-container>
    <v-container v-if="Object.keys(devisRef).length === 0 && !pendingRef">
      Aucun devis en paiement
    </v-container>
    <v-container v-if="pendingRef" fluid>
      <v-overlay :light="true" z-index="7" class="text-center">
        <v-progress-circular indeterminate size="64" />
        <p class="mt-4">{{ $t('page.loader.contratCreation') }}</p>
      </v-overlay>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import { ValidationObserver } from 'vee-validate';
import { format, parse } from 'date-fns';
import {
  InformationPaiementFractionnementEnum,
  type InformationPaiement,
  type ContratInformationComplementaireIn,
  type DevisEntreprise,
  DevisEntrepriseStatutEnum
} from 'open-api-souscription-typescript';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useSnackBar from '@/composables/useSnackBar';
import {
  devisApi,
  contratInformationComplementaireOutApi,
  informationPaiementApi
} from '@/plugins/open-api';
import _ from 'lodash';
import { useRoute } from 'vue-router';
import useConstante from '@/composables/useConstante';
import useDevis from '@/composables/useDevis';
import useUser from '@/composables/authenticate/useUser';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';

const {
  NON_CONFIE,
  PAYMENT_MEANS_CONFIE,
  PAYMENT_MEANS_NON_CONFIE,
  VALUE_BY_DEFAULT_ECHEANCE_PRINCIPALE,
  MOIS_INFO_PAIEMENT,
  REGEX
} = useConstante();

const { formatAmount } = formatDataConsultDevis();
const { user } = useUser();
const { setDevisAction } = useDevis();
const { t } = useI18n();

const PAYMENT_MEANS =
  user.value.typeEncaissement === NON_CONFIE ? PAYMENT_MEANS_NON_CONFIE : PAYMENT_MEANS_CONFIE;
const PAYMENT_MEANS_DEFAULT_VALUE =
  user.value.typeEncaissement === NON_CONFIE ? PAYMENT_MEANS_NON_CONFIE.PRELEVEMENT_CFDP : '';
const panelOpenRef = ref([0, 1, 2, 3]);
const devisRef = ref<DevisEntreprise>({});
const pendingRef = ref(false);
const pendingInfoRef = ref(false);
const getEcheanceRef = ref(null);
const modelRef = ref<InformationPaiement>({
  echeancePrincipale: null,
  fractionnement: null,
  moyenDePaiement: null,
  titulaireDuCompte: '',
  iban: '',
  bic: '',
  dateProchaineEcheance: '',
  prorataPrime: null
});
const dateProchaineEcheanceFrRef = ref('');
const selectEcheancesRef = ref(Object.keys(MOIS_INFO_PAIEMENT));
const selectFractionnementRef = ref(Object.values(InformationPaiementFractionnementEnum));
const selectPaiementRef = ref(Object.values(PAYMENT_MEANS));
const observerInfoPaymentRef = ref(null);
const cloneFormRef = ref(null);

const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();

const route = useRoute();

const emit = defineEmits(['nextStep', 'input']);
const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const onNextAction = () => {
  emit('nextStep', true);
};

const contractTypeComputed = computed(() => {
  return `${devisRef.value.formuleSouscrite?.nomProduit || ''} ${
    devisRef.value.formuleSouscrite?.nomFormule || ''
  }`;
});

onMounted(async () => {
  pendingRef.value = true;
  const id = route.query.id as string;
  devisApi()
    .getDevis(parseInt(id))
    .then((response) => {
      devisRef.value = response.data;

      //mise par défaut de la valeur de l'écheance principale et regénération des datas lié à l'échéance
      modelRef.value.echeancePrincipale = 1;
      getEcheanceRef.value = VALUE_BY_DEFAULT_ECHEANCE_PRINCIPALE;
      sendInfoContrat();

      if (devisRef.value.informationPaiement) {
        modelRef.value = devisRef.value.informationPaiement;
        getEcheanceReverse(devisRef.value.informationPaiement.echeancePrincipale);
        getProchaineEcheance();
      }
    })
    .catch(() => {
      addMessageErrorSnackBarAction('errors.recoveryDevis');
    })
    .finally(() => {
      pendingRef.value = false;
      if (user.value.typeEncaissement === NON_CONFIE) {
        selectPaymentMeans(PAYMENT_MEANS_NON_CONFIE.PRELEVEMENT_CFDP);
      }
    });
});

const isStatusTransformed = (): boolean => {
  if (devisRef.value.statut == DevisEntrepriseStatutEnum.Transforme) {
    return true;
  }
};

const formatIBAN = () => {
  modelRef.value.iban = modelRef.value.iban
    .replace(/[^\dA-Z]/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

const currencyConvert = (number: number): number | string => {
  return number ? `${formatAmount(number)} ` : number;
};

const sendInfoContrat = async () => {
  if (modelRef.value.echeancePrincipale && modelRef.value.fractionnement && devisRef.value.id) {
    pendingInfoRef.value = true;
    const infoContrat = {
      echeancePrincipale: modelRef.value.echeancePrincipale,
      fractionnement: modelRef.value.fractionnement,
      idDevis: devisRef.value.id
    } as ContratInformationComplementaireIn;
    contratInformationComplementaireOutApi()
      .createInfoContrat(infoContrat)
      .then((response) => {
        const convertDate = parse(response.data.dateProchaineEcheance, `yyyy-MM-dd`, new Date());
        const dateFormatFR = format(convertDate, `dd-MM-yyyy`);
        dateProchaineEcheanceFrRef.value = dateFormatFR;
        modelRef.value.dateProchaineEcheance = response.data.dateProchaineEcheance;
        modelRef.value.prorataPrime = response.data.prorataPrime;
        modelRef.value.prorataPrimeAnnuelle = response.data.prorataPrimeAnnuelle;
      })
      .catch(() => {
        addMessageErrorSnackBarAction(t('page.payment.updateError'));
      })
      .finally(() => {
        pendingInfoRef.value = false;
      });
  }
};

const validateDevis = async () => {
  observerInfoPaymentRef.value.validate().then((isValid: boolean) => {
    if (isValid && devisRef.value.id) {
      pendingRef.value = true;
      //cloneFormRef.value = { ...modelRef.value, iban: modelRef.value.iban.replace(/ /g, '') };
      cloneFormRef.value = { ...modelRef.value, iban: modelRef.value.iban.replace(/ /g, '') };
      informationPaiementApi()
        .transformation(devisRef.value.id, cloneFormRef.value as InformationPaiement)
        .then((response) => {
          setDevisAction(_.merge(devisRef.value, response.data));
          addMessageSuccesSnackBarAction(t('page.payment.submitSuccess'));
          onNextAction();
        })
        .catch((error) => {
          if (error?.response?.data?.violations[0]?.title) {
            addMessageErrorSnackBarAction(error.response.data.violations[0].title);
          } else {
            addMessageErrorSnackBarAction(t('page.payment.submitError'));
          }
        })
        .finally(() => {
          pendingRef.value = false;
        });
    }
  });
};

const getEcheance = (newVal) => {
  modelRef.value.echeancePrincipale = Object.keys(MOIS_INFO_PAIEMENT).indexOf(newVal) + 1;
  sendInfoContrat();
};

const selectPaymentMeans = (selectedOption: string): void => {
  modelRef.value.titulaireDuCompte = '';
  modelRef.value.iban = '';
  modelRef.value.bic = '';
  const selectedMeans: any = getKeyByValue(PAYMENT_MEANS, selectedOption);
  modelRef.value.moyenDePaiement = selectedMeans;
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const getEcheanceReverse = (echeance: number): void => {
  getEcheanceRef.value = Object.keys(MOIS_INFO_PAIEMENT)[echeance - 1];
};

const getProchaineEcheance = (): void => {
  dateProchaineEcheanceFrRef.value = devisRef.value.informationPaiement.dateProchaineEcheance;
};
</script>

<style scoped>
.renseignement-block {
  margin-top: 20px;
  padding: 0px 0px 0px 18px;
  border: solid 2px #dcdfe1;
}
.v-expansion-panel {
  border-bottom: solid 2px #ddd;
  margin-top: 0px !important;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}

.custom-border-bg {
  border: solid 2px #dcdfe1 !important;
  background-color: var(--v-bg-default-base) !important;
}
.col {
  padding-bottom: 0px;
}
</style>
