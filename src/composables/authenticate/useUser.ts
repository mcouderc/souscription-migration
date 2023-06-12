import { getUserInformationApi } from '@/plugins/open-api';
import { useUserInformationStore } from '@/stores/userStore';
import type {
  UserInformation,
  UserInformationUserIndicateurs
} from 'open-api-souscription-typescript';
import { computed } from 'vue';
import useSnackBar from '../../composables/useSnackBar';

export default function () {
  const userInformationStore = useUserInformationStore();

  const user = computed(() => userInformationStore.user);
  const { addMessageErrorSnackBarAction } = useSnackBar();

  const setUser = async (): Promise<UserInformation> => {
    const userResponse = await apiCallGetUserInfo();
    userInformationStore.setUser(userResponse);
    return userResponse;
  };

  const deleteUser = async (): Promise<void> => {
    userInformationStore.deleteUser();
  };

  const apiCallGetUserInfo = async (): Promise<UserInformation> => {
    try {
      const userResult = await getUserInformationApi().getUserInfo();
      if (!userResult) {
        const errorMSg = '[App][setUserInfo] <userResult> is null or undefined';
        addMessageErrorSnackBarAction(errorMSg);
        throw new Error(errorMSg);
      }

      return userResult.data;
    } catch (e) {
      const titleError =
        '[useUser][apiCallGetUserInfo] Erreur lors de la récuperation des information utilisateur\n';
      const messageError = '[useUser][apiCallGetUserInfo] ErrorMessage = ' + e;
      addMessageErrorSnackBarAction(titleError + messageError);
    }
  };

  const apiCallGetUserInfoIndicateur = async (): Promise<UserInformationUserIndicateurs> => {
    try {
      const result = await getUserInformationApi().getUserInfoIndicateur();
      if (!result) {
        throw new Error('[useUser][apiCallGetUserInfoIndicateur] result is null or undefined.\n');
      }
      return result.data;
    } catch (e) {
      const messageError = '[useUser][apiCallGetUserInfoIndicateur] ErrorMessage = ' + e + '\n';
      addMessageErrorSnackBarAction(messageError);
    }
  };

  return {
    user,
    setUser,
    deleteUser,
    apiCallGetUserInfoIndicateur
  };
}
