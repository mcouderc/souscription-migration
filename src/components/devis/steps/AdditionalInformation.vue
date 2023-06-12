<template>
  <validation-observer ref="observer">
    <form>
      <ContainerModel1 :pending="pendingRef">
        <template #Header>
          <HeaderModel1>
            <template #Header-Title>Devis</template>
            <template #Header-SubTitle>{{ subtitle }}</template>
          </HeaderModel1>
        </template>

        <template #Body>
          <v-expansion-panels v-model="panelOpenRef" flat multiple accordion>
            <!--            Accordéon  souscripteur -->
            <v-expansion-panel v-if="formValidateApplyComputed.souscripteur.display">
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.subscriber') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <validation-observer>
                  <FormSubscriber
                    :data="modelRef"
                    :taking-status-into-account="takingStatusIntoAccount"
                    :suscriber-form-value-validate="formValidateApplyComputed.souscripteur"
                    :compar-disabled-copro="tabComparToDisabledCoproRef"
                    @changeTypePersonne="changeTypePersonne"
                    @checkIfObjectIsSame="checkIfObjectIsSame"
                    @checkEligibility="checkEligibility($event)"
                  ></FormSubscriber>
                </validation-observer>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!--            Accordéon  Représenté par -->
            <v-expansion-panel v-if="isDisplayRepresenteParRef">
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.representedBy') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FormRepresentedBy
                  :data="modelRef.representantPersonnePhysique"
                  :taking-status-into-account="takingStatusIntoAccount"
                  :statut="modelRef.statut"
                  @checkIfObjectIsSame="checkIfObjectIsSame"
                  :represented-by-form-value-validate="formValidateApplyComputed.representePar"
                ></FormRepresentedBy>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!--            Accordéon Bénéficiaire -->
            <v-expansion-panel v-if="formValidateApplyComputed.beneficiaire.display">
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.beneficiary') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FormBeneficiary
                  :data="modelRef"
                  :taking-status-into-account="takingStatusIntoAccount"
                  @checkIfObjectIsSame="checkIfObjectIsSame"
                  :beneficiare-form-value-validate="formValidateApplyComputed.beneficiaire"
                ></FormBeneficiary>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!--            Accordeon  Description risque-->
            <v-expansion-panel v-if="formValidateApplyComputed.descriptionRisque.display">
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.riskDescription') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FormRisk
                  :data="modelRef"
                  :taking-status-into-account="takingStatusIntoAccount"
                  :description-risk-form-value-validate="
                    formValidateApplyComputed.descriptionRisque
                  "
                  @checkIfObjectIsSame="checkIfObjectIsSame()"
                ></FormRisk>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="isFillialeVisible()">
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.branch') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FormFiliales
                  :data="modelRef"
                  :taking-status-into-account="takingStatusIntoAccount"
                  :filiale-value-validate="formValidateApplyComputed.filiale"
                  :button-disabled="!checkFormatSiret()"
                  @checkIfObjectIsSame="checkIfObjectIsSame()"
                ></FormFiliales>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!--            Accordeon  Antécédent -->
            <v-expansion-panel v-if="formValidateApplyComputed.antecedent.display">
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.history') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FormAntecedent
                  :data="modelRef"
                  @checkIfObjectIsSame="checkIfObjectIsSame"
                  :taking-status-into-account="takingStatusIntoAccount"
                  :antecedant-form-value-validate="formValidateApplyComputed.antecedent"
                  :is-update="isUpdateRef"
                ></FormAntecedent>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <InfoGarantie>
              {{ subtitle }}
            </InfoGarantie>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-col cols="12">
                  <h2 class="text-primary text-h6 text-capitalize">
                    {{ $t('page.additionalInformation.editor') }}
                  </h2>
                </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FormEditor
                  v-model="modelRef.emisPar"
                  :taking-status-into-account="takingStatusIntoAccount"
                  @checkIfObjectIsSame="checkIfObjectIsSame"
                ></FormEditor>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-row class="px-5 mt-10 mb-5">
            <v-col cols="12" class="pa-0 mt-5">
              <ContainerButtons1 @cancelResponse="back()" @submitResponse="submitFormDevis()">
                <template v-if="!update" #Cancel>
                  <v-icon left> mdi-arrow-left-bold </v-icon>
                  {{ $t('forms.buttons.back') }}
                </template>
                <template #Submit>
                  <v-icon left> mdi-check </v-icon>
                  <template v-if="!update">
                    {{ $t('forms.buttons.next') }}
                  </template>
                  <template v-else> {{ $t('forms.buttons.update') }} </template>
                </template>
              </ContainerButtons1>
            </v-col>
          </v-row>
        </template>
        <template #Column>
          <ColumnSlot v-if="formValidateApplyComputed.souscripteur.identifiantLegal.visible">
            <!--Add condition s'il est éligible-->
            <v-col cols="12" class="text-body text-default">
              <ButtonAutocompletionSiret :devis="modelRef" @devisFromPapper="devisFromPapper()" />
            </v-col>
          </ColumnSlot>
          <ColumnSlot>
            <v-col v-if="isVisible" cols="12" class="text-body text-default">
              <InfoRequiredCreateDevis
                :model="modelRef"
                :statut="devis.statut"
                :personne-morale="isSouscripteurIsPersonneMoralRef"
                :siret-is-required="
                  isRequired(
                    formValidateApplyComputed.souscripteur.identifiantLegal,
                    takingStatusIntoAccount
                  )
                "
                :taking-status-into-account="takingStatusIntoAccount"
              />
            </v-col>
            <v-col v-if="devis.numeroDevis" cols="12" class="mb-5">
              <small class="mb-5">
                {{ $t('page.additionalInformation.number') }}
                <b>{{ devis.numeroDevis }}</b>
              </small>
              <v-divider />
            </v-col>
            <v-col v-if="isSaveIsVisible()" cols="12">
              <p class="text-body-2 mt-5">Pensez à enregistrer votre progression.</p>
              <v-btn
                pain
                elevation="0"
                block
                color="primary"
                :loading="btnLoadingSaveRef"
                @click.prevent="saveform"
              >
                <v-icon right dark class="mr-2"> mdi-content-save </v-icon>
                {{ $t('forms.buttons.save') }}
              </v-btn>
            </v-col>
            <v-overlay v-if="pendingDevisNumberRef" :light="true" absolute>
              <v-progress-circular indeterminate size="25" />
            </v-overlay>
          </ColumnSlot>
        </template>
      </ContainerModel1>
    </form>
    <DialogDevisEtude @continueProcess="submitFormToEtude($event)" />
    <DialogError />
    <DialogEligibiliteAdmin @nextStep="onAdminNextAction()" />
  </validation-observer>
