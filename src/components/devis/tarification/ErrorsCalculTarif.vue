<template>
  <v-container v-if="props.errorCalculTarif.length > 0">
    <v-row v-for="(errorMsg, index) in props.errorCalculTarif" :key="index">
      <p class="error-bloquant">{{ errorMsg }}</p>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
export interface IProps {
  errorCalculTarif: string[];
}

const props = withDefaults(defineProps<IProps>(), {
  errorCalculTarif: () => []
});
</script>
<style>
.error-bloquant {
  padding-left: 12px;
  font-weight: bold;
  color: red;
  margin-bottom: 0px !important;
}
</style>
