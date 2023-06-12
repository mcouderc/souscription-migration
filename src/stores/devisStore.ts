import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { DevisEntreprise } from 'open-api-souscription-typescript';

interface IDevisState {
  devis: DevisEntreprise;
}
export const useDevisStore = defineStore('devisStore', () => {
  const state = ref({ devis: {} } as IDevisState);

  const devis = computed(() => {
    return state.value.devis;
  });

  const setDevis = (devis: DevisEntreprise) => {
    state.value.devis = devis;
  };

  const initDevis = (modelDevis) => {
    state.value.devis = modelDevis as DevisEntreprise;
  };

  return {
    devis,
    setDevis,
    initDevis
  };
});
