<template>
  <v-col class="mb-6">
    <v-row>
      <v-col cols="6">
        <SelectGeneric
          v-model="modelRef.souscripteurPersonneMorale.codeNaf"
          input-id="codeNaf"
          :title="nafCodeActivtyTitleComputed"
          :items="codeNafs"
          :items-keys="['codeNafList', 'description', 'code']"
          :is-required="true"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.codeNaf,
              takingStatusIntoAccount,
              modelRef.souscripteurPersonneMorale.codeNaf,
              props.descriptionRiskFormValueValidate.codeNaf.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6">
        <InputGeneric
          v-model="modelRef.souscripteurPersonneMorale.activite"
          value=""
          input-id="activite"
          :title="$tc('page.additionalInformation.activity')"
          input-type="text"
          :is-required="true"
          :max-length="150"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.activitePrincipal,
              takingStatusIntoAccount,
              modelRef.souscripteurPersonneMorale.activite,
              props.descriptionRiskFormValueValidate.activitePrincipal.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6">
        <BaseDatePicker
          v-model="modelRef.souscripteurPersonneMorale.dateCreation"
          input-id="dateCreation"
          placeholder="JJ-MM-AAAA"
          :max="noMaxDate"
          :title="$t('page.additionalInformation.dateCreation')"
          :label="$t('page.additionalInformation.dateCreation')"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        ></BaseDatePicker>
      </v-col>
      <v-col cols="6">
        <InputGeneric
          v-model="modelRef.nombreSalaries"
          value=""
          input-id="nombreSalaries"
          :title="$tc('page.additionalInformation.numberEmployee')"
          input-type="number"
          :is-required="true"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.nombreSalaries,
              takingStatusIntoAccount,
              modelRef.nombreSalaries,
              props.descriptionRiskFormValueValidate.nombreSalaries.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6">
        <InputGeneric
          v-model="chifAffaireWithSpaceRef"
          value=""
          input-id="montantCaHtTotal"
          :title="$tc('page.additionalInformation.totalCA')"
          input-type="text"
          :is-required="true"
          :suffix="true"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.montantCaHtTotal,
              takingStatusIntoAccount,
              modelRef.montantCaHtTotal,
              props.descriptionRiskFormValueValidate.montantCaHtTotal.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6">
        <InputGeneric
          v-model="modelRef.exerciceDeReference"
          value=""
          input-id="exerciceDeReference"
          :title="$tc('page.additionalInformation.exercise')"
          :regex="REGEX.NUMBER"
          input-type="number"
          :is-required="false"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.exerciceDeReference,
              takingStatusIntoAccount,
              modelRef.exerciceDeReference,
              props.descriptionRiskFormValueValidate.exerciceDeReference.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6">
        <InputGeneric
          v-model="modelRef.nombreVehicules"
          value=""
          input-id="nombreVehicules"
          :title="$tc('page.additionalInformation.numberVehicles')"
          :regex="REGEX.NUMBER"
          input-type="number"
          :is-required="true"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.nombreVehicules,
              takingStatusIntoAccount,
              modelRef.nombreVehicules,
              props.descriptionRiskFormValueValidate.nombreVehicules.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6">
        <InputGeneric
          v-model="modelRef.nombreEtablissementsSecondaires"
          value=""
          input-id="nombreEtablissementsSecondaires"
          :title="$tc('page.additionalInformation.numberInstitutions')"
          input-type="number"
          :is-required="true"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.nombreEtablissementsSecondaires,
              takingStatusIntoAccount,
              modelRef.nombreEtablissementsSecondaires,
              props.descriptionRiskFormValueValidate.nombreEtablissementsSecondaires.typage
            )
          "
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="12" class="interligne-radio-bouton">
        <RadioButtonGeneric
          v-model="modelRef.locauxSciAvecPartsSouscripteur"
          radio-button-id="locauxSciAvecPartsSouscripteur"
          :title="$tc('forms.labels.locauxSciAvecPartsSouscripteur')"
          :label-button1="$tc('forms.labels.yes')"
          :label-button2="$tc('forms.labels.no')"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.locauxSciAvecPartsSouscripteur,
              takingStatusIntoAccount,
              modelRef.locauxSciAvecPartsSouscripteur,
              props.descriptionRiskFormValueValidate.locauxSciAvecPartsSouscripteur.typage
            )
          "
          :is-required="
            isRequired(
              props.descriptionRiskFormValueValidate.locauxSciAvecPartsSouscripteur,
              props.takingStatusIntoAccount
            )
          "
          @change="onEventInputAction(modelRef)"
        />
      </v-col>
      <v-col cols="12" v-if="isSci()">
        <p class="mb-5 grey-darken-1&#45;&#45;text" v-if="isSciTextVisible()">
          {{
            inputRequireComputed
              ? $t('page.additionalInformation.textSciIsToContrat')
              : $t('page.additionalInformation.textSci')
          }}
        </p>
        <TableWithDialogDevis
          :header="header"
          :items-list="modelRef.scis"
          :is-to-contrat="inputRequireComputed"
          :item-to-edit="modelScisRef"
          :taking-status-into-account="props.takingStatusIntoAccount"
          :statut="devis.statut"
          :collection="COLLECTION.SCI"
          :add-button-text="$t('forms.buttons.addSci')"
          @itemsListUpdated="scisUpdated"
          @resetEditedItem="scisResetInputValue"
          @loadEditedItem="scisLoadDataToEdit"
        >
          <template #edit>
            <DialogSci
              v-model="modelScisRef"
              :taking-status-into-account="props.takingStatusIntoAccount"
              :scis-form-value-validate="props.descriptionRiskFormValueValidate.scis"
              :statut="modelRef.statut"
              :devisPays="devis.souscripteurPersonneMorale.adresse.pays"
            />
          </template>
        </TableWithDialogDevis>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import RadioButtonGeneric from '@/components/common/form/RadioButtonGeneric.vue';
