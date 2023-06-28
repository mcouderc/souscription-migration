<template>
  <v-container>
    <!--Formulaire criteres valo + loader -->
    <v-row v-show="!pendingFormRef">
      <TarificationForm
        @pendingForm="getPendingForm($event)"
        @errorCalculTarif="getErrorCalculTarif($event)"
        @formulesValorisees="getproduitCalculResult($event)"
        @removeFormulesOptions="reinitialisationCalcul()"
        @pendingFormules="getPendingFormule($event)"
        @dataForm="getDataForm($event)"
        @nextStep="nextStepLocal($event)"
        @previousStep="previousStepLocal($event)"
      />
    </v-row>
    <div class="loader" v-if="pendingFormRef">
      <v-progress-circular indeterminate :size="80" color="primary"></v-progress-circular>
    </div>

    <!--message erreurs-->
    <v-row v-if="errorCalculTarifRef.length">
      <v-col cols="12">
        <ErrorsCalculTarif :errorCalculTarif="errorCalculTarifRef" />
      </v-col>
    </v-row>

    <!--tableau formules-->
    <div v-if="formulesValoriseesRef.length">
      <v-row class="titre-tooltip">
        <v-col v-if="optionsWithoutFormula.length > 0" cols="3"></v-col>
        <v-col :cols="isOptionExisted()">
          <template>
            <v-container class="message-tooltip">
              {{ $t('page.tarification.detailGarantie') }} <v-icon color="green">mdi-check</v-icon>
            </v-container>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="optionsWithoutFormula.length > 0" cols="3"
          ><OptionsSwitch
            :produitCalculResult="formulesValoriseesRef"
            :pendingPrice="pendingPriceRef"
            :garantiesConditionnees="getGarantiesConditionneesRef"
            :dataFormulesFormatees="dataFormulesFormateesRef"
            :dataForm="dataFormRef"
            :formuleValoSansOption="formuleValoListRef"
            :optionsWithoutFormula="optionsWithoutFormula"
            @dataFormulesFormateesAvecOptions="getNewPrice($event)"
            @optionsSelected="getselectedOptions($event)"
        /></v-col>
        <v-col :cols="isOptionExisted()" v-if="formulesValoriseesRef">
          <DataTableFormules
            :pendingPrice="pendingPriceRef"
            :intitulesGaranties="headersGarantiesFinal"
            :dataFormulesFormatees="dataFormulesFormateesRef"
            @formulaSelected="getFormulaSelected($event)"
            :key="variablePourUpdateComposant"
          />
        </v-col>
      </v-row>
    </div>
    <div v-else-if="pendingFormulesRef">
      <v-row class="loader-bis">
        <v-col cols="12">
          <template>
            <v-overlay>
              <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
            </v-overlay>
          </template>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TarificationForm from '@/components/devis/tarification/TarificationForm.vue';
import OptionsSwitch from '@/components/devis/tarification/OptionsSwitchList.vue';
import ErrorsCalculTarif from '@/components/devis/tarification/ErrorsCalculTarif.vue';
import type IFormulaValorisee from '@/models/interfaceEligibility/IFormulaValorisee';
import { devisApi, devisHydratorFromFormuleSouscriteApi } from '@/plugins/open-api';
import useDevis from '@/composables/useDevis';
import { useRoute, useRouter } from 'vue-router/composables';
import useSelectedProduct from '@/composables/useSelectedProduct';
import type {
  DevisEntreprise,
  DevisEntrepriseDevisHydratationFormuleSouscrite,
  DevisHydratorFromFormuleSouscriteDevisHydratation,
  DevisHydratorFromFormuleSouscriteDevisHydratationDevis,
  FormuleExtraDevisHydratation,
  ValorisationCritere
} from 'open-api-souscription-typescript';
import { useI18n } from 'vue-i18n';
import useSnackBar from '@/composables/useSnackBar';
import useBodyTableTarificationService from '@/composables/useBodyTableTarificationService';
import DataTableFormules from '@/components/devis/tarification/DataTableFormules/DataTableFormules.vue';
import useConstante from '@/composables/useConstante';
import useRoutageProduit from '@/composables/useRoutageProduit';
import type IGroupesGaranties from '@/models/interfaceEligibility/IGroupesGaranties';
import type IGarantie from '@/models/interfaceEligibility/IGarantie';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';
import type IFormulaSelected from '@/models/interfaceEligibility/IFormulaSelected';

const emit = defineEmits(['nextStep', 'previousStep']);

const nextStepLocal = (value: boolean) => {
  emit('nextStep', value);
};

