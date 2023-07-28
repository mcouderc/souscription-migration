<template>
  <v-row>
    <v-col cols="6">
      <InputGeneric
        input-class="text-uppercase"
        v-model="modelRef.raisonSociale"
        input-id="raisonSociale"
        value=""
        :title="companyNameComputed"
        input-type="text"
        :is-required="true"
        :max-length="150"
        :is-disabled="
          isDisableHelper(
            props.filialeValueValidate.raisonSociale,
            takingStatusIntoAccount,
            modelRef.raisonSociale,
            props.filialeValueValidate.raisonSociale.typage
          )
        "
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
      />
    </v-col>
    <v-col cols="6">
      <InputValidationSiret
        v-model="modelRef.identifiantLegal"
        :country="modelRef.adresse.pays"
        :is-required="true"
        id="identifiantLegal"
        :is-disabled="
          isDisableHelper(
            props.filialeValueValidate.identifiantLegal,
            takingStatusIntoAccount,
            modelRef.identifiantLegal,
            props.filialeValueValidate.identifiantLegal.typage
          )
        "
      />
    </v-col>
    <v-col cols="6" v-if="props.filialeValueValidate.activite.visible">
      <ComboboxGeneric
        v-model="modelRef.activite"
        :input-id="$tc('page.additionalInformation.activityAgricole')"
        :title="activitePrincipaleTitleComputed"
        :items="activitePrincipaleRef"
        :items-keys="['activity', 'description', 'code']"
        :is-required="true"
        :is-disabled="
          isDisableHelper(
            props.filialeValueValidate.activite,
            takingStatusIntoAccount,
            modelRef.activite,
            props.filialeValueValidate.activite.typage
          )
        "
        :max-length="150"
        :returnObject="false"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="6" v-if="props.filialeValueValidate.codeNaf.visible">
      <ComboboxGeneric
        v-model="modelRef.activite"
        :input-id="$tc('forms.labels.nafCode')"
        :title="$tc('forms.labels.nafCode')"
        :items="codeNafs"
        :items-keys="['activity', 'description', 'code']"
        :is-required="true"
        :is-disabled="
          isDisableHelper(
            props.filialeValueValidate.activite,
            takingStatusIntoAccount,
            modelRef.activite,
            props.filialeValueValidate.activite.typage
          )
        "
        :max-length="150"
        :returnObject="false"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="6">
      <SelectCountry
        :isUpperCase="true"
        v-model="modelRef.adresse.pays"
        input-id="pays"
        :title="$tc('forms.labels.countries')"
        :items="listOfCountries"
        :items-keys="['countryList', 'nom', 'code']"
        :is-info-comp="true"
        :is-required="true"
        :is-disabled="
          isDisableHelper(
            props.filialeValueValidate.pays,
            takingStatusIntoAccount,
            modelRef.adresse.pays,
            props.filialeValueValidate.pays.typage
          )
        "
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import type { Pays, ActivitePrincipale } from 'open-api-souscription-typescript';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import useCodeNafs from '@/composables/useCodeNafs';
import type { IFilliales } from '@/models/form_validate/interface/IFilliales';
import useSelectedProduct from '@/composables/useSelectedProduct';
import { activitePrincipaleApi } from '@/plugins/open-api';
import InputValidationSiret from '@/components/common/form/InputValidationSiret.vue';
import useSnackBar from '@/composables/useSnackBar';
import useDevis from '@/composables/useDevis';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import type { IFilialeValidate } from '@/models/form_validate/interface/IFilialeValidate';
import useFormValidate from '@/composables/useFormValidateHelper';

export interface IProps {
  value?: any;
  statut?: string;
  takingStatusIntoAccount?: boolean;
  market?: string;
  filialeValueValidate?: IFilialeValidate;
}

const { product } = useSelectedProduct();
const { setLoaderGlobal } = useLoader();
const { codeNafs } = useCodeNafs();
const { devis } = useDevis();
const { isDisableHelper } = useFormValidate();
const { t } = useI18n();
const props = withDefaults(defineProps<IProps>(), {
  statut: '',
  takingStatusIntoAccount: false
});

const modelRef = ref<IFilliales>({
  raisonSociale: props.value.raisonSociale || '',
  identifiantLegal: props.value.identifiantLegal || '',
  formeJuridique: props.value.formeJuridique || '',
  codeNaf: props.value.codeNaf || '',
  activite: props.value.activite || '',
  adresse: {
    pays: props.value?.adresse?.pays || devis.value?.souscripteurPersonneMorale?.adresse?.pays || ''
  }
});

const {
  isLoading: isLoadingActivitesPrincipales,
  isError: isErrorActivitesPrincipales,
  data: listActivitesPrincip,
  doFetch: doFetchActivitesPrincipales
} = useApiCall<ActivitePrincipale[]>({
  route: activitePrincipaleApi().listActivitesPrincipales
});

const activitePrincipaleTitleComputed = computed(() => {
  return t('page.additionalInformation.activityAgricole');
});

const listOfCountries = ref<Array<Pays>>([]);

const companyNameComputed = computed(() => {
  return t('forms.labels.companyName');
});

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const checkIfObjectIsSame = () => {
  emit('checkIfObjectIsSame', true);
};

onMounted(() => {
  listOfCountries.value = product.value.pays ? product.value.pays : [];
  if (props.filialeValueValidate?.activite?.visible) {
    getActivitePrincipale();
  }
});

const activitePrincipaleRef = ref<string[]>([]);
const { addMessageErrorSnackBarAction } = useSnackBar();

const getActivitePrincipale = async (): Promise<string[]> => {
  await doFetchActivitesPrincipales(modelRef.value.adresse.pays);
  if (isErrorActivitesPrincipales.value) {
    addMessageErrorSnackBarAction(t('devis.activitePrincipale.error'));
  }
  if (listActivitesPrincip.value) {
    listActivitesPrincip.value.map((item) => {
      activitePrincipaleRef.value.push(item.activite);
    });
  }
  return activitePrincipaleRef.value;
};

watch(
  () => isLoadingActivitesPrincipales.value,
  (isLoadingActivitesPrincipales) => {
    setLoaderGlobal({ isLoading: isLoadingActivitesPrincipales });
  }
);
</script>
