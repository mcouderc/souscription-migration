<template>
  <v-row>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.raisonSociale?.visible">
      <InputGeneric
        input-class="text-uppercase"
        v-model="modelRef.souscripteurPersonneMorale.raisonSociale"
        input-id="raisonSociale"
        :title="companyNameComputed"
        input-type="text"
        :max-length="150"
        :is-required="
          isRequired(props.suscriberFormValueValidate.raisonSociale, takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.raisonSociale,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.raisonSociale,
            props.suscriberFormValueValidate.raisonSociale.typage
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>

    <v-col cols="6" v-if="props.suscriberFormValueValidate.identifiantLegal?.visible">
      <InputValidationSiret
        v-model="modelRef.souscripteurPersonneMorale.identifiantLegal"
        :country="modelRef.souscripteurPersonneMorale.adresse.pays"
        id="identifiantLegal"
        :is-disabled="isSiretDisabledRef"
        :is-required="isRequiredSiretInput()"
        @paste="pasteSiretAction(modelRef.souscripteurPersonneMorale.identifiantLegal, $event)"
        @keypress="keyPressCondition($event)"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.pays?.visible">
      <SelectCountry
        input-class="text-uppercase"
        v-model="modelRef.souscripteurPersonneMorale.adresse.pays"
        input-id="pays"
        :title="$tc('forms.labels.countries')"
        :items="itemsCountryRef"
        :isUpperCase="true"
        :items-keys="['countryList', 'nom', 'code']"
        :is-info-comp="true"
        :is-required="
          isRequired(props.suscriberFormValueValidate.pays, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.pays,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.adresse.pays,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.pays.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          ) || itemsCountryRef.length === 1
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @selectedItem="getStatutCompagnies($event)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.formeJuridique?.visible">
      <SelectGeneric
        v-model="modelRef.souscripteurPersonneMorale.formeJuridique"
        input-id="formeJuridique"
        :title="$tc('forms.labels.legalForm')"
        :items="listStatutCompagniesRef"
        :items-keys="['listStatutList', 'description', 'code']"
        :is-required="
          isRequired(props.suscriberFormValueValidate.formeJuridique, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.formeJuridique,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.formeJuridique,
            props.suscriberFormValueValidate.formeJuridique.typage
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @selectedItem="setRepresentativeQualtityList()"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="12" v-if="props.suscriberFormValueValidate.adresse1?.visible">
      <template v-if="isFranceChildrenComputed">
        <ComboboxGeneric
          type="address"
          v-model="modelRef.souscripteurPersonneMorale.adresse.adresse1"
          input-id="autoCompletion-addresse"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="
            isRequired(props.suscriberFormValueValidate.adresse1, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisabled(
              props.suscriberFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.souscripteurPersonneMorale.adresse.adresse1,
              formattageTypageSouscripteur(
                props.suscriberFormValueValidate.adresse1.typage,
                SOUSCRITPEUR_BASE_TYPAGE_MORALE
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
          v-model="modelRef.souscripteurPersonneMorale.adresse.adresse1"
          input-id="adresse1"
          :title="$tc('forms.labels.address')"
          input-type="text"
          :maxLength="255"
          :is-required="
            isRequired(props.suscriberFormValueValidate.adresse1, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisabled(
              props.suscriberFormValueValidate.adresse1,
              takingStatusIntoAccount,
              modelRef.souscripteurPersonneMorale.adresse.adresse1,
              formattageTypageSouscripteur(
                props.suscriberFormValueValidate.adresse1.typage,
                SOUSCRITPEUR_BASE_TYPAGE_MORALE
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
        v-model="modelRef.souscripteurPersonneMorale.adresse.adresse2"
        input-id="adresse2"
        :title="$tc('forms.labels.address2')"
        input-type="text"
        :maxLength="255"
        :is-required="
          isRequired(props.suscriberFormValueValidate.adresse2, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.adresse2,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.adresse.adresse2,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.adresse2.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="6" v-if="props.suscriberFormValueValidate.adresse3?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonneMorale.adresse.adresse3"
        input-id="adresse3"
        :title="$tc('forms.labels.address3')"
        input-type="text"
        :maxLength="255"
        :is-required="
          isRequired(props.suscriberFormValueValidate.adresse3, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.adresse3,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.adresse.adresse3,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.adresse3.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.codePostale?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonneMorale.adresse.codePostal"
        input-id="codePostal"
        :title="$tc('forms.labels.cityCode')"
        :regex="controlCityCodeByCountry(modelRef.souscripteurPersonneMorale.adresse.pays)"
        input-type="text"
        :is-required="
          isRequired(props.suscriberFormValueValidate.codePostale, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.codePostale,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.adresse.codePostal,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.codePostale.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
        @change="getCitysByCode($event)"
      />
    </v-col>
    <v-col cols="8" v-if="props.suscriberFormValueValidate.ville?.visible">
      <ComboboxGeneric
        v-model="modelRef.souscripteurPersonneMorale.adresse.ville"
        input-id="autoCompletion-ville"
        :title="$tc('forms.labels.city')"
        input-type="text"
        :items="citysRef"
        :city-code="true"
        :maxLength="150"
        :is-required="
          isRequired(props.suscriberFormValueValidate.ville, props.takingStatusIntoAccount)
        "
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.ville,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.adresse.ville,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.ville.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
        @setCity="onInputValueAddress('ville', $event)"
        @setZipCode="onInputValueAddress('codePostal', $event)"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        @input="onEventInputAction(modelRef)"
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.telephone1?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonneMorale.telephone1"
        input-id="telephone1"
        :title="$t('forms.labels.phone', { number: '1' }).toString()"
        regex="phone"
        input-type="tel"
        :is-required="
          isRequired(props.suscriberFormValueValidate.telephone1, props.takingStatusIntoAccount)
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.telephone1,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.telephone1,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.telephone1.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.telephone2?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonneMorale.telephone2"
        input-id="telephone2"
        :title="$t('forms.labels.phone', { number: '2' }).toString()"
        regex="phone"
        :is-required="
          isRequired(props.suscriberFormValueValidate.telephone2, props.takingStatusIntoAccount)
        "
        input-type="tel"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.telephone2,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.telephone2,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.telephone2.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
      />
    </v-col>
    <v-col cols="4" v-if="props.suscriberFormValueValidate.mail?.visible">
      <InputGeneric
        v-model="modelRef.souscripteurPersonneMorale.mail"
        input-id="mail"
        input="mail"
        :title="$tc('forms.labels.mail')"
        :regex="REGEX.EMAIL"
        input-type="text"
        :max-length="150"
        :is-required="
          isRequired(props.suscriberFormValueValidate.mail, props.takingStatusIntoAccount)
        "
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        :is-disabled="
          isDisabled(
            props.suscriberFormValueValidate.mail,
            takingStatusIntoAccount,
            modelRef.souscripteurPersonneMorale.mail,
            formattageTypageSouscripteur(
              props.suscriberFormValueValidate.mail.typage,
              SOUSCRITPEUR_BASE_TYPAGE_MORALE
            )
          )
        "
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import {
  type DevisEntreprise,
  DevisEntrepriseStatutEnum,
  DevisEntrepriseTypeRisqueEnum,
  DevisEntrepriseTypeGestionCoproEnum,
  DevisEntrepriseTypeGestionAslEnum,
  type FormeJuridique
} from 'open-api-souscription-typescript';
import { extend } from 'vee-validate';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import InputValidationSiret from '@/components/common/form/InputValidationSiret.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import { useI18n } from 'vue-i18n';
import useFormValidate from '@/composables/useFormValidateHelper';
import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur.js';
import { formeJuridiqueApi } from '@/plugins/open-api';
import useSnackBar from '@/composables/useSnackBar';
import useSelectedProduct from '@/composables/useSelectedProduct';
import useConstante from '@/composables/useConstante';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import validationRulesSiret from '@/services/validationRulesSiret';
import useFormeJuridiqueStore from '@/composables/useFormeJuridiqueStore';
import useDevis from '@/composables/useDevis';
import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';
import useAutoAddress from '@/composables/useAutoAddress';
import postalCode from '@/services/postalCode';
import validationRulesCityCode from '@/services/validationRulesCityCode';
import useQualities from '@/composables/useQualities';

export interface IProps {
  value?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  suscriberFormValueValidate: ISouscripteur;
  comparDisabledCopro?: Array<string | number>;
}

const props = withDefaults(defineProps<IProps>(), {
  value: () => ({}),
  takingStatusIntoAccount: false
});
const { getCitys } = postalCode();
const { product } = useSelectedProduct();
const { devis } = useDevis();
const { setLoaderGlobal } = useLoader();
const modelRef = ref(props.value);
const isSiretDisabledRef = ref(false);
const listStatutCompagniesResultRef = ref([]);
const listStatutCompagniesRef = ref([]);
const defaultListQualiteRepresentant = ref<string[]>([]);
const itemsCountryRef = ref([]);
const countryParentRef = ref(null);
const isCoproToContratSiretRequiredRef = ref(false);
const isAslToContratSiretRequiredRef = ref(false);
const citysRef = ref<string[]>([]);
//On définit localement un formValidateCopro pour une condition spécifique :
//Si typeDeGestion = professionel le siret devient obligatoire en transfo to contrat
const champsSouscripteurCoproProOblRef = ref({
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

//On définit localement un formValidateASL pour une condition spécifique :
//Si typeDeGestion = syndica professionnel le siret devient obligatoire en transfo to contrat
const champsSouscripteurAslProOblRef = ref({
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

const { checkIfCountryIsFranceChildren } = useAutoAddress();
const { siretIsValid, keyPressCondition, pastCondition } = validationRulesSiret();
const { controlCityCodeByCountry } = validationRulesCityCode();
const { addMessageErrorSnackBarAction } = useSnackBar();
const { REGEX, SOUSCRITPEUR_BASE_TYPAGE_MORALE } = useConstante();
const { isRequired, isDisableHelper, formattageTypageSouscripteur } = useFormValidate();
const { setQualities } = useQualities();

const {
  isLoading: isLoadingFormesJuridiques,
  isError: isErrorFormesJuridiques,
  data: listFormesJuridiques,
  doFetch: doFetchFormesJuridiques
} = useApiCall<FormeJuridique[]>({
  route: formeJuridiqueApi().listFormesJuridiques
});

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
  const country = countryParentRef.value
    ? countryParentRef.value
    : modelRef.value.souscripteurPersonneMorale.adresse.pays;
  return siretIsValid(value, country);
});

const getCitysByCode = (value: string) => {
  getCitys(value).then((citysResponse: string[]) => {
    citysRef.value = citysResponse;
    modelRef.value.souscripteurPersonneMorale.adresse.ville = citysResponse[0];
  });
};

const isDisabled = (
  champsSelected: IChampValidate,
  takingStatusIntoAccount: boolean,
  valeurChampATester: any,
  typage?: string
): boolean => {
  //Si je suis dans un parcours copro ET avec un numCeryx ET une valeur dans le champs, alors ledit champs doit être disable (return true)
  if (isCoproCeryxHydratation(valeurChampATester)) {
    return true;
  }
  return isDisableHelper(champsSelected, takingStatusIntoAccount, valeurChampATester, typage);
};

const isCoproCeryxHydratation = (valeurChampATester: any) => {
  return (
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Copropriete &&
    devis.value.numClientCeryx &&
    props.comparDisabledCopro.includes(valeurChampATester)
  );
};

const pasteSiretAction = (siret: string, event: ClipboardEvent) => {
  modelRef.value.souscripteurPersonneMorale.identifiantLegal = pastCondition(siret, event);
};

const isFranceChildrenComputed = computed(() => {
  return checkIfCountryIsFranceChildren(itemsCountryRef).value.includes(
    modelRef.value.souscripteurPersonneMorale.adresse.pays
  );
});

const isRequiredSiretInput = (): boolean => {
  if (isCoproToContratSiretRequiredRef.value) {
    return isRequired(champsSouscripteurCoproProOblRef.value, props.takingStatusIntoAccount);
  } else if (isAslToContratSiretRequiredRef.value) {
    return isRequired(champsSouscripteurAslProOblRef.value, props.takingStatusIntoAccount);
  } else {
    return isRequired(
      props.suscriberFormValueValidate?.identifiantLegal,
      props.takingStatusIntoAccount
    );
  }
};

onMounted(async () => {
  modelRef.value.souscripteurPersonneMorale.adresse.pays = modelRef.value.souscripteurPersonneMorale
    ?.adresse?.pays
    ? modelRef.value.souscripteurPersonneMorale.adresse.pays
    : modelRef.value.codePays;

  itemsCountryRef.value = product.value.pays ? product.value.pays : [];
  if (itemsCountryRef.value) {
    getStatutCompagnies(modelRef.value.souscripteurPersonneMorale.adresse.pays);
  }

  isSiretDisabledInit();
  isCoproSiretRequired();
  isAslSiretRequired();
});

const isSiretDisabledInit = () => {
  if (
    ((modelRef?.value.statut === DevisEntrepriseStatutEnum.BrouillonEnCours ||
      modelRef?.value.statut === DevisEntrepriseStatutEnum.BrouillonAValider ||
      modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis) &&
      modelRef?.value.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise &&
      modelRef?.value.souscripteurPersonneMorale.identifiantLegal &&
      modelRef?.value.souscripteurPersonneMorale.identifiantLegal !== '') ||
    isCoproCeryxHydratation(modelRef?.value.souscripteurPersonneMorale.identifiantLegal)
  ) {
    isSiretDisabledRef.value = true;
  } else {
    isSiretDisabledRef.value = isDisabled(
      props.suscriberFormValueValidate.identifiantLegal,
      props.takingStatusIntoAccount,
      modelRef.value.souscripteurPersonneMorale.identifiantLegal,
      props.suscriberFormValueValidate.identifiantLegal.typage
    );
  }
};

const isCoproSiretRequired = () => {
  //si on est dans le parcours copro et que typeGestion = professionnel
  if (
    modelRef.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Copropriete &&
    modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis &&
    modelRef.value.typeGestionCopro === DevisEntrepriseTypeGestionCoproEnum.Professionnel
  ) {
    isCoproToContratSiretRequiredRef.value = true;
  }
};

const isAslSiretRequired = () => {
  //si on est dans le parcours ASL et que typeGestion = syndic professionnel
  if (
    modelRef.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Asl &&
    modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis &&
    modelRef.value.typeGestionAsl === DevisEntrepriseTypeGestionAslEnum.SyndicProfessionnel
  ) {
    isAslToContratSiretRequiredRef.value = true;
  }
};

const onInputValueAddress = (champ: string, valeur: string) => {
  citysRef.value = [];
  switch (champ) {
    case 'adresse1': {
      modelRef.value.souscripteurPersonneMorale.adresse.adresse1 = valeur;

      break;
    }
    case 'adresse2': {
      modelRef.value.souscripteurPersonneMorale.adresse.adresse2 = valeur;
      break;
    }
    case 'adresse3': {
      modelRef.value.souscripteurPersonneMorale.adresse.adresse3 = valeur;
      break;
    }
    case 'codePostal': {
      modelRef.value.souscripteurPersonneMorale.adresse.codePostal = valeur;
      break;
    }
    case 'pays': {
      modelRef.value.souscripteurPersonneMorale.adresse.pays = valeur;
      break;
    }
    case 'ville': {
      modelRef.value.souscripteurPersonneMorale.adresse.ville = valeur;

      break;
    }
    default: {
      //statements;
      break;
    }
  }
};

const getStatutCompagnies = (event?: any) => {
  const selectedItem = itemsCountryRef.value.find(
    (item) => item.code === event || item.code === event.value
  );
  countryParentRef.value = selectedItem?.parent?.code ? selectedItem.parent.code : null;
  getFormeJuridique(
    countryParentRef.value
      ? countryParentRef.value
      : modelRef.value.souscripteurPersonneMorale.adresse.pays
  );
};

const { setFormeJuridiqueAction } = useFormeJuridiqueStore();

const setDefaultListQualiteRepresentant = (data: FormeJuridique[]) => {
  data?.forEach((item: FormeJuridique) => {
    item.qualiteRepresentant.forEach((qualite: string) => {
      if (!defaultListQualiteRepresentant.value.includes(qualite)) {
        defaultListQualiteRepresentant.value.push(qualite);
      }
    });
  });
};

const getFormeJuridique = async (pays: string) => {
  const DESC_REF_OTHER = 'AUTRE';
  if (pays && modelRef.value.typeRisque) {
    await doFetchFormesJuridiques(pays, modelRef.value.typeRisque.toLowerCase());
    if (isErrorFormesJuridiques.value) {
      addMessageErrorSnackBarAction(i18n.tc('devis.formesJuridiques.error'));
    }
    if (listFormesJuridiques.value) {
      setDefaultListQualiteRepresentant(listFormesJuridiques.value);
      listStatutCompagniesResultRef.value = listFormesJuridiques.value;
      listStatutCompagniesRef.value = [];
      listStatutCompagniesResultRef.value.map((item) => {
        listStatutCompagniesRef.value.push({
          code: item.code,
          description:
            item.code === DESC_REF_OTHER ? item.code : `${item.code}${' - '}${item.libelle}`
        });
      });
      setFormeJuridiqueAction(listStatutCompagniesResultRef.value);
      listStatutCompagniesRef.value.sort();
    }
  }
};

const setRepresentativeQualtityList = () => {
  setQualities(defaultListQualiteRepresentant.value);
};

const companyNameComputed = computed(() => {
  return devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Asl
    ? i18n.tc('page.additionalInformation.aslNomSyndic')
    : i18n.tc('forms.labels.companyName');
});

watch(
  () => props.value,
  (newVal) => {
    modelRef.value = newVal;
  }
);

watch(
  () => props.comparDisabledCopro,
  () => {
    if (isCoproCeryxHydratation(modelRef.value.souscripteurPersonneMorale.identifiantLegal)) {
      isSiretDisabledInit();
    }
  }
);

watch(
  () => listStatutCompagniesResultRef.value,
  (statutCompagnie) => {
    if (statutCompagnie) {
      setRepresentativeQualtityList();
    }
  }
);

watch(
  () => isLoadingFormesJuridiques.value,
  (isLoadingFormesJuridiques) => {
    setLoaderGlobal({ isLoading: isLoadingFormesJuridiques });
  }
);
</script>
<style scoped>
.col {
  padding-bottom: 0px;
}
</style>
