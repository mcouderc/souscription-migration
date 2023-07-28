<template>
  <div>
    <ContainerModel1 :pending="devisIsEmptyComputed">
      <template #Header>
        <HeaderModel1>
          <template #Header-Title>
            <div>{{ contractTypeComputed }}</div>
          </template>
          <template #Header-SubTitle>
            <span class="sub-title">
              Devis n°{{ devisEntrepriseComputed.infoDevisHeader.numeroDevis }}
            </span>
          </template>
        </HeaderModel1>
      </template>
      <template #Body>
        <v-row no-gutters>
          <v-col cols="12" class="devis-status">
            <v-chip
              :class="[
                'text-overline pr-3 ',
                `status-color-${devisEntrepriseComputed.infoDevisHeader.statutDevis.toLowerCase()}`
              ]"
              label
              outlined
            >
              {{ getLabel(devis.statut) }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <ConsultDevis :devis="devis" />
            <TarifAdjustment
              :title="$t('page.devisOverview.ajustement')"
              :devis="devis"
              :taux-commission-courtier="tauxVariationRef.tauxCommissionCourtier"
              :taux-variation-prime-technique-min="tauxVariationRef.tauxVariationPrimeTechniqueMin"
              :taux-variation-prime-technique-max="tauxVariationRef.tauxVariationPrimeTechniqueMax"
              @buttonEmisDisabled="isButtonEmisDisabled = $event.needRecalcule"
              @tarifValues="calculateTarif($event)"
            />
            <div class="px-5 mb-5">
              <v-col cols="12" class="justify-space-between d-flex grid-gap-10">
                <v-btn type="button" color="error" :to="{ name: 'ListDevis' }">
                  <v-icon right dark class="mr-2"> mdi-close </v-icon>
                  {{ $t('forms.buttons.back') }}
                </v-btn>

                <div
                  class="action-wrapper"
                  v-if="
                    doesHavePermissionAmongAllRolesButConsultation() &&
                    devis.statut !== DevisStatutEnum.Refuse
                  "
                >
                  <div v-if="isEditableDevisComputed" class="d-flex grid-gap-10">
                    <v-menu offset-y>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn color="primary" class="white--text" v-bind="props">
                          {{ $t('forms.buttons.modify') }}<v-icon>mdi-menu-down</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-if="devis.statut !== DevisStatutEnum.Emis"
                          link
                          :to="
                            onRouteToCorrectTemplate(
                              devis.typeRisque,
                              devis?.formuleSouscrite?.idProduit,
                              { step: 'date-d-effet', id: devis.id }
                            )
                          "
                        >
                          <v-list-item-title
                            >{{ $t('forms.buttons.effectiveDate') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="checkDevis()"
                          link
                          :to="
                            onRouteToCorrectTemplate(
                              devis.typeRisque,
                              devis?.formuleSouscrite?.idProduit,
                              { step: 'tarification', id: devis.id },
                              false,
                              '1'
                            )
                          "
                        >
                          <v-list-item-title>
                            {{ $t('forms.buttons.choiceOfOffer') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="devis && devis.formuleSouscrite"
                          link
                          :to="
                            onRouteToCorrectTemplate(
                              devis.typeRisque,
                              devis?.formuleSouscrite?.idProduit,
                              {
                                step: 'info-complementaire',
                                id: devis.id
                              },
                              true
                            )
                          "
                        >
                          <v-list-item-title>
                            {{ $t('forms.buttons.additionalinfos') }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <v-btn
                      v-if="
                        devis.statut === DevisStatutEnum.BrouillonAValider ||
                        devis.statut === DevisStatutEnum.EtudeValidee
                      "
                      color="primary"
                      :disabled="isButtonEmisDisabled"
                      @click="checkBeforeEmitDevis()"
                    >
                      <v-icon right dark class="mr-2"> mdi-check </v-icon>
                      {{ $t('forms.buttons.emitDevis') }}
                    </v-btn>
                  </div>

                  <v-btn
                    v-if="devis.statut === DevisStatutEnum.Emis"
                    color="primary"
                    :to="
                      onRouteToCorrectTemplate(
                        devis.typeRisque,
                        devis?.formuleSouscrite?.idProduit,
                        {
                          step: 'validation-date-d-effet',
                          id: devis.id
                        }
                      )
                    "
                  >
                    <v-icon right dark class="mr-2"> mdi-check </v-icon>
                    {{ $t('forms.buttons.upgradeConvertContract') }}
                  </v-btn>
                  <v-btn
                    v-if="devis.statut === DevisStatutEnum.Expire"
                    color="primary"
                    @click="openDuplicationModal()"
                  >
                    <v-icon right dark class="mr-2">mdi-content-copy </v-icon>
                    {{ $t('forms.buttons.duplicateDevis') }}
                  </v-btn>
                  <v-btn
                    v-if="treatmentDevisComputed"
                    color="primary"
                    @click="openTreatmentModal()"
                  >
                    <v-icon right dark class="mr-2">mdi-wrench </v-icon>
                    {{ $t('forms.buttons.treatment') }}
                  </v-btn>
                  <v-btn
                    v-if="devis.statut === DevisStatutEnum.Emis"
                    color="primary"
                    @click="createNewDevis()"
                  >
                    <v-icon right dark class="mr-2"> mdi-file </v-icon
                    >{{ $t('forms.buttons.newDevis') }}
                  </v-btn>
                </div>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </template>
      <template #Column>
        <ColumnSlot class="mb-3" v-if="docMessageComputed">
          <span class="no-document-text">{{ docMessageComputed }}</span>
        </ColumnSlot>
        <ColumnSlot v-if="showDocumentsDownloadBlock()">
          <DocumentsDownload
            :devis-id="devis.id"
            :devis-status-has-just-change="devisStatusHasJustChangeRef"
          />
        </ColumnSlot>
        <ColumnSlot class="card-visu">
          <ConsultGaranties v-if="devis.id" />
        </ColumnSlot>
        <ColumnSlot class="card-visu" v-if="isOptionExistRef">
          <ConsultOptionsDevis v-if="devis.id" :intituleOption="intituleOptionRef" />
        </ColumnSlot>
        <ColumnSlot class="card-visu" v-if="isHistoriqueEtudeRef">
          <DetailEtude />
        </ColumnSlot>
      </template>
    </ContainerModel1>
    <DialogDuplication />
    <DialogDevisTreatment />
    <DialogEligibiliteAdmin @nextStep="onAdminNextAction()" />
  </div>
</template>

<script setup lang="ts">
import useSnackBar from '@/composables/useSnackBar';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';
import { format } from 'date-fns';
import { useApiCall } from '@/composables/api-call/useApiCall';
import {
  type DevisEntreprise,
  type Devis,
  type PatchDevis,
  type ProduitTauxVariation,
  type ReponseEligibilite,
  type PatchDevisDevisEntreprise,
  DevisStatutEnum,
  DevisEntrepriseStatutEnum,
  ReponseEligibiliteStatutEnum,
  DevisEntrepriseTypeRisqueEnum
} from 'open-api-souscription-typescript';
import {
  devisApi,
  getEligibiliteEntrepriseResponseApi,
  patchDevisApi,
  produitsApi
} from '@/plugins/open-api';
import { useI18n } from 'vue-i18n';
import eventBus from '@/plugins/eventBus';
import useLoader from '@/composables/useLoader';
import ContainerModel1 from '@/components/common/templates/ContainerModel1.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ColumnSlot from '@/components/common/templates/ColumnSlot.vue';
import DocumentsDownload from '@/components/devis/documents-download/DocumentsDownload.vue';
import DialogDuplication from '@/components/devis/forms/DialogDuplication.vue';
import DialogEligibiliteAdmin from '@/components/devis/forms/DialogEligibiliteAdmin.vue';
import TarifAdjustment from '@/components/devis/TarifAdjustment.vue';
import ConsultDevis from '@/views/consultDevis/ConsultDevis.vue';
import useDevisStore from '@/composables/useDevis';
import useRoutageProduit from '@/composables/useRoutageProduit';
import DialogDevisTreatment from '@/components/devis/forms/DialogDevisTreatment.vue';
import useStatus from '@/composables/useStatus';
import usePermission from '@/composables/authenticate/usePermission';
import ConsultGaranties from '@/components/devis/garanties/ConsultGaranties.vue';
import ConsultOptionsDevis from '@/components/devis/options/ConsultOptionsDevis.vue';
import DetailEtude from '@/components/devis/options/DetailEtude.vue';
import useConstante from '@/composables/useConstante';
import _ from 'lodash';

export interface ITauxVariation {
  tauxCommissionCourtier?: number;
  tauxVariationPrimeTechniqueMax?: number;
  tauxVariationPrimeTechniqueMin?: number;
}

interface IModulationTarifaire {
  tauxCommissionIaAjuste: number;
  tauxVariationPrimeTechnique: number;
}

const router = useRouter();
const { onRouteToCorrectTemplate } = useRoutageProduit();
const { COUNTRYS } = useConstante();
const pendingRef = ref(false);
const showDocumentsDownloadComponentRef = ref(false);
const devisStatusHasJustChangeRef = ref(false);
const newDesiredDateRef = ref('');
const isButtonEmisDisabled = ref(false);
const tauxVariationRef = ref<ITauxVariation>({});
const isOptionExistRef = ref<boolean>(false);
const isHistoriqueEtudeRef = ref<boolean>(false);
const intituleOptionRef = ref<string[]>([]);

const route = useRoute();
const { getLabel } = useStatus();
const { setLoaderGlobal } = useLoader();
const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const { setDevisAction, devis, getModel } = useDevisStore();
const {
  doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate,
  doesHavePermissionAmongAllRolesButBrokerAndConsultation,
  doesHavePermissionAmongAllRolesButConsultation
} = usePermission();

const {
  isLoading: isLoadingGetDevis,
  isError: isErrorGetDevis,
  data: devisResponse,
  doFetch: doFetchGetDevis
} = useApiCall<DevisEntreprise>({
  route: devisApi().getDevis
});

const {
  isLoading: isLoadingTauxVariation,
  isError: isErrorTauxVariation,
  data: tauxVariation,
  doFetch: doFetchTauxVariation
} = useApiCall<ProduitTauxVariation>({
  route: produitsApi().tauxVariation
});

const {
  isLoading: isLoadingGetEligibiliteEntreprise,
  isError: isErrorGetEligibiliteEntreprise,
  data: eligibiliteEntreprise,
  doFetch: doFetchGetEligibiliteEntreprise
} = useApiCall<ReponseEligibilite>({
  route: getEligibiliteEntrepriseResponseApi().getEligibiliteEntreprise
});

const {
  isLoading: isLoadingEmitDevis,
  isError: isErrorEmitDevis,
  data: emitDevisResponse,
  doFetch: doFetchEmitDevis
} = useApiCall<PatchDevisDevisEntreprise>({
  route: patchDevisApi().emitDevis
});

const {
  isLoading: isLoadingModulationTarifaire,
  errorMessage: errorMessageModulationTarifaire,
  isError: isErrorModulationTarifaire,
  data: modulationTarifResponse,
  doFetch: doFetchModulationTarifaire
} = useApiCall<Devis>({
  route: devisApi().modulationTarifaire
});

onMounted(() => {
  initForm();
  creationListOptions();
  isDetailEtudeCard();
});

const initForm = async () => {
  pendingRef.value = true;
  showDocumentsDownloadComponentRef.value = true;
  const id = Number(route.query.id);

  await doFetchGetDevis(id);
  if (isErrorGetDevis.value) {
    addMessageErrorSnackBarAction('Erreur recuperation devis');
  }
  if (devisResponse.value) {
    setDevisAction(devisResponse.value);
    newDesiredDateRef.value = devisResponse.value.dateEffet;
    getTauxVariation(devis.value?.formuleSouscrite?.idProduit);
  }
};

const showDocumentsDownloadBlock = () =>
  showDocumentsDownloadComponentRef.value &&
  !!devis?.value &&
  !!devis?.value.id &&
  devis?.value.statut !== DevisEntrepriseStatutEnum.Refuse;

const checkDevis = () => {
  return devis && devis.value.formuleSouscrite && devis.value.statut !== DevisStatutEnum.Emis;
};
const openDuplicationModal = () => {
  eventBus.emit('open-duplication-dialog');
};

const isEditableDevisComputed = computed(() => {
  const historique = devis.value?.historiques;
  return (
    devis.value.statut === DevisStatutEnum.BrouillonEnCours ||
    devis.value.statut === DevisStatutEnum.BrouillonAValider ||
    (devis.value.statut === DevisStatutEnum.Emis && !historique) ||
    (devis.value.statut === DevisStatutEnum.Emis &&
      !checkHistorique(historique[historique?.length - 1]?.type))
  );
});

const checkHistorique = (historique): boolean => {
  return (
    historique === 'EN_ETUDE_VERS_EMIS' ||
    historique === 'EN_ETUDE_N1_VERS_VALIDE' ||
    historique === 'EN_ETUDE_N2_VERS_VALIDE' ||
    historique === 'EN_ETUDE_N1_VERS_REFUSE' ||
    historique === 'EN_ETUDE_N2_VERS_REFUSE'
  );
};

const openTreatmentModal = () => {
  eventBus.emit('open-treatment-dialog');
};

const isDetailEtudeCard = () => {
  isHistoriqueEtudeRef.value = false;
  if (devis.value?.historiques) {
    devis.value.historiques.forEach((historique) => {
      if (checkHistorique(historique.type)) {
        isHistoriqueEtudeRef.value = true;
      }
    });
  } else if (
    devis.value.statut === DevisEntrepriseStatutEnum.EnEtudeN1 ||
    devis.value.statut === DevisEntrepriseStatutEnum.EnEtudeN2
  ) {
    isHistoriqueEtudeRef.value = true;
  }
};

const creationListOptions = () => {
  if (devis.value.formuleSouscrite?.formulesExtras.length > 0) {
    devis.value.formuleSouscrite.formulesExtras.forEach((option) => {
      if (option.nomFormule !== '') {
        isOptionExistRef.value = true;
        intituleOptionRef.value.push(option.nomFormule);
      }
    });
  }
};

const getTauxVariation = async (idProduct: number) => {
  await doFetchTauxVariation(idProduct);
  if (isErrorTauxVariation.value) {
    addMessageErrorSnackBarAction('Erreur recuperation taux de variation');
  }
  if (tauxVariation.value) {
    tauxVariationRef.value = tauxVariation.value;
  }
  pendingRef.value = false;
};

const docMessageComputed = computed(() => {
  switch (devis.value.statut) {
    case DevisEntrepriseStatutEnum.BrouillonEnCours: {
      return i18n.t('overview.messages.creationNotValidatedDevis');
    }
    case DevisEntrepriseStatutEnum.BrouillonAValider: {
      return i18n.t('overview.messages.validatedDevis');
    }
    case DevisEntrepriseStatutEnum.EnEtudeN1: {
      return i18n.t('overview.messages.inStudyDevis');
    }
    case DevisEntrepriseStatutEnum.EnEtudeN2: {
      return i18n.t('overview.messages.inStudyDevis');
    }
    case DevisEntrepriseStatutEnum.Expire: {
      return i18n.t('overview.messages.expiredDevis');
    }
    default:
      return null;
  }
});

const treatmentDevisComputed = computed(() => {
  return (
    (devis.value.statut === DevisEntrepriseStatutEnum.EnEtudeN1 &&
      doesHavePermissionAmongAllRolesButBrokerAndConsultation()) ||
    (devis.value.statut === DevisEntrepriseStatutEnum.EnEtudeN2 &&
      doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate())
  );
});

const devisIsEmptyComputed = computed(() => {
  return pendingRef.value;
});

const contractTypeComputed = computed(() => {
  return `${devis.value?.formuleSouscrite?.nomProduit || ''} ${
    devis.value?.formuleSouscrite?.nomFormule || ''
  }`;
});

const devisEntrepriseComputed = computed(() => {
  const devisEntrepriseModel = {
    infoDevisHeader: {
      numeroDevis: devis.value?.numeroDevis || '',
      statutDevis: devis.value?.statut || ''
    }
  };

  return devisEntrepriseModel;
});

const createNewDevis = () => {
  setDevisAction(_.merge(getModel(), devis.value));
  devis.value.statut = DevisEntrepriseStatutEnum.BrouillonEnCours;
  devis.value.dateEffet = format(new Date(), 'yyyy-MM-dd');
  delete devis.value.id;
  setDevisAction(devis.value);
  const productId = devis.value.formuleSouscrite.idProduit.toString();
  router.replace({
    name: 'SouscriptionMarketProduct',
    params: {
      market: devis.value.typeRisque,
      product: productId
    },
    query: {
      new: 'true'
    }
  });
};

const checkBeforeEmitDevis = async () => {
  const sirets =
    devis.value.souscripteurPersonneMorale?.identifiantLegal !== ''
      ? [devis.value.souscripteurPersonneMorale?.identifiantLegal]
      : [];
  const pays = devis.value.souscripteurPersonneMorale?.adresse?.pays;
  //Recuperation des siret des filiales
  sirets.push(...devis.value.filiales.map((filiale) => filiale.identifiantLegal));
  //Check if pays is FRANCE
  const isFrance = COUNTRYS.FR === pays;
  if (
    sirets &&
    sirets.length > 0 &&
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise &&
    isFrance
  ) {
    await doFetchGetEligibiliteEntreprise(pays, devis.value.dateEffet, sirets);
    if (isErrorGetEligibiliteEntreprise.value) {
      addMessageErrorSnackBarAction(i18n.tc('snackBar.error'));
    }
    if (eligibiliteEntreprise.value) {
      if (
        eligibiliteEntreprise.value.statut === ReponseEligibiliteStatutEnum.Autorise ||
        eligibiliteEntreprise.value.statut === ReponseEligibiliteStatutEnum.NonDetermine
      ) {
        emitDevis();
      } else {
        if (doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()) {
          eventBus.emit('open-eligibilite-admin-dialog');
        } else {
          addMessageErrorSnackBarAction(i18n.tc('page.subscription.noSiret.subTitle'));
        }
      }
    }
  } else {
    emitDevis();
  }
};

const onAdminNextAction = () => {
  emitDevis();
};

const emitDevis = async () => {
  await doFetchEmitDevis(devis.value.id, { type: 'EMISSION' } as PatchDevis);
  if (isErrorEmitDevis.value) {
    addMessageErrorSnackBarAction(i18n.tc('page.devisOverview.recuperationDevis.error'));
  }
  if (emitDevisResponse.value) {
    setDevisAction(emitDevisResponse.value);
    addMessageSuccesSnackBarAction(i18n.tc('page.devisOverview.recuperationDevis.success'));
    devisStatusHasJustChangeRef.value = true;
  }
};

const calculateTarif = async (data: IModulationTarifaire) => {
  await doFetchModulationTarifaire(devis.value.id.toString(), data);
  if (errorMessageModulationTarifaire.value || isErrorModulationTarifaire.value) {
    addMessageErrorSnackBarAction(
      errorMessageModulationTarifaire.value?.response?.data?.detail ??
        i18n.tc('page.devisOverview.recalculTarif.error')
    );
  }
  if (modulationTarifResponse.value) {
    setDevisAction(modulationTarifResponse.value);
    addMessageSuccesSnackBarAction(i18n.tc('page.devisOverview.recalculTarif.success'));
  }
};

watch(
  () => devis.value.statut,
  () => {
    isDetailEtudeCard();
  },
  { deep: true }
);

watch(
  () => [
    isLoadingGetDevis.value,
    isLoadingEmitDevis.value,
    isLoadingTauxVariation.value,
    isLoadingModulationTarifaire.value,
    isLoadingGetEligibiliteEntreprise.value
  ],
  ([
    isLoadingGetDevis,
    isLoadingEmitDevis,
    isLoadingTauxVariation,
    isLoadingModulationTarifaire,
    isLoadingGetEligibiliteEntreprise
  ]) => {
    setLoaderGlobal({
      isLoading:
        isLoadingGetDevis ||
        isLoadingEmitDevis ||
        isLoadingTauxVariation ||
        isLoadingModulationTarifaire ||
        isLoadingGetEligibiliteEntreprise
    });
  }
);
</script>

<style scoped>
.action-wrapper {
  display: flex;
  flex-wrap: wrap;
  grid-gap: 10px;
}
.devis-status {
  position: absolute;
  top: -47px;
  text-align: end;
}
.devis-header {
  width: 100%;
  padding: 30px 30px 10px 30px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.devis-header-info {
  width: 45%;
}
.devis-header-info.right {
  text-align: right;
}
.no-document-text {
  color: #bbb;
  font-size: 1.3rem;
  font-style: italic;
}
.grid-gap-10 {
  grid-gap: 20px 10px;
}
.v-application .mb-5 {
  margin-bottom: 0px !important;
}
.sub-title {
  z-index: 1;
  position: sticky;
}
</style>
