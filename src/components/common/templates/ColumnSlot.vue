<template>
  <v-row v-if="!props.pending" no-gutters class="pa-5 border-2 border-grey rounded bg-white">
    <v-col cols="12">
      <slot />
    </v-col>
  </v-row>
  <v-row v-else no-gutters class="pa-5 border-2 border-grey rounded bg-white">
    <v-overlay :light="true" absolute>
      <v-progress-circular indeterminate size="25"></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script setup lang="ts">
export interface IProps {
  pending?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  pending: false
});
</script>
