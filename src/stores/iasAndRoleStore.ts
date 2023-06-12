import type { Courtier, RoleSymfony } from 'open-api-espace-partenaire-souscription-typescript';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface IIasAndRoleState {
  ias: Courtier[];
  role: RoleSymfony;
}

export const useIasAndRoleStore = defineStore('iasAndRole', () => {
  const state = ref<IIasAndRoleState | undefined>();

  const ias = computed(() => {
    return state.value?.ias;
  });

  const role = computed(() => {
    return state.value?.role;
  });

  const setIasAndRole = (iasAndRole: IIasAndRoleState) => {
    state.value = iasAndRole;
  };

  return {
    ias,
    role,
    setIasAndRole
  };
});
