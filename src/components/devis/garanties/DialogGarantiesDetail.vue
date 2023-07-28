<template>
  <DetailPasGaranties v-if="!isGarantieExistRef" />
  <v-dialog v-else v-model="dialogGarantieRef" width="800">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" small v-bind="props">
        {{ $tc('forms.buttons.detailGaranties') }}</v-btn
      >
    </template>

    <v-card>
      <v-card-title class="text-primary text-h5 text-uppercase mb-2">
        {{ $tc('page.devisOverview.detailsGaranties.title') }}
      </v-card-title>
      <v-card-subtitle class="text-h7 lighten-2 pb-0">
        {{ titleProductFormulaComputed }}
      </v-card-subtitle>
      <DetailGaranties :mapDetailGaranties="mapDetailGaranties" />
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-center">
        <v-btn color="primary" @click="dialogGarantieRef = false">
          {{ $tc('forms.buttons.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import useDevis from '@/composables/useDevis';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import DetailGaranties from '@/components/devis/garanties/DetailGaranties.vue';
import DetailPasGaranties from '@/components/devis/garanties/DetailPasGarantie.vue';
import type IGarantie from '@/models/interfaceEligibility/IGarantie';
import type IGroupesGaranties from '@/models/interfaceEligibility/IGroupesGaranties';
import { formulesDetailsApi } from '@/plugins/open-api';
import { computed, onMounted, ref, watch } from 'vue';

export interface IFormulesDetailsGarantie {
  groupesGarantiesServices: [];
  type: string;
}

const dialogGarantieRef = ref<boolean>(false);
const isGarantieExistRef = ref<boolean>(false);

const { devis } = useDevis();
const { setLoaderGlobal } = useLoader();
const mapDetailGaranties = new Map();

const {
  isLoading: isLoadingFormulesGarantie,
  data: formuleDetailGarantie,
  doFetch: doFetchFormulesGarantie
} = useApiCall<any>({
  route: formulesDetailsApi().formulesDetailsGarantie
});

onMounted(() => {
  getDetailsFormule(devis.value.id);
});

const titleProductFormulaComputed = computed((): string => {
  return `${devis.value?.formuleSouscrite?.nomProduit || ''} ${
    devis.value?.formuleSouscrite?.nomFormule || ''
  }`;
});

const getDetailsFormule = async (idDevis: number) => {
  await doFetchFormulesGarantie(idDevis);
  if (formuleDetailGarantie.value) {
    creationMap(formuleDetailGarantie.value);
  }
};

const feedMap = ({ array, type }) => {
  return array.map((garantie: IGarantie) => {
    return { garantie, type };
  });
};

const creationMap = (data: IFormulesDetailsGarantie[]) => {
  data.forEach((formule: IFormulesDetailsGarantie) => {
    const type = formule.type;
    formule.groupesGarantiesServices.forEach((gpe: IGroupesGaranties) => {
      const garanties = [
        ...feedMap({
          array: gpe.garanties,
          type
        }),
        ...feedMap({
          array: gpe.services,
          type
        }),
        ...feedMap({
          array: gpe.prestations,
          type
        })
      ];

      if (mapDetailGaranties.get(gpe.nom)) {
        const arrayToConcat = mapDetailGaranties.get(gpe.nom);
        mapDetailGaranties.set(gpe.nom, [...arrayToConcat, ...garanties]);
      } else {
        mapDetailGaranties.set(gpe.nom, garanties);
      }
      isGarantieExistRef.value = true;
    });
  });
};

watch(
  () => isLoadingFormulesGarantie.value,
  (isLoadingFormulesGarantie) => {
    setLoaderGlobal({ isLoading: isLoadingFormulesGarantie });
  }
);
</script>
