<template>
  <v-col>
    <v-row>
      <v-col cols="6" v-if="props.antecedantFormValueValidate.nombreProcedures?.visible">
        <InputGeneric
          v-model="modelRef['nombreProcedures']"
          value=""
          input-id="nombreProcedures"
          :title="LegalProceedingTitleComputed"
          :regex="REGEX.NUMBER"
          input-type="number"
          :is-required="
            isRequired(
              props.antecedantFormValueValidate.nombreProcedures,
              props.takingStatusIntoAccount
            )
          "
          :is-disabled="
            isAntecedentRequired(
              props.antecedantFormValueValidate.nombreProcedures,
              takingStatusIntoAccount,
              modelRef.nombreProcedures,
              props.antecedantFormValueValidate.nombreProcedures.typage
            )
          "
          @input="input()"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
        />
      </v-col>
      <v-col cols="6"></v-col>

      <v-col
        v-if="
          isShowNombreProceduresEnDefense(
            props.antecedantFormValueValidate.nombreProceduresEnDefense?.visible
          )
        "
        cols="6"
      >
        <InputGeneric
          v-model="modelRef['nombreProceduresEnDefense']"
          value=""
          input-id="nombreProceduresEnDefense"
          :title="$tc('forms.labels.numberOfProceeding')"
          :regex="REGEX.NUMBER"
          :checkRule="true"
          input-type="number"
          :is-required="
            isRequired(
              props.antecedantFormValueValidate.nombreProceduresEnDefense,
              props.takingStatusIntoAccount
            )
          "
          :is-disabled="
            isAntecedentRequired(
              props.antecedantFormValueValidate.nombreProceduresEnDefense,
              takingStatusIntoAccount,
              modelRef.nombreProceduresEnDefense,
              props.antecedantFormValueValidate.nombreProceduresEnDefense.typage
            )
          "
          @input="input()"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
        />
      </v-col>

      <v-col
        v-if="
          isShowNombreProceduresEndDemande(
            props.antecedantFormValueValidate.nombreProceduresEnDemande?.visible
          )
        "
        cols="6"
      >
        <InputGeneric
          v-model="modelRef['nombreProceduresEnDemande']"
          value=""
          input-id="nombreProceduresEnDemande"
          :title="$tc('forms.labels.numberOfProceedingInDemande')"
          :regex="REGEX.NUMBER"
          input-type="number"
          :checkRule="true"
          :is-required="
            isRequired(
              props.antecedantFormValueValidate.nombreProceduresEnDemande,
              props.takingStatusIntoAccount
            )
          "
          :is-disabled="
            isAntecedentRequired(
              props.antecedantFormValueValidate.nombreProceduresEnDemande,
              takingStatusIntoAccount,
              modelRef.nombreProceduresEnDemande,
              props.antecedantFormValueValidate.nombreProceduresEnDemande.typage
            )
          "
          @input="input()"
          @checkIfObjectIsSame="checkIfObjectIsSame()"
        />
      </v-col>

      <v-col
        cols="12"
        v-if="props.antecedantFormValueValidate.assuranceDejaSouscrite?.visible"
        class="interligne-radio-bouton"
      >
        <RadioButtonGeneric
          v-model="modelRef['assuranceDejaSouscrite']"
          radio-button-id="assuranceDejaSouscrite"
          :title="$tc('forms.labels.egalExpensesInsurance')"
          :label-button1="$tc('forms.labels.yes')"
          :label-button2="$tc('forms.labels.no')"
          :is-disabled="
            isAntecedentRequired(
              props.antecedantFormValueValidate.assuranceDejaSouscrite,
              takingStatusIntoAccount,
              modelRef.assuranceDejaSouscrite,
              props.antecedantFormValueValidate.assuranceDejaSouscrite.typage
            )
          "
          :is-required="
            isRequired(
              props.antecedantFormValueValidate.assuranceDejaSouscrite,
              props.takingStatusIntoAccount
            )
          "
          @change="input(), blur()"
        />
      </v-col>
      <v-col
        v-if="
          isShowResiliationAssureur(props.antecedantFormValueValidate.resiliationAssureur?.visible)
        "
        cols="12"
        class="interligne-radio-bouton"
      >
        <RadioButtonGeneric
          v-model="modelRef['resiliationAssureur']"
          radio-button-id="resiliationAssureur"
          :title="$tc('forms.labels.terminatedLegalExpenses')"
          :label-button1="$tc('forms.labels.yes')"
          :label-button2="$tc('forms.labels.no')"
          :is-disabled="
            isAntecedentRequired(
              props.antecedantFormValueValidate.resiliationAssureur,
              takingStatusIntoAccount,
              modelRef.resiliationAssureur,
              props.antecedantFormValueValidate.resiliationAssureur.typage
            )
          "
          :is-required="
            isRequired(
              props.antecedantFormValueValidate.resiliationAssureur,
              props.takingStatusIntoAccount
            )
          "
          @change="input(), blur()"
        />
      </v-col>
      <v-col
        cols="12"
        v-if="props.antecedantFormValueValidate.redressementJudiciaire?.visible"
        class="interligne-radio-bouton"
      >
        <RadioButtonGeneric
          v-model="modelRef['redressementJudiciaire']"
          radio-button-id="redressementJudiciaire"
          :title="$tc('forms.labels.judicialReorganisation')"
          :label-button1="$tc('forms.labels.yes')"
          :label-button2="$tc('forms.labels.no')"
          :is-disabled="
            isAntecedentRequired(
              props.antecedantFormValueValidate.redressementJudiciaire,
              takingStatusIntoAccount,
              modelRef.redressementJudiciaire,
              props.antecedantFormValueValidate.redressementJudiciaire.typage
            )
          "
          :is-required="
            isRequired(
              props.antecedantFormValueValidate.redressementJudiciaire,
              props.takingStatusIntoAccount
            )
          "
          @change="input(), blur()"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import RadioButtonGeneric from '@/components/common/form/RadioButtonGeneric.vue';
