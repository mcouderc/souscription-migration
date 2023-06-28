<template>
  <v-row>
    <v-col cols="6">
      <InputGeneric
        input-class="text-uppercase"
        v-model="modelRef.raisonSociale"
        input-id="raisonSociale"
        :title="companyNameComputed"
        input-type="text"
        :max-length="150"
        :is-required="inputRequireComputed"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.scisFormValueValidate.raisonSociale,
            takingStatusIntoAccount,
            modelRef.raisonSociale,
            props.scisFormValueValidate.raisonSociale.typage
          )
        "
      />
    </v-col>
    <v-col cols="6">
      <InputValidationSiret
        v-model="modelRef.identifiantLegal"
        input-id="identifiantLegal"
        :country="modelRef.adresse.pays"
        :is-required="true"
        @input="onEventInputAction(modelRef)"
        :is-disabled="
          isDisableHelper(
            props.scisFormValueValidate.identifiantLegal,
            takingStatusIntoAccount,
            modelRef.identifiantLegal,
            props.scisFormValueValidate.identifiantLegal.typage
          )
        "
      />
    </v-col>
    <v-col cols="12">
      <template v-if="isFranceChildrenComputed">
        <ComboboxGeneric
          v-model="modelRef.adresse.adresse1"
          input-id="adresse1"
          type="address"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="inputRequireComputed"
          @setAddress="modelRef.adresse.adresse1 = $event"
          @setZipCode="modelRef.adresse.codePostal = $event"
          @setCity="modelRef.adresse.ville = $event"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.scisFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.adresse.adresse1,
              props.scisFormValueValidate.adresse1.typage
            )
          "
        />
      </template>
      <template v-else>
        <InputGeneric
          v-model="modelRef.adresse.adresse1"
          input-id="adresse1"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="inputRequireComputed"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.scisFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.adresse.adresse1,
              props.scisFormValueValidate.adresse1.typage
            )
          "
        />
      </template>
    </v-col>

    <v-col cols="3">
      <template v-if="isFranceChildrenComputed">
        <ComboboxGeneric
          type="address"
          v-model="modelRef.adresse.codePostal"
          input-id="codePostal"
          :title="$tc('forms.labels.cityCode')"
          :regex="controlCityCodeByCountry(modelRef.adresse.pays)"
          input-type="text"
          :max-length="25"
          :city-code="true"
          :is-required="inputRequireComputed"
          @setZipCode="modelRef.adresse.codePostal = $event"
          @setCity="modelRef.adresse.ville = $event"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.scisFormValueValidate.codePostal,
              takingStatusIntoAccount,
              modelRef.adresse.codePostal,
              props.scisFormValueValidate.codePostal.typage
            )
          "
          @change="getCitysByCode($event)"
        />
      </template>
      <template v-else>
        <InputGeneric
          v-model="modelRef.adresse.codePostal"
          input-id="codePostal"
          :title="$tc('forms.labels.cityCode')"
          :regex="controlCityCodeByCountry(modelRef.adresse.pays)"
          input-type="text"
          :max-length="25"
          :is-required="inputRequireComputed"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.scisFormValueValidate.codePostal,
              takingStatusIntoAccount,
              modelRef.adresse.codePostal,
              props.scisFormValueValidate.codePostal.typage
            )
          "
          @change="getCitysByCode($event)"
        />
      </template>
    </v-col>

    <v-col cols="5">
      <ComboboxGeneric
        input-class="text-uppercase"
        v-model="modelRef.adresse.ville"
        input-id="ville"
        :items="citysRef"
        :title="$tc('forms.labels.city')"
        input-type="text"
        :max-length="150"
        :is-required="inputRequireComputed"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.scisFormValueValidate.ville,
            takingStatusIntoAccount,
            modelRef.adresse.ville,
            props.scisFormValueValidate.ville.typage
          )
        "
      />
    </v-col>
    <v-col cols="4">
      <SelectCountry
        input-class="text-uppercase"
        v-model="modelRef.adresse.pays"
        input-id="pays"
        :title="$tc('forms.labels.countries')"
        :items="listOfCountries"
        :items-keys="['countryList', 'nom', 'code']"
        :is-info-comp="true"
        :isUpperCase="true"
        :is-required="inputRequireComputed"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        @input="onEventInputAction(modelRef)"
        :is-disabled="
          isDisableHelper(
            props.scisFormValueValidate.pays,
            takingStatusIntoAccount,
            modelRef.adresse.pays,
            props.scisFormValueValidate.pays.typage
          )
        "
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import { DevisEntrepriseStatutEnum, type Pays } from 'open-api-souscription-typescript';
import type { ISCIS } from '@/models/form_validate/interface/ISCIS';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputValidationSiret from '@/components/common/form/InputValidationSiret.vue';
import useSelectedProduct from '@/composables/useSelectedProduct';
import useAutoAddress from '@/composables/useAutoAddress';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import useFormValidate from '@/composables/useFormValidateHelper';
import type { IScisValidate } from '@/models/form_validate/interface/IScisValidate';
import validationRulesCityCode from '@/services/validationRulesCityCode';
import postalCode from '@/services/postalCode';

export interface IProps {
  value?: any;
  statut?: string;
  takingStatusIntoAccount?: boolean;
  scisFormValueValidate?: IScisValidate;
  devisPays?: string;
}

const { product } = useSelectedProduct();
const { isDisableHelper } = useFormValidate();
const props = withDefaults(defineProps<IProps>(), {
  value: {
    raisonSociale: '',
    identifiantLegal: '',
    adresse: { adresse1: '', codePostal: '', ville: '', pays: '' }
  } as ISCIS,
  statut: '',
  takingStatusIntoAccount: false
});
const { controlCityCodeByCountry } = validationRulesCityCode();
const { checkIfCountryIsFranceChildren } = useAutoAddress();
const { getCitys } = postalCode();
const citysRef = ref<string[]>([]);
const modelRef = ref<ISCIS>({
  raisonSociale: props.value.raisonSociale || '',
  identifiantLegal: props.value.identifiantLegal || '',
  adresse: {
    adresse1: props.value?.adresse?.adresse1 || '',
    codePostal: props.value?.adresse?.codePostal || '',
    ville: props.value?.adresse?.ville || '',
    pays: props.value?.adresse?.pays || ''
  }
});

const companyNameComputed = computed(() => {
  return i18n.tc('page.devisOverview.listData.nomSci');
});

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount ? props.statut === DevisEntrepriseStatutEnum.Emis : false;
});

const getCitysByCode = (value: string) => {
  getCitys(value).then((citysResponse: string[]) => {
    citysRef.value = citysResponse;
    modelRef.value.adresse.ville = citysResponse[0];
  });
};

const listOfCountries = ref<Array<Pays>>([]);

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const checkIfObjectIsSame = () => {
  emit('checkIfObjectIsSame', true);
};

const isFranceChildrenComputed = computed(() => {
  return checkIfCountryIsFranceChildren(listOfCountries).value.includes(
    modelRef.value.adresse.pays
  );
});

onMounted(async () => {
  listOfCountries.value = product.value.pays ? product.value.pays : [];
  if (!modelRef.value.adresse.pays && props.devisPays) {
    modelRef.value.adresse.pays = props.devisPays;
  }
});
</script>
