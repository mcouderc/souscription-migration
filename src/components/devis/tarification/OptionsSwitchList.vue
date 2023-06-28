<template>
  <v-container class="border-2 border-grey rounded bg-white relative px-0">
    <v-list>
      <v-list-item-title class="title">{{
        $tc('page.tarification.optionsSubTitle')
      }}</v-list-item-title>
      <v-list-item v-for="option in props.optionsWithoutFormula" :key="option.formule.id">
        <v-list-item-content dense class="interligne">
          <v-switch
            :label="option.formule.nom"
            :disabled="isLoadingRecalculTarifProduit"
            v-model="selectedOptionsRef"
            :value="option"
            :ripple="false"
            class="switch"
            @change="calculateOptions()"
            hide-details
          ></v-switch>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type IFormulaValorisee from '@/models/interfaceEligibility/IFormulaValorisee';
import type {
  IdOptions,
  RecalculData,
  ValorisationCritere
} from 'open-api-souscription-typescript';
import { produitCalculResultApi } from '@/plugins/open-api';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useDevis from '@/composables/useDevis';
import { useI18n } from 'vue-i18n';
import useSnackBar from '@/composables/useSnackBar';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';

export interface IProps {
  produitCalculResult: IFormulaValorisee[];
  garantiesConditionnees: IFormulaValorisee[];
  dataFormulesFormatees: IGarantieContenueOuIntituleGarantieHeader[];
  dataForm: ValorisationCritere[];
  formuleValoSansOption: IFormulaValorisee[];
  optionsWithoutFormula: IFormulaValorisee[];
}

const props = withDefaults(defineProps<IProps>(), {
  produitCalculResult: () => [],
  garantiesConditionnees: () => [],
  dataFormulesFormatees: () => [],
  dataForm: () => [],
  formuleValoSansOption: () => []
});

const selectedOptionsRef = ref<IFormulaValorisee[]>([]);

const recalculFinalRef = ref<RecalculData>({ formules: [], donneesTarification: {} }); // {formules: [{id(uniqueFormule): int, idOptions:stirng[] }] }
const formulesRecalculRef = ref<IdOptions[]>([]);
const idOptionsRef = ref<IdOptions>({});
const dataFormRef = ref<ValorisationCritere[]>(props.dataForm);
const resultPriceWithOptionsSelectedRef = ref(null);

const { devis } = useDevis();
const { addMessageErrorSnackBarAction } = useSnackBar();
const emit = defineEmits([
  'optionsSelected',
  'dataFormulesFormateesAvecOptions',
  'formuleSansOption'
]);

const {
  isLoading: isLoadingRecalculTarifProduit,
  isError: isErrorRecalculTarifProduit,
  data: tarifProduit,
  doFetch: doFetchRecalculTarifProduit
} = useApiCall<any>({
  route: produitCalculResultApi().recalculeTarificationProduit
});

const calculateOptions = async () => {
  emit('optionsSelected', { selectedOptionsRef });
  recalculateProductPricing();
};

const recalculateProductPricing = async () => {
  //construction de l'objet formules pour chaque formule
  props.formuleValoSansOption.forEach((formuleValo: IFormulaValorisee) => {
    idOptionsRef.value = { id: null, idOptions: [] } as IdOptions; //type idOptions {id: int, idOptions: idOptionsSelectedAndApplicablesAvecGarantieCondRef}
    formulesRecalculRef.value = [];

    idOptionsRef.value.id = formuleValo.formule.id;

    //on va comparer avec chaque garanties conditionnees s'il y en a
    if (props.garantiesConditionnees.length) {
      props.garantiesConditionnees.forEach((garantieCond) => {
        isIncludedInFormala(garantieCond, formuleValo.formule.code);
      });
    }
    //puis avec les options sélectionnées (que l'on s'assure est applicable)
    if (selectedOptionsRef.value.length) {
      selectedOptionsRef.value.forEach((optionSelectedValo) => {
        isIncludedInFormala(optionSelectedValo, formuleValo.formule.code);
      });
    }
    recalculFinalRef.value.formules.push(idOptionsRef.value) as RecalculData;
  });

  //pour l'objet donneesTarification besoin que du pays et des valeurByCritere
  recalculFinalRef.value.donneesTarification = {
    codePays: devis.value.codePays,
    valeurByCritere: dataFormRef.value
  };

  await doFetchRecalculTarifProduit(
    devis.value.formuleSouscrite.idProduit.toString(),
    recalculFinalRef.value
  );
  if (isErrorRecalculTarifProduit.value) {
    addMessageErrorSnackBarAction(i18n.tc('page.tarification.errorRecalcul'));
  }
  if (tarifProduit.value) {
    resultPriceWithOptionsSelectedRef.value = tarifProduit.value;
    modifierPrixFormules(resultPriceWithOptionsSelectedRef.value);
  }
  recalculFinalRef.value = { formules: [], donneesTarification: {} } as RecalculData;
};

const isIncludedInFormala = (
  formuleToTest: IFormulaValorisee,
  formuleValoriseeCode: string
): void => {
  if (formuleToTest.formule.formulesApplication.includes(formuleValoriseeCode)) {
    idOptionsRef.value.idOptions.push(formuleToTest.formule.id.toString());
  }
};

const modifierPrixFormules = (newVal: IGarantieContenueOuIntituleGarantieHeader[]): void => {
  props.dataFormulesFormatees.forEach((formule) => {
    const option = newVal.find(
      (el: IGarantieContenueOuIntituleGarantieHeader) => el.id === formule.id
    );
    formule.price = '';
    formule.price = option.primeTtc;
  });
  emit('dataFormulesFormateesAvecOptions', props.dataFormulesFormatees);
};
</script>
<style scoped>
.interligne {
  margin-bottom: 0px;
  margin-top: -20px;
}
.title {
  padding-left: 20px;
}
.switch {
  padding-left: 3px;
}
</style>
