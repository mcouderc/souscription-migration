<template>
  <v-dialog v-model="dialogValidationGenericRef" persistent :light="true" width="400">
    <v-card :light="true">
      <v-container>
        <h2 class="sub-title-helios d-flex justify-center">
          {{ messageRef }}
        </h2>
        <v-row>
          <v-col cols="12" class="mt-4 d-flex justify-space-around">
            <v-btn color="error" @click="annulation()">
              {{ $t('forms.labels.no') }}
            </v-btn>
            <v-btn color="primary" @click="validation()">
              {{ $t('forms.labels.yes') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { VDialog, VCard, VContainer, VRow, VCol } from 'vuetify/components';
import eventBus from '@/plugins/eventBus';

const dialogValidationGenericRef = ref(false);
const messageRef = ref('');
const emit = defineEmits(['accept']);

eventBus.on('open-validation-generic-dialog', (data: any) => {
  messageRef.value = data.message;
  dialogValidationGenericRef.value = true;
});

const annulation = (): void => {
  dialogValidationGenericRef.value = false;
};

const validation = (): void => {
  emit('accept', true);
  dialogValidationGenericRef.value = false;
};
</script>
