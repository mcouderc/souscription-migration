<template>
  <v-row>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.civilite?.visible">
      <SelectGeneric
        v-model="modelRef.souscripteurPersonnePhysique.civilite"
        input-id="civilite"
        :title="civilStatusTitleComputed"
        :items="civiliteRef"
        :max-length="25"
        :is-required="
          isRequired(props.suscriberFormValueValidate.civilite, takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.civilite,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.civilite,
            props.suscriberFormValueValidate.civilite.typage
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4">
      <InputGeneric
        v-if="props.suscriberFormValueValidate.nom?.visible"
        input-class="text-uppercase"
        v-model="modelRef.souscripteurPersonnePhysique.nom"
        input-id="nom"
        :max-length="150"
        value=""
        :title="$tc('forms.labels.name')"
        input-type="text"
        :is-required="
          isRequired(props.suscriberFormValueValidate.nom, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.nom,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.nom,
            props.suscriberFormValueValidate.nom.typage
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.prenom?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.prenom"
        input-id="prenom"
        :max-length="150"
        value=""
        :title="$tc('forms.labels.firstName')"
        input-type="text"
        :is-required="
          isRequired(props.suscriberFormValueValidate.prenom, props.takingStatusIntoAccount)
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.prenom,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.prenom,
            props.suscriberFormValueValidate.prenom.typage
          )
        "
      />
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.dateNaissance?.visible">
      <BaseDatePicker
        v-model="modelRef.souscripteurPersonnePhysique.dateNaissance"
        input-id="dateNaissance"
        :validation-is-required="
          isRequired(props.suscriberFormValueValidate.dateNaissance, props.takingStatusIntoAccount)
        "
        placeholder="JJ-MM-AAAA"
        :max="noMaxDate"
        :title="$t('forms.labels.dateNaissance')"
        :label="$t('forms.labels.dateNaissance')"
        @input="onEventInputAction(modelRef)"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
      ></BaseDatePicker>
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.lieuNaissance?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.lieuNaissance"
        input-id="lieuNaissance"
        value=""
        :max-length="150"
        :title="$tc('forms.labels.lieuNaissance')"
        input-type="text"
        :is-required="
          isRequired(props.suscriberFormValueValidate.lieuNaissance, props.takingStatusIntoAccount)
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.lieuNaissance,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.lieuNaissance,
            props.suscriberFormValueValidate.lieuNaissance.typage
          )
        "
      />
    </v-col>
    <v-col cols="12" v-if="props.suscriberFormValueValidate.adresse1?.visible">
      <template v-if="isFranceChildrenComputed">
        <ComboboxGeneric
          type="address"
          v-model="modelRef.souscripteurPersonnePhysique.adresse.adresse1"
          input-id="adresse1"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="
            isRequired(props.suscriberFormValueValidate.adresse1, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.suscriberFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.souscripteurPersonnePhysique.adresse.adresse1,
              formattageTypageSouscripteur(
                props.suscriberFormValueValidate.adresse1.typage,
                SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
              )
            )
          "
          @setAddress="onInputValueAddress('adresse1', $event)"
          @setZipCode="onInputValueAddress('codePostal', $event)"
          @setCity="onInputValueAddress('ville', $event)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          @input="onEventInputAction(modelRef)"
        />
      </template>
      <template v-else>
        <InputGeneric
          v-model="modelRef.souscripteurPersonnePhysique.adresse.adresse1"
          input-id="adresse1"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="
            isRequired(props.suscriberFormValueValidate.adresse1, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.suscriberFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.souscripteurPersonnePhysique.adresse.adresse1,
              formattageTypageSouscripteur(
                props.suscriberFormValueValidate.adresse1.typage,
                SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
              )
            )
          "
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
          @input="onEventInputAction(modelRef)"
        />
      </template>
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.adresse2?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.adresse.adresse2"
        input-id="adresse2"
        :title="$tc('forms.labels.address2')"
        input-type="text"
        :maxLength="255"
        :is-required="
          isRequired(props.suscriberFormValueValidate.adresse2, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.adresse2,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.adresse.adresse2,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.adresse2.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.adresse3?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.adresse.adresse3"
        input-id="adresse3"
        :title="$tc('forms.labels.address3')"
        input-type="text"
        :maxLength="255"
        :is-required="
          isRequired(props.suscriberFormValueValidate.adresse3, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.adresse3,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.adresse.adresse2,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.adresse3.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.codePostale?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.adresse.codePostal"
        input-id="codePostal"
        :title="$tc('forms.labels.cityCode')"
        :regex="controlCityCodeByCountry(modelRef.souscripteurPersonnePhysique.adresse.pays)"
        input-type="text"
        :is-required="
          isRequired(props.suscriberFormValueValidate.codePostale, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.codePostale,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.adresse.codePostal,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.codePostale.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
        @change="getCitysByCode($event)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.ville?.visible">
      <ComboboxGeneric
        input-class="text-uppercase"
        v-model="modelRef.souscripteurPersonnePhysique.adresse.ville"
        input-id="ville"
        :items="citysRef"
        :title="$tc('forms.labels.city')"
        input-type="text"
        :city-code="true"
        :max-length="150"
        :is-required="
          isRequired(props.suscriberFormValueValidate.ville, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.ville,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.adresse.ville,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.ville.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        @setCity="onInputValueAddress('ville', $event)"
        @setZipCode="onInputValueAddress('codePostal', $event)"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.pays?.visible">
      <SelectCountry
        input-class="text-uppercase"
        v-model="modelRef.souscripteurPersonnePhysique.adresse.pays"
        input-id="pays"
        :title="$tc('forms.labels.countries')"
        :items="itemsCountryRef"
        :is-info-comp="true"
        :isUpperCase="true"
        :items-keys="['countryList', 'nom', 'code']"
        :is-required="
          isRequired(props.suscriberFormValueValidate.pays, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.pays,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.adresse.pays,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.pays.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          ) || itemsCountryRef.length === 1
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.telephone1?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.telephone1"
        input-id="telephone1"
        :title="$t('forms.labels.phone', { number: '1' }).toString()"
        regex="phone"
        input-type="tel"
        :is-required="
          isRequired(props.suscriberFormValueValidate.telephone1, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.telephone1,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.telephone1,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.telephone1.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.telephone2?.visible">
      <!--A mettre ne place niveau back le telephone pour la personne moral-->
      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.telephone2"
        input-id="telephone2"
        :title="$t('forms.labels.phone', { number: '2' }).toString()"
        regex="phone"
        :is-required="
          isRequired(props.suscriberFormValueValidate.telephone2, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.telephone2,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.telephone2,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.telephone2.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        input-type="tel"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.mail?.visible">
      <!--A mettre ne place niveau back le mail pour la personne moral-->

      <InputGeneric
        v-model="modelRef.souscripteurPersonnePhysique.mail"
        input-id="mail"
        input="mail"
        :title="$tc('forms.labels.mail')"
        :regex="REGEX.EMAIL"
        input-type="text"
        :max-length="150"
        :is-required="
          isRequired(props.suscriberFormValueValidate.mail, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisableHelper(
            props.suscriberFormValueValidate.mail,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonnePhysique.mail,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.mail.typage,
              SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import { extend } from 'vee-validate';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import { useI18n } from 'vue-i18n';
import useFormValidate from '@/composables/useFormValidateHelper';
import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur.js';
import useSelectedProduct from '@/composables/useSelectedProduct';
import useConstante from '@/composables/useConstante';
import validationRulesSiret from '@/services/validationRulesSiret';
import { formatISO } from 'date-fns';
import BaseDatePicker from '@/components/common/BaseDatePicker.vue';
import useAutoAddress from '@/composables/useAutoAddress';
import validationRulesCityCode from '@/services/validationRulesCityCode';
import postalCode from '@/services/postalCode';

export interface IProps {
  value?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  suscriberFormValueValidate: ISouscripteur;
}

const props = withDefaults(defineProps<IProps>(), {
  value: () => ({}),
  takingStatusIntoAccount: false
});

const { CIVILITE, REGEX, SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE } = useConstante();
const civiliteRef = ref(CIVILITE);
const civilStatusTitleComputed = computed(() => {
  return i18n.tc('forms.labels.civilStatus');
});
const citysRef = ref<string[]>([]);
const { getCitys } = postalCode();
const { checkIfCountryIsFranceChildren } = useAutoAddress();
const { product } = useSelectedProduct();
const { isRequired, isDisableHelper, formattageTypageSouscripteur } = useFormValidate();
const modelRef = ref(props.value);
const itemsCountryRef = ref([]);
const { controlCityCodeByCountry } = validationRulesCityCode();
const { siretIsValid } = validationRulesSiret();
const emit = defineEmits([
  'checkIfObjectIsSame',
  'checkEligibility',
  'changeTypePersonne',
  'input'
]);
const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

extend('siret', (value) => {
  return siretIsValid(value, modelRef.value.souscripteurPersonnePhysique.adresse.pays);
});

const getCitysByCode = (value: string) => {
  getCitys(value).then((citysResponse: string[]) => {
    citysRef.value = citysResponse;
    modelRef.value.souscripteurPersonnePhysique.adresse.ville = citysResponse[0];
  });
};

const noMaxDate = computed(() => {
  return formatISO(new Date());
});

const isFranceChildrenComputed = computed(() => {
  return checkIfCountryIsFranceChildren(itemsCountryRef).value.includes(
    modelRef.value.souscripteurPersonnePhysique.adresse.pays
  );
});

onMounted(async () => {
  itemsCountryRef.value = product.value.pays ? product.value.pays : [];

  //Assignation de la valeur du pays selectionné à l'adresse de l'utilisateur
  modelRef.value.souscripteurPersonnePhysique.adresse.pays = modelRef.value
    .souscripteurPersonnePhysique?.adresse?.pays
    ? modelRef.value.souscripteurPersonnePhysique.adresse.pays
    : modelRef.value.codePays;
});

const onInputValueAddress = (champ: string, valeur: string) => {
  citysRef.value = [];
  switch (champ) {
    case 'adresse1': {
      modelRef.value.souscripteurPersonnePhysique.adresse.adresse1 = valeur;
      break;
    }
    case 'adresse2': {
      modelRef.value.souscripteurPersonnePhysique.adresse.adresse2 = valeur;
      break;
    }
    case 'adresse3': {
      modelRef.value.souscripteurPersonnePhysique.adresse.adresse3 = valeur;
      break;
    }
    case 'codePostal': {
      modelRef.value.souscripteurPersonnePhysique.adresse.codePostal = valeur;
      break;
    }
    case 'pays': {
      modelRef.value.souscripteurPersonnePhysique.adresse.pays = valeur;
      break;
    }
    case 'ville': {
      modelRef.value.souscripteurPersonnePhysique.adresse.ville = valeur;
      break;
    }
    default: {
      //statements;
      break;
    }
  }
};

watch(
  () => props.value,
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
