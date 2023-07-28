<template>
  <div>
    <h2 class="text-primary text-h6 text-uppercase">
      {{ $tc('page.devisOverview.detailEtude.title') }}
    </h2>
    <template>
      <p class="mt-3 font-weight-bold">
        {{ $tc('forms.popupEtude.commentaire') }}
      </p>
      <v-textarea
        v-model="messageRef"
        outlined
        auto-grow
        hide-details
        rows="2"
        class="mt-3"
        :disabled="!isMessageComputed"
        @input="changeMessage($event), (isButtonVisibleRef = true)"
      />
    </template>
    <template v-if="isEtudeValidee()">
      <p class="mt-4 font-weight-bold">
        {{ $t('forms.popupEtude.conditionSpec') }}
      </p>
      <v-textarea
        v-model="conditionSpecRef"
        outlined
        auto-grow
        hide-details
        rows="2"
        class="mt-3"
        :disabled="!isConditionSpecComputed"
        @input="changeConditionSpec($event), (isButtonVisibleRef = true)"
      />
    </template>
    <v-btn
      :disabled="!isButtonVisibleRef"
      class="px-5 mt-4"
      color="primary"
      @click="updateInformation()"
    >
      {{ $tc('forms.buttons.modify') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { DevisEntrepriseStatutEnum, type Devis } from 'open-api-souscription-typescript';
import { useApiCall } from '@/composables/api-call/useApiCall';
import usePermission from '@/composables/authenticate/usePermission';
import { devisApi } from '@/plugins/open-api';
import useLoader from '@/composables/useLoader';
import useSnackBar from '@/composables/useSnackBar';
import useConstante from '@/composables/useConstante';
import useDevis from '@/composables/useDevis';
import { VTextarea } from 'vuetify/components';
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';

const {
  isLoading: isLoadingUpdateDevis,
  isError: isErrorUpdateDevis,
  data: updateDevisResponse,
  doFetch: doFetchUpdateDevis
} = useApiCall<Devis>({
  route: devisApi().updateDetailsEtudeDevis
});

const { setLoaderGlobal } = useLoader();
const { devis, setDevisAction } = useDevis();
const { HISTORIQUES } = useConstante();
const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const {
  doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate,
  doesHavePermissionAmongAllRolesButBrokerAndConsultation
} = usePermission();

const messageRef = ref(devis.value.commentaire);
const isButtonVisibleRef = ref<boolean>(false);
const conditionSpecRef = ref(devis.value.conditionsSpecifiques);
const historiqueLevelEtudeRef = ref<string>('');

onMounted(() => {
  checkHistoriqueEtudeLevel();
});

const changeMessage = (message: string) => {
  messageRef.value = message;
};

const changeConditionSpec = (conditionSpec: string) => {
  conditionSpecRef.value = conditionSpec;
};

const isEtudeValidee = (): boolean => {
  return devis.value.statut === DevisEntrepriseStatutEnum.EtudeValidee;
};

const isEtudeValideeOrRefuse = (): boolean => {
  return (
    devis.value.statut === DevisEntrepriseStatutEnum.EtudeValidee ||
    devis.value.statut === DevisEntrepriseStatutEnum.Refuse
  );
};

const checkHistoriqueEtudeLevel = () => {
  historiqueLevelEtudeRef.value = '';
  if (devis.value?.historiques) {
    devis.value.historiques.forEach((historique) => {
      if (
        (historique.type === HISTORIQUES.ETUDEN1_REFUSE ||
          historique.type === HISTORIQUES.ETUDEN1_VALIDE) &&
        historiqueLevelEtudeRef.value !== 'N2'
      ) {
        historiqueLevelEtudeRef.value = 'N1';
      } else if (
        historique.type === HISTORIQUES.ETUDEN2_REFUSE ||
        historique.type === HISTORIQUES.ETUDEN2_VALIDE
      ) {
        historiqueLevelEtudeRef.value = 'N2';
      }
    });
  }
};

// eslint-disable-next-line vue/return-in-computed-property
const isMessageComputed = computed(() => {
  if (historiqueLevelEtudeRef.value === 'N2') {
    return (
      isEtudeValideeOrRefuse() &&
      doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()
    );
  } else if (historiqueLevelEtudeRef.value === 'N1') {
    return isEtudeValideeOrRefuse() && doesHavePermissionAmongAllRolesButBrokerAndConsultation();
  }
});

const isConditionSpecComputed = computed(() => {
  return (
    isEtudeValideeOrRefuse() && doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()
  );
});

const updateInformation = async () => {
  setDevisAction(
    _.merge(devis.value, {
      commentaire: messageRef.value,
      conditionsSpecifiques: conditionSpecRef.value
    })
  );

  await doFetchUpdateDevis(devis.value.id, devis.value);
  if (isErrorUpdateDevis.value) {
    addMessageErrorSnackBarAction(i18n.t('page.tarification.errorUpdate').toString());
  }
  if (updateDevisResponse.value) {
    addMessageSuccesSnackBarAction(i18n.tc('devis.update.updateDevis'));
  }
};

watch(
  () => devis.value?.commentaire || devis.value?.conditionsSpecifiques,
  () => {
    changeConditionSpec(devis.value?.conditionsSpecifiques);
    changeMessage(devis.value?.commentaire);
  },
  { deep: true }
);

watch(
  () => [isLoadingUpdateDevis.value],
  ([isLoadingUpdateDevis]) => {
    setLoaderGlobal({ isLoading: isLoadingUpdateDevis });
  }
);
</script>