const previousStepLocal = (value: boolean) => {
  emit('previousStep', value);
};

const route = useRoute();
const { devis, setDevisAction } = useDevis();
const { product } = useSelectedProduct();
const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const { getListGroupementsGarantiesDepuisUneFormule, headersGarantiesFinal } =
  useBodyTableTarificationService();
const { COPIE_EXPIRE } = useConstante();
const router = useRouter();
const { onRouteToCorrectTemplate } = useRoutageProduit();

const variablePourUpdateComposant = ref<number>(0);

const pendingFormRef = ref<boolean>(false);
const pendingFormulesRef = ref<boolean>(false);
const errorCalculTarifRef = ref<string[]>([]);
const formulesValoriseesRef = ref<IFormulaValorisee[]>([]);
const getGarantiesConditionneesRef = ref<IFormulaValorisee[]>([]);
const selectedOptionsRef = ref<IFormulaValorisee[]>([]);
const saveIdToContinueRef = ref<number>(null);
const formulesExtrasHydratationFromFormuleRef = ref<FormuleExtraDevisHydratation[]>([]);
const idFormulesExtrasUniqueHydratationFromFormuleRef = ref<FormuleExtraDevisHydratation>({});
const formuleSelectedRef = ref<IFormulaSelected>(null);
const optionsWithoutFormula = ref<IFormulaValorisee[]>([]);

const isUpdateRef = ref<boolean>(false);
const devisRef = ref<DevisEntreprise>(devis.value);

const formuleValoListRef = ref<IFormulaValorisee[]>([]);
const garantieIncluseDansFormule = ref<IGarantieContenueOuIntituleGarantieHeader>({});
const dataFormulesFormateesRef = ref<IGarantieContenueOuIntituleGarantieHeader[]>([]);

const dataFormRef = ref<ValorisationCritere[]>([]);

//METHODES
//Récupération des informations des events
const getproduitCalculResult = ($event: IFormulaValorisee[]): IFormulaValorisee[] => {
  formulesValoriseesRef.value = $event;
  getGarantiesConditionnees();
  getListGroupementsGarantiesDepuisUneFormule(formulesValoriseesRef.value);
  getAllFormulaWithoutOptions(formulesValoriseesRef.value);
  getAllOptionsWithoutFormula(formulesValoriseesRef.value);
  return formulesValoriseesRef.value;
};

const getPendingForm = ($event: boolean): boolean => {
  pendingFormRef.value = $event;
  return pendingFormRef.value;
};

const getDataForm = ($event: ValorisationCritere[]): ValorisationCritere[] => {
  return (dataFormRef.value = $event);
};

const getPendingFormule = ($event: boolean): boolean => {
  pendingFormulesRef.value = $event;
  return pendingFormulesRef.value;
};

const getErrorCalculTarif = ($event: string[]): string[] => {
  errorCalculTarifRef.value = $event;
  return errorCalculTarifRef.value;
};

const getNewPrice = (newDataFormuleFormatee: IGarantieContenueOuIntituleGarantieHeader[]) => {
  dataFormulesFormateesRef.value = newDataFormuleFormatee;
  variablePourUpdateComposant.value++;
  pendingPriceRef.value = false;
};

const getFormulaSelected = (idCode: IFormulaSelected): void => {
  formuleSelectedRef.value = idCode;
  getFormulesExtrasForSelectedFormule();
};

const getselectedOptions = (selectedOptions) => {
  selectedOptionsRef.value = selectedOptions.selectedOptionsRef.value;
};

//Récupération des formules en fonction de leur type (option/formule/garantie cond)
const getGarantiesConditionnees = (): IFormulaValorisee[] => {
  return (getGarantiesConditionneesRef.value = formulesValoriseesRef.value.filter(
    (el: IFormulaValorisee) => el.formule.type === 'GARANTIE_CONDITIONNEE'
  ));
};

const getAllFormulaWithoutOptions = (produitCalculResult: IFormulaValorisee[]) => {
  formuleValoListRef.value = [];
  formuleValoListRef.value = produitCalculResult.filter(
    (el: IFormulaValorisee) => el.formule.type === 'FORMULE'
  );
  formtItems();
};

const getAllOptionsWithoutFormula = (produitCalculResult: IFormulaValorisee[]) => {
  optionsWithoutFormula.value = produitCalculResult.filter(
    (el: IFormulaValorisee) => el.formule.type === 'OPTION'
  );
};

