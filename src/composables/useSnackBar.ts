import { useSnackBarStore } from '@/stores/snackbarStore';
import { computed } from 'vue';
import type { ISnackBar } from '@/models/ISnackBar';
import { SnackbarType } from '@/models/SnackbarEnums.enum';
import eventBus from '@/plugins/eventBus';

export default function () {
  const snackBarStore = useSnackBarStore();
  const snackBar = computed(() => snackBarStore.snackbar);

  const removeMessageSnackBarAction = () => {
    snackBarStore.removeMessage();
  };
  const addMessageInfoSnackBarAction = (message: string) => {
    snackBarStore.addMessage(message, SnackbarType.Info);
    eventBus.emit('open-snack-bar');
  };

  const addMessageErrorSnackBarAction = (message: string) => {
    snackBarStore.addMessage(message, SnackbarType.Error);
    eventBus.emit('open-snack-bar');
  };
  const addMessageWarningSnackBarAction = (message: string) => {
    snackBarStore.addMessage(message, SnackbarType.Warning);
    eventBus.emit('open-snack-bar');
  };
  const addMessageSuccesSnackBarAction = (message: string) => {
    snackBarStore.addMessage(message, SnackbarType.Success);
    eventBus.emit('open-snack-bar');
  };

  const addSnackBarAction = (snackbar: ISnackBar) => {
    snackBarStore.addSnackbar(snackbar);
    eventBus.emit('open-snack-bar');
  };

  return {
    snackBar,
    removeMessageSnackBarAction,
    addMessageInfoSnackBarAction,
    addMessageErrorSnackBarAction,
    addMessageWarningSnackBarAction,
    addMessageSuccesSnackBarAction,
    addSnackBarAction
  };
}
