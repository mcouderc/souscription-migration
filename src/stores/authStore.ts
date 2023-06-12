import useIasAndRole from '@/composables/authenticate/useIasAndRole';
import usePermissionMatrix from '@/composables/authenticate/usePermissionMatrix';
import useUser from '@/composables/authenticate/useUser';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface IAuthState {
  authToken: string;
  authRefreshToken: string;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('authStore', () => {
  const { roleStore } = useIasAndRole();
  const { setUser, deleteUser } = useUser();
  const { roles } = usePermissionMatrix();
  const state = ref<IAuthState>({ authToken: '', authRefreshToken: '', isAuthenticated: false });

  const authTokenComputed = computed<string>(() => {
    return state.value.authToken;
  });

  const authRefreshTokenComputed = computed<string>(() => {
    return state.value.authRefreshToken;
  });

  const isAuthenticatedComputed = computed<boolean>(() => {
    return state.value.isAuthenticated;
  });

  const setIsAuthenticated = (isAuthenticated: boolean): void => {
    state.value.isAuthenticated = isAuthenticated;
  };

  const setAuthToken = ({ token, tokenRefresh }: { token: string; tokenRefresh: string }): void => {
    state.value.authToken = token;
    sessionStorage.setItem('sessionStorageAuthToken', token);
    state.value.authRefreshToken = tokenRefresh;
    sessionStorage.setItem('sessionStorageAuthRefreshToken', tokenRefresh);
  };

  const deleteAuthToken = (): void => {
    state.value.authToken = '';
    state.value.authRefreshToken = '';
    sessionStorage.removeItem('sessionStorageAuthToken');
    sessionStorage.removeItem('sessionStorageAuthRefreshToken');
  };

  const initIsAuthenticated = (): void => {
    const token = sessionStorage.getItem('sessionStorageAuthToken');
    const tokenRefresh = sessionStorage.getItem('sessionStorageAuthRefreshToken');
    if (token && tokenRefresh) {
      if (roleStore.value !== roles.roleBroker) {
        deleteAuthToken();
        deleteUser();
        state.value.isAuthenticated = false;
        return;
      }
      setAuthToken({ token, tokenRefresh });
      setUser();
      state.value.isAuthenticated = true;
      return;
    }

    state.value.isAuthenticated = false;
  };

  initIsAuthenticated();

  return {
    authTokenComputed,
    authRefreshTokenComputed,
    isAuthenticatedComputed,
    setIsAuthenticated,
    setAuthToken,
    deleteAuthToken
  };
});
