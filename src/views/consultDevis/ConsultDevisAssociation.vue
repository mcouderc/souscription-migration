<template>
  <v-expansion-panels v-model="panelOpenRef" flat multiple accordion>
    <v-expansion-panel
      class="border-grey info-devis-expansion-panel"
      v-for="({ id, title, sectionData }, index) in devisAssociationComputed.infoDevisSections"
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
            <ListeChampsConsultDevis :label="label" :value="preFormatValue(formatAdress(value))">
            </ListeChampsConsultDevis>
          </div>
        </div>
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
import ListeErrorsConsultDevis from './liste/ListeErrorsConsultDevis.vue';
import useConstante from '@/composables/useConstante';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const { RESUME_DEVIS, PANEL_INITIAL_OPEN } = useConstante();
const { getResumeDevis, getSouscripteurMoral, getRiskForAssociation } = getListeConsultDevis();
const { formatAdress, preFormatValue } = formatDataConsultDevis();

const devisRef = ref<DevisEntreprise>(props.devis);
const panelOpenRef = ref(PANEL_INITIAL_OPEN);

const devisAssociationComputed = computed(() => {
  const devisAssociationModel = {
    infoDevisHeader: {
      numeroDevis: devisRef.value?.numeroDevis || '',
      statutDevis: devisRef.value?.statut || ''
    },
    infoDevisSections: [
      getResumeDevis(devisRef.value),
      getSouscripteurMoral(devisRef.value),
      getRiskForAssociation(devisRef.value)
    ]
  };

  return devisAssociationModel;
});

const showListeErrorsConsultDevis = computed(() => {
  return (id: string): boolean =>
    id === RESUME_DEVIS && devisRef.value.informationsEligibilite?.length > 0;
});

watch(
  () => props.devis,
  (newVal) => {
    devisRef.value = newVal;
  }
);
</script>
