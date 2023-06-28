<template>
  <v-col>
    <v-row>
      <v-col cols="12" v-if="props.suscriberFormValueValidate.choixTypePersonne">
        <RadioButtonGeneric
          v-model="isSouscripteurIsPersonneMoral"
          radio-button-id="isSouscripteurIsPersonneMoral"
          :title="$tc('forms.labels.nomPropreOuSociete')"
          :label-button1="$tc('forms.labels.viaSociete')"
          :label-button2="$tc('forms.labels.nomPropre')"
          :is-disabled="checkRadioChoixTypePersonne"
          @input="onChangeTypePersonneAction(isSouscripteurIsPersonneMoral)"
        />
      </v-col>
    </v-row>
    <template v-if="!pendingRef">
      <FormSubscriberMoral
        v-if="isSouscripteurIsPersonneMoral"
        :suscriber-form-value-validate="props.suscriberFormValueValidate"
        v-model="modelRef"
        :taking-status-into-account="props.takingStatusIntoAccount"
        :compar-disabled-copro="props.comparDisabledCopro"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction"
        @input="onEventInputAction"
        @checkEligibility="onEventEligibilityCheck($event)"
      ></FormSubscriberMoral>
      <FormSubscriberPhysique
        v-else
        :suscriber-form-value-validate="props.suscriberFormValueValidate"
        v-model="modelRef"
        :taking-status-into-account="props.takingStatusIntoAccount"
        @checkIfObjectIsSame="onCheckIfObjectIsSameAction"
        @input="onEventInputAction"
      >
      </FormSubscriberPhysique>
    </template>
  </v-col>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur.js';
import FormSubscriberPhysique from '@/components/devis/forms/FormSubscriberPhysique.vue';
import FormSubscriberMoral from '@/components/devis/forms/FormSubscriberMoral.vue';
import RadioButtonGeneric from '@/components/common/form/RadioButtonGeneric.vue';

export interface IProps {
  data?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  suscriberFormValueValidate: ISouscripteur;
  comparDisabledCopro?: Array<string | number>;
}
const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});

const modelRef = ref(props.data);
const isSouscripteurIsPersonneMoral = ref(props.suscriberFormValueValidate.isPersonneMorale);
const pendingRef = ref(true);

const emit = defineEmits([
  'checkIfObjectIsSame',
  'checkEligibility',
  'changeTypePersonne',
  'input'
]);
const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const onEventEligibilityCheck = (isEligible: boolean) => {
  emit('checkEligibility', isEligible);
};

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const onChangeTypePersonneAction = (isPersonneMoral: boolean) => {
  resetForm();
  emit('changeTypePersonne', isPersonneMoral);
};

onMounted(async () => {
  await checkTypeOfSouscripteur();
  pendingRef.value = false;
});

const checkTypeOfSouscripteur = async () => {
  if (props.data?.souscripteurPersonneMorale?.raisonSociale) {
    isSouscripteurIsPersonneMoral.value = true;
  }
};

const resetForm = () => {
  modelRef.value.souscripteurPersonneMorale.raisonSociale = '';
  modelRef.value.souscripteurPersonneMorale.formeJuridique = '';
  modelRef.value.souscripteurPersonneMorale.identifiantLegal = '';
  modelRef.value.souscripteurPersonneMorale.adresse.adresse1 = '';
  modelRef.value.souscripteurPersonneMorale.adresse.adresse2 = '';
  modelRef.value.souscripteurPersonneMorale.adresse.adresse3 = '';
  modelRef.value.souscripteurPersonneMorale.adresse.ville = '';
  modelRef.value.souscripteurPersonneMorale.adresse.codePostal = '';
  modelRef.value.souscripteurPersonnePhysique.nom = '';
  modelRef.value.souscripteurPersonnePhysique.mail = '';
  modelRef.value.souscripteurPersonnePhysique.prenom = '';
  modelRef.value.souscripteurPersonnePhysique.telephone2 = '';
  modelRef.value.souscripteurPersonnePhysique.telephone1 = '';
  modelRef.value.souscripteurPersonnePhysique.lieuNaissance = '';
  modelRef.value.souscripteurPersonnePhysique.civilite = '';
  modelRef.value.souscripteurPersonnePhysique.dateNaissance = null;
  modelRef.value.souscripteurPersonnePhysique.adresse.adresse1 = '';
  modelRef.value.souscripteurPersonnePhysique.adresse.adresse2 = '';
  modelRef.value.souscripteurPersonnePhysique.adresse.adresse3 = '';
  modelRef.value.souscripteurPersonnePhysique.adresse.ville = '';
  modelRef.value.souscripteurPersonnePhysique.adresse.codePostal = '';
};
const checkRadioChoixTypePersonne = computed(() => {
  return (
    modelRef.value?.numeroDevis !== undefined &&
    modelRef.value?.numeroDevis != null &&
    modelRef.value?.numeroDevis !== ''
  );
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
