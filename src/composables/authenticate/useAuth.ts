import useSnackBar from '@/composables/useSnackBar';
import { getConnexionApi } from '@/plugins/open-api';
import { useAuthStore } from '@/stores/authStore';
import type { RefreshToken } from 'open-api-espace-partenaire-souscription-typescript';
import type { UserInformation } from 'open-api-souscription-typescript';
import { computed } from 'vue';
import useIasAndRole from './useIasAndRole';
import usePermissionMatrix from './usePermissionMatrix';
import useUser from './useUser';

export default function () {
  const authStore = useAuthStore();
  const { roleStore } = useIasAndRole();
  const { roles } = usePermissionMatrix();
  const { setUser, deleteUser } = useUser();
  const { addMessageErrorSnackBarAction } = useSnackBar();

  const authTokenComputed = computed(() => authStore.authTokenComputed);
  const authRefreshTokenComputed = computed(() => authStore.authRefreshTokenComputed);
  const isAuthenticatedComputed = computed(() => authStore.isAuthenticatedComputed);

  const login = async (_codeIa?: string): Promise<UserInformation> => {
    const tokenResponse: { token: string; tokenRefresh: string } = _codeIa
      ? await apiCallGetTokenWithIa(_codeIa)
      : await apiCallGetToken();

    authStore.setAuthToken(tokenResponse);
    authStore.setIsAuthenticated(true);
    return setUser();
  };

  const logout = async (): Promise<void> => {
    authStore.deleteAuthToken();
    authStore.setIsAuthenticated(false);
    return deleteUser();
  };

  const relog = async (ia?: string): Promise<UserInformation> => {
    if (roleStore.value !== roles.roleBroker) {
      return logout().then(() => login(ia));
    }
  };

  const apiCallGetToken = async (): Promise<{ token: string; tokenRefresh: string }> => {
    const tokenResponse = await getConnexionApi().getToken();
    if (!tokenResponse.data.token) {
      const errorMSg = '[App][getToken] Token null ou undefined.';
      addMessageErrorSnackBarAction(errorMSg);
      throw new Error(errorMSg);
    }

    return { token: tokenResponse.data.token, tokenRefresh: tokenResponse.data.refresh_token };
  };

  const apiCallGetTokenWithIa = async (
    iaCode: string
  ): Promise<{ token: string; tokenRefresh: string }> => {
    const tokenResponse = await getConnexionApi().getTokenCourtier(iaCode);
    if (!tokenResponse.data.token) {
      const errorMSg = '[App][getToken] Token null ou undefined.';
      addMessageErrorSnackBarAction(errorMSg);
      throw new Error(errorMSg);
    }

    return { token: tokenResponse.data.token, tokenRefresh: tokenResponse.data.refresh_token };
  };

  const refreshToken = async (ia?: string) => {
    const tokenResponse = await apiCallRefreshToken(ia);

    authStore.setAuthToken(tokenResponse);
    authStore.setIsAuthenticated(true);
    await setUser();
    return tokenResponse;
  };

  const apiCallRefreshToken = async (
    ia?: string
  ): Promise<{ token: string; tokenRefresh: string }> => {
    const refreshToken: RefreshToken = { refresh_token: authStore.authRefreshTokenComputed };
    const refreshTokenResponse = await getConnexionApi().getRefreshTokenV2(refreshToken, ia);
    if (!refreshTokenResponse) {
      throw new Error('[useAuth][apiCallRefreshToken] Token null ou undefined.');
    }

    return {
      token: refreshTokenResponse.data.token,
      tokenRefresh: refreshTokenResponse.data.refresh_token
    };
  };

  return {
    authTokenComputed,
    authRefreshTokenComputed,
    isAuthenticatedComputed,
    login,
    logout,
    relog,
    refreshToken
  };
}
