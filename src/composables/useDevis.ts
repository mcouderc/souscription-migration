import { computed } from 'vue';
import { useDevisStore } from '@/stores/devisStore';

import type {
  Adresse,
  DevisEntreprise,
  DevisEntrepriseStatutEnum,
  DevisEntrepriseTypeGestionAslEnum,
  DevisEntrepriseTypeRisqueEnum,
  FormuleSouscrite,
  PersonneMorale,
  PersonnePhysique,
  ValorisationCritere,
  DevisSouscripteurPersonnePhysique,
  DevisEntrepriseTypeCoproprieteEnum,
  DevisEntrepriseTypeGestionCoproEnum
} from 'open-api-souscription-typescript';

export default function useDevis() {
  const devisStore = useDevisStore();
  const model = {
    id: null as number,
    numeroDevis: null as string,
    numeroContrat: null as string,
    codePays: '' as string,
    statut: '' as DevisEntrepriseStatutEnum,
    typeRisque: '' as DevisEntrepriseTypeRisqueEnum,
    emisPar: null as string,
    dateCreationTechnique: null as string,
    dateCreation: null as string,
    dateUpdate: null as string,
    dateEffet: '' as string,
    dateFinValidite: null as string,
    primeTtc: null as number,
    primeHt: null as number,
    valorisationCritere: null as Array<ValorisationCritere>,
    formuleSouscrite: {} as FormuleSouscrite,
    souscripteurPersonneMorale: {
      identifiantLegal: '',
      raisonSociale: '',
      adresse: {
        adresse1: '',
        adresse2: '',
        adresse3: '',
        codePostal: '',
        ville: '',
        pays: ''
      } as Adresse
    } as PersonneMorale,
    beneficiairePersonneMorale: {
      identifiantLegal: '',
      adresse: {
        adresse1: '',
        adresse2: '',
        adresse3: '',
        codePostal: '',
        ville: ''
      } as Adresse
    } as PersonneMorale,
    representantPersonnePhysique: {
      civilite: '' as string,
      nom: '' as string,
      prenom: '' as string,
      qualiteProfessionnelle: null as string,
      dateNaissance: null as string,
      lieuNaissance: '' as string,
      situationProfessionnelle: null as string,
      telephone1: '' as string,
      telephone2: '' as string,
      mail: '' as string,
      adresse: {
        adresse1: '',
        adresse2: '',
        adresse3: '',
        codePostal: '',
        ville: ''
      } as Adresse
    } as DevisSouscripteurPersonnePhysique,
    souscripteurPersonnePhysique: {
      civilite: '' as string,
      nom: '' as string,
      prenom: '' as string,
      qualiteProfessionnelle: null as string,
      dateNaissance: null as string,
      lieuNaissance: '' as string,
      situationProfessionnelle: null as string,
      telephone1: '' as string,
      telephone2: '' as string,
      mail: '' as string,
      adresse: {
        adresse1: '',
        adresse2: '',
        adresse3: '',
        codePostal: '',
        ville: ''
      } as Adresse
    } as PersonnePhysique,
    filiales: null as Array<PersonneMorale>,
    scis: null as Array<PersonneMorale>,
    exerciceDeReference: null as number,
    montantCaHtTotal: null as number,
    nombreEtablissementsSecondaires: 0 as number,
    nombreSalaries: null as number,
    nombreVehicules: null as number,
    nombreResidencesSecondaires: 0 as number,
    nombreProcedures: null as number,
    nombreProceduresEnDefense: null as number,
    nombreProceduresEnDemande: null as number,
    assuranceDejaSouscrite: null as boolean,
    resiliationAssureur: false as boolean,
    redressementJudiciaire: null as boolean,
    nombreCoproVerticales: null as number,
    nombreVillasIndividuelles: null as number,
    groupeAsl: false as boolean,
    typeGestionAsl: null as DevisEntrepriseTypeGestionAslEnum,
    commercialisationDirecte: false as boolean,
    activiteAccessoire: false as boolean,
    surfaceExploitation: 0 as number,
    nombreTravailleursExploitation: null as number,
    residencesSecondaires: null as Array<Adresse>,
    presenceLotsHabitations: false as boolean,
    typeCopropriete: null as DevisEntrepriseTypeCoproprieteEnum,
    superficieCopro: null as string,
    nombreLots: null as number,
    typeGestionCopro: null as DevisEntrepriseTypeGestionCoproEnum,
    numClientCeryx: null as string | number,
    locauxSciAvecPartsSouscripteur: null as boolean
  };
  const devis = computed(() => devisStore.devis);

  const setDevisAction = (devis: DevisEntreprise) => {
    devisStore.setDevis(devis);
  };

  const initDevisAction = () => {
    return devisStore.initDevis(model);
  };

  const getModel = () => {
    return model;
  };

  return {
    devis,
    setDevisAction,
    initDevisAction,
    getModel
  };
}
