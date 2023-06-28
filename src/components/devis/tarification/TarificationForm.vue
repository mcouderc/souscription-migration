<template>
  <ContainerModel1>
    <template #Header>
      <HeaderModel1 :color="false">
        <template #Header-Title>
          {{ devis.formuleSouscrite?.nomProduit || '' }}
        </template>
      </HeaderModel1>
    </template>
    <template #Body v-if="isHiddenRef">
      <validation-observer ref="observerValuationRef">
        <form>
          <v-container v-if="inputsValuationCriteriaRef.length">
            <v-row>
              <v-col>
                <div class="text-form">
                  <strong>
                    <p>{{ $t('page.tarification.title') }}</p>
                  </strong>
                </div>
              </v-col>
            </v-row>
            <v-row v-if="!isProfessionalProduct()">
              <v-col cols="4">
                <validation-provider name="select-country" rules="required">
                  <SelectCountry
                    v-model="dataFormPaysRef"
                    input-id="select-country"
                    :title="$tc('page.subscription.siret.form.selectCountry')"
                    :items="itemsCountryRef"
                    :items-keys="['countryList', 'nom', 'code']"
                    :is-required="true"
                    :is-disabled="product.pays.length === 1"
                    @changeCountry="removeFormules()"
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                v-for="(input, index) in inputsValuationCriteriaRef"
                :key="index"
                :cols="4"
                class="criteres"
              >
                <validation-provider v-slot="{ errors }" :name="input.nom" rules="required">
                  <template v-if="setType(input.type) !== 'valeurs'">
                    <span :class="starStyle(false)">
                      <strong>* </strong>
                    </span>
                    <label :class="labelStyle(errors, false)">
                      {{ input.nom }}
                      <span v-if="input.unite">{{ ' (' + input.unite + ')' }}</span></label
                    >
                    <v-text-field
                      class="mt-0 pt-0"
                      :id="input.nom"
                      v-model="dataFormRef[index].valeurTarification"
                      :light="true"
                      :type="setType(input.type)"
                      :name="input.nom"
                      step="any"
                      :min="0"
                      :data-cy="input.id"
                      :title="input.nom"
                      :error-messages="errors"
                      required
                      hide-spin-buttons
                      @wheel="$event.target.blur()"
                      @input="formatNumberWriting(index)"
                      @keyup="removeFormules()"
                      @click="removeFormules()"
                      @keydown="checkCaract($event)"
                    >
                    </v-text-field
                  ></template>
                  <template v-else>
                    <span :class="starStyle(false)">
                      <strong>* </strong>
                    </span>
                    <label :class="labelStyle(errors, false)">{{ input.nom }}</label>
                    <v-autocomplete
                      class="mt-0 pt-0"
                      :id="input.nom"
                      v-model="dataFormRef[index].valeurTarification"
                      :light="true"
                      :items="input.valeurCriteres"
                      :data-cy="input.id"
                      :name="input.nom"
                      :title="input.nom"
                      :suffix="input.unite"
                      :menu-props="{
                        bottom: true,
                        offsetY: true,
                        light: true
                      }"
                      attach
                      item-text="nom"
                      item-value="id"
                      :error-messages="errors"
                      required
                      clearable
                      @change="removeFormules()"
                      @click="removeFormules()"
                      @update:search-input="searchSelect($event, index)"
                      return-object
                    >
                    </v-autocomplete>
                  </template>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-0 mt-5">
                <ContainerButtons1
                  @cancelResponse="back()"
                  @submitResponse="submitFormCalculate()"
                  :is-disabled="isBtnDisabledRef"
                >
                  <template #Cancel>
                    <v-icon left> mdi-arrow-left-bold </v-icon>
                    {{ $t('forms.buttons.back') }}
                  </template>
                  <template #Submit>
                    <v-icon left> mdi-check </v-icon>
                    {{ $t('forms.buttons.calculate') }}
                  </template>
                </ContainerButtons1>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-else>
            <v-row v-if="!isProfessionalProduct()">
              <v-col cols="4">
                <validation-provider name="select-country" rules="required">
                  <SelectCountry
                    v-model="dataFormPaysRef"
                    input-id="select-country"
                    :title="$tc('page.subscription.siret.form.selectCountry')"
                    :items="itemsCountryRef"
                    :items-keys="['countryList', 'nom', 'code']"
                    :is-required="true"
                    :is-disabled="product.pays.length === 1"
                    @changeCountry="removeFormules()"
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-0 mt-5">
                <ContainerButtons1
                  @cancelResponse="back()"
                  @submitResponse="submitFormCalculate()"
                  :is-disabled="isBtnDisabledRef"
                >
                  <template #Cancel>
                    <v-icon left> mdi-arrow-left-bold </v-icon>
                    {{ $t('forms.buttons.back') }}
                  </template>
                  <template #Submit>
                    <v-icon left> mdi-check </v-icon>
                    {{ $t('forms.buttons.calculate') }}
                  </template>
                </ContainerButtons1>
              </v-col>
            </v-row>
          </v-container>
        </form>
      </validation-observer>
    </template>
    <template #Body v-else>
      <div class="alignement justify-space-between d-flex pa-0 capitalize">
        <div class="text-form-ferme">
          <strong>{{ $t('page.tarification.title') }}</strong>
        </div>
        <v-spacer />
        <v-btn color="primary" class="btn-form" @click="showCritereValo()">
          {{ $t('forms.buttons.modifierInfos') }}</v-btn
        >
      </div>
    </template>
    <template #Column v-if="!formulesRef.length">
      <ColumnSlot v-if="showIdentificationCard()" class="text-body text-default">
        <IdentificationCard :profil="identifiantProfil" />
      </ColumnSlot>
    </template>
  </ContainerModel1>
