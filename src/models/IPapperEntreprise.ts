export default interface IPapperEntreprise {
  siren: string;
  siren_formate: string;
  nom_entreprise: string;
  personne_morale: boolean;
  denomination: string;
  nom: string;
  label: string;
  prenom: string;
  sexe: string;
  code_naf: string;
  libelle_code_naf: string;
  domaine_activite: string;
  conventions_collectives: IConventionCollective[];
  date_creation: string;
  date_creation_formate: string;
  entreprise_cessee: boolean;
  date_cessation: string;
  entreprise_employeuse: boolean;
  categorie_juridique: string;
  forme_juridique: string;
  effectif: string;
  effectif_min: number;
  effectif_max: number;
  tranche_effectif: string;
  annee_effectif: number;
  capital: number;
  statut_rcs: string;
  siege: IEtablissement;
  diffusable: boolean;
  sigle: string;
  objet_social: string;
  capital_formate: string;
  capital_actuel_si_variable: string;
  devise_capital: string;
  numero_rcs: string;
  date_cloture_exercice: string;
  date_cloture_exercice_exceptionnelle: string;
  date_cloture_exercice_exceptionnelle_formate: string;
  prochaine_date_cloture_exercice: string;
  prochaine_date_cloture_exercice_formate: string;
  economie_sociale_solidaire: boolean;
  duree_personne_morale: string;
  dernier_traitement: string;
  derniere_mise_a_jour_sirene: string;
  derniere_mise_a_jour_rcs: string;
  greffe: string;
  code_greffe: string;
  date_immatriculation_rcs: string;
  date_premiere_immatriculation_rcs: string;
  date_debut_activite: string;
  date_debut_premiere_activite: string;
  date_radiation_rcs: string;
  numero_tva_intracommunautaire: string;
  validite_tva_intracommunautaire: boolean;
  associe_unique: boolean;
  etablissements: IEtablissement[];
}

export interface IConventionCollective {
  nom: string;
  idcc: number;
  confirmee: boolean;
}
export interface ICesseur {
  siret: string;
  date: string;
  transfert_siege: boolean;
  continuite_economique: boolean;
}

export interface IEtablissement {
  siret: string;
  siret_formate: string;
  nic: string;
  code_postal: string;
  ville: string;
  pays: string;
  code_pays: string;
  latitude: number;
  longitude: number;
  etablissement_cesse: boolean;
  siege: boolean;
  etablissement_employeur: boolean;
  effectif: string;
  effectif_min: number;
  effectif_max: number;
  tranche_effectif: string;
  annee_effectif: number;
  code_naf: string;
  libelle_code_naf: string;
  date_de_creation: string;
  numero_voie: number;
  indice_repetition: string;
  type_voie: string;
  libelle_voie: string;
  complement_adresse: string;
  adresse_ligne_1: string;
  adresse_ligne_2: string;
  date_cessation: string;
  enseigne: string;
  nom_commercial: string;
  domiciliation: {
    nom: string;
    siren: string;
  };
  predecesseurs: ICesseur[];
  successeurs: ICesseur[];
}
