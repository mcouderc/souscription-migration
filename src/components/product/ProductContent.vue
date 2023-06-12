<template>
  <v-container>
    <v-row class="px-4">
      <v-col v-if="title">
        <router-link
          :to="`/produits/${props.title}`"
          :class="`h-100 uppercase font-medium text-decoration-none`"
          :style="`color:${props.color}`"
        >
          {{ props.title }}
        </router-link>
      </v-col>
      <v-col v-else>
        <v-skeleton-loader width="500" type="heading" />
      </v-col>
    </v-row>
    <v-row class="px-4">
      <slot />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
export interface IProps {
  title?: string;
  color?: string;
}
const props = withDefaults(defineProps<IProps>(), {
  title: '',
  color: ''
});
</script>
