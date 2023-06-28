<template>
  <Form>
    <v-col cols="12">
      <h2 class="text-primary text-h6 text-capitalize">
        {{ $t('page.additionalInformation.riskDescription') }}
      </h2>
    </v-col>
    <FormRisk
      v-if="formValidateApplyComputed.descriptionRisque.display"
      :data="modelRef"
      :description-risk-form-value-validate="formValidateApplyComputed.descriptionRisque"
      @checkIfObjectIsSame="checkIfObjectIsSame()"
    ></FormRisk>
  </Form>
</template>

<script setup lang="ts">
import {
  type DevisEntreprise,
  DevisEntrepriseStatutEnum,
  type PatchDevis,
  DevisEntrepriseTypeRisqueEnum,
  ReponseEligibiliteStatutEnum
} from 'open-api-souscription-typescript';
import { Field, Form } from 'vee-validate';
import FormRisk from '@/components/devis/forms/FormRisk.vue';
import { computed, onMounted, ref } from 'vue';
import useSnackBar from '@/composables/useSnackBar';
import useDevis from '@/composables/useDevis';
import useFormValidate from '@/composables/useFormValidateHelper';
import usePermission from '@/composables/authenticate/usePermission';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import eventBus from '@/plugins/eventBus';
import { ceryxClientApi } from '@/plugins/open-api';
import {
  devisApi,
  getEligibiliteEntrepriseResponseApi,
  patchDevisApi,
  documentsApi
} from '@/plugins/open-api';
import { devisInitiatorApi } from '@/plugins/open-api';
import useFormeJuridiqueStore from '@/composables/useFormeJuridiqueStore';
import useListTypage from '@/composables/useListTypage';
import useConstante from '@/composables/useConstante';
import validationRulesSiret from '@/services/validationRulesSiret';

export interface IProps {
  takingStatusIntoAccount?: boolean;
  required?: boolean;
  update?: boolean;
  isEligible?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  takingStatusIntoAccount: false,
  required: false,
  update: false,
  isEligible: false
});
const { siretIsValid } = validationRulesSiret();
const {
  addMessageErrorSnackBarAction,
  addMessageSuccesSnackBarAction,
  addMessageInfoSnackBarAction
} = useSnackBar();
const { devis, setDevisAction } = useDevis();
const { PANEL_OPEN } = useConstante();
const { formeJuridique } = useFormeJuridiqueStore();
const { getFormValidateFollowingTypeRisk } = useFormValidate();
const { doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate } = usePermission();

const pendingRef = ref(true);
const pendingDevisNumberRef = ref(false);
const modelRef = ref<DevisEntreprise>(devis.value);
const panelOpenRef = ref(PANEL_OPEN);
const timeOutRef = ref(null);
const btnLoadingSaveRef = ref(false);
const numeroDevisRef = ref('');
const yearRef = ref<number>(0);
const checkEligibilityRef = ref(true);
const isInCreationRef = ref<boolean>(false);
const tabComparToDisabledCoproRef = ref([]);
const { t } = useI18n();

const observer = ref(null);
const route = useRoute();
const router = useRouter();
const emit = defineEmits(['previousStep', 'nextStep']);
const { isRequired } = useFormValidate();
const isUpdateRef = ref(route.params.update === 'true');

const validationFormComputed = computed<DevisEntreprise>((): DevisEntreprise => {
  const devisBis = modelRef;

  Object.keys(devisBis).forEach((key) => {
    if (!devisBis[key] || devisBis[key].length <= 0) {
      delete devisBis[key];
    }
  });
  return devisBis.value;
});

const subtitle = computed(() => {
  return `${devis.value.formuleSouscrite.nomProduit || ''} - ${
    devis.value.formuleSouscrite.nomFormule || ''
  }`;
});

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount
    ? devis.value.statut === DevisEntrepriseStatutEnum.Emis
    : false;
});

