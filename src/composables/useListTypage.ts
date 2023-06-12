import { useListTypageStore } from '@/stores/listTypageStore';
import { computed } from 'vue';

export default function () {
  const listTypageStore = useListTypageStore();

  const listTypage = computed(() => listTypageStore.listTypage);

  const setListTypage = (listTypage: string[]) => {
    listTypageStore.setListTypage(listTypage);
  };

  return {
    listTypage,
    setListTypage
  };
}
