<template>
  <v-dialog v-model="dialogEtudeRef" persistent :light="true" width="650">
    <v-card :light="true">
      <v-container>
        <h4>
          {{ $t('forms.popupEtude.title') }}
        </h4>

        <p v-for="(errorMsg, index) in tabMsgRef" :key="index" class="sub-error">
          {{ errorMsg }}
        </p>

        <p class="sub-title-helios">
          {{ $t('forms.popupEtude.question') }}
        </p>
        <validation-observer ref="observerSign">
          <v-row>
            <v-col cols="12" class="mt-5">
              <ContainerButtons1 @cancelResponse="cancelModal()" @submitResponse="onSubmit()">
                <template #Cancel>
                  {{ $t('forms.buttons.backModifDevis') }}
                </template>
                <template #Submit>
                  {{ $t('forms.buttons.sendDevisEtude') }}
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
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import { ValidationObserver } from 'vee-validate';
import { ref } from 'vue';
import { VDialog, VCard, VContainer, VRow, VCol } from 'vuetify/components';
import eventBus from '@/plugins/eventBus';

const dialogEtudeRef = ref(false);
const responseValidationRef = ref({});
const tabMsgRef = ref([]);
const emit = defineEmits(['continueProcess']);

eventBus.on('open-devis-etude-dialog', (datas: { message: string; response }) => {
  tabMsgRef.value = [];
  datas.message.split('.').map((msg) => {
    tabMsgRef.value.push(msg);
  });
  responseValidationRef.value = datas.response;
  dialogEtudeRef.value = true;
});

//submit dupliction of devis
const onSubmit = (): void => {
  emit('continueProcess', responseValidationRef.value);
  dialogEtudeRef.value = false;
};

const cancelModal = (): void => {
  responseValidationRef.value = [];
  dialogEtudeRef.value = false;
};
</script>