const formValidateApplyComputed = computed(() => {
  return getFormValidateFollowingTypeRisk(modelRef.value.typeRisque);
});

const isSouscripteurIsPersonneMoralRef = ref(
  formValidateApplyComputed.value.souscripteur.isPersonneMorale
);
const isDisplayRepresenteParRef = ref(formValidateApplyComputed.value.representePar.display);

onMounted(async () => {
  checkTypage();
  const routeQueryId = route?.query?.id;
  const isNewDevis = route?.query?.new;
  window.scrollTo(0, 0); //permet de remonter la scrollbar de la page en cours
  if (isNewDevis) {
    createDevisNumber();
  }
  if (
    devis.value.statut === DevisEntrepriseStatutEnum.Emis &&
    !isUpdateRef.value &&
    !props.required
  ) {
    addMessageErrorSnackBarAction('no update');
    await router.push({
      name: 'OverviewDevis',
      query: { id: devis.value.id.toString() }
    });
  } else if (routeQueryId) {
    pendingRef.value = true;
    numeroDevisRef.value = devis.value.numeroDevis || '';
    pendingRef.value = false;
  } else if (!devis.value?.formuleSouscrite.idProduit && !routeQueryId) {
    addMessageErrorSnackBarAction('La session a expirée');
    await router.push({
      name: 'SouscriptionMarketProduct'
    });
  }

  if (
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Copropriete &&
    devis.value.numClientCeryx
  ) {
    getCeryxClientData();
  }

  if (devis.value) {
    pendingRef.value = false;
    devis.value.souscripteurPersonneMorale.identifiantLegal
      ? (checkEligibilityRef.value = true)
      : (checkEligibilityRef.value = false);
    getPreviousDate();
    getDefaultValueForAgricole();
    if (devis.value.souscripteurPersonneMorale.identifiantLegal && !devis.value.numeroDevis) {
      // A l'arriver sur la page, si on a les infos par papper, on crée directement le devis
      await createDevisNumber();
    }
  }
  checkTypeOfSouscripteur();
});

const getPreviousDate = (): void => {
  const today = new Date();
  yearRef.value = today.getUTCFullYear();
  modelRef.value.exerciceDeReference = yearRef.value - 1;
};

const checkTypage = async () => {
  try {
    const response = await devisApi().listTypages(devis.value);
    const { setListTypage } = useListTypage();
    setListTypage(response.data);
  } catch {
    addMessageErrorSnackBarAction(t('errors.typageError'));
  }
};

const getDefaultValueForAgricole = (): void => {
  if (!modelRef.value.montantCaHtTotal) {
    modelRef.value.montantCaHtTotal = 0;
  }
  if (!modelRef.value.nombreSalaries) {
    modelRef.value.nombreSalaries = 0;
  }
  if (!modelRef.value.nombreTravailleursExploitation) {
    modelRef.value.nombreTravailleursExploitation = 0;
  }
  if (!modelRef.value.nombreVehicules) {
    modelRef.value.nombreVehicules = 0;
  }
};

const getCeryxClientData = () => {
  ceryxClientApi()
    .getCeryxClient(devis.value.numClientCeryx.toString())
    .then((response) => {
      tabComparToDisabledCoproRef.value = Object.values(response.data).filter((item) => item);
    })
    .catch(() => {
      addMessageInfoSnackBarAction(t('page.addClient.errorRecupClient'));
    });
};

