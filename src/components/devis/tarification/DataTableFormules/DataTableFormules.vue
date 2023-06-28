<template>
  <v-data-table
    item-key="id"
    :items="props.dataFormulesFormatees"
    no-gutter
    hide-default-footer
    dense
    class="border-2 border-grey rounded bg-white relative px-0"
  >
    <template v-slot:body>
      <BodyTableFormules
        :isLoadingRecalculTarifProduit="isLoadingRecalculTarifProduitRef"
        :intitulesGaranties="props.intitulesGaranties"
        :dataFormulesFormatees="props.dataFormulesFormatees"
        @formulaSelected="getFormulaSelected($event)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BodyTableFormules from '@/components/devis/tarification/DataTableFormules/components/BodyTableFormules/BodyTableFormules.vue';
import type IFormulaSelected from '@/models/interfaceEligibility/IFormulaSelected';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';

export interface IProps {
  intitulesGaranties: IGarantieContenueOuIntituleGarantieHeader[];
  dataFormulesFormatees: IGarantieContenueOuIntituleGarantieHeader[];
  isLoadingRecalculTarifProduit: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  intitulesGaranties: () => [],
  dataFormulesFormatees: () => []
});

const isLoadingRecalculTarifProduitRef = ref<boolean>(props.isLoadingRecalculTarifProduit);

const emit = defineEmits(['formulaSelected']);

const getFormulaSelected = (idCode: IFormulaSelected): void => {
  emit('formulaSelected', idCode);
};

watch(
  () => props.isLoadingRecalculTarifProduit,
  (newVal) => {
    isLoadingRecalculTarifProduitRef.value = newVal;
  },
  { immediate: true }
);
</script>
