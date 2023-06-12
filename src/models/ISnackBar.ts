import type { SnackbarTime, SnackbarType } from '@/models/SnackbarEnums.enum';

export interface ISnackBar {
  message: string;
  type: SnackbarType;
  time?: SnackbarTime;
  positionTop?: boolean;
}
