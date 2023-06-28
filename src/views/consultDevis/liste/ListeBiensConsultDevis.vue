<template>
  <div>
    <a href="#" class="sub-section-title" @click.prevent="changeDisplayBiensState()">
      {{ displayBiensRef ? '-' : '+' }} Biens
    </a>
    <div v-if="displayBiensRef">
      <div v-for="(bien, y) in getBiensComputed" :key="y" class="section-data">
        <div v-for="({ label, value }, z) in bien" :key="z">
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
import type { IBiens } from '@/models/form_validate/interface/IBiens';
import getListeConsultDevis from '@/services/getListeConsultDevis';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const devisRef = ref<DevisEntreprise>(props.devis);
const displayBiensRef = ref(true);
const { formatAdress, preFormatValue } = formatDataConsultDevis();
const { getBiens } = getListeConsultDevis();

const changeDisplayBiensState = () => {
  displayBiensRef.value = !displayBiensRef.value;
};

const getBiensComputed = computed(() => {
  const biens = [];
  if (devisRef.value.biens) {
    devisRef.value?.biens.map((a: IBiens) => {
      const criteres = getBiens(a);
      biens.push(criteres);
    });
  }
  return biens;
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
