<template>
  <v-col>
    <v-row class="pb-2">
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
          v-model="modelRef.nombreResidencesSecondaires"
          value=""
          input-id="nombreResidencesSecondaires"
          :title="$tc('page.additionalInformation.numberResidenceSecondaire')"
          :regex="REGEX.NUMBER"
          input-type="number"
          :is-required="true"
          :is-disabled="
            isDisableHelper(
              props.descriptionRiskFormValueValidate.nombreResidencesSecondaires,
              takingStatusIntoAccount,
              modelRef.nombreResidencesSecondaires,
              props.descriptionRiskFormValueValidate.nombreResidencesSecondaires.typage
            )
          "
          @input="onEventInputActionTab(modelRef, $event), buttonAddDisabled()"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="12">
        <!-- <TableWithDialogDevis
          :header="header"
          :items-list="modelRef.residencesSecondaires"
          :item-to-edit="modelSecondHomeRef"
          :is-to-contrat="inputRequireComputed"
          :taking-status-into-account="props.takingStatusIntoAccount"
          :statut="devis.statut"
          :disabled="isButtonAddResSecDisabledRef"
          :show-btn-delete-table="false"
          :show-btn-add-dialog="false"
          :add-button-text="$t('forms.buttons.addSecondHome')"
          @itemsListUpdated="residenceSecondaireUpdated"
          @resetEditedItem="residenceSecondaireResetInputValue"
          @loadEditedItem="residenceSecondaireLoadDataToEdit"
        >
          <template #edit>
            <DialogSecondHome
              v-model="modelSecondHomeRef"
              :taking-status-into-account="props.takingStatusIntoAccount"
              :residence-secondaire-form-value-validate="
                props.descriptionRiskFormValueValidate.residencesSecondaires
              "
              :statut="devis.statut"
              :devisPays="devis.souscripteurPersonnePhysique.adresse.pays"
            />
          </template>
        </TableWithDialogDevis> -->
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  type DevisEntreprise,
  DevisEntrepriseStatutEnum,
  type Adresse
} from 'open-api-souscription-typescript';
import useDevis from '@/composables/useDevis';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import useConstante from '@/composables/useConstante';
import useFormValidate from '@/composables/useFormValidateHelper';

export interface IProps {
  data?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  descriptionRiskFormValueValidate: IDescriptionRisque;
}
const { t } = useI18n();
const { devis } = useDevis();
const { REGEX } = useConstante();
const { isDisableHelper } = useFormValidate();
const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});

const modelSecondHomeRef = ref<Adresse>({});
const modelRef = ref<DevisEntreprise>(props.data);
const isButtonAddResSecDisabledRef = ref<boolean>(true);

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const onEventInputActionTab = (modelValue: DevisEntreprise, valuerAModifier: number) => {
  onEventInputAction(modelValue);
  createArrayFormResidenceSecondaire(valuerAModifier);
};

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const buttonAddDisabled = () => {
  isButtonAddResSecDisabledRef.value =
    modelRef.value.nombreResidencesSecondaires <= modelRef.value.residencesSecondaires.length;
};

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount
    ? modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis
    : false;
});

const createArrayFormResidenceSecondaire = (valeurAPersister: number) => {
  //recuperation de la liste des index des RS deja present dans le tableau pour ce type de bien

  const indicesResidenceSecondaireDejaPresent = modelRef.value.residencesSecondaires;

  const cloneResidenceSecondaire = [...modelRef.value.residencesSecondaires];
  //Recuperation du type de traitement à faire. Si negatif alors suppresion, si positive alors ajout
  const valeurDifference = valeurAPersister - indicesResidenceSecondaireDejaPresent?.length;
  if (valeurDifference < 0) {
    let valeurDifferencePositive = Math.abs(valeurDifference);
    indicesResidenceSecondaireDejaPresent.reverse().forEach((indiceRSASupprimer) => {
      if (valeurDifferencePositive > 0) {
        cloneResidenceSecondaire.splice(indiceRSASupprimer as number, 1);
        valeurDifferencePositive = valeurDifferencePositive - 1;
      }
    });
  } else {
    if (Math.abs(valeurDifference) > 0) {
      for (let i = 0; i < Math.abs(valeurDifference); i++) {
        cloneResidenceSecondaire.push({
          adresse1: '',
          adresse2: '',
          adresse3: '',
          codePostal: '',
          pays: ''
        } as Adresse);
      }
    }
  }
  modelRef.value.residencesSecondaires = cloneResidenceSecondaire;
};

const initTableauResidenceSecondaire = () => {
  createArrayFormResidenceSecondaire(modelRef.value.nombreLotsHabitations);
};

initTableauResidenceSecondaire();

watch(
  () => props.data,
  (nv) => (modelRef.value = nv)
);

watch(
  () => modelRef.value.residencesSecondaires,
  () => buttonAddDisabled()
);
</script>
<style scoped>
.col {
  padding-bottom: 0px;
}
</style>
