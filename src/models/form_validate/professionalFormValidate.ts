import type { IFormValidate } from '@/models/form_validate/interface/IFormValidate';

export const ProfessionalFormValidate: IFormValidate = {
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
        required: true,
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
        required: false,
        disable: false
      },
      transformation: {
        required: true,
        disable: false
      },
      typage: 'souscripteurPersonnePhysique.civilite',
      checkNonEmptyFields: false
    },
    nom: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      },
      typage: 'souscripteurPersonnePhysique.nom',
      checkNonEmptyFields: true
    },
    prenom: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      },
      typage: 'souscripteurPersonnePhysique.prenom',
      checkNonEmptyFields: false
    },
    dateNaissance: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      },
      typage: 'souscripteurPersonnePhysique.dateNaissance',
      checkNonEmptyFields: false
    },
    lieuNaissance: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: true
      },
      typage: 'souscripteurPersonnePhysique.lieuNaissance',
      checkNonEmptyFields: false
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
      checkNonEmptyFields: false
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
      typage: 'souscripteurPersonneMorale.codeNaf',
      checkNonEmptyFields: true
    },
    activitePrincipal: {
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
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'montantCaHtTotal',
      checkNonEmptyFields: true
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
    nombreEtablissementsSecondaires: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreEtablissementsSecondaires',
      checkNonEmptyFields: true
    },
    activitepricipaleAppartencaeSCI: {
      visible: true,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      }
    },
    locauxSciAvecPartsSouscripteur: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'locauxSciAvecPartsSouscripteur',
      checkNonEmptyFields: false
    },
    scis: {
      display: true,
      typage: 'scis',
      raisonSociale: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: false,
          disable: false
        },
        typage: 'scis[*].raisonSociale',
        checkNonEmptyFields: false
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
        typage: 'scis[*].identifiantLegal',
        checkNonEmptyFields: false
      },
      adresse1: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: false,
          disable: false
        },
        typage: 'scis[*].adresse.adresse1',
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
        typage: 'scis[*].adresse.adresse2',
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
        typage: 'scis[*].adresse.adresse3',
        checkNonEmptyFields: false
      },
      codePostal: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: false,
          disable: false
        },
        typage: 'scis[*].adresse.codePostal',
        checkNonEmptyFields: false
      },
      ville: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: false,
          disable: false
        },
        typage: 'scis[*].adresse.ville',
        checkNonEmptyFields: false
      },
      pays: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: false,
          disable: false
        },
        typage: 'scis[*].adresse.pays',
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
      visible: true,
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
      typage: 'filiales[*].raisonSociale',
      checkNonEmptyFields: false
    },
    identifiantLegal: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'filiales[*].identifiantLegal',
      checkNonEmptyFields: true
    },
    activite: {
      visible: false,
      emis: {
        required: false,
        disable: false
      },
      transformation: {
        required: false,
        disable: false
      },
      typage: 'filiales[*].activite',
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
      typage: 'filiales[*].codeNaf',
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
      typage: 'filiales[*].adresse.codeNaf',
      checkNonEmptyFields: true
    }
  }
};