const devisFromPapper = () => {
  const formDataToHydrate = {
    codePays: modelRef.value.codePays,
    dateEffet: modelRef.value.dateEffet,
    identifiantLegal: modelRef.value.souscripteurPersonneMorale.identifiantLegal,
    typeRisque: modelRef.value.typeRisque,
    devis: modelRef.value
  };

  devisInitiatorApi()
    .initiateDevis(formDataToHydrate)
    .then((response) => {
      if (response.status === 201) {
        if (
          response.data.souscripteurPersonneMorale.raisonSociale !== '' ||
          response.data.souscripteurPersonneMorale.adresse.adresse1 !== ''
        ) {
          setDevisAction(_.merge(devis.value, response.data));
          modelRef.value = response.data;
          getSelectedStatutCompagnie();
          if (!devis.value?.numeroDevis) {
            createDevisNumber();
          }
          addMessageSuccesSnackBarAction(t('devis.pappers.hydratationSuccess'));
        } else {
          addMessageInfoSnackBarAction(t('devis.pappers.hydratationEmpty'));
        }
      } else {
        addMessageErrorSnackBarAction(t('devis.pappers.HydratationError'));
      }
    })
    .catch(() => addMessageErrorSnackBarAction(t('devis.pappers.HydratationError')));
};

const getSelectedStatutCompagnie = () => {
  const selectedItem = formeJuridique.value.filter((item) => {
    return item.code === modelRef?.value?.souscripteurPersonneMorale?.formeJuridique;
  });
  eventBus.emit('forme-juridique', selectedItem[0]?.qualiteRepresentant);
};

const checkEligibility = (isEligible: boolean) => {
  checkEligibilityRef.value = isEligible;
};

const isVisible = (): boolean => {
  return !devis.value.numeroDevis || (devis.value.numeroDevis && !checkFormatSiret());
};

const isSaveIsVisible = (): boolean => {
  return (
    devis.value.numeroDevis &&
    (devis.value.statut === DevisEntrepriseStatutEnum.BrouillonEnCours ||
      devis.value.statut === DevisEntrepriseStatutEnum.BrouillonAValider)
  );
};

const checkFormatSiret = () => {
  return siretIsValid(
    modelRef.value.souscripteurPersonneMorale.identifiantLegal,
    modelRef.value.souscripteurPersonneMorale?.adresse?.pays
  );
};

const checkIfObjectIsSame = () => {
  clearTimeout(timeOutRef.value);
  timeOutRef.value = setTimeout(() => {
    if (!devis.value?.numeroDevis) {
      createDevisNumber();
    }
  }, 1000);
};

const createClone = (devis: DevisEntreprise): DevisEntreprise => {
  //le back ne gère pas les dates au format string vide, soit null, soit une date valide
  if (devis.souscripteurPersonneMorale.dateCreation === '') {
    devis.souscripteurPersonneMorale.dateCreation = null;
  }
  if (devis.souscripteurPersonnePhysique.dateNaissance === '') {
    devis.souscripteurPersonnePhysique.dateNaissance = null;
  }
  return devis;
};

const saveDevis = () => {
  const clone = createClone({ ...validationFormComputed.value });
  setDevisAction(_.merge(devis.value, clone));
  devisApi()
    .updateDevis(devis.value.id, clone)
    .then(() => {
      addMessageSuccesSnackBarAction(t('devis.update.updateDevis'));
    })
    .catch(() => {
      addMessageErrorSnackBarAction(t('devis.errors.validerTousLesChamps').toString());
    });
};

const isSiretSaveButton = (): boolean => {
  return (
    modelRef.value?.souscripteurPersonneMorale?.identifiantLegal === '' ||
    (modelRef.value?.souscripteurPersonneMorale?.identifiantLegal && checkFormatSiret())
  );
};

const isPartNbResSecond = () => {
  if (modelRef.value?.nombreResidencesSecondaires < modelRef.value?.residencesSecondaires?.length) {
    addMessageErrorSnackBarAction(t('page.additionalInformation.nbResSecondError'));
  } else {
    saveDevis();
  }
};

const saveform = async () => {
  btnLoadingSaveRef.value = true;
  if (devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier) {
    isPartNbResSecond();
  } else if (isSiretSaveButton()) {
    saveDevis();
  } else {
    addMessageErrorSnackBarAction(t('page.subscription.siret.siretBadFormat'));
  }
  btnLoadingSaveRef.value = false;
};

