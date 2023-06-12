import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface IResidenceSecondaireValidate {
  display: boolean; // gere l'affichage ou nom de cette interface
  adresse1?: IChampValidate;
  adresse2?: IChampValidate;
  adresse3?: IChampValidate;
  codePostal?: IChampValidate;
  ville?: IChampValidate;
  pays?: IChampValidate;
  typage?: string;
}
