<template>
  <FormRiskProfessionel
    v-if="isCanShow([PROFESSIONEL])"
    :data="modelRef"
    :taking-status-into-account="props.takingStatusIntoAccount"
    :description-risk-form-value-validate="descriptionRiskFormValueValidate"
    @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
  />
  <!-- <FormRiskParticular
    v-if="isCanShow([PARTICULIER])"
    :data="modelRef"
    @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
  /> -->
</template>

<script setup lang="ts">

import FormRiskParticular from './FormRiskParticular.vue';
import { ref, watch } from 'vue';
import useConstante from '@/composables/useConstante';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import type { IFilialeValidate } from '@/models/form_validate/interface/IFilialeValidate';
import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur';

export interface IProps {
  data?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  descriptionRiskFormValueValidate: IDescriptionRisque;
  souscripteurRiskFormValueValidate?: ISouscripteur;
  filialeFormValueValidate?: IFilialeValidate;
}

const props = withDefaults(defineProps<IProps>(), {
  value: () => ({}),
  takingStatusIntoAccount: false
});
const { PROFESSIONEL, PARTICULIER } = useConstante();
const modelRef = ref<DevisEntreprise>(props.data);

const emit = defineEmits(['input', 'checkIfObjectIsSame']);
const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const isCanShow = (listTypeRikAllow: string[]): boolean => {
  // return listTypeRikAllow.indexOf(modelRef.value.typeRisque) >= 0;
  return true;
};

watch(
  () => props.data,
  (nv) => (modelRef.value = nv)
);
</script>
