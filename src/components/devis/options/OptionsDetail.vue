<template>
  <v-row>
    <v-col cols="12"
      ><li v-for="option in props.intituleOption" :key="option">
        {{ option }}
      </li></v-col
    >
  </v-row>
</template>

<script setup lang="ts">
export interface IProps {
  intituleOption?: string[];
}
const props = withDefaults(defineProps<IProps>(), {
  intituleOption: () => []
});
</script>
