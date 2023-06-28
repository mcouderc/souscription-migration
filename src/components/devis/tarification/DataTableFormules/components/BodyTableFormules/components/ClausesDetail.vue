<template>
  <v-card width="25rem">
    <v-card-title v-if="isClausesExist()">
      <p v-if="props.headerItem.clauses.length">{{ $t('page.tarification.titleDescription') }}</p>
    </v-card-title>
    <v-card-text class="list-style" v-if="isClausesExist()">
      <p v-for="clause in props.headerItem.clauses" :key="clause.id">
        <span v-if="clause?.type !== CLAUSES_TYPE_MONTANT_CONTRACTUEL"> {{ clause.nom }} </span>
      </p>
    </v-card-text>

    <v-card-title v-if="props.headerItem.exemple">{{
      $t('page.tarification.titleExample')
    }}</v-card-title>
    <v-card-text v-if="props.headerItem.exemple" class="list-style">
      {{ props.headerItem.exemple }}</v-card-text
    >
  </v-card>
</template>

<script setup lang="ts">
import useConstante from '@/composables/useConstante';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';

export interface IProps {
  headerItem: IGarantieContenueOuIntituleGarantieHeader;
}

const props = withDefaults(defineProps<IProps>(), {});

const { CLAUSES_TYPE_MONTANT_CONTRACTUEL } = useConstante();

const isClausesExist = (): boolean => {
  return (
    props.headerItem.clauses.length > 1 ||
    props.headerItem.clauses[0]?.type !== CLAUSES_TYPE_MONTANT_CONTRACTUEL
  );
};
</script>
<style scoped>
.list-style {
  white-space: pre-wrap;
}
</style>
