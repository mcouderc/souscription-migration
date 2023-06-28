<template>
  <td v-if="props.isDividerPrice">
    <strong class="intitule-gpe-garantie">{{ props.intituleGarantie.text }}</strong>
  </td>
  <td v-else>
    <div class="header-title">{{ props.intituleGarantie.text }}</div>
  </td>
</template>

<script setup lang="ts">
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';

export interface IProps {
  intituleGarantie: IGarantieContenueOuIntituleGarantieHeader;
  isDividerPrice: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isDividerPrice: false
});
</script>

<style scoped>
.header-title {
  margin-left: 22px;
  font-size: 13px;
}
.intitule-gpe-garantie {
  font-size: 15px;
  margin-left: 12px;
}
</style>
