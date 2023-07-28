<template>
  <v-menu bottom v-if="isValue(props.headerItem)" open-on-hover offset-y>
    <template v-slot:activator="{ props }">
      <v-icon color="green" v-bind="props">mdi-check</v-icon>
    </template>
    <ClausesDetail v-if="isCardExist()" :headerItem="props.headerItem" />
  </v-menu>

  <v-icon v-else color="red">mdi-window-close</v-icon>
</template>

<script setup lang="ts">
import useBodyTableTarificationService from '@/composables/useBodyTableTarificationService';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';
import ClausesDetail from '@/components/devis/tarification/DataTableFormules/components/BodyTableFormules/components/ClausesDetail.vue';

export interface IProps {
  itemDansFormule: IGarantieContenueOuIntituleGarantieHeader;
  headerItem: IGarantieContenueOuIntituleGarantieHeader;
}

const props = withDefaults(defineProps<IProps>(), {});

const { isValue } = useBodyTableTarificationService();

const isCardExist = () => {
  return props.headerItem.clauses.length || props.headerItem.exemple;
};
</script>
