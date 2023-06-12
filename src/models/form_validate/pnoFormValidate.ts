import type { IFormValidate } from '@/models/form_validate/interface/IFormValidate';

export const PnoFormValidate: IFormValidate = {
  souscripteur: {
    display: true,
    isPersonneMorale: false,
    choixTypePersonne: true,
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
    montantLoyersAnnuels: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      },
      typage: 'montantLoyersAnnuels',
      checkNonEmptyFields: false
    },
    nombreLotsHabitations: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      },
      typage: 'nombreLotsHabitations',
      checkNonEmptyFields: true
    },
    nombreLotsProfessionnels: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      },
      typage: 'nombreLotsProfessionnels',
      checkNonEmptyFields: true
    },
    nombreLotsCommerciaux: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      },
      typage: 'nombreLotsCommerciaux',
      checkNonEmptyFields: true
    },
    nombreLotsLocationsMeublees: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      },
      typage: 'nombreLotsLocationsMeublees',
      checkNonEmptyFields: true
    },
    nombreLotsGaragesCaves: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      },
      typage: 'nombreLotsGaragesCaves',
      checkNonEmptyFields: true
    },
    nombreLotsRuraux: {
      visible: true,
      emis: {
        required: true,
        disable: false
      },
      transformation: {
        required: true,
        disable: true
      },
      typage: 'nombreLotsRuraux',
      checkNonEmptyFields: true
    },
    nombreLotsTerrainsNus: {
      visible: false,
      emis: {
        required: true
      },
      transformation: {
        required: true
      },
      typage: 'nombreLotsTerrainsNus',
      checkNonEmptyFields: true
    },
    nombreLotsLocationsSaisonsOccasionnelles: {
      visible: false,
      emis: {
        required: false
      },
      transformation: {
        required: false
      },
      typage: 'nombreLotsLocationsSaisonsOccasionnelles',
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
      display: true,
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
        typage: 'biens[*].adresse.adresse1',
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
        typage: 'biens[*].adresse.adresse2',
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
        typage: 'biens[*].adresse.adresse3',
        checkNonEmptyFields: false
      },
      codePostal: {
        visible: true,
        emis: {
          required: false,
          disable: false
        },
        transformation: {
          required: true,
          disable: false
        },
        typage: 'biens[*].adresse.codePostal',
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
        typage: 'biens[*].adresse.pays',
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
        typage: 'biens[*].adresse.ville',
        checkNonEmptyFields: false
      }
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
      typage: 'nombreProceduresEnDemande',
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
      }
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
      typage: 'resiliationAssureur',
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
