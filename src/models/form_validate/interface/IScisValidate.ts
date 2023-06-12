import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface IScisValidate {
  display: boolean; // gere l'affichage ou nom de cette interface
  raisonSociale?: IChampValidate;
  identifiantLegal?: IChampValidate;
  adresse1?: IChampValidate;
  adresse2?: IChampValidate;
  adresse3?: IChampValidate;
  codePostal?: IChampValidate;
  ville?: IChampValidate;
  pays?: IChampValidate;
  typage?: string;
}
