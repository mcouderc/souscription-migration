<template>
  <div>
    <a href="#" class="sub-section-title" @click.prevent="changeScisState()">
      {{ displayScisRef ? '-' : '+' }} SCIS
    </a>
    <div v-if="displayScisRef">
      <div v-for="(sci, y) in getScisComputed" :key="y" class="section-data">
        <div v-for="({ label, value }, z) in sci" :key="z">
          <ListeChampsConsultDevis
            :label="label"
            :value="preFormatValue(formatAdress(value))"
          ></ListeChampsConsultDevis>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import ListeChampsConsultDevis from './ListeChampsConsultDevis.vue';
import type { IScis } from '@/models/form_validate/interface/IScis';
import getListeConsultDevis from '@/services/getListeConsultDevis';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const devisRef = ref<DevisEntreprise>(props.devis);
const displayScisRef = ref(true);
const { formatAdress, preFormatValue } = formatDataConsultDevis();
const { getSCIS } = getListeConsultDevis();

const changeScisState = async () => {
  displayScisRef.value = !displayScisRef.value;
};

const getScisComputed = computed(() => {
  const scis = [];
  if (devisRef.value.scis) {
    devisRef.value?.scis.map((a: IScis) => {
      const criteres = getSCIS(a);
      scis.push(criteres);
    });
  }
  return scis;
});
</script>

<style scoped>
.data-block {
  width: 100%;
  display: flex;
}
.label {
  flex-basis: 40%;
}
.value {
  padding-left: 20px;
  flex-basis: 50%;
}
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
</style>
