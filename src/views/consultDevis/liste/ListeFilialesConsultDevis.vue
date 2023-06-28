<template>
  <div>
    <a href="#" class="sub-section-title" @click.prevent="changeDisplayFilialesState()">
      {{ displayFilialesRef ? '-' : '+' }} Filiales
    </a>
    <div v-if="displayFilialesRef">
      <div v-for="(filiale, y) in getFilialesComputed" :key="y" class="section-data">
        <div v-for="({ label, value }, z) in filiale" :key="z">
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
import getListeConsultDevis from '@/services/getListeConsultDevis';
import type { IFilliales } from '@/models/form_validate/interface/IFilliales';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const devisRef = ref<DevisEntreprise>(props.devis);
const displayFilialesRef = ref(true);
const { formatAdress, preFormatValue } = formatDataConsultDevis();
const { getFilliales } = getListeConsultDevis();

const changeDisplayFilialesState = () => {
  displayFilialesRef.value = !displayFilialesRef.value;
};

const getFilialesComputed = computed(() => {
  const filiales = [];
  if (devisRef.value.filiales) {
    devisRef.value?.filiales.map((a: IFilliales) => {
      const criteres = getFilliales(a);
      filiales.push(criteres);
    });
  }
  return filiales;
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
