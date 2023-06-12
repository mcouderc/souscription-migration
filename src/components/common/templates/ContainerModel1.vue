<template>
  <v-container v-if="!props.pending">
    <slot name="Header" />
    <v-container>
      <v-row align-start>
        <v-col
          :cols="$slots['Column'] ? 8 : 12"
          class="border-2 border-grey rounded bg-white relative px-0"
          style="height: fit-content"
        >
          <slot name="Body" />
        </v-col>
        <v-col v-if="$slots['Column']" cols="4" class="d-flex-col justify-between pt-0">
          <div class="sticky top-10">
            <slot name="Column" />
          </div>
        </v-col>
      </v-row>
      <v-row v-if="props.overlay">
        <v-overlay :light="true" :opacity="0.5">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-row>
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
