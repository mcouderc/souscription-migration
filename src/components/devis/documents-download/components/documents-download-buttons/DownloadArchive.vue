<template>
  <v-btn small color="primary" :disabled="props.disabled" @click="downloadArchive()">
    <v-icon class="mr-2" small>mdi-download</v-icon>
    {{ props.labelButton }}
  </v-btn>
</template>

<script setup lang="ts">
import { useApiCall } from '@/composables/api-call/useApiCall';
import useLoader from '@/composables/useLoader';
import { watch } from 'vue';
import useSnackBar from '@/composables/useSnackBar';
import { useI18n } from 'vue-i18n';
import { documentsApi } from '@/plugins/open-api';
import type { Document } from 'open-api-souscription-typescript';

export interface IProps {
  documents: Document[];
  devisId: number;
  labelButton: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  documents: null,
  devisId: 0,
  labelButton: i18n.tc('forms.buttons.downloadAllDocuments'),
  disabled: false
});

const {
  isLoading: isLoadingArchiveDocDevis,
  isError: isErrorArchiveDocDevis,
  data: archiveDocument,
  doFetch: doFetchArchiveDocDevis
} = useApiCall<Document>({
  route: documentsApi().archiveDocumentDevis
});

const { addMessageErrorSnackBarAction } = useSnackBar();
const { setLoaderGlobal } = useLoader();

const downloadArchive = async () => {
  const uids = props.documents.map((document) => document.uid);

  await doFetchArchiveDocDevis(props.devisId, uids);
  if (isErrorArchiveDocDevis.value) {
    addMessageErrorSnackBarAction(i18n.tc('page.devisOverview.documents.errorGenerationArchive'));
  }
  if (archiveDocument.value) {
    window.open(archiveDocument.value.downloadLink);
  }
};

watch(
  () => isLoadingArchiveDocDevis.value,
  (isLoadingListSignature) => {
    setLoaderGlobal({ isLoading: isLoadingListSignature });
  }
);
</script>
