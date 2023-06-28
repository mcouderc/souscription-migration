<template>
  <ConsultDevisProfessionel v-if="isCanShow([PROFESSIONEL])" :devis="devisRef" />
  <ConsultDevisParticular v-else-if="isCanShow([PARTICULIER])" :devis="devisRef" />
  <ConsultDevisAgricole v-else-if="isCanShow([AGRICOLE])" :devis="devisRef" />
  <ConsultDevisAssociation v-else-if="isCanShow([ASSOCIATION])" :devis="devisRef" />
  <ConsultDevisASL v-else-if="isCanShow([ASL])" :devis="devisRef" />
  <ConsultDevisPNO v-else-if="isCanShow([PNO])" :devis="devisRef" />
  <ConsulDevisCopro v-else-if="isCanShow([COPRO])" :devis="devisRef" />
</template>

<script setup lang="ts">
import ConsultDevisASL from './ConsultDevisASL.vue';
import ConsultDevisAssociation from './ConsultDevisAssociation.vue';
import ConsultDevisParticular from './ConsultDevisParticular.vue';
import ConsultDevisProfessionel from './ConsultDevisProfessionel.vue';
import ConsultDevisAgricole from './ConsultDevisAgricole.vue';
import ConsultDevisPNO from './ConsultDevisPNO.vue';
import ConsulDevisCopro from './ConsultDevisCopro.vue';
import { ref, watch } from 'vue';
import useConstante from '@/composables/useConstante';
import type { DevisEntreprise } from 'open-api-souscription-typescript';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const { PROFESSIONEL, ASL, PARTICULIER, ASSOCIATION, PNO, AGRICOLE, COPRO } = useConstante();
const devisRef = ref<DevisEntreprise>(props.devis);

const isCanShow = (listTypeRikAllow: string[]): boolean => {
  return listTypeRikAllow.indexOf(devisRef.value.typeRisque) >= 0;
};

watch(
  () => props.devis,
  (newVal) => {
    devisRef.value = newVal;
  }
);
</script>

<style>
.section-data {
  padding-bottom: 20px;
}
.sub-section-title {
  display: block;
  margin-bottom: 5px;
  padding-left: 17px;
  font-size: 0.95rem;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--v-primary-base) !important;
}
.info-devis-expansion-panel {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.v-expansion-panel-header {
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