</template>

<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import ContainerModel1 from '@/components/common/templates/ContainerModel1.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import ColumnSlot from '@/components/common/templates/ColumnSlot.vue';
import IdentificationCard from '@/components/devis/IdentificationCard.vue';
import SelectCountry from '@/components/common/form/SelectCountry.vue';
import useDevis from '@/composables/useDevis';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import { VContainer, VRow, VCol, VTextField, VIcon } from 'vuetify/lib';
import { onMounted, ref, watch } from 'vue';
import { CritereTypeEnum } from 'open-api-produits-typescript';
import { useRoute } from 'vue-router/composables';
import useSelectedProduct from '@/composables/useSelectedProduct';
import useIdentifiantProfil from '@/composables/useIdentifiantProfil';
import {
  type Critere,
  type DevisEntreprise,
  type ProduitCalculResult,
  DevisEntrepriseStatutEnum,
  ProduitTypeRisqueEnum,
  type ValorisationCritere,
  DevisEntrepriseTypeRisqueEnum
} from 'open-api-souscription-typescript';
import useSnackBar from '@/composables/useSnackBar';
import { useI18n } from 'vue-i18n';
import useConstante from '@/composables/useConstante';
import {
  critereApi,
  devisHydratorFromValorisationCritereApi,
  produitCalculResultApi
} from '@/plugins/open-api';
import _ from 'lodash';

//COMPOSABLES
const { labelStyle, starStyle } = inputStyle();
const { devis, setDevisAction } = useDevis();
const { setLoaderGlobal } = useLoader();
const { product } = useSelectedProduct();
const { identifiantProfil } = useIdentifiantProfil();
const { addMessageErrorSnackBarAction } = useSnackBar();
const route = useRoute();
const { COPIE_EXPIRE, REGEX } = useConstante();

//VARIABLES
const devisRef = ref(devis);
const inputsValuationCriteriaRef = ref([]);

const dataFormPaysRef = ref<string>('');
const dataFormRef = ref<ValorisationCritere[]>([]);
const isBtnDisabledRef = ref<boolean>(false);
const observerValuationRef = ref(null);
const itemsCountryRef = ref([]);
const countryParentRef = ref(null);
const isEtudeRef = ref(false);
const isUpdateRef = ref(false);
const tarificationProduitRef = ref(null);
const errorCalculTarifRef = ref<string[]>([]);
const formulesRef = ref([]);
const valueByDefaultRef = ref<string>('');
const isNewDevis = route.query?.new;
const isHiddenRef = ref<boolean>(true);

