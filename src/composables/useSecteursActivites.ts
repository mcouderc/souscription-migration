import { useSecteursActivites } from '@/stores/secteursActivitesStore';
import { computed } from 'vue';

export default function () {
  const secteursActivitesStore = useSecteursActivites();
  const secteursActivites = computed(() => secteursActivitesStore.secteursActivites);
  const getSecteursActivites = (pays: string) => {
    secteursActivitesStore.getSecteursActivites(pays);
  };

  return {
    secteursActivites,
    getSecteursActivites
  };
}
