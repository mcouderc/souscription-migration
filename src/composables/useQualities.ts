import { useQualitiesStore } from '@/stores/qualitiesStore';
import { computed } from 'vue';

export default function () {
  const qualitiesStore = useQualitiesStore();
  const qualities = computed(() => qualitiesStore.qualities);
  const setQualities = (qualities: string[]) => {
    qualitiesStore.setQualities(qualities);
  };

  return {
    qualities,
    setQualities
  };
}