const defaultValue = (): void => {
  if (validationFormComputed.value.budgetHt?.toString() === '') {
    validationFormComputed.value.budgetHt = null;
  }
  if (validationFormComputed.value.exerciceDeReference?.toString() === '') {
    validationFormComputed.value.exerciceDeReference = null;
  }
};

const createDevisNumber = async () => {
  if (infosRequiredcreateDevis(modelRef.value.typeRisque) && !isInCreationRef.value) {
    isInCreationRef.value = true;
    pendingDevisNumberRef.value = true;
    defaultValue();
    try {
      const response = await devisApi().createDevis(validationFormComputed.value);
      if (response.data) {
        setDevisAction(_.merge(devis.value, response.data));
        addMessageSuccesSnackBarAction(t('devis.creation.success'));
        const url = new URL(window.location.toString());
        url.searchParams.set('id', devis.value.id.toString());
        window.history.pushState({}, '', url.toString());
      }
    } catch {
      addMessageErrorSnackBarAction(t('devis.creation.error'));
    } finally {
      pendingDevisNumberRef.value = false;
      isInCreationRef.value = false;
    }
  }
};

const infosRequiredcreateDevis = (typeRisque: DevisEntrepriseTypeRisqueEnum): boolean => {
  switch (typeRisque) {
    case 'PROFESSIONNEL_ENTREPRISE': {
      if (
        modelRef.value?.souscripteurPersonneMorale.raisonSociale &&
        modelRef.value?.souscripteurPersonneMorale.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonneMorale.adresse.codePostal &&
        modelRef.value?.souscripteurPersonneMorale.adresse.ville
      ) {
        return true;
      }
      break;
    }
    case 'PARTICULIER': {
      if (
        modelRef.value?.souscripteurPersonnePhysique.nom &&
        modelRef.value?.souscripteurPersonnePhysique.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonnePhysique.adresse.codePostal &&
        modelRef.value?.souscripteurPersonnePhysique.adresse.ville
      ) {
        return true;
      }
      break;
    }
    case 'AGRICOLE': {
      if (
        modelRef.value?.souscripteurPersonneMorale.raisonSociale &&
        modelRef.value?.souscripteurPersonneMorale.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonneMorale.adresse.codePostal &&
        modelRef.value?.souscripteurPersonneMorale.adresse.ville
      ) {
        return true;
      }
      break;
    }
    case 'ASL': {
      if (
        modelRef.value?.souscripteurPersonneMorale.raisonSociale &&
        modelRef.value?.souscripteurPersonneMorale.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonneMorale.adresse.codePostal &&
        modelRef.value?.souscripteurPersonneMorale.adresse.ville
      ) {
        return true;
      }
      break;
    }
    case 'COPROPRIETE': {
      if (
        modelRef.value?.souscripteurPersonneMorale.raisonSociale &&
        modelRef.value?.souscripteurPersonneMorale.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonneMorale.adresse.codePostal &&
        modelRef.value?.souscripteurPersonneMorale.adresse.ville
      ) {
        return true;
      }
      break;
    }
    case 'ASSOCIATION': {
      if (
        modelRef.value?.souscripteurPersonneMorale.raisonSociale &&
        modelRef.value?.souscripteurPersonneMorale.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonneMorale.adresse.codePostal &&
        modelRef.value?.souscripteurPersonneMorale.adresse.ville
      ) {
        return true;
      }
      break;
    }
    case 'PROPRIETAIRE': {
      if (isSouscripteurIsPersonneMoralRef.value) {
        if (
          modelRef.value?.souscripteurPersonneMorale.raisonSociale &&
          modelRef.value?.souscripteurPersonneMorale.adresse.adresse1 &&
          modelRef.value?.souscripteurPersonneMorale.adresse.codePostal &&
          modelRef.value?.souscripteurPersonneMorale.adresse.ville
        ) {
          return true;
        }
      }
      if (
        modelRef.value?.souscripteurPersonnePhysique.nom &&
        modelRef.value?.souscripteurPersonnePhysique.adresse.adresse1 &&
        modelRef.value?.souscripteurPersonnePhysique.adresse.codePostal &&
        modelRef.value?.souscripteurPersonnePhysique.adresse.ville
      ) {
        return true;
      }
      break;
    }

    default: {
      //statements;
      break;
    }
  }
};