const emit = defineEmits([
  'nextStep',
  'isEtude',
  'previousStep',
  'pendingForm',
  'errorCalculTarif',
  'formulesValorisees',
  'removeFormulesOptions',
  'dataForm'
]);

const {
  isLoading: isLoadingCriteresProduit,
  isError: isErrorCriteresProduit,
  data: listCritereProduit,
  doFetch: doFetchCriteresProduit
} = useApiCall<Critere[]>({
  route: critereApi().listCriteresValoriseProduit
});

const {
  isLoading: isLoadingHydratDevisCriteres,
  isError: isErrorHydratDevisCriteres,
  data: hydratvaloCritere,
  doFetch: doFetchHydratDevisCriteres
} = useApiCall<DevisEntreprise>({
  route: devisHydratorFromValorisationCritereApi().hydrateDevisValorisationCritere
});

const {
  isLoading: isLoadingCalculTarifProduit,
  isError: isErrorCalculTarifProduit,
  errorMessage: errorMessageCalculTarifProduit,
  data: tarificationProduit,
  doFetch: doFetchCalculTarifProduit
} = useApiCall<ProduitCalculResult>({
  route: produitCalculResultApi().calculeTarificationProduit
});

onMounted(() => {
  init();
});

//METHODES
const init = async () => {
  const routeQueryId = route?.query?.id;
  const routeQueryIdProduct = route?.params?.product;

  if (routeQueryIdProduct) {
    inputsValuationCriteriaRef.value = await getListCriteresValoriseProduit(routeQueryIdProduct);
    inputsValuationCriteriaRef.value?.map((item) => {
      item.valeurCriteres.length ? convertValue(item.valeurCriteres, 'id', 'str') : [];
    });

    if (!inputsValuationCriteriaRef.value.length && product.value.pays.length === 1) {
      dataFormPaysRef.value = product.value.pays[0].code;
    }

    itemsCountryRef.value = product.value.pays ? product.value.pays : [];
    initDataForm(inputsValuationCriteriaRef.value);

    if (
      routeQueryId ||
      (devis.value.valorisationCritere && devis.value.valorisationCritere.length > 0)
    ) {
      if (routeQueryId || isNewDevis === COPIE_EXPIRE) {
        isUpdateRef.value = true;
      }
      dataFormRef.value = convertValue(devis.value.valorisationCritere, 'valeur', 'str');
      formatNumberWithSpace();
    }
  }
  if (!isProfessionalProduct() && product.value.pays.length === 1) {
    dataFormPaysRef.value = product.value.pays[0].code;
  }
};

const initDataForm = (inputsValuationCriteria) => {
  dataFormRef.value = inputsValuationCriteria.map((item) => {
    if (item.type === 'ENTIER' && !item.valeurTarification) {
      valueByDefaultRef.value = '0';
    } else {
      valueByDefaultRef.value = '';
    }
    return {
      idCritere: parseInt(item.id),
      groupe: item.groupe,
      valeurTarification: valueByDefaultRef.value,
      nomCritere: item.nom || null,
      type: item.type || null,
      typage: item.typage || null
    } as ValorisationCritere;
  });
  if (devis.value.codePays !== '') {
    dataFormPaysRef.value = devis.value.codePays;
  }
};

const isProfessionalProduct = (): boolean => {
  return product.value.typeRisque === ProduitTypeRisqueEnum.ProfessionnelEntreprise;
};

const showIdentificationCard = () => {
  return (
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise &&
    Object.keys(identifiantProfil.value).length > 0
  );
};

const showCritereValo = (): boolean => {
  formatNumberWithSpace();
  isHiddenRef.value = !isHiddenRef.value;
  isBtnDisabledRef.value = true;
  return isHiddenRef.value;
};

const getListCriteresValoriseProduit = async (idProduct) => {
  await doFetchCriteresProduit(idProduct);
  if (isErrorCriteresProduit.value) {
    addMessageErrorSnackBarAction(i18n.t('page.tarification.errorGetCritere').toString());
  }
  if (listCritereProduit.value) {
    return listCritereProduit.value;
  }
  return [];
};

const convertValue = (array, key, type) => {
  return array.map((item) => {
    item[key] = type === 'int' ? parseInt(item[key]) : item[key];
    return item;
  });
};

