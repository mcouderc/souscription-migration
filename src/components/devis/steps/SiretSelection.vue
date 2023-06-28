<template>
  <div>
    <ContainerModel1 v-if="devis">
      <template #Header>
        <HeaderModel1>
          <template #Header-Title>
            {{ $t('page.subscription.siret.title') }}
          </template>
          <template #Header-SubTitle>
            {{ $t('page.subscription.siret.subTitle') }}
          </template>
        </HeaderModel1>
      </template>
      <template #Body>
        <validation-observer ref="observerSiretRef">
          <form>
            <v-container>
              <v-row align="center">
                <v-col cols="6">
                  <validation-provider name="select-country" rules="required">
                    <SelectCountry
                      v-model="dataFormPaysRef"
                      input-id="select-country"
                      :title="$tc('page.subscription.siret.form.selectCountry')"
                      :items="itemsCountryRef"
                      :items-keys="['countryList', 'nom', 'code']"
                      :is-required="true"
                      :is-disabled="itemsCountryRef.length === 1"
                      @changeCountry="clearInputSiret()"
                      @selectedItem="getSelectedCountry($event)"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    v-model="dataFormCheckboxRef"
                    :label="$t('page.subscription.siret.form.societyIncomming')"
                    class="d-flex align-center"
                    @change="clearInputSiret()"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="10">
                  <InputValidationSiret
                    v-model="dataFormSiretRef"
                    :country="dataFormPaysRef"
                    :countryParent="countryParentRef"
                    :is-disabled="dataFormCheckboxRef"
                    :is-required="!dataFormCheckboxRef"
                    @clearMsgError="backToSiret()"
                  />
                </v-col>
                <p v-if="siretNoValidRef" class="error-bloquant">
                  {{ $t('page.subscription.noSiret.subTitle') }}
                </p>
              </v-row>
              <v-row>
                <v-col cols="12" class="py-0 mt-5">
                  <ContainerButtons1
                    @cancelResponse="onPreviousStepAction()"
                    @submitResponse="onSubmit()"
                  >
                    <template #Cancel>
                      <v-icon left> mdi-arrow-left-bold </v-icon>
                      {{ $t('forms.buttons.back') }}
                    </template>
                    <template #Submit>
                      <v-icon left> mdi-check </v-icon>
                      {{ $t('forms.buttons.valid') }}
                    </template>
                  </ContainerButtons1>
                  <DialogEligibiliteAdmin @nextStep="onAdminNextAction()" />
                </v-col>
              </v-row>
            </v-container>
          </form>
        </validation-observer>
      </template>
      <template #Column>
        <ColumnSlot>
          <p class="text-body-2 mb-0">
            {{ $t('page.subscription.siret.identificationTitle') }}
          </p>
          <p class="text-small-siret">
            {{ $t('page.subscription.siret.precisionTitle') }}
          </p>
          <ComboboxGeneric
            input-id="siret"
            type="siret"
            :value="getInitialValue"
            :title="$tc('forms.labels.search')"
            :is-disabled="dataFormCheckboxRef || !countryParentSouscripteurRef"
            @selected="selectedProfil"
            @clearMsgError="backToSiret()"
          />
        </ColumnSlot>
        <ColumnSlot
          v-if="Object.keys(identifiantProfil).length > 0"
          class="mt-5 text-body text-default"
        >
          <IdentificationCard :profil="identifiantProfil" />
        </ColumnSlot>
      </template>
    </ContainerModel1>
  </div>
</template>

<script setup lang="ts">
import ContainerModel1 from '@/components/common/templates/ContainerModel1.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import InputValidationSiret from '@/components/common/form/InputValidationSiret.vue';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import ColumnSlot from '@/components/common/templates/ColumnSlot.vue';
import IdentificationCard from '@/components/devis/IdentificationCard.vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import useSnackBar from '@/composables/useSnackBar';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import { computed, onMounted, ref, watch } from 'vue';
import useIdentifiantProfil from '@/composables/useIdentifiantProfil';
import useIdentifiantLegal from '@/composables/useIdentifiantLegal';
import { devisInitiatorApi, getEligibiliteEntrepriseResponseApi } from '@/plugins/open-api';
import type IPapperEntreprise from '@/models/IPapperEntreprise';
import useSelectedProduct from '@/composables/useSelectedProduct';
import { useRoute } from 'vue-router/composables';
import useDevis from '@/composables/useDevis';
import usePermission from '@/composables/authenticate/usePermission';
import DialogEligibiliteAdmin from '@/components/devis/forms/DialogEligibiliteAdmin.vue';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import eventBus from '@/plugins/eventBus';
import {
  DevisEntrepriseStatutEnum,
  DevisInitiatorDevisHydratationTypeRisqueEnum,
  ReponseEligibiliteStatutEnum,
  type ReponseEligibilite,
  type DevisEntreprise
} from 'open-api-souscription-typescript';
import type { DevisInitiatorDevisHydratation } from 'open-api-souscription-typescript';

