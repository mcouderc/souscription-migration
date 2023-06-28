<template>
  <v-dialog v-model="dialogErrorRef" persistent :light="true" width="650">
    <v-card :light="true">
      <v-container>
        <h3 class="title-error-eligible">
          {{ $t('forms.popupError.title') }}
        </h3>

        <p class="sub-title-helios sub-error">
          {{ $t('forms.popupError.intro') }}
        </p>

        <ul class="mt-2 sub-error">
          <li v-for="(errorMsg, index) in responseValidationRef" :key="index">
            {{ errorMsg }}
          </li>
        </ul>

        <p class="sub-title-helios sub-error">
          {{ $t('forms.popupError.outro') }}
        </p>
        <validation-observer ref="observerSign">
          <v-row>
            <v-col cols="12" class="mt-5 button-error-eligible">
              <v-btn color="error" @click="cancelModal()">
                {{ $t('forms.buttons.backModifDevis') }}
              </v-btn>
              <v-btn color="primary" @click="clotureDevis()">
                {{ $t('forms.buttons.closeDevis') }}
              </v-btn>
            </v-col>
          </v-row>
        </validation-observer>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ValidationObserver } from 'vee-validate';
import { ref, watch } from 'vue';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import { useRouter } from 'vue-router/composables';
import useSnackBar from '@/composables/useSnackBar';
import useDevis from '@/composables/useDevis';
import { VDialog, VCard, VContainer, VRow, VCol } from 'vuetify/lib';
import eventBus from '@/plugins/eventBus';
import { patchDevisApi } from '@/plugins/open-api';
import {
  DevisStatutEnum,
  type PatchDevis,
  type PatchDevisDevisEntreprise
} from 'open-api-souscription-typescript';
import { useI18n } from 'vue-i18n';

const { devis, setDevisAction } = useDevis();
const { setLoaderGlobal } = useLoader();
const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const router = useRouter();
const dialogErrorRef = ref(false);
const responseValidationRef = ref([]);

const {
  isLoading: isLoadingRefuse,
  isError: isErrorRefuse,
  data: refuseResponse,
  doFetch: doFetchRefuse
} = useApiCall<PatchDevisDevisEntreprise>({
  route: patchDevisApi().refuse
});

eventBus.on('open-error-dialog', (message: string) => {
  message.split('.').map((msg) => {
    if (msg) {
      responseValidationRef.value.push(msg);
    }
  });
  dialogErrorRef.value = true;
});

const cancelModal = (): void => {
  responseValidationRef.value = [];
  dialogErrorRef.value = false;
};

const clotureDevis = async () => {
  dialogErrorRef.value = false;
  const patchData = {
    type: DevisStatutEnum.Refuse
  } as PatchDevis;

  await doFetchRefuse(devis.value.id, patchData);
  if (isErrorRefuse.value) {
    addMessageErrorSnackBarAction(i18n.tc('forms.popupEtude.refuseError'));
  }
  if (refuseResponse.value) {
    setDevisAction(refuseResponse.value);
    addMessageSuccesSnackBarAction(i18n.tc('forms.popupEtude.refuseSuccess'));
    router.replace({ name: 'ListDevis' });
  }
};

watch(
  () => isLoadingRefuse.value,
  (isLoadingRefuse) => {
    setLoaderGlobal({ isLoading: isLoadingRefuse });
  }
);
</script>
<style scope>
.title-error-eligible {
  display: flex;
  justify-content: center;
  color: red;
}

.button-error-eligible {
  display: flex;
  justify-content: space-around;
}
</style>
<style>
.sub-error {
  color: red;
}
</style>
