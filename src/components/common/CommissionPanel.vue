<template>
  <v-row no-gutters class="card-commission border-2 border-grey rounded bg-white">
    <v-col cols="12">
      <v-expansion-panels flat accordion>
        <v-expansion-panel>
          <v-expansion-panel-header class="header-commission">
            <h2 class="text-primary text-h6 text-uppercase">
              {{ $t('page.summary.commission.title') }}
            </h2>
          </v-expansion-panel-header>
          <v-expansion-panel-content id="expansion-panel-content-1">
            <p class="text-sm font-semibold date-center">
              {{ props.date }}
            </p>
            <v-col class="col-visu-contrat">
              <v-row
                v-for="{ label, value } in datasCommissionsRef?.slice(0, 5)"
                :key="label"
                class="row-display"
              >
                <label class="text-sm">{{ label }} :</label>
                <label
                  v-if="label === t('page.summary.commission.taux')"
                  class="text-sm font-semibold"
                  >{{ value }} %</label
                >
                <label v-else class="text-sm font-semibold">{{ formatAmount(value) }}</label>
              </v-row>
            </v-col>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { DevisEntreprise, DevisCommissionContrat } from 'open-api-souscription-typescript';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { devisApi } from '@/plugins/open-api';
import useSnackBar from '@/composables/useSnackBar';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';

export interface IProps {
  devis: DevisEntreprise;
  date: string;
}

const props = withDefaults(defineProps<IProps>(), {});
const { t } = useI18n();
const datasCommissionsRef = ref();

const { addMessageErrorSnackBarAction } = useSnackBar();
const { setLoaderGlobal } = useLoader();
const { formatAmount } = formatDataConsultDevis();

const {
  isLoading: isLoadingGetComContrat,
  isError: isErrorGetComContrat,
  data: commissionContrat,
  doFetch: doFetchGetComContrat
} = useApiCall<DevisCommissionContrat>({
  route: devisApi().getCommissionContrat
});

onMounted(async () => {
  await doFetchGetComContrat(props.devis.id);
  if (isErrorGetComContrat.value) {
    addMessageErrorSnackBarAction(t('page.summary.commission.errorGetCommission'));
  }
  if (commissionContrat.value) {
    initDataCommission(commissionContrat.value);
  }
});

const initDataCommission = (response) => {
  datasCommissionsRef.value = [
    {
      label: t('page.summary.commission.taux'),
      value: isNumberExist(response.tauxCommissionContrat) ? response.tauxCommissionContrat : '-'
    },
    {
      label: t('page.summary.commission.montant'),
      value: isNumberExist(response.montantCommissionContrat)
        ? formatAmount(response.montantCommissionContrat)
        : '-'
    },
    {
      label: t('page.summary.commission.reverser'),
      value: formatAmount(response.montant) || '-'
    }
  ];
};

const isNumberExist = (number: number): boolean => {
  return number >= 0;
};

watch(
  () => isLoadingGetComContrat.value,
  (isLoadingGetComContrat) => {
    setLoaderGlobal({ isLoading: isLoadingGetComContrat });
  }
);
</script>

<style scoped>
.card-commission {
  margin-top: 12px !important;
  padding: 0 20px;
}

.header-commission {
  padding: 0%;
}

.date-center {
  display: flex;
  justify-content: center;
}

.row-display {
  display: flex;
  justify-content: space-between;
}
</style>
<style>
#expansion-panel-content-1 > * {
  padding: 0 0 16px !important;
}
</style>
