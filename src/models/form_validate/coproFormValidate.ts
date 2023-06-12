import type { IFormValidate } from '@/models/form_validate/interface/IFormValidate';

export const CoproFormValidate: IFormValidate = {
  souscripteur: {
    display: true,
    isPersonneMorale: true,
    choixTypePersonne: false,
    raisonSociale: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'souscripteurPersonneMorale.raisonSociale',
      checkNonEmptyFields: true
    },
    identifiantLegal: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'souscripteurPersonneMorale.identifiantLegal',
      checkNonEmptyFields: false
    },
    formeJuridique: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'souscripteurPersonneMorale.formeJuridique',
      checkNonEmptyFields: true
    },
    adresse1: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true
      },
      typage: 'adresse.adresse1',
      checkNonEmptyFields: true
    },
    adresse2: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'adresse.adresse2',
      checkNonEmptyFields: false
    },
    adresse3: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'adresse.adresse3',
      checkNonEmptyFields: false
    },
    codePostale: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'adresse.codePostal',
      checkNonEmptyFields: true
    },
    ville: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'adresse.ville',
      checkNonEmptyFields: true
    },
    pays: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'adresse.pays',
      checkNonEmptyFields: true
    },
    telephone1: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: true,
        disable: false
      },
      typage: 'telephone1',
      checkNonEmptyFields: false
    },
    telephone2: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'telephone2',
      checkNonEmptyFields: false
    },
    mail: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: true,
        disable: false
      },
      typage: 'mail',
      checkNonEmptyFields: false
    },
    civilite: {
      visible: false,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      }
    },
    nom: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      }
    },
    prenom: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      }
    },
    dateNaissance: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      }
    },
    lieuNaissance: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      }
    }
  },
  representePar: {
    display: true,
    civilite: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'representantPersonnePhysique.civilite',
      checkNonEmptyFields: true
    },
    nom: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'representantPersonnePhysique.nom',
      checkNonEmptyFields: true
    },
    prenom: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'representantPersonnePhysique.prenom',
      checkNonEmptyFields: false
    },
    qualite: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'representantPersonnePhysique.qualiteProfessionnelle',
      checkNonEmptyFields: false
    },
    raisonSociale: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    }
  },
  beneficiaire: {
    display: true,
    raisonSociale: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'beneficiairePersonneMorale.raisonSociale',
      checkNonEmptyFields: true
    },
    adresse1: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'beneficiairePersonneMorale.adresse.adresse1',
      checkNonEmptyFields: true
    },
    adresse2: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'beneficiairePersonneMorale.adresse.adresse2',
      checkNonEmptyFields: false
    },
    adresse3: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'beneficiairePersonneMorale.adresse.adresse3',
      checkNonEmptyFields: false
    },
    codePostale: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'beneficiairePersonneMorale.adresse.codePostal',
      checkNonEmptyFields: false
    },
    ville: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'beneficiairePersonneMorale.adresse.ville',
      checkNonEmptyFields: true
    },
    pays: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'beneficiairePersonneMorale.adresse.pays',
      checkNonEmptyFields: true
    },
    numeroImmatriculation: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'beneficiairePersonneMorale.identifiantLegal',
      checkNonEmptyFields: false
    }
  },
  descriptionRisque: {
    display: true,
    nombreCoproVerticales: {
      visible: false,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      }
    },
    nombreVillasIndividuelles: {
      visible: false,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      }
    },
    nombreSalaries: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    typeGestion: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    groupeAsl: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    presenceLotsHabitations: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'presenceLotsHabitations',
      checkNonEmptyFields: true
    },
    typeCopropriete: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'typeCopropriete',
      checkNonEmptyFields: true
    },
    superficieCopro: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'superficieCopro',
      checkNonEmptyFields: true
    },
    nombreLots: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreLots',
      checkNonEmptyFields: true
    },
    typeGestionCopro: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'typeGestionCopro',
      checkNonEmptyFields: true
    },
    locauxSciAvecPartsSouscripteur: {
      visible: false,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      }
    },
    bien: {
      display: false
    }
  },
  antecedent: {
    display: true,
    nombreProcedures: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreProcedures',
      checkNonEmptyFields: true
    },
    nombreProceduresEnDefense: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreProceduresEnDefense',
      checkNonEmptyFields: true
    },
    nombreProceduresEnDemande: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreProceduresEnDemande',
      checkNonEmptyFields: true
    },
    assuranceDejaSouscrite: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'assuranceDejaSouscrite',
      checkNonEmptyFields: true
    },
    resiliationAssureur: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'resiliationAssureur',
      checkNonEmptyFields: true
    },
    redressementJudiciaire: {
      visible: false,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'redressementJudiciaire',
      checkNonEmptyFields: true
    }
  },
  filiale: {
    display: false
  }
};
