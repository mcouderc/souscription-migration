<template>
  <v-row>
    <v-col cols="12">
      <InputGeneric
        v-model="modelRef.typeBien"
        input-id="typebien"
        :title="$tc('forms.labels.typeBien')"
        input-type="text"
        :isDisabled="true"
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
          :is-required="isRequired(props.bienFormValidate.adresse1, props.takingStatusIntoAccount)"
          @setAddress="modelRef.adresse.adresse1 = $event"
          @setZipCode="modelRef.adresse.codePostal = $event"
          @setCity="modelRef.adresse.ville = $event"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.bienFormValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.adresse.adresse1,
              props.bienFormValidate.adresse1.typage
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
          :is-required="isRequired(props.bienFormValidate.adresse1, props.takingStatusIntoAccount)"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.bienFormValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.adresse.adresse1,
              props.bienFormValidate.adresse1.typage
            )
          "
        />
      </template>
    </v-col>
    <v-col cols="12">
      <InputGeneric
        v-model="modelRef.adresse.adresse2"
        input-id="adresse2"
        :title="$tc('forms.labels.address2')"
        input-type="text"
        :maxLength="255"
        :is-required="isRequired(props.bienFormValidate.adresse2, props.takingStatusIntoAccount)"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.bienFormValidate.adresse2,
            takingStatusIntoAccount,
            modelRef.adresse.adresse2,
            props.bienFormValidate.adresse2.typage
          )
        "
      />
    </v-col>
    <v-col cols="12">
      <InputGeneric
        v-model="modelRef.adresse.adresse3"
        input-id="adresse3"
        :title="$tc('forms.labels.address3')"
        input-type="text"
        :maxLength="255"
        :is-required="isRequired(props.bienFormValidate.adresse2, props.takingStatusIntoAccount)"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.bienFormValidate.adresse3,
            takingStatusIntoAccount,
            modelRef.adresse.adresse3,
            props.bienFormValidate.adresse3.typage
          )
        "
      />
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
          :city-code="true"
          :max-length="25"
          :is-required="
            isRequired(props.bienFormValidate.codePostal, props.takingStatusIntoAccount)
          "
          @setZipCode="modelRef.adresse.codePostal = $event"
          @setCity="modelRef.adresse.ville = $event"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.bienFormValidate.codePostal,
              takingStatusIntoAccount,
              modelRef.adresse.codePostal,
              props.bienFormValidate.codePostal.typage
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
          :is-required="
            isRequired(props.bienFormValidate.codePostal, props.takingStatusIntoAccount)
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
          :is-disabled="
            isDisableHelper(
              props.bienFormValidate.codePostal,
              takingStatusIntoAccount,
              modelRef.adresse.codePostal,
              props.bienFormValidate.codePostal.typage
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
        :is-required="isRequired(props.bienFormValidate.ville, props.takingStatusIntoAccount)"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.bienFormValidate.ville,
            takingStatusIntoAccount,
            modelRef.adresse.ville,
            props.bienFormValidate.ville.typage
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
        :isUpperCase="true"
        :items-keys="['countryList', 'nom', 'code']"
        :is-info-comp="true"
        :is-required="isRequired(props.bienFormValidate.ville, props.takingStatusIntoAccount)"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="checkIfObjectIsSame()"
        :is-disabled="
          isDisableHelper(
            props.bienFormValidate.pays,
            takingStatusIntoAccount,
            modelRef.adresse.ville,
            props.bienFormValidate.pays.typage
          )
        "
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import type { Pays } from 'open-api-souscription-typescript';
import { BienTypeBienEnum } from 'open-api-souscription-typescript';
import type { IBiens } from '@/models/form_validate/interface/IBiens';
import { computed, onMounted, ref } from 'vue';
import useSelectedProduct from '@/composables/useSelectedProduct';
import type { IBienValidate } from '@/models/form_validate/interface/IBienValidate';
import useFormValidate from '@/composables/useFormValidateHelper';
import useAutoAddress from '@/composables/useAutoAddress';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import validationRulesCityCode from '@/services/validationRulesCityCode';
import postalCode from '@/services/postalCode';

export interface IProps {
  value?: IBiens;
  statut?: string;
  takingStatusIntoAccount?: boolean;
  bienFormValidate?: IBienValidate;
  devisPays?: string;
}
const { checkIfCountryIsFranceChildren } = useAutoAddress();
const { product } = useSelectedProduct();
const { isDisableHelper, isRequired } = useFormValidate();
const { getCitys } = postalCode();
const props = withDefaults(defineProps<IProps>(), {
  value: () =>
    ({
      typeBien: BienTypeBienEnum.LocationSaisonnire,
      adresse: {
        adresse1: '',
        adresse2: '',
        adresse3: '',
        codePostal: '',
        ville: '',
        pays: ''
      }
    } as IBiens),
  statut: '',
  takingStatusIntoAccount: false
});
const citysRef = ref<string[]>([]);
const { controlCityCodeByCountry } = validationRulesCityCode();
const listOfCountries = ref<Array<Pays>>([]);
const modelRef = ref<IBiens>({
  typeBien: props.value.typeBien || '',
  adresse: {
    adresse1: props.value?.adresse?.adresse1 || '',
    adresse2: props.value?.adresse?.adresse2 || '',
    adresse3: props.value?.adresse?.adresse3 || '',
    codePostal: props.value?.adresse?.codePostal || '',
    ville: props.value?.adresse?.ville || '',
    pays: props.value?.adresse?.pays || ''
  }
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
    modelRef.value.adresse.ville = citysResponse[0];
  });
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
