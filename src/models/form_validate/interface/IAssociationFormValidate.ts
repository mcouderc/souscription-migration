import type { ISouscripteur } from '@/models/form_validate/interface/ISouscripteur';
import type { IRepresentePar } from '@/models/form_validate/interface/IRepresentePar';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import type { IAntecedant } from '@/models/form_validate/interface/IAntecedant';

export interface IAssociationFormValidate {
  souscripteur: ISouscripteur;
  representePar: IRepresentePar;
  descriptionRisque: IDescriptionRisque;
  antecedent: IAntecedant;
}