const siretNoValidRef = ref(false);
const dataFormPaysRef = ref('');
const dataFormSiretRef = ref('');
const dataFormCheckboxRef = ref(false);
const observerSiretRef = ref(null);
const itemsCountryRef = ref([]);
const usePappers = ref(true);
const countryParentRef = ref('');
const countryParentSouscripteurRef = ref<string>(null);
const { setLoaderGlobal } = useLoader();
const { product } = useSelectedProduct();
const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const { devis, setDevisAction } = useDevis();
const { identifiantProfil, setIdentifiantProfil } = useIdentifiantProfil();
const { getPapersAction } = useIdentifiantLegal();
const { doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate } = usePermission();
const route = useRoute();

const emit = defineEmits(['nextStep', 'previousStep']);

const {
  isLoading: isLoadingGetEliEntreprise,
  isError: isErrorEliEntreprise,
  data: eligiEntrepriseResponse,
  doFetch: doFetchEliEntreprise
} = useApiCall<ReponseEligibilite>({
  route: getEligibiliteEntrepriseResponseApi().getEligibiliteEntreprise
});

const {
  isLoading: isLoadingInitiateDevis,
  isError: isErrorInitiateDevis,
  data: initDevisResponse,
  doFetch: doFetchInitiateDevis
} = useApiCall<DevisEntreprise>({
  route: devisInitiatorApi().initiateDevis
});

onMounted(async () => {
  if (devis.value) {
    setIdentifiantProfil({} as IPapperEntreprise);
    if (devis.value.souscripteurPersonneMorale?.identifiantLegal) {
      await getPappers(devis.value.souscripteurPersonneMorale.identifiantLegal);
    }
    dataFormPaysRef.value =
      product.value.pays.length === 1 ? product.value.pays[0].code : devis.value?.codePays ?? '';
    dataFormSiretRef.value = devis.value?.souscripteurPersonneMorale?.identifiantLegal;
    itemsCountryRef.value = product.value.pays ? product.value.pays : [];
    if (devis.value.id && dataFormSiretRef.value === '') {
      dataFormCheckboxRef.value = true;
    }
  }
});

const getInitialValue = computed(() => {
  return devis.value.souscripteurPersonneMorale?.identifiantLegal?.length > 0
    ? devis.value.souscripteurPersonneMorale.identifiantLegal
    : Object.keys(identifiantProfil).length > 0
    ? identifiantProfil
    : '';
});

const initCountryParentSouscripteur = () => {
  countryParentSouscripteurRef.value = null;
  dataFormPaysRef.value === 'FR'
    ? (countryParentSouscripteurRef.value = dataFormPaysRef.value)
    : itemsCountryRef.value.find((pays) => {
        if (pays.code === dataFormPaysRef.value && pays.parent) {
          countryParentSouscripteurRef.value = pays.parent.code;
        }
      });
};

const getSelectedCountry = (event) => {
  const selectedItem = itemsCountryRef.value.find((item) => item.code === event.value);
  countryParentRef.value = selectedItem.parent?.code ?? null;
};

const clearInputSiret = () => {
  dataFormSiretRef.value = '';
  setIdentifiantProfil({} as IPapperEntreprise);
};

const getPappers = async (identifiantLegal) => {
  const payload = {
    headers: {},
    limit: 5,
    target: 'siret',
    query: identifiantLegal
  };
  await getPapersAction(payload);
};

