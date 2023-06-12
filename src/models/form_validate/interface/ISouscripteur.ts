import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface ISouscripteur {
  display: boolean; // gere l'affichage ou nom de cette interface
  isPersonneMorale: boolean;
  choixTypePersonne: boolean;
  adresse1?: IChampValidate;
  adresse2?: IChampValidate;
  adresse3?: IChampValidate;
  codePostale?: IChampValidate;
  ville?: IChampValidate;
  pays?: IChampValidate;
  telephone1?: IChampValidate;
  telephone2?: IChampValidate;
  mail?: IChampValidate;
  //personne morale
  raisonSociale?: IChampValidate;
  identifiantLegal?: IChampValidate;
  formeJuridique?: IChampValidate;
  //personne physique
  civilite?: IChampValidate;
  nom?: IChampValidate;
  prenom?: IChampValidate;
  dateNaissance?: IChampValidate;
  lieuNaissance?: IChampValidate;
}
