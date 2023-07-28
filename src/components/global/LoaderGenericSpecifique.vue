<template>
  <v-container v-if="props.isLoading" fluid>
    <v-overlay
      :light="true"
      z-index="40"
      :absolute="props.absolute"
      :relative="props.relative"
      :opacity="props.opacity"
      :class="props.backgroundWhite ? 'bg-white text-center' : 'text-center'"
      :style="props.relative ? 'position: relative' : null"
    >
      <v-progress-circular indeterminate :size="props.size" :color="props.color" />
      <p class="mt-4">{{ props.messageLoader }}</p>
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import { VContainer, VOverlay, VProgressCircular } from 'vuetify/components';

export interface IProps {
  isLoading: boolean;
  messageLoader?: string;
  opacity?: string | number;
  absolute?: boolean;
  relative?: boolean;
  color?: string;
  size?: number;
  backgroundWhite?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isLoading: false,
  messageLoader: null,
  opacity: '0.4',
  absolute: false,
  relative: false,
  color: 'grey-darken-1',
  size: 40,
  backgroundWhite: false
});
</script>
