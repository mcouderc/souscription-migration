import { computed } from 'vue';
import { useLoaderStore } from '@/stores/loaderStore';
import type { ILoader } from '@/models/ILoader';

export default function () {
  const LoaderStore = useLoaderStore();

  const loaderParams = computed(() => LoaderStore.loaderGlobal);
  const setLoaderGlobal = (loaderParam: ILoader) => {
    LoaderStore.setLoaderGlobal(loaderParam);
  };

  return {
    loaderParams,
    setLoaderGlobal
  };
}