import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useFormValidate from '@/composables/useFormValidateHelper';
import type { IAntecedant } from '@/models/form_validate/interface/IAntecedant';
import useConstante from '@/composables/useConstante';
import { DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';
import { VRow, VCol } from 'vuetify/components';
import eventBus from '@/plugins/eventBus';

export interface IProps {
  data?: any;
  isUpdate?: boolean;
  takingStatusIntoAccount?: boolean;
  antecedantFormValueValidate: IAntecedant;
}

const props = withDefaults(defineProps<IProps>(), {
  data: {} as DevisEntreprise,
  takingStatusIntoAccount: false
});
const { isRequired, isDisableHelper } = useFormValidate();
const { REGEX } = useConstante();
const modelRef = ref<DevisEntreprise>(props.data);
const { t } = useI18n();
watch(
  () => props.data,
  (newVal) => {
    modelRef.value = newVal;
  }
);

onMounted(() => {
  isAdditionValid();
});

const LegalProceedingTitleComputed = computed(() => {
  return t('forms.labels.howManyLegalProceeding');
});

const emit = defineEmits(['input', 'checkIfObjectIsSame', 'blur']);

const input = () => {
  isAdditionValid();
  emit('input', modelRef);
};

const blur = () => {
  emit('blur', true);
};

const checkIfObjectIsSame = () => {
  emit('checkIfObjectIsSame', true);
};

const isShowNombreProceduresEnDefense = (champFormulaireIsVisible: boolean): boolean => {
  //Remise a zero du champs nombreProceduresEnDefense
  isAdditionValid();
  if (modelRef.value.nombreProcedures < 5) {
    modelRef.value.nombreProceduresEnDefense = null;
  } else if (!modelRef.value.nombreProceduresEnDefense) {
    modelRef.value.nombreProceduresEnDefense = 0;
  }
  return champFormulaireIsVisible && modelRef.value.nombreProcedures >= 5;
};

const isShowNombreProceduresEndDemande = (champFormulaireIsVisible: boolean): boolean => {
  //Remise a zero du champs nombreProceduresEnDemande
  isAdditionValid();
  if (modelRef.value.nombreProcedures < 5) {
    modelRef.value.nombreProceduresEnDemande = null;
  } else if (!modelRef.value.nombreProceduresEnDemande) {
    modelRef.value.nombreProceduresEnDemande = 0;
  }
  return champFormulaireIsVisible && modelRef.value.nombreProcedures >= 5;
};

const isAdditionValid = () => {
  if (modelRef.value.nombreProcedures >= 5) {
    eventBus.emit('validNbProcedures', {
      isNotValid:
        modelRef.value.nombreProcedures !==
        modelRef.value.nombreProceduresEnDemande + modelRef.value.nombreProceduresEnDefense,
      message: t('forms.errors.coherenceNbProcedure')
    });
  }
};

const isShowResiliationAssureur = (champFormulaireIsVisible: boolean): boolean => {
  //Remise a false du champs resiliationAssureur
  if (!modelRef.value.assuranceDejaSouscrite) {
    modelRef.value.resiliationAssureur = null;
  }
  return champFormulaireIsVisible && modelRef.value.assuranceDejaSouscrite;
};

const isAntecedentRequired = (
  champsSelected: IChampValidate,
  takingStatusIntoAccount: boolean,
  valeurChampATester: any,
  typage?: string
): boolean => {
  if (
    !takingStatusIntoAccount &&
    props.isUpdate &&
    props.data.statut === DevisEntrepriseStatutEnum.Emis
  ) {
    return true;
  }
  return isDisableHelper(champsSelected, takingStatusIntoAccount, valeurChampATester, typage);
};
</script>

<style scoped>
.interligne-radio-bouton {
  padding-top: 0px;
}
.col {
  padding-bottom: 0px;
}
</style>