</template>

<script setup lang="ts">
import {
  type DevisEntreprise,
  DevisEntrepriseStatutEnum,
  type PatchDevis,
  DevisEntrepriseTypeRisqueEnum,
  ReponseEligibiliteStatutEnum
} from 'open-api-souscription-typescript';
import { ValidationObserver } from 'vee-validate';
import FormSubscriber from '@/components/devis/forms/FormSubscriber.vue';
import FormRepresentedBy from '@/components/devis/forms/FormRepresentedBy.vue';
import InfoGarantie from '@/components/devis/InfoGarantie.vue';
import FormRisk from '@/components/devis/forms/FormRisk.vue';
import FormFiliales from '@/components/devis/forms/FormFiliales.vue';
import FormAntecedent from '@/components/devis/forms/FormAntecedent.vue';
import FormEditor from '@/components/devis/forms/FormEditor.vue';
import ContainerModel1 from '@/components/common/templates/ContainerModel1.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ColumnSlot from '@/components/common/templates/ColumnSlot.vue';
import InfoRequiredCreateDevis from '@/components/devis/InfoRequiredCreateDevis.vue';
import ButtonAutocompletionSiret from '@/components/common/form/ButtonAutocompletionSiret.vue';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import DialogEligibiliteAdmin from '@/components/devis/forms/DialogEligibiliteAdmin.vue';
import DialogDevisEtude from '@/components/devis/forms/DialogDevisEtude.vue';
import DialogError from '@/components/devis/forms/DialogError.vue';
import validationRulesSiret from '@/services/validationRulesSiret';
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
import FormBeneficiary from '@/components/devis/forms/FormBeneficiary.vue';
import { devisInitiatorApi } from '@/plugins/open-api';
import useFormeJuridiqueStore from '@/composables/useFormeJuridiqueStore';
import useListTypage from '@/composables/useListTypage';
import useConstante from '@/composables/useConstante';

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
