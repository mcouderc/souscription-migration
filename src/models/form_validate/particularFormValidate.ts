import type { IFormValidate } from '@/models/form_validate/interface/IFormValidate';

export const ParticularFormValidate: IFormValidate = {
  souscripteur: {
    display: true,
    isPersonneMorale: false,
    choixTypePersonne: false,
    raisonSociale: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    identifiantLegal: {
      visible: false,
      emis: {
        required: true,
        disable: true
      },
      transformation: {
        required: true,
        disable: true
      }
    },
    formeJuridique: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
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
        required: true
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
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'souscripteurPersonnePhysique.civilite',
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
      typage: 'souscripteurPersonnePhysique.nom',
      checkNonEmptyFields: true
    },
    prenom: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'souscripteurPersonnePhysique.prenom',
      checkNonEmptyFields: true
    },
    dateNaissance: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: true,
        disable: false
      },
      typage: 'souscripteurPersonnePhysique.dateNaissance',
      checkNonEmptyFields: false
    },
    lieuNaissance: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: true,
        disable: false
      },
      typage: 'souscripteurPersonnePhysique.lieuNaissance',
      checkNonEmptyFields: false
    }
  },
  representePar: {
    display: false
  },
  descriptionRisque: {
    display: true,
    nombreSalaries: {
      visible: false,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreSalaries',
      checkNonEmptyFields: false
    },
    codeNaf: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    activitePrincipal: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      }
    },
    dateCreation: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      }
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
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      }
    },
    nombreVehicules: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreVehicules',
      checkNonEmptyFields: true
    },
    nombreResidencesSecondaires: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreResidencesSecondaires'
    },
    nombreEtablissementsSecondaires: {
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
    activitepricipaleAppartencaeSCI: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      }
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
    scis: {
      display: false
    },
    residencesSecondaires: {
      display: true,
      typage: 'residencesSecondaires',
      adresse1: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: true,
          disable: false
        },
        typage: 'residencesSecondaires[*].adresse1',
        checkNonEmptyFields: false
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
        typage: 'residencesSecondaires[*].adresse2',
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
        typage: 'residencesSecondaires[*].adresse3',
        checkNonEmptyFields: false
      },
      codePostal: {
        visible: true,
        emis: {
          required: true,
          disable: false
        },
        transformation: {
          required: true,
          disable: false
        },
        typage: 'residencesSecondaires[*].codePostal',
        checkNonEmptyFields: false
      },
      ville: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: true,
          disable: false
        },
        typage: 'residencesSecondaires[*].ville',
        checkNonEmptyFields: false
      },
      pays: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: true,
          disable: false
        },
        typage: 'residencesSecondaires[*].pays',
        checkNonEmptyFields: false
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
