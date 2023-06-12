<template>
  <div>
    <template v-if="!props.noRow">
      <v-row v-for="i in props.rowLoop" :key="i">
        <v-col v-for="index in props.colLoop" :key="index" xs="12" md="6" lg="4" class="pt-0 px-2">
          <v-sheet theme="light" outlined class="pa-3 border-grey border-2 h-100">
            <v-skeleton-loader type="article" />
          </v-sheet>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <ProductContent>
        <v-col
          v-for="index in props.colLoop"
          :key="index"
          xs="12"
          sm="6"
          md="4"
          lg="3"
          class="pt-0 px-2"
        >
          <v-sheet theme="light" outlined class="pa-3 border-grey border-2 h-100">
            <v-skeleton-loader type="article" />
          </v-sheet>
        </v-col>
      </ProductContent>
    </template>
  </div>
</template>

<script setup lang="ts">
import ProductContent from '@/components/product/ProductContent.vue';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

export interface IProps {
  noRow?: boolean;
  rowLoop?: number;
  colLoop?: number;
}
const props = withDefaults(defineProps<IProps>(), {
  noRow: false,
  rowLoop: 2,
  colLoop: 5
});
</script>
