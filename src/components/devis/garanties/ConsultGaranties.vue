<template>
  <div>
    <h2 class="text-primary text-h6 text-uppercase">
      {{ $tc('page.devisOverview.detailsGaranties.titleCardOverview') }}
    </h2>
    <div class="mt-4">
      <p>{{ product.accrocheCourte }}</p>
      <DialogGarantiesDetail />
    </div>
  </div>
</template>

<script setup lang="ts">
import DialogGarantiesDetail from '@/components/devis/garanties/DialogGarantiesDetail.vue';
import useDevis from '@/composables/useDevis';
import { useApiCall } from '@/composables/api-call/useApiCall';
import type { Produit } from 'open-api-souscription-typescript';
import useLoader from '@/composables/useLoader';
import useSelectedProduct from '@/composables/useSelectedProduct';
import { produitsApi } from '@/plugins/open-api';
import { onMounted, watch } from 'vue';

const { devis } = useDevis();
const { setLoaderGlobal } = useLoader();
const { setProductAction, product } = useSelectedProduct();

const {
  isLoading: isLoadingGetProduit,
  data: produit,
  doFetch: doFetchGetProduit
} = useApiCall<Produit>({
  route: produitsApi().getProduit
});

onMounted(() => {
  getSelectedProduct(devis.value.formuleSouscrite.idProduit);
});

const getSelectedProduct = async (idProduit: number) => {
  await doFetchGetProduit(idProduit);
  if (produit.value) {
    setProductAction(produit.value);
  }
};

watch(
  () => isLoadingGetProduit.value,
  (isLoadingGetProduit) => {
    setLoaderGlobal({ isLoading: isLoadingGetProduit });
  }
);
</script>
