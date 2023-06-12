import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';
import type { IScisValidate } from '@/models/form_validate/interface/IScisValidate';
import type { IResidenceSecondaireValidate } from '@/models/form_validate/interface/IResidenceSecondaireValidate';
import type { IBienValidate } from '@/models/form_validate/interface/IBienValidate';

export interface IDescriptionRisque {
  display: boolean; // gere l'affichage ou nom de cette interface
  /**
   * COMMUN
   */
  nombreSalaries?: IChampValidate;
  /**
   * ASL
   */
  nombreCoproVerticales?: IChampValidate;

  nombreVillasIndividuelles?: IChampValidate;
  typeGestion?: IChampValidate;
  groupeAsl?: IChampValidate;
  /**
   * PROFESSIONNEL
   */
  codeNaf?: IChampValidate;
  activitePrincipal?: IChampValidate;
  dateCreation?: IChampValidate;
  montantCaHtTotal?: IChampValidate;
  exerciceDeReference?: IChampValidate;
  nombreVehicules?: IChampValidate;
  nombreEtablissementsSecondaires?: IChampValidate;
  activitepricipaleAppartencaeSCI?: IChampValidate;
  locauxSciAvecPartsSouscripteur?: IChampValidate;

  scis?: IScisValidate;
  /**
   * AGRICOLE
   */
  commercialisationDirecte?: IChampValidate;
  activiteAccessoireDiversificationAgricole?: IChampValidate;
  surfaceExploitation?: IChampValidate;
  nombreVehiculesEtEnginsAgricoles?: IChampValidate;
  nombrePersonneTravaillantSurExploitation?: IChampValidate;
  dontSalariesPermanent?: IChampValidate;
  /**
   * ASSOCIATION
   */
  numInscription?: IChampValidate;
  activiteStatutairePrecise?: IChampValidate;
  budgetHT?: IChampValidate;
  secteurActivite?: IChampValidate;
  typeAssociation?: IChampValidate;
  nombreAdherent?: IChampValidate;
  /**
   * PNO
   */
  nombreLotsHabitations?: IChampValidate;
  nombreLotsProfessionnels?: IChampValidate;
  nombreLotsCommerciaux?: IChampValidate;
  nombreLotsLocationsMeublees?: IChampValidate;
  nombreLotsGaragesCaves?: IChampValidate;
  nombreLotsRuraux?: IChampValidate;
  nombreLotsTerrainsNus?: IChampValidate;
  nombreLotsLocationsSaisonsOccasionnelles?: IChampValidate;
  montantLoyersAnnuels?: IChampValidate;
  bien: IBienValidate;
  /**
   * COPRO
   */
  presenceLotsHabitations?: IChampValidate;
  typeCopropriete?: IChampValidate;
  superficieCopro?: IChampValidate;
  nombreLots?: IChampValidate;
  typeGestionCopro?: IChampValidate;

  /**
   * PARTICULIER
   */
  residencesSecondaires?: IResidenceSecondaireValidate;
  nombreResidencesSecondaires?: IChampValidate;
}
