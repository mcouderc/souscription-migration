<template>
  <v-container>
    <v-breadcrumbs :items="breadCrumbsComputed" divider=">" class="pa-0">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          class="text-subtitle-2 crumb-item capitalize"
          :to="item.to"
          :disabled="item.disabled || isNewDevis()"
          exact
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const breadCrumbsComputed = computed(() => {
  if (typeof route.meta.breadCrumb === 'function') {
    return route.meta.breadCrumb.call(this, route);
  }
  return route.meta.breadCrumb;
});

const isNewDevis = () => {
  return route.query.new ? true : false;
};
</script>
