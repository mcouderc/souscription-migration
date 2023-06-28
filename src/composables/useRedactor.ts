import { useRedactorStore } from '@/stores/useRedactorStore';
import { computed } from 'vue';

export default function () {
  const redactorStore = useRedactorStore();
  const redactor = computed(() => redactorStore.redactors);

  const getRedactorsAction = async () => {
    await redactorStore.getRedactors();
  };

  const getRedactorFilteredComputed = computed(() => {
    return redactor.value.filter((item) => item);
  });

  return {
    redactor,
    getRedactorsAction,
    getRedactorFilteredComputed
  };
}
