import { useCodeNafStore } from '@/stores/codeNafStore';
import { computed } from 'vue';

export default function () {
  const codeNafStore = useCodeNafStore();
  const codeNafs = computed(() => codeNafStore.codeNafs);

  return {
    codeNafs
  };
}
