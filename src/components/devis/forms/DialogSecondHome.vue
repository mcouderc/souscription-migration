<template>
  <v-row>
    <v-col cols="12">
      <template v-if="isFranceChildrenComputed">
        <ComboboxGeneric
          type="address"
          v-model="modelRef.adresse1"
          input-id="adresse1"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="inputRequireComputed"
          @setAddress="modelRef.adresse1 = $event"
          @setZipCode="modelRef.codePostal = $event"
          @setCity="modelRef.ville = $event"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.residenceSecondaireFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.adresse1,
              props.residenceSecondaireFormValueValidate.adresse1.typage
            )
          "
        />
      </template>
      <template v-else>
        <InputGeneric
          v-model="modelRef.adresse1"
          input-id="adresse1"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :is-required="false"
          :maxLength="255"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.residenceSecondaireFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.adresse1,
              props.residenceSecondaireFormValueValidate.adresse1.typage
            )
          "
        />
      </template>
    </v-col>

    <v-col cols="12">
      <InputGeneric
        v-model="modelRef.adresse2"
        input-id="adresse2"
        :title="$tc('forms.labels.address2')"
        input-type="text"
        :maxLength="255"
        :is-required="false"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.residenceSecondaireFormValueValidate.adresse2,
            takingStatusIntoAccount,
            modelRef.adresse2,
            props.residenceSecondaireFormValueValidate.adresse2.typage
          )
        "
      />
    </v-col>
    <v-col cols="12">
      <InputGeneric
        v-model="modelRef.adresse3"
        input-id="adresse3"
        :title="$tc('forms.labels.address3')"
        input-type="text"
        :maxLength="255"
        :is-required="false"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.residenceSecondaireFormValueValidate.adresse3,
            takingStatusIntoAccount,
            modelRef.adresse3,
            props.residenceSecondaireFormValueValidate.adresse3.typage
          )
        "
      />
    </v-col>

    <v-col cols="3">
      <template v-if="isFranceChildrenComputed">
        <ComboboxGeneric
          type="address"
          v-model="modelRef.codePostal"
          input-id="codePostal"
          :title="$tc('forms.labels.cityCode')"
          :regex="controlCityCodeByCountry(modelRef.pays)"
          input-type="text"
          :max-length="25"
          :city-code="true"
          :is-required="inputRequireComputed"
          @setZipCode="modelRef.codePostal = $event"
          @setCity="modelRef.ville = $event"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.residenceSecondaireFormValueValidate.codePostal,
              takingStatusIntoAccount,
              modelRef.codePostal,
              props.residenceSecondaireFormValueValidate.codePostal.typage
            )
          "
          @change="getCitysByCode($event)"
        />
      </template>
      <template v-else>
        <InputGeneric
          v-model="modelRef.codePostal"
          input-id="codePostal"
          :title="$tc('forms.labels.cityCode')"
          :regex="controlCityCodeByCountry(modelRef.pays)"
          input-type="text"
          :max-length="25"
          :is-required="inputRequireComputed"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.residenceSecondaireFormValueValidate.codePostal,
              takingStatusIntoAccount,
              modelRef.codePostal,
              props.residenceSecondaireFormValueValidate.codePostal.typage
            )
          "
          @change="getCitysByCode($event)"
        />
      </template>
    </v-col>

    <v-col cols="5">
      <ComboboxGeneric
        input-class="text-uppercase"
        v-model="modelRef.ville"
        input-id="ville"
        :items="citysRef"
        :max-length="150"
        :title="$tc('forms.labels.city')"
        input-type="text"
        :is-required="inputRequireComputed"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.residenceSecondaireFormValueValidate.ville,
            takingStatusIntoAccount,
            modelRef.ville,
            props.residenceSecondaireFormValueValidate.ville.typage
          )
        "
      />
    </v-col>
    <v-col cols="4">
      <SelectCountry
        v-model="modelRef.pays"
        input-id="pays"
        :title="$tc('forms.labels.countries')"
        :items="listOfCountries"
        :items-keys="['countryList', 'nom', 'code']"
        :is-info-comp="true"
        :isUpperCase="true"
        :is-required="inputRequireComputed"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.residenceSecondaireFormValueValidate.pays,
            takingStatusIntoAccount,
            modelRef.pays,
            props.residenceSecondaireFormValueValidate.pays.typage
          )
        "
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import { DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';
import { computed, onMounted, ref } from 'vue';
import type { IResSecond } from '@/models/form_validate/interface/IResSecond';
import useSelectedProduct from '@/composables/useSelectedProduct';
import useAutoAddress from '@/composables/useAutoAddress';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import type { IResidenceSecondaireValidate } from '@/models/form_validate/interface/IResidenceSecondaireValidate';
import useFormValidate from '@/composables/useFormValidateHelper';
import validationRulesCityCode from '@/services/validationRulesCityCode';
import postalCode from '@/services/postalCode';

export interface IProps {
  value?: any;
  statut?: string;
  takingStatusIntoAccount?: boolean;
  residenceSecondaireFormValueValidate?: IResidenceSecondaireValidate;
  devisPays?: string;
}

const { checkIfCountryIsFranceChildren } = useAutoAddress();
const { product } = useSelectedProduct();
const { isDisableHelper } = useFormValidate();
const props = withDefaults(defineProps<IProps>(), {
  value: {
    adresse1: '',
    adresse2: '',
    adresse3: '',
    codePostal: '',
    ville: '',
    pays: ''
  } as IResSecond,
  statut: '',
  takingStatusIntoAccount: false
});
const { controlCityCodeByCountry } = validationRulesCityCode();
const listOfCountries = ref([]);
const { getCitys } = postalCode();
const citysRef = ref<string[]>([]);
const modelRef = ref<IResSecond>({
  adresse1: props.value?.adresse1 || '',
  adresse2: props.value?.adresse2 || '',
  adresse3: props.value?.adresse3 || '',
  codePostal: props.value?.codePostal || '',
  ville: props.value?.ville || '',
  pays: props.value?.pays || ''
});

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount ? props.statut === DevisEntrepriseStatutEnum.Emis : false;
});

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const checkIfObjectIsSame = () => {
  emit('checkIfObjectIsSame', true);
};

const getCitysByCode = (value: string) => {
  getCitys(value).then((citysResponse: string[]) => {
    citysRef.value = citysResponse;
    modelRef.value.ville = citysResponse[0];
  });
};

const isFranceChildrenComputed = computed(() => {
  return checkIfCountryIsFranceChildren(listOfCountries).value.includes(modelRef.value.pays);
});

onMounted(async () => {
  listOfCountries.value = product.value.pays ? product.value.pays : [];
  if (!modelRef.value.pays && props.devisPays) {
    modelRef.value.pays = props.devisPays;
  }
});
</script>
