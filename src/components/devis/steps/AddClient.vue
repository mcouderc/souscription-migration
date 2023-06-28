<template>
  <ContainerModel2>
    <template #Header>
      <HeaderModel1>
        <template #Header-Title>Devis</template>
        <template #Header-SubTitle>{{ subtitle }}</template>
      </HeaderModel1>
    </template>
    <template #Body>
      <validation-observer ref="observerAddClientRef">
        <form>
          <v-row no-gutters align-start>
            <v-col cols="12">
              {{ $t('page.addClient.text') }}
            </v-col>
          </v-row>
          <v-row no-gutters align-start>
            <v-col cols="12">
              {{ $t('page.addClient.textbis') }}
            </v-col>
          </v-row>
          <div>
            <v-btn v-if="!route.query.id" class="mt-3 mr-5" @click="onNextActionNewProspect()">{{
              $t('page.addClient.newProspect')
            }}</v-btn>
            <v-btn v-else class="mt-3 mr-5" @click="onNextActionKeepClient()">{{
              $t('page.addClient.keepSame')
            }}</v-btn>

            <v-btn class="mt-3 mr-5" @click="suppLienClient()"
              >{{ $t('page.addClient.createNewProspect') }}
            </v-btn>

            <v-col v-if="error.length === 0" :class="classDynamiqueRef">
              <v-btn large @click="toggleShowClient()">{{
                $t('page.addClient.searchExistedClient')
              }}</v-btn>
            </v-col>
          </div>

          <v-col cols="12" v-if="showClientTableRef">
            <ExistedCLientTable @selectItem="selectItem($event.item)"></ExistedCLientTable>
          </v-col>
        </form>
      </validation-observer>
    </template>
  </ContainerModel2>
</template>

<script setup lang="ts">
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ContainerModel2 from '@/components/common/templates/ContainerModel2.vue';
import { ValidationObserver } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import ExistedCLientTable from '../ExistedCLientTable.vue';
import useDevis from '@/composables/useDevis';
import { ceryxClientApi } from '@/plugins/open-api';
import { useRoute } from 'vue-router/composables';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import useClientsCC from '@/composables/useClientsCC';
import mapCeryxClient from '@/services/mapCeryxClient';
import type { CeryxClientSearch, CeryxClient } from 'open-api-souscription-typescript';
import _ from 'lodash';

export interface IProps {
  required?: boolean;
  update?: boolean;
  client?: Promise<[]>;
}

const { devis, setDevisAction } = useDevis();
const { setLoaderGlobal } = useLoader();
const { getClientsCCAction, clients, error } = useClientsCC();
const { mapReturnCeryxThen, mapReturnCeryxCatch } = mapCeryxClient();

const route = useRoute();

const emit = defineEmits(['nextStep', 'previousStep']);

const showClientTableRef = ref<boolean>(false);
const classDynamiqueRef = ref<string>(null);

const {
  isLoading: isLoadingGetCeryxClient,
  isError: isErrorGetCeryxClient,
  data: clientCeryx,
  doFetch: doFetchGetCeryxClient
} = useApiCall<CeryxClient>({
  route: ceryxClientApi().getCeryxClient
});

onMounted(() => {
  route.query.id
    ? (classDynamiqueRef.value = 'text-center')
    : (classDynamiqueRef.value = 'align-btn');
  //lancer une recherche client si on est en update
  if (route.query.id && !clients.value.length) {
    getClientsCCAction();
  }
});

const subtitle = computed(() => {
  return `${devis.value.formuleSouscrite.nomProduit || ''} - ${
    devis.value.formuleSouscrite.nomFormule || ''
  }`;
});

const toggleShowClient = (): boolean => {
  return (showClientTableRef.value = !showClientTableRef.value);
};

const selectItem = async (item: CeryxClientSearch) => {
  //lancer le deuxième appel CC avec le num client pour ensuite tout enregistrer dans le devis
  await doFetchGetCeryxClient(item.lienClient);
  if (isErrorGetCeryxClient.value) {
    mapReturnCeryxCatch(item);
  }
  if (clientCeryx.value) {
    mapReturnCeryxThen(clientCeryx.value);
  }
  onNextActionKeepClient();
};

const suppLienClient = () => {
  setDevisAction(_.merge(devis.value, { numClientCeryx: null }));
  onNextActionKeepClient();
};

const onNextActionNewProspect = () => {
  if (devis.value.numClientCeryx) {
    const pays = devis.value.souscripteurPersonneMorale.adresse.pays;
    setDevisAction(
      _.merge(devis.value, {
        numClientCeryx: null,
        souscripteurPersonneMorale: {
          raisonSociale: '',
          identifiantLegal: '',
          adresse: {
            adresse1: '',
            adresse2: '',
            adresse3: '',
            codePostal: '',
            ville: '',
            pays: pays
          },
          telephone1: '',
          telephone2: '',
          mail: ''
        },
        representantPersonnePhysique: {
          nom: ''
        }
      })
    );
  }
  emit('nextStep', true);
};

const onNextActionKeepClient = () => {
  emit('nextStep', true);
};

watch(
  () => isLoadingGetCeryxClient.value,
  (isLoadingGetCeryxClient) => {
    setLoaderGlobal({ isLoading: isLoadingGetCeryxClient });
  }
);
</script>
<style scoped>
.align-btn {
  text-align: end;
}
.btn {
  padding-left: 20px;
}
</style>
