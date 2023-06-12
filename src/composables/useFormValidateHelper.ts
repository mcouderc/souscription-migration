import useConstante from '@/composables/useConstante';
import { ASLFormValidate } from '@/models/form_validate/aslFormValidate';
import { ProfessionalFormValidate } from '@/models/form_validate/professionalFormValidate';
import { AgricoleFormValidate } from '@/models/form_validate/agricoleFormValidate';
import { ParticularFormValidate } from '@/models/form_validate/particularFormValidate';
import { AssociationFormValidate } from '@/models/form_validate/associationFormValidate';
import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';
import { PnoFormValidate } from '@/models/form_validate/pnoFormValidate';
import { CoproFormValidate } from '@/models/form_validate/coproFormValidate';
import useListTypage from '@/composables/useListTypage';

export default function () {
  //TODO mettre les propriétés de l'enum
  const { PARTICULIER, PROFESSIONEL, AGRICOLE, ASL, ASSOCIATION, PNO, COPRO } = useConstante();

  /**
   * renvoi le json de validation suivant le type de risque
   * @param typeRisque
   */
  const getFormValidateFollowingTypeRisk = (typeRisque: string) => {
    switch (typeRisque) {
      case ASL:
        return ASLFormValidate;
      case AGRICOLE:
        return AgricoleFormValidate;
      case PROFESSIONEL:
        return ProfessionalFormValidate;
      case PARTICULIER:
        return ParticularFormValidate;
      case ASSOCIATION:
        return AssociationFormValidate;
      case PNO:
        return PnoFormValidate;
      case COPRO:
        return CoproFormValidate;
      default:
        return ProfessionalFormValidate;
    }
  };

  const getInputRequiredFromRouting = (
    champsSelected: IChampValidate,
    isRoutingTransformation: boolean
  ) => {
    if (isRoutingTransformation) {
      return champsSelected.transformation.required;
    }

    return champsSelected.emis.required;
  };

  const getInputDisableFromRouting = (
    champsSelected: IChampValidate,
    isRoutingTransformation: boolean
  ) => {
    if (isRoutingTransformation) {
      return champsSelected.transformation.disable;
    }

    return champsSelected.emis.disable;
  };

  const getSiretRequiredFromRouting = (
    champsSelected: IChampValidate,
    isRoutingTransformation: boolean
  ) => {
    const siretRequired = 'siret';
    if (isRoutingTransformation) {
      return champsSelected.transformation.required ? 'required|' + siretRequired : siretRequired;
    }

    return champsSelected.emis.required ? 'required|' + siretRequired : siretRequired;
  };

  /**
   * return true or false
   * verifie si le champs est requis
   * @param champsSelected  champs contenant la regle de validation
   * @param takingStatusIntoAccount valeur resultant du step 2
   */
  const isRequired = (
    champsSelected: IChampValidate,
    takingStatusIntoAccount: boolean
  ): boolean => {
    return getInputRequiredFromRouting(champsSelected, takingStatusIntoAccount);
  };

  /**
   * return required|siret
   * verifie si le champs  siret est requis
   * @param champsSelected  champs contenant la regle de validation
   * @param takingStatusIntoAccount valeur resultant du step 2
   */
  const isRequiredSiret = (
    champsSelected: IChampValidate,
    takingStatusIntoAccount: boolean
  ): string => {
    return getSiretRequiredFromRouting(champsSelected, takingStatusIntoAccount);
  };

  /**
   * return required
   * verifie si le champs est requis
   * @param champsSelected  champs contenant la regle de validation
   * @param takingStatusIntoAccount valeur resultant du step 2
   */
  const isRequiredReturnRequired = (
    champsSelected: IChampValidate,
    takingStatusIntoAccount: boolean
  ): string => {
    return getInputRequiredFromRouting(champsSelected, takingStatusIntoAccount) ? 'required' : '';
  };

  /**
   * verifie si le champs doit etre desactivé
   * @param champsSelected  champs contenant la regle de validation
   * @param takingStatusIntoAccount valeur resultant du step 2
   * @param valeurChampATester valeur actuelle du champs a tester
   * @param typage
   */
  const isDisableHelper = (
    champsSelected: IChampValidate,
    takingStatusIntoAccount: boolean,
    valeurChampATester: any,
    typage?: string
  ): boolean => {
    let isdisabled = true;

    const { listTypage } = useListTypage();
    if (Array.isArray(listTypage.value) && listTypage.value.includes(typage)) {
      return true;
    }

    if (!getInputDisableFromRouting(champsSelected, takingStatusIntoAccount)) {
      isdisabled = champsSelected.checkNonEmptyFields
        ? takingStatusIntoAccount && !!valeurChampATester
        : false;
    }

    return isdisabled;
  };

  const formattageTypageSouscripteur = (typage: string, typeSouscritpeur: string): string => {
    return typeSouscritpeur.concat(typage);
  };

  return {
    getFormValidateFollowingTypeRisk,
    getSiretRequiredFromRouting,
    getInputRequiredFromRouting,
    isRequired,
    isRequiredSiret,
    isRequiredReturnRequired,
    isDisableHelper,
    formattageTypageSouscripteur
  };
}
