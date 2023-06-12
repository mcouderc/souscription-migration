import type { RouteLocationNormalized } from 'vue-router';
import useDevis from '@/composables/useDevis';
import type { ComputedRef, Ref } from 'vue';

import { devisApi, produitsApi } from '@/plugins/open-api';
import { useRouter, useRoute } from 'vue-router';
import useSelectedProduct from '@/composables/useSelectedProduct';
import { useI18n } from 'vue-i18n';
import useSnackBar from '@/composables/useSnackBar';
import useContractStepper from '@/composables/useContractStepper';
import type IPapperEntreprise from '@/models/IPapperEntreprise';
import useConstante from '@/composables/useConstante';
import useIdentifiantProfil from '@/composables/useIdentifiantProfil';
import { DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';

export default () => {
  const { initDevisAction, setDevisAction, devis } = useDevis();
  const { setIdentifiantProfil } = useIdentifiantProfil();
  const { setProductAction, product } = useSelectedProduct();
  const { addMessageErrorSnackBarAction } = useSnackBar();
  const { COPIE_EXPIRE } = useConstante();
  const { setContractStepper, isContractStepper } = useContractStepper();
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const mounted = async (
    parcoursStep1s: string[],
    parcoursStep2s: string[],
    route: RouteLocationNormalized,
    routeIdQueryRef: Ref,
    stepperContentRef: Ref<string>,
    isUpdateRef: Ref<boolean>,
    stepper: Ref<number>,
    pendingDevisRef: Ref<boolean>,
    e1Ref: Ref<number>
  ) => {
    if (isNewDevis(route) && !isSameProduct()) {
      devis.value.valorisationCritere = [];
      setDevisAction(devis.value);
    } else if (!isNewDevis(route)) {
      initDevisAction();
    }
    setIdentifiantProfil({} as IPapperEntreprise);
    const routeUpdateParams = route?.params?.update;
    const routeStepQuery = route?.query?.step;
    const positionStep_1 = parcoursStep1s.indexOf(routeStepQuery as string);
    const positionStep_2 = parcoursStep2s.indexOf(routeStepQuery as string);
    const positionStep =
      positionStep_1 >= 0 ? positionStep_1 : positionStep_2 >= 0 ? positionStep_2 : 0;
    routeIdQueryRef.value = route?.query?.id;

    stepperContentRef.value =
      positionStep_1 >= 0 ? 'step_1' : positionStep_2 >= 0 ? 'step_2' : 'step_1';
    isUpdateRef.value = !!routeUpdateParams;

    if (routeIdQueryRef.value) {
      e1Ref.value = positionStep + 1;
      stepper.value = positionStep + 1;
      try {
        const response = await devisApi().getDevis(routeIdQueryRef.value);
        setDevisAction(response.data);
        const responseProduit = await produitsApi().getProduit(
          response.data.formuleSouscrite.idProduit
        );
        setProductAction(responseProduit.data);
      } catch {
        addMessageErrorSnackBarAction(t('errors.recoveryDevis'));
      } finally {
        pendingDevisRef.value = true;
      }
    } else if (route?.query?.new === COPIE_EXPIRE) {
      if (product.value?.id === undefined || product.value?.id === null) {
        const responseProduit = await produitsApi().getProduit(
          parseInt(String(route?.params?.product))
        );
        setProductAction(responseProduit.data);
      }
      e1Ref.value = positionStep + 1;
      stepper.value = positionStep + 1;
      pendingDevisRef.value = true;
    } else {
      //Recherche le produit par l'id de l'url si le store est vide
      if (product.value?.id === undefined || product.value?.id === null) {
        const responseProduit = await produitsApi().getProduit(
          parseInt(String(route?.params?.product))
        );
        setProductAction(responseProduit.data);
      }
      pendingDevisRef.value = true;
      if (routeStepQuery !== parcoursStep1s[0])
        await router.replace({
          query: { step: parcoursStep1s[0] }
        });
    }
    if (stepperContentRef.value === 'step_1') {
      setContractStepper(false);
    } else {
      setContractStepper(true);
    }
  };

  const isNewDevis = (route: RouteLocationNormalized) => {
    return route.query.new;
  };

  const isSameProduct = () => {
    return devis.value.formuleSouscrite?.idProduit.toString() === route?.params?.product.toString();
  };

  const informationStepGeneric = (
    e1Ref: Ref<number>,
    route: RouteLocationNormalized,
    isEmittedStatusComputed: ComputedRef<boolean>,
    positionStep: number
  ) => {
    return (e1Ref.value === positionStep && !isEmittedStatusComputed.value) || isNewDevis(route);
  };

  const devisStepsGeneric = (
    route: RouteLocationNormalized,
    isEmittedStatusComputed: ComputedRef
  ) => {
    return !isEmittedStatusComputed.value || isNewDevis(route);
  };

  /**
   * methode
   */

  const stepEditableGeneric = (position: number, isUpdateRef: boolean, stepper: number) => {
    return (
      (isUpdateRef ? position + 1 === stepper : position + 1 <= stepper) &&
      !(position === 3 && isContractStepper.value)
    );
  };

  const setQuery = (queries: string, parcoursStep1: string, parcoursStep2: string) => {
    return queries === 'step_1' ? parcoursStep1 : parcoursStep2;
  };

  const stepPreviousGeneric = (position, parcoursStep1s: string[], e1Ref: Ref<number>) => {
    const url = new URL(window.location.toString());
    url.searchParams.set('step', parcoursStep1s[position - 1]);
    window.history.pushState({}, '', url);
    e1Ref.value = position;
  };

  const stepEditable = (position, stepper, devis, isUpdate) => {
    if (stepper === 4 && devis?.statut === DevisEntrepriseStatutEnum.Transforme) {
      return false;
    } else {
      return stepEditableGeneric(position, isUpdate, stepper);
    }
  };

  const nextStepGeneric = (
    queries,
    position: number,
    parcoursStep1s: string[],
    parcoursStep2s: string[],
    routeIdQuery: string,
    e1Ref: Ref<number>,
    stepperRef: Ref<number>
  ) => {
    const url = new URL(window.location.toString());
    url.searchParams.set(
      'step',
      setQuery(queries, parcoursStep1s[position], parcoursStep2s[position])
    );
    if (routeIdQuery) {
      url.searchParams.set('id', routeIdQuery);
    }
    window.history.pushState({}, '', url);
    e1Ref.value = position + 1;
    stepperRef.value = position + 1;
  };

  return {
    mounted,
    nextStepGeneric,
    stepPreviousGeneric,
    stepEditableGeneric,
    devisStepsGeneric,
    informationStepGeneric,
    stepEditable
  };
};
