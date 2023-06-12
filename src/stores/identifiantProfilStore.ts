import { defineStore } from 'pinia';
import type IPapperEntreprise from '@/models/IPapperEntreprise';
import { computed, ref } from 'vue';

interface IdentifiantLegalState {
  identifiantProfil: IPapperEntreprise;
}

export const useIdentifiantProfilStore = defineStore('identifiantProfilStore', () => {
  const state = ref({ identifiantProfil: {} } as IdentifiantLegalState);

  const identifiantProfil = computed<IPapperEntreprise>(() => {
    return state.value.identifiantProfil;
  });

  function setIdentifiantProfil(identificationProfil: IPapperEntreprise) {
    state.value.identifiantProfil = identificationProfil;
  }
  return {
    identifiantProfil,
    setIdentifiantProfil
  };
});
