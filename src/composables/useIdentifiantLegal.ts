import { computed } from 'vue';
import { useIdentifiantLegalStore } from '@/stores/identifiantLegalStore';

export default function () {
  const identifiantLegalStore = useIdentifiantLegalStore();
  const pappersProfile = computed(() => identifiantLegalStore.pappersProfile);

  const getPapersAction = ({ headers, limit, target, query }) => {
    identifiantLegalStore.getPapers({ headers, limit, target, query });
  };

  return {
    pappersProfile,
    getPapersAction
  };
}
