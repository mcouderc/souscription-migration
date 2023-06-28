<template>
  <div>
    <h2 class="text-primary text-h6 text-uppercase">
      {{ $tc('page.devisOverview.detailOptions.titleCardOverview') }}
    </h2>
    <div class="mt-4">
      <OptionsDetail :intituleOption="props.intituleOption" />
    </div>
  </div>
</template>

<script setup lang="ts">
import OptionsDetail from '@/components/devis/options/OptionsDetail.vue';
export interface IProps {
  intituleOption?: string[];
}
const props = withDefaults(defineProps<IProps>(), {
  intituleOption: () => []
});
</script>
