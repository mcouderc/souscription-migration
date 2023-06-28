<template>
  <div>
    <h2 class="text-primary text-h6 text-uppercase"><slot /></h2>
    <div v-if="!pendingRef && !documentsIsEmpty" class="justify-space-between d-flex my-2">
      <v-list :light="true" class="w-100">
        <v-list-item
          v-for="{
            uid,
            nom,
            downloadLink,
            printLink,
            type,
            downloadLinkUnion,
            printLinkUnion
          } in documentsListRef"
          :key="uid"
          :light="true"
          class="doc-items"
        >
          <v-list-item-title class="text-capitalize font-semibold text-sm text-default">
            {{ nom }}
          </v-list-item-title>
          <v-list-item-action class="ma-0">
            <v-list-item-icon>
              <v-btn
                small
                elevation="0"
                target="_blank"
                plain
                icon
                color="primary"
                class="mr-5"
                @click="downloadDocument(printLink, printLinkUnion, type)"
              >
                <v-icon>mdi-file-eye</v-icon>
              </v-btn>
              <v-btn
                small
                elevation="0"
                plain
                icon
                color="primary"
                @click="downloadDocument(downloadLink, downloadLinkUnion, type)"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
    <div v-else-if="documentsIsEmpty && !pendingRef" class="d-flex justify-center flex-column">
      <p class="empty-document-text mt-5">
        {{ $t('page.devisOverview.documents.empty') }}
      </p>
      <v-btn
        small
        color="primary"
        :disabled="pendingRef"
        @click="waitingGetDocument(props.devisId)"
      >
        <v-icon class="mr-2" small>mdi-reload</v-icon>
        {{ $t('forms.buttons.refresh') }}
      </v-btn>
    </div>
    <div v-else>
      <v-overlay :light="true" :z-index="40" class="loaderDocument" opacity="0">
        <v-progress-circular indeterminate size="32" color="grey-darken-1" />
      </v-overlay>
      <p class="empty-document-text mt-2 mb-0">
        {{ $t('overview.loadingDocument') }}
      </p>
    </div>
    <div
      :class="
        documentsRef.length > initialDocsCounter ? 'justify-content-between' : 'justify-center'
      "
      class="d-flex"
      v-if="!pendingRef"
    >
      <v-btn
        v-if="!documentsIsEmpty"
        small
        color="primary"
        :disabled="downloadArchiveInProgressRef"
        @click="downloadArchive()"
      >
        <v-icon v-show="downloadArchiveInProgressRef" class="mr-2 rotate" small>mdi-reload</v-icon>
        <v-icon v-show="!downloadArchiveInProgressRef" class="mr-2" small>mdi-download</v-icon>
        {{ $t('forms.buttons.downloadAllDocuments') }}
      </v-btn>
      <v-btn
        v-if="documentsRef.length > initialDocsCounter"
        color="primary"
        small
        class="docs-view"
        @click="toggleVisibility()"
      >
        {{
          showAllDocsRef
            ? $t('page.devisOverview.documents.seeLess')
            : $t('page.devisOverview.documents.seeMore')
        }}
        <v-icon small right dark class="mr-2">
          {{ showAllDocsRef ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon
        ></v-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useSnackBar from '@/composables/useSnackBar';
import type { Document } from 'open-api-souscription-typescript';
import { documentsApi } from '@/plugins/open-api';
import { useI18n } from 'vue-i18n';
import useConstante from '@/composables/useConstante';

export interface IProps {
  devisId: number;
  devisStatus?: string;
  devisStatusHasJustChange?: boolean;
}
const { t } = useI18n();
const initialDocsCounter = 7;
const pendingRef = ref(false);
const documentsRef = ref<Array<Document>>([]);
const documentsListRef = ref([]);
const showAllDocsRef = ref(false);
const { addMessageErrorSnackBarAction } = useSnackBar();
const { TYPE_DOC_DEVIS, TYPE_DOC_IPID, HASH_UNION, UID_UNION } = useConstante();
const emit = defineEmits(['documents-available-and-loaded']);

const delayInMillisecondsRef = ref(import.meta.env.VITE_SECONDES_CHARGEMENT_GED);
const downloadArchiveInProgressRef = ref(false);
const documentIPIDRef = ref<Document>(null);

const props = withDefaults(defineProps<IProps>(), {
  devisId: null,
  downloadArchiveInProgressRef: false
});

onMounted(() => {
  delayInMillisecondsRef.value = props.devisStatusHasJustChange
    ? delayInMillisecondsRef.value
    : 1000;
  waitingGetDocument(props.devisId);
});

const getDocuments = (id: number) => {
  setTimeout(() => {
    documentsApi()
      .listDocuments(id)
      .then((responseDocuments) => {
        displayData(responseDocuments.data);
        retrieveIPIDDocument(responseDocuments.data);
      })
      .catch(() => {
        addMessageErrorSnackBarAction(t('page.devisOverview.documents.error'));
      })
      .finally(() => {
        pendingRef.value = false;
      });
  }, delayInMillisecondsRef.value);
};

const downloadArchive = () => {
  downloadArchiveInProgressRef.value = true;
  const uids = documentsRef.value.map((document) => document.uid);
  documentsApi()
    .archiveDocumentDevis(props.devisId, uids)
    .then((responseDocument) => {
      window.open(responseDocument.data.downloadLink);
    })
    .catch(() => {
      addMessageErrorSnackBarAction(t('page.devisOverview.documents.errorGenerationArchive'));
    })
    .finally(() => {
      downloadArchiveInProgressRef.value = false;
    });
};

defineExpose({ downloadArchive, downloadArchiveInProgressRef });

const displayData = (responseDocuments: Document[]) => {
  pendingRef.value = false;
  documentsRef.value = responseDocuments;
  displayDocuments();
};

const waitingGetDocument = (id: number) => {
  pendingRef.value = true;
  getDocuments(id);
};

const documentsIsEmpty = computed(() => {
  if (documentsRef.value.length === 0) {
    return true;
  }
  emit('documents-available-and-loaded');
  return false;
});

const displayDocuments = () => {
  if (showAllDocsRef.value) {
    documentsListRef.value = documentsRef.value;
  } else {
    documentsListRef.value = documentsRef.value.slice(0, initialDocsCounter);
  }
};

const toggleVisibility = () => {
  showAllDocsRef.value = !showAllDocsRef.value;
  displayDocuments();
};

const downloadDocument = (linkDownload: string, linkDownloadWithUnion: string, type: string) => {
  const lienFormattedDevisIPID = retrieveLinkConcatDevisWithIPID(linkDownloadWithUnion, type);
  const lienDownloadFinal = lienFormattedDevisIPID ?? linkDownload;
  window.open(lienDownloadFinal);
};

const retrieveIPIDDocument = (documents: Document[]) => {
  const filteredData = documents.filter((doc) => doc.type === TYPE_DOC_IPID);
  documentIPIDRef.value = filteredData && filteredData?.length > 0 ? filteredData[0] : null;
};
const retrieveLinkConcatDevisWithIPID = (lienPourConcatenation: string, type: string): string => {
  let lienDownload = null;
  if (TYPE_DOC_DEVIS === type && documentIPIDRef.value) {
    lienDownload = lienPourConcatenation
      .replace(HASH_UNION, documentIPIDRef.value.hash)
      .replace(UID_UNION, documentIPIDRef.value.uid);
  }
  return lienDownload;
};
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
.loaderDocument {
  position: initial;
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
