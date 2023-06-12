<template>
  <div class="text-center">
    <v-snackbar
      v-model="isVisible"
      :timeout="snackBar.time"
      :color="snackBar.type"
      :top="snackBar.positionTop"
    >
      {{ snackBar.message }}

      <template v-slot:actions="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="closeSnakbar">
          {{ $t('forms.buttons.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import eventBus from '@/plugins/eventBus';
import useSnackBar from '@/composables/useSnackBar';

const { removeMessageSnackBarAction, snackBar } = useSnackBar();

const isVisible = ref(false);

const openSnakbar = () => {
  isVisible.value = true;
};
const closeSnakbar = () => {
  isVisible.value = false;
  removeMessageSnackBarAction();
};

eventBus.on('open-snack-bar', () => {
  openSnakbar();
});
</script>
