export interface IChampValidate {
  visible: boolean;
  title?: string;
  emis: {
    required: boolean;
    disable?: boolean;
  };
  transformation: {
    required: boolean;
    disable?: boolean;
  };
  typage?: string;
  checkNonEmptyFields?: boolean;
}
