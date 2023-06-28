<template>
  <tr>
    <td></td>
    <td
      v-for="(item, indx) in props.dataFormulesFormatees"
      :key="indx"
      :class="isFormuleDevisIsInFormuleSelected(item.id) ? 'selectedPrix' : 'pl-0 pr-0'"
    >
      <div class="prix">
        <div class="mb-2" v-if="item.isEtude">
          <p class="primary--text text-2xl ma-0 font-semibold text-2xl text-etude">
            {{ $t('page.tarification.etudeNecessaire') }}
          </p>
        </div>
        <div class="mb-2" v-else>
          <p class="primary--text text-2xl ma-0 font-semibold text-2xl prix-ttc">
            {{ $t('page.pricing.cardPrime', { prime: getPrimeTTC(item.price) }) }}
          </p>
          <p class="text-sm ma-0 font-semibold prix-mois">
            {{ $t('page.pricing.cardPrimePerMonths', { prime: getPrimeTTCPerMonths(item.price) }) }}
          </p>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import useDevis from '@/composables/useDevis';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import { useRoute } from 'vue-router';

export interface IProps {
  dataFormulesFormatees: IGarantieContenueOuIntituleGarantieHeader[];
}

const props = withDefaults(defineProps<IProps>(), {
  dataFormulesFormatees: () => []
});

const { devis } = useDevis();
const route = useRoute();
const { formatAmount } = formatDataConsultDevis();

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

const isFormuleDevisIsInFormuleSelected = (formuleId: number): boolean => {
  return !isNewDevis() && devis.value.formuleSouscrite?.idFormule === formuleId;
};

const isNewDevis = (): boolean => {
  return !!route.query.new;
};
</script>

<style scoped>
.prix {
  background-color: rgb(211, 211, 211);
  text-align: center;
  border-radius: 4px !important;
  margin: auto;
  width: 165px;
}
.selectedPrix {
  text-align: center;
  border-radius: 4px;
  margin: auto;
  border-right: solid 1px green;
  border-left: solid 1px green;
  border-bottom: solid 1px green;
}
.prix-ttc {
  padding-top: 7px;
}
.prix-mois {
  padding-top: 0px;
  padding-bottom: 5px;
}

.prix-titre {
  font-size: 17px;
}
.text-etude {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