//Sélectionner une formule
const getFormulesExtrasForSelectedFormule = async () => {
  formulesExtrasHydratationFromFormuleRef.value = [];
  //permet de construire le tableau des ids des options applicables et selectionnées + garanties conditionnees de la formule sélectionnée
  if (getGarantiesConditionneesRef.value) {
    idFormulesExtrasUniqueHydratationFromFormuleRef.value = {};
    getGarantiesConditionneesRef.value.forEach((garantieCond) => {
      idFormulesExtrasUniqueHydratationFromFormuleRef.value = {};
      if (garantieCond.formule.formulesApplication.includes(formuleSelectedRef.value.code)) {
        idFormulesExtrasUniqueHydratationFromFormuleRef.value.idFormule = garantieCond.formule.id;
        formulesExtrasHydratationFromFormuleRef.value.push(
          idFormulesExtrasUniqueHydratationFromFormuleRef.value
        );
      }
    });
  }

  if (selectedOptionsRef.value) {
    idFormulesExtrasUniqueHydratationFromFormuleRef.value = {};
    selectedOptionsRef.value.forEach((option) => {
      idFormulesExtrasUniqueHydratationFromFormuleRef.value = {};
      if (option.formule.formulesApplication.includes(formuleSelectedRef.value.code)) {
        idFormulesExtrasUniqueHydratationFromFormuleRef.value.idFormule = option.formule.id;
        idFormulesExtrasUniqueHydratationFromFormuleRef.value.nomFormule = option.formule.nom;
        formulesExtrasHydratationFromFormuleRef.value.push(
          idFormulesExtrasUniqueHydratationFromFormuleRef.value
        );
      }
    });
  }

  if (formuleSelectedRef.value) {
    addedFormula();
  }
};

const addedFormula = async () => {
  //Si nous avons un numéros de devis il faut l'enregistrer pour le persister.
  //Parce que l'hydratation fait une requête POST qui ne peut pas avoir un ID.
  if (devis.value.id !== null && devis.value.id !== undefined && devis.value.id !== 0) {
    saveIdToContinueRef.value = devis.value.id;
  }

  //l'objet d'appel de l'hydration {devis: {}, formuleSouscrite: {}}
  //d'abord la partie formule souscrite
  const devisEntrepriseDevisHydratationFormuleSouscrite = {
    idProduit: product.value.id,
    idFormule: formuleSelectedRef.value.id,
    formulesExtras: formulesExtrasHydratationFromFormuleRef.value
  };
  //puis on rajoute le devis à l'objet final
  const devisHydratorFromFormuleSouscriteDevisHydratation = {
    devis: devis.value as DevisHydratorFromFormuleSouscriteDevisHydratationDevis,
    formuleSouscrite:
      devisEntrepriseDevisHydratationFormuleSouscrite as DevisEntrepriseDevisHydratationFormuleSouscrite
  } as DevisHydratorFromFormuleSouscriteDevisHydratation;
  //appel à la route d'hydratation

  devisHydratorFromFormuleSouscriteApi()
    .hydrateDevisFormuleSouscrite(devisHydratorFromFormuleSouscriteDevisHydratation)
    .then((response) => {
      if (saveIdToContinueRef.value) {
        response.data.id = saveIdToContinueRef.value;
      }
      setDevisAction(response.data);

      if (isUpdateRef.value) {
        updateDevis();
      } else if (route.query?.new) {
        createDevis();
      } else {
        onNextStepAction();
      }
    })
    .catch(() => {
      addMessageErrorSnackBarAction(i18n.tc('page.tarification.errorHydrate'));
    });
};

//Formatage des données des formules pour qu'elles soient utilisable dans le tableau
const formtItems = (): void => {
  dataFormulesFormateesRef.value = [];
  garantieIncluseDansFormule.value = {};

  formuleValoListRef.value.forEach((formuleValo: IFormulaValorisee) => {
    garantieIncluseDansFormule.value = {};
    garantieIncluseDansFormule.value.name = formuleValo.formule.nom;
    garantieIncluseDansFormule.value.id = formuleValo.formule.id;
    garantieIncluseDansFormule.value.code = formuleValo.formule.code;
    garantieIncluseDansFormule.value.price = formuleValo.primeTTC;
    garantieIncluseDansFormule.value.formulesExtras = [];

    formuleValo.formule.groupesGarantiesServices?.forEach((gpeGaranties: IGroupesGaranties) => {
      gpeGaranties.garanties.forEach((garantie: IGarantie) => {
        if (garantie.estApplicable) {
          garantieIncluseDansFormule.value[garantie.type + '-' + garantie.id] = {
            clauses: garantie.clauses,
            nom: garantie.nom,
            exemple: garantie.exemple
          };
        }
      });

      gpeGaranties.prestations.forEach((presta: IGarantie) => {
        if (presta.estApplicable) {
          garantieIncluseDansFormule.value[presta.type + '-' + presta.id] = {
            clauses: presta.clauses,
            nom: presta.nom,
            exemple: presta.exemple
          };
        }
      });

      gpeGaranties.services.forEach((garantie: IGarantie) => {
        if (garantie.estApplicable) {
          garantieIncluseDansFormule.value[garantie.type + '-' + garantie.id] = {
            clauses: garantie.clauses,
            nom: garantie.nom,
            exemple: garantie.exemple
          };
        }
      });
    });
    if (!selectedOptionsRef.value.length) {
      dataFormulesFormateesRef.value.push(garantieIncluseDansFormule.value);
    } else {
      formtItemsWithOptions(formuleValo);
    }
  });
};

