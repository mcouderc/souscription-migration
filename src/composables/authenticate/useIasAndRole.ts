import { getConnexionApi } from '@/plugins/open-api';
import { useIasAndRoleStore, type IIasAndRoleState } from '@/stores/iasAndRoleStore';
import { computed } from 'vue';

export default function () {
  const iasAndRoleStore = useIasAndRoleStore();

  const iasStore = computed(() => iasAndRoleStore.ias);
  const roleStore = computed(() => iasAndRoleStore.role);

  const setIasAndRole = (_iasAndRole: IIasAndRoleState) => {
    iasAndRoleStore.setIasAndRole(_iasAndRole);
  };

  const hydrateIasCodesAndRole = async (): Promise<void> => {
    try {
      const brokersResponse = await getConnexionApi().listCourtiersV3();

      if (!brokersResponse) {
        throw new Error(
          '[iasAndRole][hydrateIasCodesAndRole] <brokersResponse> null ou undefined.'
        );
      }

      setIasAndRole(brokersResponse.data);
    } catch (e) {
      const messageError = '[iasAndRole][hydrateIasCodesAndRole] ErrorMessage = ' + e;
      throw messageError;
    }
  };

  return {
    iasStore,
    roleStore,
    hydrateIasCodesAndRole
  };
}
