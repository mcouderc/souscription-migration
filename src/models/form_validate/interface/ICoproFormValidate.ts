import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur';
import type { IRepresentePar } from '@/models/form_validate/interface/IRepresentePar';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import type { IAntecedant } from '@/models/form_validate/interface/IAntecedant';
import type { IBeneficiaire } from './IBeneficiaire';

export interface ICoproFormValidate {
  souscripteur: ISouscripteur;
  representePar: IRepresentePar;
  beneficiaire: IBeneficiaire;
  descriptionRisque: IDescriptionRisque;
  antecedent: IAntecedant;
}
