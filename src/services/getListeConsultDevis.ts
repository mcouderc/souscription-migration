import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import { DevisStatutEnum, type DevisEntreprise } from 'open-api-souscription-typescript';
import type { IConsultDevisData } from '@/models/form_validate/interface/IConsultDevisData';
import { useI18n } from 'vue-i18n';
import type { IConsultDevisDataChild } from '@/models/form_validate/interface/IConsultDevisDataChild';
import type { IBiens } from '@/models/form_validate/interface/IBiens';
import type { IResSecond } from '@/models/form_validate/interface/IResSecond';
import type { ISCIS } from '@/models/form_validate/interface/ISCIS';
import type { IFilliales } from '@/models/form_validate/interface/IFilliales';
import getCountryName from './getCountryName';

const { formatDate, formatPrice, formatNumber, preFormatValue } = formatDataConsultDevis();
const { getCountry } = getCountryName();
const { t } = useI18n();

export default function getListeConsultDevis() {
  const getResumeDevis = (devis: DevisEntreprise): IConsultDevisData => {
    const enTeteForAll = {
      id: 'ResumeDevis',
      title: 'Résumé Devis'
    };
    const resumeDevisForAll = [
      {
        label: t('page.devisOverview.listData.dateEffetSouhaite'),
        value: formatDate(devis?.dateEffet) || ''
      },
      {
        label: t('page.devisOverview.listData.dateCreationDevis'),
        value: formatDate(devis?.dateCreation) || ''
      },
      {
        label: t('page.devisOverview.listData.dateFinValidite'),
        value: formatDate(devis?.dateFinValidite) || ''
      },
      {
        label: t('page.devisOverview.listData.emisPar'),
        value: devis?.emisPar || ''
      }
    ];
    if (
      devis?.statut !== DevisStatutEnum.EnEtudeN1 &&
      devis?.statut !== DevisStatutEnum.EnEtudeN2
    ) {
      return {
        ...enTeteForAll,
        sectionData: [
          ...resumeDevisForAll,
          {
            label: t('page.devisOverview.listData.primeTTC'),
            value: formatPrice(devis?.primeTtc) || ''
          },
          {
            label: t('page.devisOverview.listData.primeHT'),
            value: formatPrice(devis?.primeHt) || ''
          }
        ]
      };
    } else {
      return {
        ...enTeteForAll,
        sectionData: resumeDevisForAll
      };
    }
  };

  const getSouscripteurMoral = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'SouscripteurPersonneMorale',
      title: 'Souscripteur',
      sectionData: [
        {
          label: t('page.devisOverview.listData.nom'),
          value: `${devis?.souscripteurPersonneMorale?.formeJuridique || ''} ${
            devis?.souscripteurPersonneMorale?.raisonSociale || ''
          }`
        },
        {
          label: t('page.devisOverview.listData.adresse'),
          value: devis?.souscripteurPersonneMorale?.adresse || ''
        },
        {
          label: t('page.devisOverview.listData.pays'),
          value: getCountry(devis?.souscripteurPersonneMorale?.adresse?.pays || '')
        },
        {
          label: t('page.devisOverview.listData.telephone1'),
          value: devis?.souscripteurPersonneMorale?.telephone1 || ''
        },
        {
          label: t('page.devisOverview.listData.telephone2'),
          value: devis?.souscripteurPersonneMorale?.telephone2 || ''
        },
        {
          label: t('page.devisOverview.listData.email'),
          value: devis?.souscripteurPersonneMorale?.mail || ''
        },
        {
          label: t('page.devisOverview.listData.siret'),
          value: devis?.souscripteurPersonneMorale?.identifiantLegal || ''
        },
        {
          label: t('page.devisOverview.listData.representPar'),
          value: `${devis?.representantPersonnePhysique?.civilite || ''}
            ${devis?.representantPersonnePhysique?.nom || ''}
            ${devis?.representantPersonnePhysique?.prenom || ''}
            ${
              devis?.representantPersonnePhysique?.qualiteProfessionnelle
                ? ' en qualité de ' + devis?.representantPersonnePhysique?.qualiteProfessionnelle
                : ''
            }`
        }
      ]
    };
  };

  const getSouscripteurPhysique = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'souscripteurPersonnePhysique',
      title: 'Souscripteur',
      sectionData: [
        {
          label: t('page.devisOverview.listData.nom'),
          value: `${devis?.souscripteurPersonnePhysique?.civilite || ''}
            ${devis?.souscripteurPersonnePhysique?.nom || ''}
            ${devis?.souscripteurPersonnePhysique?.prenom || ''}`
        },
        {
          label: t('page.devisOverview.listData.dateNaissance'),
          value: formatDate(devis?.souscripteurPersonnePhysique?.dateNaissance) || ''
        },
        {
          label: t('page.devisOverview.listData.lieuNaissance'),
          value: devis?.souscripteurPersonnePhysique?.lieuNaissance || ''
        },
        {
          label: t('page.devisOverview.listData.adresse'),
          value: devis?.souscripteurPersonnePhysique?.adresse || ''
        },
        {
          label: t('page.devisOverview.listData.pays'),
          value: getCountry(devis?.souscripteurPersonnePhysique?.adresse?.pays || '')
        },
        {
          label: t('page.devisOverview.listData.telephone1'),
          value: devis?.souscripteurPersonnePhysique?.telephone1 || ''
        },
        {
          label: t('page.devisOverview.listData.telephone2'),
          value: devis?.souscripteurPersonnePhysique?.telephone2 || ''
        },
        {
          label: t('page.devisOverview.listData.email'),
          value: devis?.souscripteurPersonnePhysique?.mail || ''
        }
      ]
    };
  };

  const getBeneficiaireMoralForASL = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'BeneficiairePersonneMorale',
      title: 'Bénéficiaire',
      sectionData: [
        {
          label: t('page.devisOverview.listData.numeroImmatriculation'),
          value: devis?.beneficiairePersonneMorale?.identifiantLegal || ''
        },
        {
          label: t('page.devisOverview.listData.nomASL'),
          value: devis?.beneficiairePersonneMorale?.raisonSociale || ''
        },
        {
          label: t('page.devisOverview.listData.adresse'),
          value: devis?.beneficiairePersonneMorale?.adresse || ''
        },
        {
          label: t('page.devisOverview.listData.pays'),
          value: getCountry(devis?.beneficiairePersonneMorale?.adresse.pays || '')
        }
      ]
    };
  };

  const getBeneficiaireMoralForCopro = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'BeneficiairePersonneMorale',
      title: 'Bénéficiaire',
      sectionData: [
        {
          label: t('page.devisOverview.listData.numeroImmatriculation'),
          value: devis?.beneficiairePersonneMorale?.identifiantLegal || ''
        },
        {
          label: t('page.devisOverview.listData.nomCopro'),
          value: devis?.beneficiairePersonneMorale?.raisonSociale || ''
        },
        {
          label: t('page.devisOverview.listData.adresse'),
          value: devis?.beneficiairePersonneMorale?.adresse || ''
        },
        {
          label: t('page.devisOverview.listData.pays'),
          value: getCountry(devis?.beneficiairePersonneMorale?.adresse.pays) || ''
        }
      ]
    };
  };

  const getRiskForAll = (devis: DevisEntreprise): IConsultDevisDataChild[] => {
    return [
      {
        label: t('page.devisOverview.listData.nombreProcedures'),
        value: formatNumber(devis?.nombreProcedures) || ''
      },
      {
        label: t('page.devisOverview.listData.nombreProceduresDefense'),
        value: formatNumber(devis?.nombreProceduresEnDefense) || ''
      },
      {
        label: t('page.devisOverview.listData.nombreProceduresDemande'),
        value: formatNumber(devis?.nombreProceduresEnDemande) || ''
      },
      {
        label: t('page.devisOverview.listData.assuranceDejaSouscrite'),
        value: preFormatValue(devis?.assuranceDejaSouscrite) || ''
      },
      {
        label: t('page.devisOverview.listData.resiliationAssureur'),
        value: preFormatValue(devis?.resiliationAssureur) || ''
      }
    ];
  };

  const getRiskForProfessionel = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.exerciceReference'),
          value: devis?.exerciceDeReference || ''
        },
        {
          label: t('page.devisOverview.listData.montantCATotal'),
          value: formatPrice(devis?.montantCaHtTotal) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreEtablissementsSecondaires'),
          value: formatNumber(devis?.nombreEtablissementsSecondaires) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreSalaries'),
          value: formatNumber(devis?.nombreSalaries) || ''
        },
        {
          label: t('page.devisOverview.listData.dateCreationEntreprise'),
          value: formatDate(devis?.souscripteurPersonneMorale.dateCreation) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreVehicules'),
          value: formatNumber(devis?.nombreVehicules) || ''
        },
        ...getRiskForAll(devis),
        {
          label: t('page.devisOverview.listData.redressementJudiciaire'),
          value: preFormatValue(devis?.redressementJudiciaire) || ''
        },
        {
          label: t('page.devisOverview.listData.locauxSciAvecPartsSouscripteur'),
          value: preFormatValue(devis?.locauxSciAvecPartsSouscripteur) || ''
        }
      ]
    };
  };

  const getRiskForAssociation = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.exerciceReference'),
          value: devis?.exerciceDeReference || ''
        },
        {
          label: t('page.devisOverview.listData.numeroInscription'),
          value: devis?.numeroInscription || ''
        },
        {
          label: t('page.devisOverview.listData.secteurActivite'),
          value: devis?.secteur || ''
        },
        {
          label: t('page.devisOverview.listData.activitePrecise'),
          value: devis?.souscripteurPersonneMorale?.activite || ''
        },
        {
          label: t('page.devisOverview.listData.budgetHTTotal'),
          value: formatPrice(devis?.budgetHt) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreSalaries'),
          value: formatNumber(devis?.nombreSalaries) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreAdherent'),
          value: formatNumber(devis?.nombreAdherents) || ''
        },
        {
          label: t('page.devisOverview.listData.typeAssociation'),
          value: preFormatValue(devis?.typeAssociation) || ''
        },
        ...getRiskForAll(devis)
      ]
    };
  };

  const getRiskForAgricole = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.activitesDiverAgricole'),
          value: preFormatValue(devis?.activiteAccessoire) || ''
        },
        {
          label: t('page.devisOverview.listData.activitesCommerceDirecte'),
          value: preFormatValue(devis?.commercialisationDirecte) || ''
        },
        {
          label: t('page.devisOverview.listData.activitesPrincipale'),
          value: devis?.souscripteurPersonneMorale.activite || ''
        },
        {
          label: t('page.devisOverview.listData.exerciceReference'),
          value: devis?.exerciceDeReference || ''
        },
        {
          label: t('page.devisOverview.listData.montantCATotal'),
          value: formatPrice(devis?.montantCaHtTotal) || ''
        },
        {
          label: t('page.devisOverview.listData.surfaceExploitation'),
          value: formatNumber(devis?.surfaceExploitation) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreVehicules'),
          value: formatNumber(devis?.nombreVehicules) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreTravailleursExploitation'),
          value: formatNumber(devis?.nombreTravailleursExploitation) || ''
        },
        {
          label: t('page.devisOverview.listData.dontSalariesPermanent'),
          value: formatNumber(devis?.nombreSalaries) || ''
        },
        ...getRiskForAll(devis),
        {
          label: t('page.devisOverview.listData.redressementJudiciaire'),
          value: preFormatValue(devis?.redressementJudiciaire) || ''
        }
      ]
    };
  };

  const getRiskForASL = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.nombreSalaries'),
          value: formatNumber(devis?.nombreSalaries) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreVillasIndividuelles'),
          value: formatNumber(devis?.nombreVillasIndividuelles) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreCoproVerticale'),
          value: formatNumber(devis?.nombreCoproVerticales) || ''
        },
        {
          label: t('page.devisOverview.listData.typeGestion'),
          value: preFormatValue(devis?.typeGestionAsl) || ''
        },
        {
          label: t('page.devisOverview.listData.groupementASL'),
          value: preFormatValue(devis?.groupeAsl) || ''
        },
        ...getRiskForAll(devis)
      ]
    };
  };

  const getRiskForPNO = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.montantLoyersAnnuels'),
          value: formatPrice(devis?.montantLoyersAnnuels) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotHabitation'),
          value: formatNumber(devis?.nombreLotsHabitations) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotPro'),
          value: formatNumber(devis?.nombreLotsProfessionnels) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotCommercial'),
          value: formatNumber(devis?.nombreLotsCommerciaux) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotLocationMeublee'),
          value: formatNumber(devis?.nombreLotsLocationsMeublees) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotGarageCave'),
          value: formatNumber(devis?.nombreLotsGaragesCaves) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotRural'),
          value: formatNumber(devis?.nombreLotsRuraux) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotTerrainParcelleNue'),
          value: formatNumber(devis?.nombreLotsTerrainsNus) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLotLocationSaison'),
          value: formatNumber(devis?.nombreLotsLocationsSaisonsOccasionnelles) || ''
        },
        ...getRiskForAll(devis)
      ]
    };
  };

  const getRiskForCopro = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.presenceLotHabitation'),
          value: preFormatValue(devis?.presenceLotsHabitations) || ''
        },
        {
          label: t('page.devisOverview.listData.typeCopro'),
          value: preFormatValue(devis?.typeCopropriete) || ''
        },
        {
          label: t('page.devisOverview.listData.typeGestion'),
          value: preFormatValue(devis?.typeGestionCopro) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreM2'),
          value: formatNumber(devis?.superficieCopro) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreLot'),
          value: formatNumber(devis?.nombreLots) || ''
        },
        ...getRiskForAll(devis)
      ]
    };
  };

  const getRiskForParticulier = (devis: DevisEntreprise): IConsultDevisData => {
    return {
      id: 'DescriptionRisque',
      title: 'Description du risque',
      sectionData: [
        {
          label: t('page.devisOverview.listData.nombreVehicules'),
          value: formatNumber(devis?.nombreVehicules) || ''
        },
        {
          label: t('page.devisOverview.listData.nombreResidencesSecondaires'),
          value: formatNumber(devis?.nombreResidencesSecondaires) || ''
        },
        ...getRiskForAll(devis)
      ]
    };
  };

  const getBiens = (devis: IBiens): IConsultDevisDataChild[] => {
    return [
      {
        label: t('page.devisOverview.listData.adresse'),
        value: devis.adresse
      },
      {
        label: t('page.devisOverview.listData.pays'),
        value: getCountry(devis.adresse.pays)
      },
      {
        label: t('page.devisOverview.listData.typeBien'),
        value: devis.typeBien
      }
    ];
  };

  const getResSecond = (adresse: IResSecond) => {
    return [
      {
        label: t('page.devisOverview.listData.adresse'),
        value: adresse
      },
      {
        label: t('page.devisOverview.listData.pays'),
        value: getCountry(adresse.pays)
      }
    ];
  };

  const getSCIS = (devis: ISCIS) => {
    return [
      {
        label: t('page.devisOverview.listData.nomSci'),
        value: devis.raisonSociale
      },
      {
        label: t('page.devisOverview.listData.adresse'),
        value: devis.adresse
      },
      {
        label: t('page.devisOverview.listData.pays'),
        value: getCountry(devis.adresse.pays)
      },
      {
        label: t('page.devisOverview.listData.identifiantLegal'),
        value: devis.identifiantLegal
      }
    ];
  };

  const getFilliales = (devis: IFilliales) => {
    const criteresByProduct = devis.codeNaf
      ? {
          label: t('page.devisOverview.listData.codeNaf'),
          value: devis.codeNaf
        }
      : {
          label: t('page.devisOverview.listData.activitePrecise'),
          value: devis.activite
        };
    return [
      {
        label: t('page.devisOverview.listData.raisonSociale'),
        value: devis.raisonSociale
      },
      {
        label: t('page.devisOverview.listData.pays'),
        value: getCountry(devis.adresse.pays)
      },
      {
        label: t('page.devisOverview.listData.identifiantLegal'),
        value: devis.identifiantLegal
      },
      criteresByProduct
    ];
  };

  return {
    getResumeDevis,
    getSouscripteurMoral,
    getSouscripteurPhysique,
    getRiskForAll,
    getRiskForProfessionel,
    getRiskForAgricole,
    getRiskForASL,
    getRiskForPNO,
    getRiskForCopro,
    getRiskForParticulier,
    getRiskForAssociation,
    getBeneficiaireMoralForASL,
    getBeneficiaireMoralForCopro,
    getBiens,
    getResSecond,
    getSCIS,
    getFilliales
  };
}
