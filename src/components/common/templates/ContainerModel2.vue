<template>
  <v-container v-if="!props.pending" class="pa-0">
    <slot name="Header" />
    <v-container class="border-2 border-grey bg-white relative pa-5">
      <slot name="Body" />
      <div v-show="props.overlay">
        <v-overlay :light="true" z-index="7" :opacity="0.5">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </div>
    </v-container>
  </v-container>
  <v-container v-else-if="props.pending">
    <v-overlay :light="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
  <v-container v-else> Error </v-container>
</template>

<script setup lang="ts">
export interface IProps {
  pending?: boolean;
  overlay?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  pending: false,
  overlay: false
});
</script>
