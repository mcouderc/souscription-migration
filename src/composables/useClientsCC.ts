import { useClientsCCStore } from '@/stores/clientsCCStore';
import { computed } from 'vue';

export default function () {
  const ClientsCCStore = useClientsCCStore();
  const clients = computed(() => ClientsCCStore.clientsCC);
  const error = computed(() => ClientsCCStore.error);
  const pending = computed(() => ClientsCCStore.pending);

  const getClientsCCAction = async () => {
    await ClientsCCStore.getClientsCC();
  };

  return {
    error,
    clients,
    pending,
    getClientsCCAction
  };
}