const isSiretProToContrat = (): boolean => {
  return (
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise &&
    inputRequireComputed.value
  );
};

const submitFormDevis = () => {
  observer.value.validate().then((isValidForm: boolean) => {
    //Si le formulaire et valide grace aux 'formValide.ts'
    if (isValidForm) {
      pendingRef.value = true;
      //Si produit PRO en transformation en contrat, Siret éligible obligatoire
      if (isSiretProToContrat()) {
        checkSiretEligible();
        //Si produit Particulier et nombreResSecondaire < resSecondaire.length
      } else if (devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier) {
        checkNbResSecondaire();
      } else {
        updateDevis();
      }
    } else {
      panelOpenRef.value = PANEL_OPEN;
      addMessageErrorSnackBarAction(t('devis.errors.validerTousLesChamps'));
    }
  });
};

const checkNbResSecondaire = () => {
  if (modelRef.value?.nombreResidencesSecondaires < modelRef.value?.residencesSecondaires?.length) {
    addMessageErrorSnackBarAction(t('page.additionalInformation.nbResSecondError'));
    pendingRef.value = false;
  } else {
    updateDevis();
  }
};

const checkSiretEligible = async () => {
  const sirets = [devis.value.souscripteurPersonneMorale?.identifiantLegal];
  const pays = devis.value.souscripteurPersonneMorale?.adresse?.pays;
  //Recuperation des siret des filiales
  sirets.push(...devis.value.filiales.map((filiale) => filiale.identifiantLegal));
  getEligibiliteEntrepriseResponseApi()
    .getEligibiliteEntreprise(pays, devis.value.dateEffet, sirets)
    .then((response) => {
      if (
        response.data.statut === ReponseEligibiliteStatutEnum.Autorise ||
        response.data.statut === ReponseEligibiliteStatutEnum.NonDetermine
      ) {
        updateDevis();
      } else {
        pendingRef.value = false;
        if (doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()) {
          eventBus.emit('open-eligibilite-admin-dialog');
        } else {
          addMessageErrorSnackBarAction(t('page.subscription.noSiret.subTitle'));
        }
      }
    })
    .catch(() => {
      pendingRef.value = false;
      addMessageErrorSnackBarAction(t('snackBar.error'));
    });
};

const validStateDevis = () => {
  patchDevisApi()
    .preTransformation(devis.value.id, { type: 'PRE_TRANSFORMATION' } as PatchDevis)
    .then(() => {
      next();
    })
    .catch(() => {
      pendingRef.value = false;
      addMessageErrorSnackBarAction(t('devis.errors.preTransformation'));
    });
};

