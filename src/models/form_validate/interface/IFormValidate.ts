import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur';
import type { IRepresentePar } from '@/models/form_validate/interface/IRepresentePar';
import type { IBeneficiaire } from '@/models/form_validate/interface/IBeneficiaire';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import type { IAntecedant } from '@/models/form_validate/interface/IAntecedant';
import type { IFilialeValidate } from './IFilialeValidate';

export interface IFormValidate {
  souscripteur: ISouscripteur;
  representePar: IRepresentePar;
  beneficiaire: IBeneficiaire;
  descriptionRisque: IDescriptionRisque;
  antecedent: IAntecedant;
  filiale: IFilialeValidate;
}
