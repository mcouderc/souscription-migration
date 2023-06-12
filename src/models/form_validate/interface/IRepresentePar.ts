import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface IRepresentePar {
  display: boolean; // gere l'affichage ou nom de cette interface
  civilite?: IChampValidate;
  nom?: IChampValidate;
  prenom?: IChampValidate;
  qualite?: IChampValidate;
  raisonSociale?: IChampValidate;
}