const updateDevis = async () => {
  defaultValue();
  //Clone permettant de recuperer le devis et de retirer l'ID car le BAck n'accepte pas l'UPADTE avec l'Id
  const clone = createClone({ ...validationFormComputed.value });
  clone.id = null;
  devisApi()
    .updateDevis(devis.value.id, clone)
    .then((response) => {
      if (response.data.statut === DevisEntrepriseStatutEnum.Emis) {
        if (!isUpdateRef.value) {
          validStateDevis();
        } else {
          documentsApi()
            .regenerateDocumentDevis(devis.value.id)
            .then(() => {
              addMessageSuccesSnackBarAction(t('page.additionalInformation.regenerateDocument'));
            });
          addMessageSuccesSnackBarAction(t('devis.update.updateDevis'));
          pendingRef.value = false;
          router.push({
            name: 'OverviewDevis',
            query: { id: response.data.id.toString() }
          });
        }
      } else {
        patchDevisApi()
          .validateDevis(devis.value.id, { type: 'VALIDATION' } as PatchDevis)
          .then(() => {
            submitFormToFinish(response);
          })
          .catch((e) => {
            pendingRef.value = false;
            if (e.response.data.violations) {
              if (e.response.data?.violations[0]?.propertyPath === 'BLOQUANT') {
                eventBus.emit('open-error-dialog', e.response.data.violations[0].title);
              } else if (e.response.data?.violations[0]?.propertyPath === 'ETUDE') {
                eventBus.emit('open-devis-etude-dialog', {
                  message: e.response.data.violations[0].title,
                  response: response
                });
              } else {
                addMessageErrorSnackBarAction(t('forms.errors.updateFail'));
              }
            } else {
              addMessageErrorSnackBarAction(t('forms.errors.updateFail'));
            }
          });
      }
    })
    .catch(() => {
      pendingRef.value = false;
      addMessageErrorSnackBarAction(t('forms.errors.updateFail'));
    });
};

const submitFormToFinish = (responseValidation) => {
  numeroDevisRef.value = responseValidation.data?.numeroDevis || '';
  setDevisAction(_.merge(devis.value, modelRef.value));

  addMessageSuccesSnackBarAction(t('devis.update.updateDevis'));
  pendingRef.value = false;
  router.push({
    name: 'OverviewDevis',
    query: { id: responseValidation.data.id.toString() }
  });
};

const submitFormToEtude = (response) => {
  pendingRef.value = true;
  patchDevisApi()
    .enEtude(devis.value.id, { type: 'EN_ETUDE' } as PatchDevis)
    .then(() => {
      submitFormToFinish(response);
    })
    .catch(() => {
      addMessageErrorSnackBarAction(t('forms.errors.pushEtudeFail'));
    })
    .finally(() => {
      pendingRef.value = false;
    });
};

const onAdminNextAction = () => {
  updateDevis();
  next();
};

const back = () => {
  emit('previousStep', true);
};

const next = () => {
  pendingRef.value = false;
  emit('nextStep', true);
};

const changeTypePersonne = (typePersonneSuscriber: boolean) => {
  isSouscripteurIsPersonneMoralRef.value = typePersonneSuscriber;
  isDisplayRepresenteParRef.value = typePersonneSuscriber;
};

const isFillialeVisible = (): boolean => {
  //Si on doit afficher le champ ET on est en emis ET il n'y a pas de filiales = ne pas affiché le champ
  if (
    formValidateApplyComputed.value.filiale.display &&
    inputRequireComputed.value &&
    devis.value.filiales.length === 0
  ) {
    return false;
  } else {
    return formValidateApplyComputed.value.filiale.display;
  }
};

/**
 * permet de determiner le type de souscripteur et d'afficher ou non le representer par
 **/
const checkTypeOfSouscripteur = () => {
  if (formValidateApplyComputed.value.souscripteur.choixTypePersonne) {
    isSouscripteurIsPersonneMoralRef.value =
      !!modelRef.value?.souscripteurPersonneMorale?.raisonSociale;
    isDisplayRepresenteParRef.value = !!modelRef.value?.souscripteurPersonneMorale?.raisonSociale;
  }
};
</script>
<style scoped>
.col {
  padding-top: 0px;
  padding-bottom: 0px;
}
.v-expansion-panel {
  border-bottom: solid 2px #ddd;
  margin-top: 0px !important;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}
.custom-border-bg {
  border: solid 2px #dcdfe1 !important;
  background-color: var(--v-bg-default-base) !important;
}
.v-application .mt-10 {
  margin-top: 10px !important;
}
.v-application .mb-5 {
  margin: 0px 5px 5px 5px !important;
}
</style>
