<template>
  <ProductContent :title="products[0].marche.nom" :color="products[0].couleur">
    <ProductItem
      v-for="(product, index) in sliceProducts"
      :key="index"
      :color="product.couleur"
      :name="product.nom"
      :short-text="product.accrocheCourte"
      :long-text="product.accrocheLongue"
      :type-risque="product.typeRisque"
      @selected="navigateToSteps(props.products[index])"
    />
  </ProductContent>
</template>

<script setup lang="ts">
import useSelectedProduct from '@/composables/useSelectedProduct';
import ProductContent from '@/components/product/ProductContent.vue';
import ProductItem from '@/components/product/ProductItem.vue';
import type { Produit } from 'open-api-souscription-typescript';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useRoutageProduit from '@/composables/useRoutageProduit';
import type { IQueryRoutage } from '@/models/IQueryRoutage';
import { documentsApi } from '@/plugins/open-api';
import useSnackBar from '@/composables/useSnackBar';
import { useI18n } from 'vue-i18n';

export interface IProps {
  products: any;
  color?: string;
  name?: string;
}

const { t } = useI18n();
const { addMessageErrorSnackBarAction } = useSnackBar();
const { setProductAction } = useSelectedProduct();
const props = withDefaults(defineProps<IProps>(), {
  products: {} as Produit,
  color: '',
  name: ''
});
const router = useRouter();
const { onRouteToCorrectTemplate } = useRoutageProduit();
const route = useRoute();
const navigateToSteps = (currentProduct: Produit | any) => {
  if (currentProduct.isOffersComparative) {
    openComparativeDoc();
  } else {
    setProductAction(currentProduct);
    let query: IQueryRoutage;
    if (route.query.new) {
      query = {
        step: 'date-d-effet',
        new: 'true'
      };
    } else {
      query = {
        step: 'date'
      };
    }
    const typeRisque = currentProduct.typeRisque;
    const produitId = currentProduct.id;
    const templateRoute = onRouteToCorrectTemplate(typeRisque, produitId, query);
    router.push(templateRoute);
  }
};

const openComparativeDoc = () => {
  documentsApi()
    .getDocumentDescriptifPro()
    .then((response) => {
      window.open(response.data.printLink, '_blank');
    })
    .catch(() => {
      addMessageErrorSnackBarAction(t('page.subscription.produits.comparativeDocError'));
    });
};

const sliceProducts = computed<Produit[]>(() => {
  return props.products.slice();
});
</script>
