<template>
  <v-container v-if="loaderParams.isLoading" fluid>
    <v-overlay :light="true" :opacity="0.3" z-index="500" class="text-center">
      <v-progress-circular indeterminate size="64" />
      <p class="mt-4">{{ loaderParams.loaderLabel }}</p>
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import useLoader from '@/composables/useLoader';
import { VContainer, VOverlay, VProgressCircular } from 'vuetify/lib';

const { loaderParams } = useLoader();
</script>
