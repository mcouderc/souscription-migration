import { computed } from 'vue';
import { useFormeJuridiqueStore } from '@/stores/formeJuridiqueStore';

export default function () {
  const formeJuridiqueStore = useFormeJuridiqueStore();

  const formeJuridique = computed(() => formeJuridiqueStore.formeJuridique);

  const setFormeJuridiqueAction = (formeJuridique: any[]) => {
    formeJuridiqueStore.setFormeJuridique(formeJuridique);
  };

  return {
    formeJuridique,
    setFormeJuridiqueAction
  };
}