const onSubmit = async () => {
  const isValid = await observerSiretRef.value.validate();
  if (isValid) {
    if (dataFormCheckboxRef.value || !countryParentSouscripteurRef.value) {
      // Si la société est encore en cours de création OU  si la société n'est pas FR (dans ce cas on a pas de SIRET)
      // alors Force le statut du devis pour ne pas tomber en erreur sur la requête d'hydratation juste après
      setDevisSouscripteurCountry();
      onNextAction();
    } else {
      await doFetchEliEntreprise(dataFormPaysRef.value, devis.value.dateEffet, [
        dataFormSiretRef.value
      ]);
      if (isErrorEliEntreprise.value) {
        addMessageErrorSnackBarAction(i18n.tc('snackBar.error'));
      }
      if (eligiEntrepriseResponse.value) {
        if (
          eligiEntrepriseResponse.value.statut === ReponseEligibiliteStatutEnum.Autorise ||
          eligiEntrepriseResponse.value.statut === ReponseEligibiliteStatutEnum.NonDetermine
        ) {
          devisInitiator(); //puisque eligibilite ok alors on fait l'initiate hydrate
        } else {
          if (doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()) {
            eventBus.emit('open-eligibilite-admin-dialog');
          } else {
            addMessageErrorSnackBarAction(i18n.tc('page.subscription.noSiret.title'));
            siretNoValidRef.value = true;
          }
        }
      }
    }
  } else {
    addMessageErrorSnackBarAction('Veuillez valider tous les champs');
  }
};

const devisInitiator = async () => {
  if (route.query.new) {
    usePappers.value = false;
  }

  const initDevis = {
    dateEffet: devis.value.dateEffet,
    typeRisque: devis.value.typeRisque as DevisInitiatorDevisHydratationTypeRisqueEnum,
    identifiantLegal: dataFormSiretRef.value,
    codePays: dataFormPaysRef.value,
    usePappersHydrater: usePappers.value
  } as DevisInitiatorDevisHydratation;

  await doFetchInitiateDevis(initDevis);
  if (isErrorInitiateDevis.value) {
    addMessageErrorSnackBarAction(i18n.tc('page.subscription.siret.initDevisFail'));
  }
  if (initDevisResponse.value) {
    setDevisSouscripteurCountry();
    setDevisAction(_.merge(devis.value, initDevisResponse.value));
    onNextAction();
    addMessageSuccesSnackBarAction(i18n.tc('page.subscription.siret.initDevisSuccess'));
  }
};

const setDevisSouscripteurCountry = () => {
  setDevisAction(
    _.merge(devis.value, {
      statut: DevisEntrepriseStatutEnum.BrouillonEnCours,
      codePays: dataFormPaysRef.value,
      souscripteurPersonneMorale: {
        identifiantLegal: dataFormSiretRef.value,
        adresse: {
          pays: countryParentSouscripteurRef.value
        }
      },
      souscripteurPersonnePhysique: {
        adresse: {
          pays: countryParentSouscripteurRef.value
        }
      }
    })
  );
};

const selectedProfil = (profil) => {
  if (profil && typeof profil === 'object') {
    dataFormSiretRef.value = profil.siege.siret;
    setIdentifiantProfil(profil);
  } else {
    setIdentifiantProfil({} as IPapperEntreprise);
  }
};

const onAdminNextAction = () => {
  devisInitiator();
  onNextAction();
};

const onNextAction = () => {
  emit('nextStep', true);
};

const onPreviousStepAction = () => {
  emit('previousStep', true);
};

const backToSiret = () => {
  siretNoValidRef.value = false;
};

watch(
  () => dataFormPaysRef.value,
  () => {
    initCountryParentSouscripteur();
  }
);

watch(
  () => dataFormSiretRef.value,
  (newVal) => {
    if (!newVal) {
      setIdentifiantProfil({} as IPapperEntreprise);
    }
  }
);

watch(
  () => [isLoadingGetEliEntreprise.value, isLoadingInitiateDevis.value],
  ([isLoadingGetEliEntreprise, isLoadingInitiateDevis]) => {
    setLoaderGlobal({
      isLoading: isLoadingGetEliEntreprise || isLoadingInitiateDevis
    });
  }
);
</script>
<style scoped>
.col {
  padding-bottom: 0px;
}
.error-bloquant {
  padding-left: 12px;
  font-weight: bold;
  color: red;
  margin-bottom: 0px !important;
}
.text-small-siret {
  font-style: italic;
  font-weight: 500;
  font-size: 11px;
}
</style>
