<template>
  <v-dialog v-model="signatureModalRef" :light="true" width="650">
    <v-card :light="true">
      <v-container>
        <h1 class="title-helios">
          {{ $t('page.summary.subTitle') }}
        </h1>
        <p class="sub-title-helios">
          {{ $t('page.summary.text') }}
        </p>
        <validation-observer ref="observerSignRef">
          <v-row class="px-5 my-0">
            <v-col cols="6">
              <InputGeneric
                v-model="signatoryModelRef.prenom"
                input-id="prenom"
                :title="$tc('forms.labels.firstName')"
                input-type="text"
                :is-required="true"
                :max-length="150"
              />
            </v-col>
            <v-col cols="6">
              <InputGeneric
                input-class="text-uppercase"
                v-model="signatoryModelRef.nom"
                input-id="nom"
                :title="$tc('forms.labels.name')"
                input-type="text"
                :is-required="true"
                :max-length="150"
              />
            </v-col>
            <v-col cols="6">
              <InputGeneric
                v-model="signatoryModelRef.mail"
                input-id="mail"
                :title="$tc('forms.labels.mail')"
                input-type="text"
                :is-required="true"
                :regex="REGEX.EMAIL"
                :max-length="150"
              />
            </v-col>
            <v-col cols="6">
              <InputGeneric
                v-model="signatoryModelRef.portable"
                input-id="portable"
                :title="$t('forms.labels.phone', { number: '' }).toString()"
                input-type="text"
                :is-required="true"
                regex="phone"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="mt-5">
              <ContainerButtons1
                @cancelResponse="cancelDialog()"
                @submitResponse="onSubmitSignature()"
              >
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
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { signatureElectroniqueApi } from '@/plugins/open-api';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import { ValidationObserver } from 'vee-validate';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import useConstante from '@/composables/useConstante';
import useSnackBar from '@/composables/useSnackBar';
import type {
  DevisEntreprise,
  SignataireElectronique,
  SignatureElectronique
} from 'open-api-souscription-typescript';
import eventBus from '@/plugins/eventBus';
import { VDialog, VCard, VContainer, VRow, VCol } from 'vuetify/lib';

export interface IProps {
  devis: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {});

const { addMessageErrorSnackBarAction, addMessageSuccesSnackBarAction } = useSnackBar();
const { REGEX } = useConstante();
const { setLoaderGlobal } = useLoader();
const signatureModalRef = ref<boolean>(false);
const observerSignRef = ref(null);
const signatoryModelRef = ref<SignataireElectronique>({
  nom: '',
  prenom: '',
  mail: '',
  portable: ''
});

const {
  isLoading: isLoadingCreateSignature,
  isError: isErrorCreateSignature,
  data: createSignatureResponse,
  doFetch: doFetchCreateSignature
} = useApiCall<SignatureElectronique>({
  route: signatureElectroniqueApi().createSignataireElectronique
});

const emit = defineEmits(['submitEvent']);

eventBus.on('open-modal', () => {
  signatureModalRef.value = true;
});

const onSubmitSignature = async () => {
  const isValidSign = await observerSignRef.value.validate();
  if (isValidSign) {
    await doFetchCreateSignature(props.devis.id, signatoryModelRef.value);
    if (isErrorCreateSignature.value) {
      addMessageErrorSnackBarAction(i18n.tc('page.summary.signin.error'));
    }
    if (createSignatureResponse.value) {
      signatureModalRef.value = false;
      emit('submitEvent');
      addMessageSuccesSnackBarAction(i18n.tc('page.summary.signin.success'));
    }
  }
};

const cancelDialog = () => {
  signatureModalRef.value = false;
  signatoryModelRef.value = { nom: '', prenom: '', mail: '', portable: '' };
};

watch(
  () => isLoadingCreateSignature.value,
  (isLoadingCreateSignature) => {
    setLoaderGlobal({ isLoading: isLoadingCreateSignature });
  }
);
</script>

<style scoped>
.v-card {
  padding: 20px 10px;
}
</style>
