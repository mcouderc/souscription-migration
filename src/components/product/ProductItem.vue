<template>
  <v-col xs="12" sm="6" md="4" lg="3" class="pt-0 px-2">
    <v-card
      theme="light"
      tile
      outlined
      class="border-2 h-100"
      :style="`border-color:${props.color}`"
      @click="selectedEmit(true)"
    >
      <v-card-title :class="props.isOffersComparative ? 'h-100' : null">
        <v-card-actions class="w-100 pa-0">
          <div
            :title="props.name"
            :class="[
              {
                'text-sm': $vuetify.display.smAndDown,
                'text-base': $vuetify.display.mdAndUp
              },
              'pa-0 w-100 text-black uppercase text-left justify-space-between'
            ]"
            block
            text
            plain
            :ripple="false"
          >
            <div class="text-product">
              {{ props.name }}
              <v-icon right :class="`text-${props.color}`"> mdi-arrow-right </v-icon>
            </div>
          </div>
        </v-card-actions>
      </v-card-title>
      <v-card-text
        :class="[
          {
            'text-sm': $vuetify.display.smAndDown,
            'text-base': $vuetify.display.mdAndUp
          }
        ]"
        :title="props.longText"
      >
        {{ truncateTextComputed }}
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface IProps {
  lengthTruncate?: number;
  shortText?: string;
  longText?: string;
  color?: string;
  name?: string;
  isOffersComparative?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  lengthTruncate: 100,
  longText: '',
  shortText: '',
  color: 'default',
  name: 'default'
});

const truncateTextComputed = computed<string>(() => {
  if (props.shortText.length > props.lengthTruncate) {
    return `${props.shortText.substring(0, 100)} ...`;
  }
  return props.shortText;
});

const emit = defineEmits(['selected']);

const selectedEmit = (state: boolean) => {
  emit('selected', state);
};
</script>

<style>
.display-full {
  display: contents;
}
.text-product {
  word-break: break-word;
}
</style>
