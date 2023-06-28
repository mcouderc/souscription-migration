<template>
  <div>
    <a
      href="#"
      class="sub-section-title"
      @click.prevent="changeDisplayEtablissementsSecondairesState()"
    >
      {{ displayEtablissementsSecondairesRef ? '-' : '+' }} RESIDENCES SECONDAIRES
    </a>
    <div v-if="displayEtablissementsSecondairesRef">
      <div
        v-for="(etablissementSecondaire, keyY) in getEtablissementsSecondairesComputed"
        :key="keyY"
        class="section-data"
      >
        <div v-for="({ label, value }, keyZ) in etablissementSecondaire" :key="keyZ">
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
import type { IEtablissementsSecondaires } from '@/models/form_validate/interface/IEtablissementsSecondaires';

export interface IProps {
  devis?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  devis: () => ({})
});

const devisRef = ref<DevisEntreprise>(props.devis);
const displayEtablissementsSecondairesRef = ref(true);
const { formatAdress, preFormatValue } = formatDataConsultDevis();
const { getEtablissementsSecondaires } = getListeConsultDevis();

const changeDisplayEtablissementsSecondairesState = () => {
  displayEtablissementsSecondairesRef.value = !displayEtablissementsSecondairesRef.value;
};

const getEtablissementsSecondairesComputed = computed(() => {
  const etablissementsSecondaires = [];
  if (devisRef.value.etablissementsSecondaires) {
    devisRef.value?.etablissementsSecondaires.map((a: IEtablissementsSecondaires) => {
      const criteres = getEtablissementsSecondaires(a);
      etablissementsSecondaires.push(criteres);
    });
  }
  return etablissementsSecondaires;
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
