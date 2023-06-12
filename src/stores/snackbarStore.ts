import { SnackbarTime, SnackbarType } from '@/models/SnackbarEnums.enum';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ISnackBar } from '@/models/ISnackBar';

export interface ISnackbarSate {
  snackbar: ISnackBar;
}

export const useSnackBarStore = defineStore('snackbar', () => {
  const state = ref({
    snackbar: {
      message: '',
      type: SnackbarType.Info,
      time: SnackbarTime.Default,
      positionTop: false
    }
  } as ISnackbarSate);
  const snackbar = computed(() => {
    return state.value.snackbar;
  });

  function addSnackbar(msg: ISnackBar) {
    state.value.snackbar = msg;
  }

  function addMessage(msg: string, type?: SnackbarType) {
    state.value.snackbar.message = msg;
    state.value.snackbar.type = type ?? SnackbarType.Info;
  }

  function removeMessage() {
    state.value.snackbar.message = '';
  }
  return {
    snackbar,
    addSnackbar,
    addMessage,
    removeMessage
  };
});
