<template>
  <v-col>
    <v-row>
      <v-col cols="4" v-if="props.beneficiareFormValueValidate.raisonSociale?.visible">
        <InputGeneric
          input-class="text-uppercase"
          v-model="modelRef.beneficiairePersonneMorale.raisonSociale"
          input-id="nom"
          :title="companyNameComputed"
          input-type="text"
          :max-length="150"
          :is-required="
            isRequired(
              props.beneficiareFormValueValidate?.raisonSociale,
              props.takingStatusIntoAccount
            )
          "
          :is-disabled="
            isDisableHelper(
              props.beneficiareFormValueValidate?.raisonSociale,
              takingStatusIntoAccount,
              modelRef.beneficiairePersonneMorale.raisonSociale,
              props.beneficiareFormValueValidate.raisonSociale.typage
            )
          "
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>

      <v-col cols="3" v-if="props.beneficiareFormValueValidate.pays?.visible">
        <SelectCountry
          v-model="modelRef.beneficiairePersonneMorale.adresse.pays"
          input-id="paysBeneficiaire"
          :title="$tc('forms.labels.countries')"
          :items="listOfCountriesRef"
          :items-keys="['countryList', 'nom', 'code']"
          :is-info-comp="true"
          :isUpperCase="true"
          :is-required="
            isRequired(props.beneficiareFormValueValidate.pays, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.beneficiareFormValueValidate.pays,
              takingStatusIntoAccount,
              modelRef.beneficiairePersonneMorale.adresse.pays,
              props.beneficiareFormValueValidate.pays.typage
            ) || listOfCountriesRef.length === 1
          "
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>

      <v-col cols="5" v-if="props.beneficiareFormValueValidate.numeroImmatriculation?.visible">
        <InputGeneric
          v-model="modelRef.beneficiairePersonneMorale.identifiantLegal"
          input-id="numeroImmatriculation"
          :title="numeroImmatriculationComputed"
          input-type="text"
          :max-length="25"
          :is-required="isRequiredNumImmat()"
          :is-disabled="
            isDisableHelper(
              props.beneficiareFormValueValidate.numeroImmatriculation,
              takingStatusIntoAccount,
              modelRef.beneficiairePersonneMorale.identifiantLegal,
              props.beneficiareFormValueValidate.numeroImmatriculation.typage
            )
          "
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>

      <v-col cols="12" v-if="props.beneficiareFormValueValidate.adresse1?.visible">
        <template v-if="isFranceChildrenComputed">
          <ComboboxGeneric
            type="address"
            v-model="modelRef.beneficiairePersonneMorale.adresse.adresse1"
            input-id="adresse1"
            :title="$tc('forms.labels.address')"
            input-type="text"
            :maxLength="255"
            :is-required="
              isRequired(props.beneficiareFormValueValidate.adresse1, props.takingStatusIntoAccount)
            "
            :is-disabled="
              isDisableHelper(
                props.beneficiareFormValueValidate.adresse1,
                takingStatusIntoAccount,
                modelRef.beneficiairePersonneMorale.adresse.adresse1,
                props.beneficiareFormValueValidate.adresse1.typage
              )
            "
            @setAddress="onInputValueAddress('adresse1', $event)"
            @setZipCode="onInputValueAddress('codePostal', $event)"
            @setCity="onInputValueAddress('ville', $event)"
            @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          />
        </template>
        <template v-else>
          <InputGeneric
            v-model="modelRef.beneficiairePersonneMorale.adresse.adresse1"
            input-id="adresse1"
            :title="$tc('forms.labels.address')"
            input-type="text"
            :maxLength="255"
            :is-required="
              isRequired(props.beneficiareFormValueValidate.adresse1, props.takingStatusIntoAccount)
            "
            :is-disabled="
              isDisableHelper(
                props.beneficiareFormValueValidate.adresse1,
                takingStatusIntoAccount,
                modelRef.beneficiairePersonneMorale.adresse.adresse1,
                props.beneficiareFormValueValidate.adresse1.typage
              )
            "
            @setAddress="onInputValueAddress('adresse1', $event)"
            @setZipCode="onInputValueAddress('codePostal', $event)"
            @setCity="onInputValueAddress('ville', $event)"
            @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          />
        </template>
      </v-col>
      <v-col cols="6" v-if="props.beneficiareFormValueValidate.adresse2?.visible">
        <InputGeneric
          v-model="modelRef.beneficiairePersonneMorale.adresse.adresse2"
          input-id="adresse2"
          :title="$tc('forms.labels.address2')"
          input-type="text"
          :maxLength="255"
          :is-required="
            isRequired(props.beneficiareFormValueValidate.adresse2, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.beneficiareFormValueValidate.adresse2,
              takingStatusIntoAccount,
              modelRef.beneficiairePersonneMorale.adresse.adresse2,
              props.beneficiareFormValueValidate.adresse2.typage
            )
          "
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6" v-if="props.beneficiareFormValueValidate.adresse3?.visible">
        <InputGeneric
          v-model="modelRef.beneficiairePersonneMorale.adresse.adresse3"
          input-id="adresse3"
          :title="$tc('forms.labels.address3')"
          input-type="text"
          :maxLength="255"
          :is-required="
            isRequired(props.beneficiareFormValueValidate.adresse3, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.beneficiareFormValueValidate.adresse2,
              takingStatusIntoAccount,
              modelRef.beneficiairePersonneMorale.adresse.adresse2,
              props.beneficiareFormValueValidate.adresse2.typage
            )
          "
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="4" v-if="props.beneficiareFormValueValidate.codePostale?.visible">
        <template v-if="isFranceChildrenComputed">
          <InputGeneric
            v-model="modelRef.beneficiairePersonneMorale.adresse.codePostal"
            :maxLength="255"
            input-id="codePostalBeneficaire"
            :title="$tc('forms.labels.cityCode')"
            :regex="controlCityCodeByCountry(modelRef.beneficiairePersonneMorale.adresse.pays)"
            input-type="text"
            :is-required="
              isRequired(
                props.beneficiareFormValueValidate.codePostale,
                props.takingStatusIntoAccount
              )
            "
            :is-disabled="
              isDisableHelper(
                props.beneficiareFormValueValidate.codePostale,
                takingStatusIntoAccount,
                modelRef.beneficiairePersonneMorale.adresse.codePostal,
                props.beneficiareFormValueValidate.codePostale.typage
              )
            "
            @setAddress="onInputValueAddress('adresse1', $event)"
            @setZipCode="onInputValueAddress('codePostal', $event)"
            @setCity="onInputValueAddress('ville', $event)"
            @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          />
        </template>
        <template v-else>
          <InputGeneric
            v-model="modelRef.beneficiairePersonneMorale.adresse.codePostal"
            input-id="codePostalBeneficaire"
            :title="$tc('forms.labels.cityCode')"
            :regex="controlCityCodeByCountry(modelRef.beneficiairePersonneMorale.adresse.pays)"
            input-type="text"
            :is-required="
              isRequired(
                props.beneficiareFormValueValidate.codePostale,
                props.takingStatusIntoAccount
              )
            "
            :is-disabled="
              isDisableHelper(
                props.beneficiareFormValueValidate.codePostale,
                takingStatusIntoAccount,
                modelRef.beneficiairePersonneMorale.adresse.codePostal,
                props.beneficiareFormValueValidate.codePostale.typage
              )
            "
            @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          />
        </template>
      </v-col>
      <v-col cols="8" v-if="props.beneficiareFormValueValidate.ville?.visible">
        <template v-if="isFranceChildrenComputed">
          <ComboboxGeneric
            type="address"
            v-model="modelRef.beneficiairePersonneMorale.adresse.ville"
            input-id="villeBeneficiaire"
            :title="$tc('forms.labels.city')"
            input-type="text"
            :city-code="true"
            :max-length="150"
            :is-required="
              isRequired(props.beneficiareFormValueValidate.ville, props.takingStatusIntoAccount)
            "
            :is-disabled="
              isDisableHelper(
                props.beneficiareFormValueValidate.ville,
                takingStatusIntoAccount,
                modelRef.beneficiairePersonneMorale.adresse.ville,
                props.beneficiareFormValueValidate.ville.typage
              )
            "
            @setCity="onInputValueAddress('ville', $event)"
            @setZipCode="onInputValueAddress('codePostal', $event)"
            @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          />
        </template>
        <template v-else>
          <InputGeneric
            input-class="text-uppercase"
            v-model="modelRef.beneficiairePersonneMorale.adresse.ville"
            input-id="ville"
            :title="$tc('forms.labels.city')"
            input-type="text"
            :max-length="150"
            :city-code="true"
            @setCity="onInputValueAddress('ville', $event)"
            @setZipCode="onInputValueAddress('codePostal', $event)"
            :is-required="
              isRequired(props.beneficiareFormValueValidate.ville, props.takingStatusIntoAccount)
            "
            :is-disabled="
              isDisableHelper(
                props.beneficiareFormValueValidate.ville,
                takingStatusIntoAccount,
                modelRef.beneficiairePersonneMorale.adresse.ville,
                props.beneficiareFormValueValidate.ville.typage
              )
            "
            @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          />
        </template>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import type { Pays } from 'open-api-souscription-typescript/dist/fr/cfdp/axios/generated/souscription/model/pays';
