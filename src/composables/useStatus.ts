import {
  DevisEntrepriseStatutEnum,
  SignatureElectroniqueStatutEnum
} from 'open-api-souscription-typescript';
import { useI18n } from 'vue-i18n';

export default () => {
  const getColor = (statut: DevisEntrepriseStatutEnum | SignatureElectroniqueStatutEnum) => {
    switch (statut) {
      case DevisEntrepriseStatutEnum.BrouillonEnCours:
        return '#00446b';
      case DevisEntrepriseStatutEnum.BrouillonAValider:
        return '#00446b';
      case DevisEntrepriseStatutEnum.Emis:
        return '#1ca700';
      case DevisEntrepriseStatutEnum.Transforme:
        return '#000000';
      case DevisEntrepriseStatutEnum.Expire:
        return '#cd0000';
      case DevisEntrepriseStatutEnum.EnEtudeN1:
      case DevisEntrepriseStatutEnum.EnEtudeN2:
      case DevisEntrepriseStatutEnum.EtudeValidee:
        return '#e08206';
      case DevisEntrepriseStatutEnum.Refuse:
        return '#808080';
      case SignatureElectroniqueStatutEnum.Termine:
        return '#ff9800';
      case SignatureElectroniqueStatutEnum.EnCours:
        return '#1ca700';
      case SignatureElectroniqueStatutEnum.Archive:
        return '#00446b';
      case SignatureElectroniqueStatutEnum.Abandonne:
        return '#cd0000';

      default:
        return '#00446b';
    }
  };
  const { t } = useI18n();

  const getLabel = (statut: DevisEntrepriseStatutEnum | SignatureElectroniqueStatutEnum) => {
    switch (statut) {
      case DevisEntrepriseStatutEnum.BrouillonEnCours:
        return t('enums.status.create');
      case DevisEntrepriseStatutEnum.BrouillonAValider:
        return t('enums.status.create');
      case DevisEntrepriseStatutEnum.Emis:
        return t('enums.status.send');
      case DevisEntrepriseStatutEnum.Transforme:
        return t('enums.status.transformed');
      case DevisEntrepriseStatutEnum.Expire:
        return t('enums.status.expire');
      case SignatureElectroniqueStatutEnum.Abandonne:
        return t('enums.status.abandoned');
      case SignatureElectroniqueStatutEnum.Archive:
        return t('enums.status.archive');
      case SignatureElectroniqueStatutEnum.EnCours:
        return t('enums.status.current');
      case DevisEntrepriseStatutEnum.EnEtudeN1:
        return t('enums.status.enEtudeN1');
      case DevisEntrepriseStatutEnum.EnEtudeN2:
        return t('enums.status.enEtudeN2');
      case DevisEntrepriseStatutEnum.EtudeValidee:
        return t('enums.status.etudeValidee');
      case DevisEntrepriseStatutEnum.Refuse:
        return t('enums.status.refuse');
      case SignatureElectroniqueStatutEnum.Termine:
        return t('enums.status.ended');
      default:
        return '';
    }
  };

  return { getColor, getLabel };
};
