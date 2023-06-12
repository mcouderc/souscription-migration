import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface IUserInformationSate {
  listTypage: string[];
}

export const useListTypageStore = defineStore('listTypage', () => {
  const state = ref<IUserInformationSate>({
    listTypage: []
  });

  const listTypage = computed(() => {
    return state.value.listTypage;
  });

  const setListTypage = (listTypage: string[]) => {
    state.value.listTypage = listTypage;
  };

  return {
    listTypage,
    setListTypage
  };
});