const setType = (critere): string => {
  if (
    critere === CritereTypeEnum.Decimal ||
    critere === CritereTypeEnum.Entier ||
    critere === CritereTypeEnum.Texte
  ) {
    return 'text';
  } else if (critere === CritereTypeEnum.Valeurs) {
    return 'valeurs';
  }
  return 'text';
};

const removeFormules = (): void => {
  formulesRef.value = [];
  isBtnDisabledRef.value = false;
  emit('removeFormulesOptions', true);
};

const submitFormCalculate = async () => {
  errorCalculTarifRef.value = [];
  const isValid = await observerValuationRef.value.validate();
  if (isValid) {
    isBtnDisabledRef.value = true;
    isHiddenRef.value = false;
    dataFormRef.value = convertValue(dataFormRef.value, 'valeur', 'str');
    if (!isProfessionalProduct() && !isUpdateRef.value && !isNewDevis) {
      //Assignation de la valeur du pays selectionné à l'adresse de l'utilisateur
      mapCountryToSouscripteur();
    }
    hydrateDevisFromCriteres().then(() => {
      calculateProductPricing();
    });
  } else {
    addMessageErrorSnackBarAction(i18n.t('devis.errors.validerTousLesChamps').toString());
  }
};

const formatNumberWriting = (index: number) => {
  const newString = dataFormRef.value[index].valeurTarification
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  dataFormRef.value[index].valeurTarification = newString;
};

const formatNumberWithoutSpace = async () => {
  dataFormRef.value.forEach((critere, index) => {
    if (critere.type === 'ENTIER' && critere.valeurTarification) {
      dataFormRef.value[index].valeurTarification = critere.valeurTarification.replace(/\s/g, '');
    }
  });
};

