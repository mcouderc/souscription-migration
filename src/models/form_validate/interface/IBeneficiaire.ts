import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface IBeneficiaire {
  display: boolean;
  nom?: IChampValidate;
  raisonSociale?: IChampValidate;
  adresse1?: IChampValidate;
  adresse2?: IChampValidate;
  adresse3?: IChampValidate;
  codePostale?: IChampValidate;
  ville?: IChampValidate;
  pays?: IChampValidate;
  numeroImmatriculation?: IChampValidate;
}
