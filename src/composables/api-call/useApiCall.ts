import { ref } from 'vue';

interface IParams {
  route: any;
  isMounted?: boolean;
}

export function useApiCall<T>(params: IParams) {
  const isLoading = ref<boolean>(false);
  const isError = ref<boolean>(false);
  const errorMessage = ref(null);
  const status = ref<number>(null);
  const data = ref<T>();

  const doFetch = async (...args: any) => {
    isLoading.value = true;
    return params
      .route(...args)
      .then((result: any) => {
        data.value = result.data;
        status.value = result.status;
      })
      .catch((error: any) => {
        isError.value = true;
        errorMessage.value = error;
        status.value = error.status;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  if (params.isMounted) {
    doFetch();
  }
  return { isLoading, isError, errorMessage, data, status, doFetch };
}