import BaseDatePicker from '@/components/common/BaseDatePicker.vue';
import DialogSci from './DialogSci.vue';
import TableWithDialogDevis from '../TableWithDialogDevis.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatISO } from 'date-fns';
import { type DevisEntreprise, DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';
import useCodeNafs from '@/composables/useCodeNafs';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import useConstante from '@/composables/useConstante';
import useFormValidate from '@/composables/useFormValidateHelper';
import numberSeparator from '@/services/numberSeparator';
import useDevis from '@/composables/useDevis';
import type { DataTableHeader } from 'vuetify';

export interface IProps {
  data?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  descriptionRiskFormValueValidate: IDescriptionRisque;
}

const { devis } = useDevis();
const { REGEX, COLLECTION } = useConstante();
const { codeNafs } = useCodeNafs();
const { formatNumberWithSpace } = numberSeparator();
const { isRequired, isDisableHelper } = useFormValidate();
const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});

const header: DataTableHeader[] = [
  { text: i18n.tc('forms.labels.companyName'), value: 'raisonSociale' },
  { text: i18n.tc('forms.labels.siret'), value: 'identifiantLegal' },
  { text: i18n.tc('forms.labels.address'), value: 'adresse.adresse1' },
  { text: i18n.tc('forms.labels.cityCode'), value: 'adresse.codePostal' },
  { text: i18n.tc('forms.labels.city'), value: 'adresse.ville' },
  { text: i18n.tc('forms.labels.countries'), value: 'adresse.pays' }
];

const modelScisRef = ref({});
const modelRef = ref<DevisEntreprise>(props.data);
const chifAffaireWithSpaceRef = ref<string>(modelRef.value.montantCaHtTotal.toString());

onMounted(() => {
  if (!modelRef.value.exerciceDeReference) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    modelRef.value['exerciceDeReference'] = currentDate.getFullYear();
  }
  chifAffaireWithSpaceRef.value = formatNumberWithSpace(modelRef.value.montantCaHtTotal);
});

const emit = defineEmits(['input', 'checkIfObjectIsSame', 'blur']);

const onEventInputAction = (modelValue) => {
  onEvenblurAction();
  emit('input', modelValue);
};

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const onEvenblurAction = () => {
  emit('blur', true);
};

const noMaxDate = computed(() => {
  return formatISO(new Date());
});

const nafCodeActivtyTitleComputed = computed(() => {
  return i18n.tc('page.additionalInformation.nafCodeActivty');
});

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount
    ? modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis
    : false;
});

const scisUpdated = (data) => {
  modelRef.value.scis = data;
};

const scisResetInputValue = () => {
  modelScisRef.value = {};
};

const scisLoadDataToEdit = (data) => {
  modelScisRef.value = data;
};

const isSciTextVisible = (): boolean => {
  return inputRequireComputed.value && modelRef.value.scis.length === 0 ? false : true;
};

const isSci = (): boolean => {
  if (modelRef.value.locauxSciAvecPartsSouscripteur) {
    return true;
  } else {
    modelRef.value.scis = [];
    return false;
  }
};

watch(
  () => props.data,
  (nv) => (modelRef.value = nv)
);
</script>
<style scoped>
.interligne-radio-bouton {
  padding-top: 0px;
  padding-bottom: 0px;
}
.col {
  padding-bottom: 0px;
}
</style>