const formatNumberWithSpace = async () => {
  dataFormRef.value.forEach((critere, index) => {
    if (critere.type === 'ENTIER' && critere.valeurTarification) {
      dataFormRef.value[index].valeurTarification = dataFormRef.value[index].valeurTarification
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
  });
};

const mapCountryToSouscripteur = () => {
  itemsCountryRef.value.find((pays) => {
    if (pays.code === dataFormPaysRef.value && pays.parent) {
      countryParentRef.value = pays.parent.code;
    }
  });

  setDevisAction(
    _.merge(devis.value, {
      statut: DevisEntrepriseStatutEnum.BrouillonAValider, //TODO WORKFLOW HYDRATATION NOT OK
      codePays: dataFormPaysRef.value,
      souscripteurPersonneMorale: {
        adresse: {
          pays: countryParentRef.value || dataFormPaysRef.value
        }
      },
      souscripteurPersonnePhysique: {
        adresse: {
          pays: countryParentRef.value || dataFormPaysRef.value
        }
      }
    })
  );
  countryParentRef.value = null;
};

const hydrateDevisFromCriteres = async () => {
  devisRef.value.valorisationCritere = dataFormRef.value;
  setDevisAction(devisRef.value);
  emit('dataForm', dataFormRef.value);
  if (!devis?.value?.formuleSouscrite?.idFormule) {
    //TODO: remove if backend return idFormule null
    delete devis.value.formuleSouscrite;
  }

  //le backend est obligé de retourner un devis avec un indentifiant
  //quand bien même ce dernier n'est pas persisté
  if (devis.value.id === 0) {
    delete devis.value.id;
  }

  formatNumberWithoutSpace(); //Pour enlever les espaces dans les nombres avant envoie au back

  const devisAndValorisationCritere = {
    devis: devis.value,
    valorisationCritere: dataFormRef.value
  };

  await doFetchHydratDevisCriteres(devisAndValorisationCritere);
  if (isErrorHydratDevisCriteres.value) {
    addMessageErrorSnackBarAction(i18n.t('page.tarification.errorHydrate').toString());
    return false;
  }
  if (hydratvaloCritere.value) {
    //Obligatoire car formule souscrite n'existe pas sinon et donc on tombe en erreur => remove if backend return idFormule = null
    devis.value['formuleSouscrite'] = {
      idFormule: 0,
      idProduit: parseInt(route?.params?.product)
    };
    let devisData = {};
    if (isUpdateRef.value) {
      devisData = { ...devis.value, id: parseInt(route.query.id as string) };
      setDevisAction(_.merge(devisData, hydratvaloCritere.value));
    } else {
      setDevisAction(_.merge(devis.value, hydratvaloCritere.value));
    }
    return true;
  }
};

const calculateProductPricing = async () => {
  await doFetchCalculTarifProduit(
    product.value.id ? product.value.id : devis.value.formuleSouscrite.idProduit,
    {
      codePays: devis.value.codePays.toUpperCase(),
      valeurByCritere: dataFormRef.value
    }
  );
  if (isErrorCalculTarifProduit.value || errorMessageCalculTarifProduit.value) {
    if (errorMessageCalculTarifProduit.value.response.data?.violations) {
      //Error si Produit BLOQUANT
      errorMessageCalculTarifProduit.value.response.data.violations[0].title
        .split('.')
        .map((msg) => {
          errorCalculTarifRef.value.push(msg);
        });
    } else {
      //autres erreur
      addMessageErrorSnackBarAction(i18n.tc('page.tarification.errorTarification'));
    }
  }
  tarificationProduitRef.value = tarificationProduit.value;
  if (tarificationProduitRef.value) {
    if (tarificationProduitRef.value?.eligibiliteProduit?.ALERTE) {
      tarificationProduitRef.value.eligibiliteProduit.ALERTE.map((msg) => {
        errorCalculTarifRef.value.push(msg);
      });
    }
    if (
      tarificationProduitRef.value?.eligibiliteProduit?.ETUDE_N1 ||
      tarificationProduitRef.value?.eligibiliteProduit?.ETUDE_N2
    ) {
      isEtudeRef.value = true;
    }

    if (tarificationProduitRef.value.formulesValorises.length > 0) {
      //Si la formule et en bloqué ou en alerte
      tarificationProduitRef.value.formulesValorises.map((formule) => {
        formule.eligibiliteFormule?.map((msg) => {
          errorCalculTarifRef.value.push(msg);
        });
      });
      tarificationProduitRef.value.isEtude = isEtudeRef.value;
      formulesRef.value = tarificationProduitRef.value.formulesValorises;
      devisRef.value.valorisationCritere = dataFormRef.value;
      setDevisAction(devisRef.value);
      emit('isEtude', isEtudeRef.value);
      emit('formulesValorisees', formulesRef.value);
    } else {
      //Si le back ne me retourne pas de formule
      addMessageErrorSnackBarAction(i18n.tc('page.tarification.title'));
    }
  }
  isBtnDisabledRef.value = false;
  isEtudeRef.value = false;
  emit('errorCalculTarif', errorCalculTarifRef.value);
};

const checkCaract = (event: KeyboardEvent): void => {
  if (
    !new RegExp(REGEX.NUMBER).test(event.key) &&
    event.key !== 'Tab' &&
    event.key !== 'Backspace' &&
    event.key !== 'Delete' &&
    event.key !== 'ArrowLeft' &&
    event.key !== 'ArrowRight'
  ) {
    return event.preventDefault();
  }
};

const searchSelect = (search: string, index: number) => {
  if (search && dataFormRef[index]) {
    dataFormRef[index].valeurTarification = search;
  }
};

const back = () => {
  emit('previousStep', true);
};

watch(
  () => [
    isLoadingCriteresProduit.value,
    isLoadingCalculTarifProduit.value,
    isLoadingHydratDevisCriteres.value
  ],
  ([isLoadingCriteresProduit, isLoadingCalculTarifProduit, isLoadingHydratDevisCriteres]) => {
    setLoaderGlobal({
      isLoading:
        isLoadingCriteresProduit || isLoadingCalculTarifProduit || isLoadingHydratDevisCriteres
    });
  }
);
</script>

<style scoped>
.btn-affichage-formule {
  text-align: end;
  padding-top: 0%;
}
.btn-form {
  margin-right: 10px;
  font-size: 15px;
}
.text-form {
  font-size: 20px;
  margin-bottom: -15px;
}
.text-form-ferme {
  margin-left: 15px;
  font-size: 18px;
}
.subtitle-form {
  color: red;
}
.criteres {
  padding: 0px 12px 0px 12px;
}
.alignement {
  align-items: baseline;
}
</style>