import { computed, onMounted, ref, watch } from 'vue';
import {
  type DevisEntreprise,
  DevisEntrepriseStatutEnum,
  DevisEntrepriseTypeRisqueEnum
} from 'open-api-souscription-typescript';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import useConstante from '@/composables/useConstante';
import { useI18n } from 'vue-i18n';
import validationRulesSiret from '@/services/validationRulesSiret';
import useFormValidate from '@/composables/useFormValidateHelper';
import type { IBeneficiaire } from '@/models/form_validate/interface/IBeneficiaire';
import useSelectedProduct from '@/composables/useSelectedProduct';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import useAutoAddress from '@/composables/useAutoAddress';
import validationRulesCityCode from '@/services/validationRulesCityCode';

export interface IProps {
  data?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  beneficiareFormValueValidate: IBeneficiaire;
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});

const { product } = useSelectedProduct();
const { isRequired, isDisableHelper } = useFormValidate();
const { checkIfCountryIsFranceChildren } = useAutoAddress();
const { getCountryParent } = validationRulesSiret();
const emit = defineEmits(['checkIfObjectIsSame', 'input']);
const { controlCityCodeByCountry } = validationRulesCityCode();
const { COUNTRYS } = useConstante();

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const onInputValueAddress = (champ, valeur) => {
  switch (champ) {
    case 'adresse1': {
      modelRef.value.beneficiairePersonneMorale.adresse.adresse1 = valeur;
      break;
    }
    case 'adresse2': {
      modelRef.value.beneficiairePersonneMorale.adresse.adresse2 = valeur;
      break;
    }
    case 'adresse3': {
      modelRef.value.beneficiairePersonneMorale.adresse.adresse3 = valeur;
      break;
    }
    case 'codePostal': {
      modelRef.value.beneficiairePersonneMorale.adresse.codePostal = valeur;
      break;
    }
    case 'pays': {
      modelRef.value.beneficiairePersonneMorale.adresse.pays = valeur;
      break;
    }
    case 'ville': {
      modelRef.value.beneficiairePersonneMorale.adresse.ville = valeur;
      break;
    }
    default: {
      //statements;
      break;
    }
  }
};

