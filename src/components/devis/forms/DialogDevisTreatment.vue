<template>
  <v-dialog v-model="dialogTreatmentRef" persistent :light="true" width="650">
    <v-card :light="true">
      <v-container>
        <v-row class="px-5 my-0">
          <v-col cols="12">
            <h2>
              {{ $t('forms.popupEtude.rules') }}
            </h2>
            <ul class="mt-4">
              <li v-for="(information, index) in tabMsgRef" :key="index">
                {{ information.message }}
              </li>
            </ul>
            <p class="mt-5">
              {{ $t('forms.popupEtude.confirmationQuestion') }}
            </p>
          </v-col>
          <v-col cols="12" class="mt-5 d-flex justify-content-between flex-wrap">
            <v-btn class="px-5" :disabled="isButtonDisabledRef" color="error" @click="closePopup()">
              {{ $t('forms.popupEtude.cancel') }}</v-btn
            >
            <v-btn
              class="px-5"
              :disabled="isButtonDisabledRef"
              color="warning"
              @click="openRefuseDeviModal()"
            >
              {{ $t('forms.popupEtude.refuse') }}
            </v-btn>
            <v-btn
              class="px-5"
              :disabled="isButtonDisabledRef"
              color="primary"
              @click="openValidationDevisModal()"
            >
              {{ $t('forms.popupEtude.validation') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="isRefusDevisRef">
        <v-divider></v-divider>
        <RefuseDevis
          @returnMenu="returnMenu()"
          @submitRefuse="openValidationGeneric($event, 'refuse')"
        />
      </v-container>
      <v-container v-if="isValidationDevisRef">
        <v-divider></v-divider>
        <ValidationDevis
          @returnMenu="returnMenu()"
          @submitValidation="openValidationGeneric($event, 'validation')"
          @closePopup="navigateToConsulDevis()"
        />
      </v-container>
    </v-card>
    <DialogValidationGeneric @accept="submitTraitement()" />
  </v-dialog>
</template>

<script setup lang="ts">
import DialogValidationGeneric from '@/components/devis/forms/DialogValidationGeneric.vue';
import RefuseDevis from '@/components/devis/forms/dialogDevisEtude/RefuseDevis.vue';
import ValidationDevis from '@/components/devis/forms/dialogDevisEtude/ValidationDevis.vue';
import type { PatchDevis, PatchDevisDevisEntreprise } from 'open-api-souscription-typescript';
import useDevis from '@/composables/useDevis';
import useSnackBar from '@/composables/useSnackBar';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import { patchDevisApi } from '@/plugins/open-api';
import router from '@/router';
import { ref, watch } from 'vue';
import { VDialog, VCard, VContainer, VRow, VCol, VDivider } from 'vuetify/lib';
import eventBus from '@/plugins/eventBus';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router/composables';

const dialogTreatmentRef = ref(false);
const tabMsgRef = ref([]);
const messageRef = ref(''); //Mettre par defaut la valeur dans l'objet devis
const conditionSpecRef = ref(''); //Mettre par defaut la valeur dans l'objet devis
const isRefusDevisRef = ref(false);
const isValidationDevisRef = ref(false);
const isButtonDisabledRef = ref(false);
const selectedItemRef = ref(null);

const { devis, setDevisAction } = useDevis();
const { setLoaderGlobal } = useLoader();
const { addMessageSuccesSnackBarAction, addMessageErrorSnackBarAction } = useSnackBar();
const route = useRoute();

const {
  isLoading: isLoadingRefuse,
  isError: isErrorRefuse,
  data: refuseResponse,
  doFetch: doFetchRefuse
} = useApiCall<PatchDevisDevisEntreprise>({
  route: patchDevisApi().refuse
});

const {
  isLoading: isLoadingEtudeValidee,
  isError: isErrorEtudeValidee,
  data: etudeValideeResponse,
  doFetch: doFetchEtudeValidee
} = useApiCall<PatchDevisDevisEntreprise>({
  route: patchDevisApi().etudeValidee
});

eventBus.on('open-treatment-dialog', (selectedItem) => {
  if (selectedItem) {
    selectedItemRef.value = selectedItem;
  }
  tabMsgRef.value = [];
  devis.value.informationsEligibilite.map((msg) => {
    if (msg.action === 'ETUDE') {
      tabMsgRef.value.push(msg);
    }
  });
  dialogTreatmentRef.value = true;
});

const emit = defineEmits(['action']);
const emitDevis = () => {
  emit('action', devis.value);
};

const openRefuseDeviModal = (): void => {
  isRefusDevisRef.value = !isRefusDevisRef.value;
  isButtonDisabledRef.value = true;
};

const openValidationDevisModal = (): void => {
  isValidationDevisRef.value = !isValidationDevisRef.value;
  isButtonDisabledRef.value = true;
};

const returnMenu = (): void => {
  isButtonDisabledRef.value = false;
  isValidationDevisRef.value = false;
  isRefusDevisRef.value = false;
};

const openValidationGeneric = (datas: any, mode: string): void => {
  messageRef.value = datas.message; //Cette variable à passer pour la suite des requêtes
  conditionSpecRef.value = datas.conditionSpec;
  eventBus.emit('open-validation-generic-dialog', {
    message:
      mode === 'validation'
        ? i18n.tc('forms.popupEtude.valideDevis')
        : i18n.tc('forms.popupEtude.refuseDevis')
  });
};

const submitTraitement = (): void => {
  isRefusDevisRef.value ? refuseDevis() : validateDevis();
};

const refuseDevis = async () => {
  const patchDataRefuseDevis = {
    type: 'REFUSE',
    commentaire: messageRef.value
  } as PatchDevis;

  await doFetchRefuse(devis.value.id, patchDataRefuseDevis);
  if (isErrorRefuse.value) {
    addMessageErrorSnackBarAction(i18n.tc('forms.popupEtude.refuseError'));
  }
  if (refuseResponse.value) {
    setDevisAction(refuseResponse.value);
    navigateToListDevis();
    addMessageSuccesSnackBarAction(i18n.tc('forms.popupEtude.refuseSuccess'));
    emitDevis();
  }
};

const validateDevis = async () => {
  const patchDataValidateDevis = {
    type: 'VALIDATION',
    commentaire: messageRef.value,
    conditionsSpecifiques: conditionSpecRef.value
  } as PatchDevis;

  await doFetchEtudeValidee(devis.value.id, patchDataValidateDevis);
  if (isErrorEtudeValidee.value) {
    addMessageErrorSnackBarAction(i18n.tc('forms.popupEtude.validationError'));
  }
  if (etudeValideeResponse.value) {
    setDevisAction(etudeValideeResponse.value);
    navigateToConsulDevis();
    addMessageSuccesSnackBarAction(i18n.tc('forms.popupEtude.validationSuccess'));
    emitDevis();
  }
};

const navigateToConsulDevis = async () => {
  closePopup();
  if (!route.query.id) {
    router.replace({ name: 'OverviewDevis', query: { id: selectedItemRef.value.toString() } });
  }
};

const navigateToListDevis = (): void => {
  closePopup();
  if (route.query.id) {
    router.replace({ name: 'ListDevis' });
  }
};

const closePopup = () => {
  dialogTreatmentRef.value = false;
};

watch(
  () => [isLoadingRefuse.value, isLoadingEtudeValidee.value],
  ([isLoadingRefuse, isLoadingEtudeValidee]) => {
    setLoaderGlobal({ isLoading: isLoadingRefuse || isLoadingEtudeValidee });
  }
);
</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
li {
  color: rgb(255, 6, 6);
}
</style>
