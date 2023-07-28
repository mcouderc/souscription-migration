<template>
  <!-- here modal for devis duplication -->
  <v-dialog v-model="dialogDuplicationRef" :light="true" width="650">
    <v-card :light="true">
      <v-container>
        <h1 class="title-helios">
          {{ $t('page.listDevis.modal.title') }}
        </h1>
        <p class="sub-title-helios">
          {{ $t('page.listDevis.modal.text') }}
        </p>
        <validation-observer ref="observerSignRef">
          <v-row class="px-5 my-0">
            <v-col cols="5">
              <BaseDatePicker
                v-model="dateSouhaiteeRef"
                :validation-is-required="true"
                placeholder="JJ-MM-AAAA"
                :label="$t('page.subscription.popupDate.input')"
                :min="noMinDateComputed"
                :max="maxDateComputed"
              ></BaseDatePicker>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="mt-5">
              <ContainerButtons1 @cancelResponse="cancelModal()" @submitResponse="onSubmit()">
                <template #Cancel>
                  {{ $t('forms.buttons.cancel') }}
                </template>
                <template #Submit>
                  {{ $t('forms.buttons.valid') }}
                </template>
              </ContainerButtons1>
            </v-col>
          </v-row>
        </validation-observer>
      </v-container>
    </v-card></v-dialog
  >
</template>
<script setup lang="ts">
import type { PatchDevisDevisEntreprise, Produit } from 'open-api-souscription-typescript';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import BaseDatePicker from '@/components/common/BaseDatePicker.vue';
import { ValidationObserver } from 'vee-validate';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import useDevis from '@/composables/useDevis';
import useSnackBar from '@/composables/useSnackBar';
import { patchDevisApi, produitsApi } from '@/plugins/open-api';
import router from '@/router';
import { format, formatISO } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { VDialog, VCard, VContainer, VRow, VCol } from 'vuetify/components';
import useRoutageProduit from '@/composables/useRoutageProduit';
import eventBus from '@/plugins/eventBus';
import { useI18n } from 'vue-i18n';
import useConstante from '@/composables/useConstante';
import useSelectedProduct from '@/composables/useSelectedProduct';

const { onRouteToCorrectTemplate } = useRoutageProduit();
const { setLoaderGlobal } = useLoader();
const dateSouhaiteeRef = ref(format(new Date(), 'yyyy-MM-dd'));
const observerSignRef = ref(null);
const dialogDuplicationRef = ref(false);
const { product, setProductAction } = useSelectedProduct();
const { devis, setDevisAction } = useDevis();
const { COPIE_EXPIRE } = useConstante();
const { addMessageSuccesSnackBarAction, addMessageErrorSnackBarAction } = useSnackBar();

const {
  isLoading: isLoadingCopie,
  errorMessage: errorMessageCopie,
  isError: isErrorCopie,
  data: copieResponse,
  doFetch: doFetchCopie
} = useApiCall<PatchDevisDevisEntreprise>({
  route: patchDevisApi().copie
});

const {
  isLoading: isLoadingGetProduit,
  data: dataGetProduit,
  doFetch: doFetchGetProduit
} = useApiCall<Produit>({
  route: produitsApi().getProduit
});

eventBus.on('open-duplication-dialog', () => {
  dialogDuplicationRef.value = true;
  defineProduct();
});

const defineProduct = async () => {
  await doFetchGetProduit(devis.value?.formuleSouscrite?.idProduit);
  if (dataGetProduit.value) {
    setProductAction(dataGetProduit.value);
  }
};

//submit dupliction of devis
const onSubmit = () => {
  observerSignRef.value.validate().then((isValid: boolean) => {
    if (dateSouhaiteeRef.value && isValid) {
      if (product.value?.dateFin && product.value?.dateFin < dateSouhaiteeRef.value) {
        addMessageErrorSnackBarAction(i18n.tc('snackBar.errorDatePorduit'));
      } else {
        copieDevis(devis.value);
      }
    } else {
      addMessageErrorSnackBarAction(i18n.tc('snackBar.errorDateFormat'));
    }
  });
};

const copieDevis = async (devis) => {
  devis.dateEffet = dateSouhaiteeRef.value;
  await doFetchCopie(devis.id, { type: 'COPIE', date: dateSouhaiteeRef.value });
  if (errorMessageCopie.value || isErrorCopie.value) {
    addMessageErrorSnackBarAction(
      errorMessageCopie.value.response.data.violations[0].title
        ? errorMessageCopie.value.response.data.violations[0].title
        : i18n.tc('devis.duplication.error')
    );
    dialogDuplicationRef.value = false;
  }
  if (copieResponse.value) {
    if (copieResponse.value.id) {
      dialogDuplicationRef.value = false;
      setDevisAction(copieResponse.value);
      addMessageSuccesSnackBarAction(i18n.tc('devis.duplication.success'));
      router.replace({
        name: 'OverviewDevis',
        query: { id: copieResponse.value.id.toString() }
      });
    } else {
      setDevisAction(copieResponse.value);
      addMessageSuccesSnackBarAction(i18n.tc('devis.creation.success'));
      const query = {
        step: 'tarification',
        new: COPIE_EXPIRE
      };
      router.push(
        onRouteToCorrectTemplate(
          devis.typeRisque,
          devis.formuleSouscrite.idProduit,
          query,
          true,
          '1'
        )
      );
    }
  }
};

const noMinDateComputed = computed((): string => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 1);
  return formatISO(minDate);
});

const maxDateComputed = computed((): string => {
  const currentDate = new Date();
  const maxDate = new Date(currentDate.setMonth(currentDate.getMonth() + 8));
  return formatISO(maxDate);
});

const cancelModal = () => {
  dialogDuplicationRef.value = false;
};

watch(
  () => isLoadingCopie.value,
  (isLoadingCopie) => {
    setLoaderGlobal({ isLoading: isLoadingCopie });
  }
);

watch(
  () => [isLoadingCopie.value, isLoadingGetProduit.value],
  ([isLoadingCopie, isLoadingGetProduit]) => {
    setLoaderGlobal({
      isLoading: isLoadingCopie || isLoadingGetProduit
    });
  }
);
</script>
