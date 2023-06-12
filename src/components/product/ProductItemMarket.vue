<template>
  <v-col xs="12" md="6" lg="4" class="pt-0 px-2">
    <router-link :to="`/produits/${props.name}`" :title="props.name" class="no-underline">
      <v-card
        theme="light"
        tile
        outlined
        class="border-2 h-100"
        :style="`border-color:${props.color}`"
      >
        <v-card-title>
          <v-card-actions class="w-100 pa-0">
            <div
              :class="[
                {
                  'text-sm': $vuetify.display.smAndDown,
                  'text-base': $vuetify.display.mdAndUp
                },
                'text-truncate w-100 uppercase'
              ]"
            >
              {{ props.name }}
            </div>
            <v-icon right :style="`color:${props.color}`"> mdi-arrow-right </v-icon>
          </v-card-actions>
        </v-card-title>
        <v-card-text
          :class="[
            {
              'text-sm': $vuetify.display.smAndDown,
              'text-base': $vuetify.display.mdAndUp
            }
          ]"
        >
          {{ truncateTextComputed }}
        </v-card-text>
      </v-card>
    </router-link>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface IProps {
  lengthTruncate?: number;
  color: string;
  name: string;
  text: string;
}

const props = withDefaults(defineProps<IProps>(), {
  lengthTruncate: 100,
  text: '',
  color: '',
  name: ''
});

const truncateTextComputed = computed<string>(() => {
  return props.text.length > props.lengthTruncate
    ? `${props.text.substring(0, 100)} ...`
    : props.text;
});
</script>
