import type { IFormValidate } from '@/models/form_validate/interface/IFormValidate';

export const AssociationFormValidate: IFormValidate = {
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
        required: true,
        disable: true
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
        required: false
      },
      transformation: {
        required: true
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
    }
  },
  descriptionRisque: {
    display: true,
    nombreSalaries: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreSalaries',
      checkNonEmptyFields: true
    },
    codeNaf: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'beneficiairePersonneMorale.codeNaf',
      checkNonEmptyFields: true
    },
    activitePrincipal: {
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
    dateCreation: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'souscripteurPersonneMorale.dateCreation',
      checkNonEmptyFields: false
    },
    montantCaHtTotal: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    exerciceDeReference: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'exerciceDeReference',
      checkNonEmptyFields: false
    },
    nombreVehicules: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    nombreEtablissementsSecondaires: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    activitepricipaleAppartencaeSCI: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      }
    },
    numInscription: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'numeroInscription',
      checkNonEmptyFields: true
    },
    activiteStatutairePrecise: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'souscripteurPersonneMorale.activite',
      checkNonEmptyFields: true
    },
    budgetHT: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'budgetHt',
      checkNonEmptyFields: true
    },
    secteurActivite: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'secteur',
      checkNonEmptyFields: true
    },
    typeAssociation: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'typeAssociation',
      checkNonEmptyFields: true
    },
    nombreAdherent: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreAdherents',
      checkNonEmptyFields: true
    },
    locauxSciAvecPartsSouscripteur: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
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
  beneficiaire: {
    display: false
  },
  filiale: {
    display: false
  }
};
