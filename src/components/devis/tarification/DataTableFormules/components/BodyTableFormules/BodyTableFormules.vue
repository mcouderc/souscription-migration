<template>
  <tbody>
    <tr v-for="(intituleGarantie, index) in props.intitulesGaranties" :key="index">
      <HeaderTableFormule
        :intituleGarantie="intituleGarantie"
        :isDividerPrice="isDivider(intituleGarantie.value) || isPrice(intituleGarantie.value)"
        :width="columnWidth"
      />

      <td
        v-for="(itemDansFormule, indx) in props.dataFormulesFormatees"
        :key="indx"
        :class="isSelected(itemDansFormule, intituleGarantie)"
        :width="columnWidth"
      >
        <template v-if="isDivider(intituleGarantie.value)"></template>
        <PriceFormule
          v-else-if="isPrice(intituleGarantie.value)"
          :item="itemDansFormule"
          @formulaSelected="getFormulaSelected($event)"
          :isSelected="isFormuleDevisIsInFormuleSelected(itemDansFormule.id)"
        />

        <strong v-else-if="isName(intituleGarantie.value)" class="nom-formule"
          >{{ itemDansFormule[intituleGarantie.value] }}
        </strong>

        <LoaderGenericSpecifique
          v-else-if="isLoadingRecalculTarifProduitRef"
          :opacity="0.2"
          absolute
          backgroundWhite
          is-loading
        />

        <template v-else>
          <ToolTip
            :headerItem="itemDansFormule[intituleGarantie.value]"
            :itemDansFormule="itemDansFormule"
          />
        </template>
      </td>
    </tr>
    <PriceFormuleWithoutButton :dataFormulesFormatees="props.dataFormulesFormatees" />
  </tbody>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import HeaderTableFormule from '@/components/devis/tarification/DataTableFormules/components/BodyTableFormules/components/HeaderTableFormule.vue';
import PriceFormule from '@/components/devis/tarification/DataTableFormules/components/BodyTableFormules/components/PriceFormule.vue';
import PriceFormuleWithoutButton from '@/components/devis/tarification/DataTableFormules/components/BodyTableFormules/components/PriceFormuleWithoutButton.vue';
import ToolTip from '@/components/devis/tarification/DataTableFormules/components/BodyTableFormules/components/ToolTip.vue';
import LoaderGenericSpecifique from '@/components/global/LoaderGenericSpecifique.vue';
import { useRoute } from 'vue-router/composables';
import useDevis from '@/composables/useDevis';
import type IFormulaSelected from '@/models/interfaceEligibility/IFormulaSelected';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';
import useBodyTableTarificationService from '@/composables/useBodyTableTarificationService';

export interface IProps {
  intitulesGaranties: IGarantieContenueOuIntituleGarantieHeader[];
  dataFormulesFormatees: IGarantieContenueOuIntituleGarantieHeader[];
  isLoadingRecalculTarifProduit: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  intitulesGaranties: () => [],
  dataFormulesFormatees: () => [],
  isLoadingRecalculTarifProduit: false
});

const formulaSelected = ref<IFormulaSelected>(null);
const isLoadingRecalculTarifProduitRef = ref<boolean>(props.isLoadingRecalculTarifProduit);
const cols = ref<number>(props.dataFormulesFormatees.length);
const columnWidth = computed(() => {
  if (cols.value === 1) {
    return '5%';
  } else {
    return 100 / (cols.value + 1) + '%';
  }
});

const emit = defineEmits(['formulaSelected']);
const route = useRoute();
const { devis } = useDevis();
const { isName, isDivider, isPrice } = useBodyTableTarificationService();

const isSelected = (
  itemDansFormule: IGarantieContenueOuIntituleGarantieHeader,
  intituleGarantie: IGarantieContenueOuIntituleGarantieHeader
): string => {
  if (isFormuleDevisIsInFormuleSelected(itemDansFormule.id)) {
    if (isName(intituleGarantie.value)) {
      return 'title-selected';
    }
    return 'selected';
  } else {
    return 'tableau';
  }
};

const getFormulaSelected = (idCode: IFormulaSelected): void => {
  formulaSelected.value = idCode;
  emit('formulaSelected', idCode);
};

const isFormuleDevisIsInFormuleSelected = (formuleId: number): boolean => {
  return !isNewDevis() && devis.value.formuleSouscrite?.idFormule === formuleId;
};

const isNewDevis = (): boolean => {
  return !!route.query.new;
};

watch(
  () => props.isLoadingRecalculTarifProduit,
  (newVal) => {
    isLoadingRecalculTarifProduitRef.value = newVal;
  }
);
</script>

<style scoped>
.tableau {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
.v-data-table td {
  border-bottom: none !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.nom-formule {
  font-size: 22px;
}

.selected {
  text-align: center;
  border-right: solid 1px green;
  border-left: solid 1px green;
}

.title-selected {
  text-align: center;
  border-right: solid 1px green;
  border-left: solid 1px green;
  border-top: solid 1px green;
}
</style>
