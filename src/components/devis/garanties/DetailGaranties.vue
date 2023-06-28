<template>
  <v-expansion-panels v-model="panelsOpenRef" flat multiple accordion>
    <v-expansion-panel
      v-for="([gpeGarantie, value], index) in props.mapDetailGaranties"
      :key="index"
    >
      <v-expansion-panel-header class="pl-4">
        <v-col cols="12">
          <h3 class="text-primary text-h6 text-capitalize">{{ gpeGarantie }}</h3>
        </v-col>
      </v-expansion-panel-header>

      <v-expansion-panel-content>
        <v-expansion-panels multiple accordion>
          <v-expansion-panel v-for="(garantie, index) in value" :key="index">
            <v-expansion-panel-header>
              <v-col cols="12">{{ garantie?.garantie?.nom }} </v-col>
            </v-expansion-panel-header>
            <v-expansion-panel-content v-if="isClausesExist(garantie.garantie)">{{
              $tc('page.devisOverview.detailsGaranties.noClauses')
            }}</v-expansion-panel-content>
            <v-expansion-panel-content
              class="list-style"
              v-else-if="garantie?.garantie?.clauses.length"
            >
              <v-col
                cols="12"
                class="pt-0"
                v-for="clause in garantie.garantie.clauses"
                :key="clause.id"
                ><span v-if="clause.type !== CLAUSES_TYPE_MONTANT_CONTRACTUEL">{{
                  clause.nom
                }}</span>
              </v-col>

              <v-col cols="12" class="pt-0" v-if="garantie.garantie.exemple"
                ><div class="exemple pl-5 pr-5">{{ garantie.garantie.exemple }}</div></v-col
              >
            </v-expansion-panel-content>

            <v-expansion-panel-content v-else>{{
              $tc('page.devisOverview.detailsGaranties.noClauses')
            }}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import useConstante from '@/composables/useConstante';
import type IGarantie from '@/models/interfaceEligibility/IGarantie';
import { onMounted, ref } from 'vue';

export interface IProps {
  mapDetailGaranties: any;
}

const { CLAUSES_TYPE_MONTANT_CONTRACTUEL } = useConstante();

onMounted(() => {
  getAllPanelsOpen();
});

const props = withDefaults(defineProps<IProps>(), {});
const panelsOpenRef = ref<number[]>([]);

const isClausesExist = (garantie: IGarantie): boolean => {
  return (
    garantie?.clauses?.length === 1 &&
    garantie?.clauses[0]?.type === CLAUSES_TYPE_MONTANT_CONTRACTUEL
  );
};

const getAllPanelsOpen = (): number[] => {
  const nbPanelsRef = ref<number>(0);
  const keysFromMap = Array.from(props.mapDetailGaranties.keys());
  keysFromMap.forEach(() => {
    panelsOpenRef.value.push(nbPanelsRef.value);
    nbPanelsRef.value++;
  });
  return panelsOpenRef.value;
};
</script>

<style scoped>
.list-style {
  white-space: pre-wrap;
  font-size: 14px;
}
.exemple {
  background-color: rgb(211, 211, 211);
  text-align: center;
}
</style>
