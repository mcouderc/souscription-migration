<template>
  <div>
    <p>{{ $t('page.additionalInformation.preRemplirSiret') }}</p>
    <v-col cols="12">
      <v-dialog v-model="dialogRef" :light="true" width="650">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            pain
            elevation="0"
            block
            color="primary"
            v-bind="attrs"
            v-on="on"
            :disabled="isDisabledButtonRef"
          >
            {{ $t('page.additionalInformation.preRemplirButton') }}
          </v-btn>
        </template>
        <v-card :light="true">
          <v-container>
            <p class="sub-title-helios">
              {{ $t('page.additionalInformation.preRemplirPappers') }}
            </p>
            <v-row>
              <v-col>
                <ContainerButtons1
                  @cancelResponse="getDialogResponse()"
                  @submitResponse="preRemplirPappers()"
                >
                  <template #Cancel>
                    {{ $t('forms.buttons.cancel') }}
                  </template>
                  <template #Submit>
                    {{ $t('page.additionalInformation.preRemplirButton') }}
                  </template>
                </ContainerButtons1>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>

<script setup lang="ts">
import type { Pays } from 'open-api-souscription-typescript/dist/fr/cfdp/axios/generated/souscription/model/pays';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import { DevisEntrepriseStatutEnum, type DevisEntreprise } from 'open-api-souscription-typescript';
import validationRulesSiret from '@/services/validationRulesSiret';
import useConstante from '@/composables/useConstante';
import useSelectedProduct from '@/composables/useSelectedProduct';
import { ref, watch, onMounted } from 'vue';

export interface IProps {
  devis: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {});

const { siretIsValid, getCountryParent } = validationRulesSiret();
const { COUNTRYS } = useConstante();
const { product } = useSelectedProduct();

const emit = defineEmits(['devisFromPapper']);
const dialogRef = ref(false);
const isDisabledButtonRef = ref(true);
const itemsCountryRef = ref<Pays[]>(product.value.pays ? product.value.pays : []);

onMounted(() => {
  disableButton();
});

const getDialogResponse = () => {
  dialogRef.value = false;
};

const preRemplirPappers = () => {
  emitDevis();
  dialogRef.value = false;
};

const disableButton = () => {
  isDisabledButtonRef.value = !(
    props.devis.statut !== DevisEntrepriseStatutEnum.Emis &&
    siretIsValid(props.devis.souscripteurPersonneMorale.identifiantLegal, props.devis.codePays) &&
    getCountryParent(itemsCountryRef.value, props.devis.codePays) === COUNTRYS.FR
  );
};

const emitDevis = () => {
  emit('devisFromPapper');
};

watch(
  () => props.devis.souscripteurPersonneMorale.identifiantLegal,
  () => {
    disableButton();
  }
);
</script>

<style scoped>
.col-12 {
  padding: 0px;
}
</style>