const formtItemsWithOptions = (formuleValo: IFormulaValorisee) => {
  selectedOptionsRef.value.forEach((formuleValoOption: IFormulaValorisee) => {
    if (formuleValoOption.formule.formulesApplication.includes(formuleValo.formule.code)) {
      formuleValoOption.formule.groupesGarantiesServices.forEach(
        (gpeGaranties: IGroupesGaranties) => {
          gpeGaranties.garanties.forEach((garantie: IGarantie) => {
            garantieIncluseDansFormule.value[garantie.type + '-' + garantie.id] = {
              clauses: garantie.clauses,
              nom: garantie.nom,
              exemple: garantie.exemple
            };
          });

          gpeGaranties.prestations.forEach((presta: IGarantie) => {
            garantieIncluseDansFormule.value[presta.type + '-' + presta.id] = {
              clauses: presta.clauses,
              nom: presta.nom,
              exemple: presta.exemple
            };
          });

          gpeGaranties.services.forEach((garantie: IGarantie) => {
            garantieIncluseDansFormule.value[garantie.type + '-' + garantie.id] = {
              clauses: garantie.clauses,
              nom: garantie.nom,
              exemple: garantie.exemple
            };
          });
        }
      );
    }
  });
  dataFormulesFormateesRef.value.push(garantieIncluseDansFormule.value);
};

//Gestion du devis
const createDevis = async () => {
  devis.value.valorisationCritere = dataFormRef.value;
  const model: DevisEntreprise = JSON.parse(JSON.stringify(devis.value));
  delete model['id'];
  delete model['numeroDevis'];
  try {
    const response = await devisApi().createDevis(model);
    if (response.data) {
      setDevisAction(response.data);
      addMessageSuccesSnackBarAction(i18n.tc('devis.creation.success'));
      if (route.query?.new === COPIE_EXPIRE) {
        router.push({
          name: 'OverviewDevis',
          query: { id: response.data.id.toString() }
        });
      } else {
        const query = {
          step: 'info-complementaire',
          id: devis.value.id
        };
        router.replace(
          onRouteToCorrectTemplate(devis.value.typeRisque, product.value.id, query, true)
        );
        onNextStepAction();
      }
    }
  } catch {
    addMessageErrorSnackBarAction(i18n.tc('devis.creation.error'));
  }
};

const updateDevis = () => {
  devisRef.value.valorisationCritere = dataFormRef.value;
  devisApi()
    .updateDevis(devis.value.id, devis.value)
    .then((response) => {
      setDevisAction(response.data);
      onNextStepAction();
    })
    .catch(() => {
      addMessageErrorSnackBarAction(i18n.tc('page.tarification.errorUpdate'));
    });
};

const reinitialisationCalcul = (): void => {
  formulesValoriseesRef.value = [];
  errorCalculTarifRef.value = [];
  selectedOptionsRef.value = [];
};

const isOptionExisted = (): number => {
  return optionsWithoutFormula.value.length > 0 ? 9 : 12;
};

const onNextStepAction = () => {
  emit('nextStep', true);
};

watch(
  () => selectedOptionsRef.value,
  () => {
    if (formulesValoriseesRef.value.length && formulesValoriseesRef.value.length > 1) {
      dataFormulesFormateesRef.value = [];
      pendingPriceRef.value = true;
      formtItems();
    }
  }
);

const pendingPriceRef = ref<boolean>(false);
</script>
<style scoped>
.loader {
  text-align: center;
  margin-top: 100px;
}
.loader-bis {
  text-align: center;
  margin-top: 10px;
}
.titre-formule {
  font-size: 20px;
  margin-left: -10px;
}
.message-tooltip {
  font-size: 12px;
  margin-left: -10px;
}
.titre-tooltip {
  margin-bottom: -50px;
  align-items: baseline;
}
</style>
