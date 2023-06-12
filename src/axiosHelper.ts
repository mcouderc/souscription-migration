import useAuth from '@/composables/authenticate/useAuth';
import axios, { type AxiosInstance } from 'axios';

class AxiosHelper {
  /**vi
   * L'instance d'axios.
   */
  public axiosInstance: AxiosInstance = AxiosHelper.createInstance();

  private static createInstance(): AxiosInstance {
    const axiosInstance = axios.create();
    let firstRefresh = false;

    axiosInstance.interceptors.request.use(
      async (config) => config,
      (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;
        if (response && response.status === 401 && !config.retry && !firstRefresh) {
          // Si le token est expiré on rappelle l'autologin et on retente la requête en erreur.
          config.retry = true;
          firstRefresh = true;

          try {
            const { refreshToken } = useAuth();
            const tokenResponse = await refreshToken();
            axiosInstance.defaults.headers['Authorization'] = tokenResponse.token;
            return axiosInstance(config);
          } catch (_error: any) {
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }
            return Promise.reject(_error);
          }
        }

        // TODO: optimize itma
        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }

  /**
   * Getter de l'instance axios.
   */
  public get axios(): AxiosInstance {
    const { authTokenComputed } = useAuth();

    if (this.axiosInstance.defaults.headers) {
      this.axiosInstance.defaults.headers['Authorization'] = authTokenComputed.value;
    }
    return this.axiosInstance;
  }
}
const instance: AxiosHelper = new AxiosHelper();

const axiosInstance = (): AxiosInstance => instance.axios;

export default axiosInstance;
