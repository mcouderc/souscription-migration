<template>
  <div class="px-7 data-block" v-if="props.value">
    <span class="label text-sm">{{ props.label }} : </span>
    <span class="value text-sm font-semibold">
      {{
        props.value
          ? formatAmountWithAlreadyEuroSign(textTruncate(lengthTruncate, props.value))
          : '-'
      }}
    </span>
  </div>
</template>

<script setup lang="ts">
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import { ref } from 'vue';

export interface IProps {
  label?: string;
  value?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  label: '-',
  value: '-'
});

const lengthTruncate = ref<number>(40);

const { formatAmountWithAlreadyEuroSign, textTruncate } = formatDataConsultDevis();
</script>

<style scoped>
.data-block {
  width: 100%;
  display: flex;
}
.label {
  flex-basis: 40%;
}
.value {
  padding-left: 20px;
  flex-basis: 50%;
  display: flex;
  align-items: flex-end;
}
.px-7 {
  padding-right: 0px !important;
}
</style>
