<template>
  <div>
    <h2 class="text-primary text-h6 text-uppercase">
      {{ $t('page.devisOverview.documents.downloads') }}
    </h2>

    <template v-if="isLoadingListDocuments">
      <LoaderGenericSpecifique :is-loading="true" :relative="true" :opacity="0" />
    </template>
    <template v-else-if="documentListToDisplay.length">
      <DocumentList :document-list="documentListToDisplay" :documentIPID="documentIPIDRef" />
      <DocumentsDownloadButtons
        :documents="listDocuments"
        :devis-id="props.devisId"
        :max-documents-to-display="MAX_DOCUMENTS_TO_DISPLAY"
        :show-all-documents="showAllDocuments"
        @updateShowAllDocuments="updateShowAllDocuments"
      />
    </template>
    <template v-else>
      <DocumentListEmpty @get-list-documents="getListDocuments()" />
    </template>
  </div>
</template>

<script setup lang="ts">
import LoaderGenericSpecifique from '@/components/global/LoaderGenericSpecifique.vue';
import DocumentList from '@/components/devis/documents-download/components/document-list/DocumentList.vue';
import DocumentListEmpty from '@/components/devis/documents-download/components/DocumentListEmpty.vue';
import { useApiCall } from '@/composables/api-call/useApiCall';
import useConstante from '@/composables/useConstante';
import useSnackBar from '@/composables/useSnackBar';
import { useI18n } from 'vue-i18n';
import { documentsApi } from '@/plugins/open-api';
import type { Document } from 'open-api-souscription-typescript';
import { onMounted, ref, watch } from 'vue';
import DocumentsDownloadButtons from './components/documents-download-buttons/DocumentsDownloadButtons.vue';

export interface IProps {
  devisId: number;
  devisStatusHasJustChange?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  devisId: null,
  devisStatusHasJustChange: false
});

const emit = defineEmits(['documents-available-and-loaded']);

const UNE_SECONDE = 1000;
const DIX_SECONDE = 10000;
const delayInMillisecondsRef = ref<number>(
  props.devisStatusHasJustChange ? DIX_SECONDE : UNE_SECONDE
);
const documentIPIDRef = ref<Document>(null);
const documentListToDisplay = ref<Document[]>([]);
const showAllDocuments = ref<boolean>(false);
const MAX_DOCUMENTS_TO_DISPLAY = 7;

const { addMessageErrorSnackBarAction } = useSnackBar();
const { TYPE_DOC_IPID } = useConstante();

const {
  isLoading: isLoadingListDocuments,
  isError: isErrorListDocuments,
  data: listDocuments,
  doFetch: doFetchListDocuments
} = useApiCall<Document[]>({
  route: documentsApi().listDocuments
});

onMounted(() => {
  getListDocuments();
});

const getListDocuments = async () => {
  setTimeout(async () => {
    await doFetchListDocuments(props.devisId);

    if (isErrorListDocuments.value) {
      addMessageErrorSnackBarAction(i18n.tc('page.devisOverview.documents.error'));
    }

    if (listDocuments?.value) {
      displayDocuments();
      retrieveIPIDDocument(listDocuments.value);
      emit('documents-available-and-loaded', listDocuments?.value);
    }
  }, delayInMillisecondsRef.value);
};

const retrieveIPIDDocument = (documents: Document[]) => {
  const filteredData = documents.filter((doc) => doc.type === TYPE_DOC_IPID);
  documentIPIDRef.value = filteredData && filteredData?.length > 0 ? filteredData[0] : null;
};

const updateShowAllDocuments = (value: boolean) => {
  showAllDocuments.value = value;
};

const displayDocuments = () => {
  if (showAllDocuments.value) {
    documentListToDisplay.value = listDocuments.value;
  } else {
    documentListToDisplay.value = listDocuments.value.slice(0, MAX_DOCUMENTS_TO_DISPLAY);
  }
};

watch(
  () => showAllDocuments.value,
  () => {
    displayDocuments();
  }
);
</script>

<style scoped>
.doc-items {
  height: 35px;
  min-height: auto;
  padding: 0 5px;
}
.empty-document-text {
  color: #bbb;
  font-size: 1.2rem;
  font-style: italic;
}
.rotate {
  animation: rotate 1.1s linear infinite;
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