const modelRef = ref(props.data);
const listOfCountriesRef = ref([]);
const itemsCountryRef = ref<Pays[]>(product.value.pays ? product.value.pays : []);

const companyNameComputed = computed((): string => {
  if (modelRef.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Asl) {
    return i18n.tc('forms.labels.companyNameAsl');
  } else if (modelRef.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Copropriete) {
    return i18n.tc('forms.labels.companyNameCopro');
  } else {
    return i18n.tc('forms.labels.companyName');
  }
});

const isRequiredNumImmat = (): boolean => {
  if (coproTransfoIsSiretOblRef.value) {
    return isRequired(
      champsBeneficiaireCoproLotsHabitationOblRef.value,
      props.takingStatusIntoAccount
    );
  } else {
    return isRequired(
      props.beneficiareFormValueValidate?.numeroImmatriculation,
      props.takingStatusIntoAccount
    );
  }
};

const isFranceChildrenComputed = computed(() => {
  return checkIfCountryIsFranceChildren(listOfCountriesRef).value.includes(
    modelRef.value.beneficiairePersonneMorale.adresse.pays
  );
});

const numeroImmatriculationComputed = computed((): string => {
  return i18n.tc('forms.labels.immatriculationNumber');
});

const coproTransfoIsSiretOblRef = ref(false);
const champsBeneficiaireCoproLotsHabitationOblRef = ref({
  visible: true,
  emis: {
    required: false,
    disable: false
  },
  transformation: {
    required: true,
    disable: false
  }
});

onMounted(async () => {
  if (
    modelRef.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Copropriete &&
    modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis &&
    modelRef.value.presenceLotsHabitations &&
    getCountryParent(
      itemsCountryRef.value,
      modelRef?.value.beneficiairePersonneMorale.adresse.pays
    ) === COUNTRYS.FR
  ) {
    coproTransfoIsSiretOblRef.value = true;
  }

  listOfCountriesRef.value = product.value.pays ? product.value.pays : [];
});

watch(
  () => props.data,
  (newVal) => {
    modelRef.value = newVal;
  }
);
</script>

<style scoped>
.col {
  padding-bottom: 0px;
}
</style>
