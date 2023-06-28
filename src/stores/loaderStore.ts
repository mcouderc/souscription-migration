import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ILoader } from '@/models/ILoader';

export const useLoaderStore = defineStore('loaderStore', () => {
  const state = ref<ILoader>({
    isLoading: false,
    loaderLabel: ''
  });

  const loaderGlobal = computed<ILoader>(() => {
    return state.value;
  });

  const setLoaderGlobal = (loaderParam: ILoader) => {
    state.value = loaderParam;
  };

  return {
    loaderGlobal,
    setLoaderGlobal
  };
});
