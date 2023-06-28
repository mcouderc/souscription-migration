<template>
  <v-expansion-panels v-model="panelOpenRef" flat multiple accordion>
    <v-expansion-panel
      class="border-grey info-devis-expansion-panel"
      v-for="({ id, title, sectionData }, index) in devisPNOComputed.infoDevisSections"
      :key="index"
    >
      <v-expansion-panel-header>
        <v-col cols="12">
          <h2 class="text-primary text-h6 text-capitalize">
            {{ title }}
          </h2>
        </v-col>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="section-data">
          <div v-for="({ label, value }, x) in sectionData" :key="x">
            <ListeChampsConsultDevis :label="label" :value="preFormatValue(formatAdress(value))" />
          </div>
        </div>
        <ListeBiensConsultDevis v-if="showListeDescriptionConsultDevis(id)" :devis="devisRef" />
        <ListeErrorsConsultDevis
          v-if="showListeErrorsConsultDevis(id)"
          :errors="devisRef.informationsEligibilite"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import getListeConsultDevis from '@/services/getListeConsultDevis';
import ListeChampsConsultDevis from './liste/ListeChampsConsultDevis.vue';
import ListeBiensConsultDevis from './liste/ListeBiensConsultDevis.vue';
import ListeErrorsConsultDevis from './liste/ListeErrorsConsultDevis.vue';
import type { IConsultDevisData } from '@/models/form_validate/interface/IConsultDevisData';
import useConstante from '@/composables/useConstante';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const { RESUME_DEVIS, DESCRIPTION_DEVIS, PANEL_INITIAL_OPEN } = useConstante();
const { getResumeDevis, getSouscripteurMoral, getSouscripteurPhysique, getRiskForPNO } =
  getListeConsultDevis();
const { formatAdress, preFormatValue } = formatDataConsultDevis();

const devisRef = ref<DevisEntreprise>(props.devis);
const panelOpenRef = ref(PANEL_INITIAL_OPEN);

const devisPNOComputed = computed(() => {
  const devisPNOModel = {
    infoDevisHeader: {
      numeroDevis: devisRef.value?.numeroDevis || '',
      statutDevis: devisRef.value?.statut || ''
    },
    infoDevisSections: [
      getResumeDevis(devisRef.value),
      definedDataToPNO(),
      getRiskForPNO(devisRef.value)
    ]
  };

  return devisPNOModel;
});

const definedDataToPNO = (): IConsultDevisData => {
  if (devisRef.value.souscripteurPersonneMorale?.raisonSociale) {
    return getSouscripteurMoral(devisRef.value);
  } else {
    return getSouscripteurPhysique(devisRef.value);
  }
};

const showListeErrorsConsultDevis = computed(() => {
  return (id: string): boolean =>
    id === RESUME_DEVIS && devisRef.value.informationsEligibilite?.length > 0;
});

const showListeDescriptionConsultDevis = computed(() => {
  return (id: string): boolean => id === DESCRIPTION_DEVIS && devisRef.value.biens?.length !== 0;
});

watch(
  () => props.devis,
  (newVal) => {
    devisRef.value = newVal;
  }
);
</script>
