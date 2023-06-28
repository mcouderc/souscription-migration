<template>
  <div :class="props.isSelected ? 'prixSelected' : 'prix'">
    <div class="mb-2" v-if="item.isEtude">
      <p class="primary--text text-2xl ma-0 font-semibold text-2xl prix-ttc">
        {{ $t('page.tarification.etudeNecessaire') }}
      </p>
    </div>
    <div v-else>
      <p class="primary--text text-2xl ma-0 font-semibold text-2xl prix-ttc">
        {{ $t('page.pricing.cardPrime', { prime: getPrimeTTC(item.price) }) }}
      </p>
      <p class="primary--text text-sm ma-0 prix-mois">
        {{
          $t('page.pricing.cardPrimePerMonths', {
            prime: getPrimeTTCPerMonths(props.item.price)
          })
        }}
      </p>
    </div>
    <v-btn
      :class="props.isSelected ? 'white--text green mx-auto btn' : 'primary mx-auto btn'"
      @click="
        formulaSelected({
          id: props.item.id,
          code: props.item.code
        })
      "
    >
      {{ $t('forms.buttons.chooseFormula') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';
import type IFormulaSelected from '@/models/interfaceEligibility/IFormulaSelected';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';

export interface IProps {
  item: IGarantieContenueOuIntituleGarantieHeader;
  isSelected: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  item: null,
  isSelected: false
});

const emit = defineEmits(['formulaSelected']);

const { formatAmount } = formatDataConsultDevis();

const formulaSelectedRef = ref<IFormulaSelected>(null);

const formulaSelected = (idCode: IFormulaSelected): void => {
  formulaSelectedRef.value = idCode;
  emit('formulaSelected', idCode);
};

const getPrimeTTC = (price: string): string => {
  return formatAmount(parseFloat(price));
};

const getPrimeTTCPerMonths = (price: string | number): string => {
  if (typeof price === 'string') {
    return formatAmount(parseFloat(price) / 12);
  } else {
    return formatAmount(price / 12);
  }
};
</script>

<style scoped>
.prixSelected {
  background-color: rgb(211, 211, 211);
  text-align: center;
  border-radius: 4px;
  margin: auto;
  width: 165px;
}
.prix {
  background-color: rgb(211, 211, 211);
  text-align: center;
  border-radius: 4px;
  margin: auto;
  width: 165px;
}
.btn {
  margin-bottom: 10px;
}
.prix-ttc {
  padding-top: 7px;
}
.prix-mois {
  padding-top: 0px;
  padding-bottom: 4px;
}
</style>
