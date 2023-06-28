<template>
  <v-dialog v-model="dialogEligibiliteAdminRef" persistent :light="true" width="550">
    <v-card :light="true">
      <v-container>
        <h3 class="title-error-eligible">
          {{ $t('forms.popupError.titleAdmin') }}
        </h3>

        <p class="sub-title-helios sub-error">
          {{ $t('forms.popupError.introAdmin') }}
        </p>
        <v-row>
          <v-col cols="12" class="mt-5 button-error-eligible">
            <v-btn color="error" @click="cancelModal()">
              {{ $t('forms.buttons.backModifDevis') }}
            </v-btn>
            <v-btn color="primary" @click="nextStep()">
              {{ $t('forms.buttons.next') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { VDialog, VCard, VContainer, VRow, VCol } from 'vuetify/lib';
import eventBus from '@/plugins/eventBus';

const dialogEligibiliteAdminRef = ref(false);
const emit = defineEmits(['nextStep']);

eventBus.on('open-eligibilite-admin-dialog', () => {
  dialogEligibiliteAdminRef.value = true;
});

const cancelModal = (): void => {
  dialogEligibiliteAdminRef.value = false;
};

const nextStep = (): void => {
  dialogEligibiliteAdminRef.value = false;
  emit('nextStep', true);
};
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
