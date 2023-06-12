export default () => {
  /**
   * PROFESIONNAL
   */
  const PROFESSIONAL_STEPS_1 = [
    'date-d-effet',
    'information',
    'tarification',
    'info-complementaire'
  ];
  const PROFESSIONAL_STEPS_2 = [
    'validation-date-d-effet',
    'validation-info-complementaire',
    'paiement',
    'signature'
  ];

  /**
   * PARTICULAR
   */
  const PARTICULAR_STEPS_1 = ['date-d-effet', 'tarification', 'info-complementaire'];
  const PARTICULAR_STEPS_2 = [
    'validation-date-d-effet',
    'validation-info-complementaire',
    'paiement',
    'signature'
  ];

  /**
   * ASSOCIATION
   */
  const ASSOCIATION_STEPS_1 = ['date-d-effet', 'tarification', 'info-complementaire'];
  const ASSOCIATION_STEPS_2 = [
    'validation-date-d-effet',
    'validation-info-complementaire',
    'paiement',
    'signature'
  ];

  /**
   * AGRICOLE
   */
  const AGRICOLE_STEPS_1 = ['date-d-effet', 'tarification', 'info-complementaire'];
  const AGRICOLE_STEPS_2 = [
    'validation-date-d-effet',
    'validation-info-complementaire',
    'paiement',
    'signature'
  ];

  /**
   * PNO
   */
  const PNO_STEPS_1 = ['date-d-effet', 'tarification', 'info-complementaire'];
  const PNO_STEPS_2 = [
    'validation-date-d-effet',
    'validation-info-complementaire',
    'paiement',
    'signature'
  ];

  /**
   * COPRO
   */
  const COPRO_STEPS_1 = ['date-d-effet', 'tarification', 'addClient', 'info-complementaire'];
  const COPRO_STEPS_2 = [
    'validation-date-d-effet',
    'validation-info-complementaire',
    'paiement',
    'signature'
  ];

  const PROFESSIONEL = 'PROFESSIONNEL_ENTREPRISE';
  const AGRICOLE = 'AGRICOLE';
  const PARTICULIER = 'PARTICULIER';
  const ASSOCIATION = 'ASSOCIATION';
  const ASL = 'ASL';
  const PNO = 'PROPRIETAIRE';
  const COPRO = 'COPROPRIETE';
  const NON_CONFIE = 'NON_CONFIE';
  const TYPE_ASSOCIATION = ['Employeur', 'Non employeur'];
  const TYPE_COPROPRIETE = ['Horizontale', 'Verticale'];
  const TYPE_GESTION = ['Président ASL', 'Syndic professionnel'];
  const CIVILITE = ['Monsieur', 'Madame', 'Madame, Monsieur'];
  const COPIE_EXPIRE = 'copieExpire';
  const RESUME_DEVIS = 'ResumeDevis';
  const DESCRIPTION_DEVIS = 'DescriptionRisque';
  const PANEL_INITIAL_OPEN = [0, 1];

  const COUNTRY_KEY = {
    FR: 14,
    BE: 10,
    MC: 8,
    AD: 8,
    LX: 7,
    '': 0
  };

  const PAYMENT_MEANS_CONFIE = {
    PRELEVEMENT_CFDP: 'Prélèvement par CFDP',
    PRELEVEMENT_COURTIER: 'Prélèvement par le courtier',
    CHEQUE: 'Chèque',
    VIREMENT: 'Virement'
  };

  const PAYMENT_MEANS_NON_CONFIE = {
    PRELEVEMENT_CFDP: 'Prélèvement par CFDP',
    CHEQUE: 'Chèque',
    VIREMENT: 'Virement'
  };

  const SIGNATURE_ACTIONS = {
    RAISE: 'Relancer',
    ABANDON: 'Abandonner',
    DOWNLOAD: 'Télécharger'
  };
  const REGEX = {
    PHONE:
      /^(?:(?:\+|00)[3][1-7][\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/,
    EMAIL: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$',
    CODE_POSTAL: {
      AD: '^AD[0-9]{3}$',
      LX: '^L-[0-9]{4}$',
      MC: '^98000$',
      BE: '^[0-9]{4}$',
      FR: '^[0-9]{5}$'
    },
    IDENTIFIANT_LEGAL: '^[0-9]{14}$',
    NUMBER: '^[0-9][0-9]*$',
    DATE: /^(((\d{4}(-)((0[13578](-)|1[02](-))(0[1-9]|[12]\d|3[01])|(0[13456789](-)|1[012](-))(0[1-9]|[12]\d|30)|02(-)(0[1-9]|1\d|2[0-8])))|((([02468][048]|[13579][26])00|\d{2}([13579][26]|0[48]|[2468][048])))(-)02(-)29)){0,10}$/,
    COUNTRYS: {
      AD: '^[A-Z][-]?[0-9]{6}[-]?[A-Z]$',
      LX: '^[B][0-9]{6}$',
      MC: '^[0-9]{2}[PS][0-9]{5}$',
      BE: '^[01][.]?[0-9][.]?[0-9][.]?[0-9][.]?[0-9][.]?[0-9][.]?[0-9][.]?[0-9][.]?[0-9][.]?[0-9][.]?$',
      FR: '^[0-9]{5}$'
    },
    IBAN: '^([A-Z]{2}[ -]?[0-9]{2})(?=(?:[ -]?[A-Z0-9]){10,30}$)((?:[ -]?[A-Z0-9]{3,5}){2,7})([ -]?[A-Z0-9]{1,3})?$',
    BIC: '^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$'
  };
  const COUNTRYS = {
    AD: 'AD',
    LX: 'LX',
    MC: 'MC',
    BE: 'BE',
    FR: 'FR'
  };
  const SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE = 'souscripteurPersonnePhysique.';
  const SOUSCRITPEUR_BASE_TYPAGE_MORALE = 'souscripteurPersonneMorale.';

  const VALUE_BY_DEFAULT_ECHEANCE_PRINCIPALE = '01/01';

  const CLAUSES_TYPE_MONTANT_CONTRACTUEL = 'MONTANT_CONTRACTUEL';

  const MOIS_INFO_PAIEMENT = {
    '01/01': 'Janvier',
    '01/02': 'Février',
    '01/03': 'Mars',
    '01/04': 'Avril',
    '01/05': 'Mai',
    '01/06': 'Juin',
    '01/07': 'Juillet',
    '01/08': 'Août',
    '01/09': 'Septembre',
    '01/10': 'Octobre',
    '01/11': 'Novembre',
    '01/12': 'Décembre'
  };

  const PANEL_OPEN = [0, 1, 2, 3, 4, 5, 6];

  const TYPE_DOC_IPID = 'IPID';
  const TYPE_DOC_DEVIS = 'DEVIS';
  const HASH_UNION = 'hashunion';
  const UID_UNION = 'uidunion';

  return {
    PROFESSIONAL_STEPS_1,
    PROFESSIONAL_STEPS_2,
    PARTICULAR_STEPS_1,
    PARTICULAR_STEPS_2,
    AGRICOLE_STEPS_1,
    AGRICOLE_STEPS_2,
    PROFESSIONEL,
    AGRICOLE,
    PARTICULIER,
    ASSOCIATION,
    ASSOCIATION_STEPS_1,
    ASSOCIATION_STEPS_2,
    ASL,
    PNO,
    TYPE_ASSOCIATION,
    TYPE_COPROPRIETE,
    TYPE_GESTION,
    CIVILITE,
    COUNTRY_KEY,
    PAYMENT_MEANS_CONFIE,
    PAYMENT_MEANS_NON_CONFIE,
    SIGNATURE_ACTIONS,
    REGEX,
    PNO_STEPS_1,
    PNO_STEPS_2,
    COPIE_EXPIRE,
    COPRO_STEPS_1,
    COPRO_STEPS_2,
    COPRO,
    COUNTRYS,
    RESUME_DEVIS,
    DESCRIPTION_DEVIS,
    PANEL_INITIAL_OPEN,
    SOUSCRITPEUR_BASE_TYPAGE_PHYSIQUE,
    SOUSCRITPEUR_BASE_TYPAGE_MORALE,
    VALUE_BY_DEFAULT_ECHEANCE_PRINCIPALE,
    MOIS_INFO_PAIEMENT,
    CLAUSES_TYPE_MONTANT_CONTRACTUEL,
    PANEL_OPEN,
    NON_CONFIE,
    TYPE_DOC_IPID,
    TYPE_DOC_DEVIS,
    HASH_UNION,
    UID_UNION
  };
};
