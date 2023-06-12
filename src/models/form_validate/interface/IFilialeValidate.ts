import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface IFilialeValidate {
  display: boolean; // gere l'affichage ou nom de cette interface
  raisonSociale?: IChampValidate;
  identifiantLegal?: IChampValidate;
  activite?: IChampValidate;
  codeNaf?: IChampValidate;
  pays?: IChampValidate;
}
