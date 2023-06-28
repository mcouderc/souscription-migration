<template>
  <div
    :class="
      props.documents.length > props.maxDocumentsToDisplay
        ? 'justify-content-between'
        : 'justify-center'
    "
    class="d-flex"
  >
    <DownloadArchive
      :devis-id="props.devisId"
      :documents="props.documents"
      :labelButton="$tc('forms.buttons.downloadAllDocuments')"
    />
    <v-btn
      v-if="props.documents.length > props.maxDocumentsToDisplay"
      color="primary"
      small
      class="docs-view"
      @click="toggleVisibility()"
    >
      {{
        showAllDocuments
          ? $t('page.devisOverview.documents.seeLess')
          : $t('page.devisOverview.documents.seeMore')
      }}
      <v-icon small right dark class="mr-2">
        {{ showAllDocuments ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import DownloadArchive from '@/components/devis/documents-download/components/documents-download-buttons/DownloadArchive.vue';
import type { Document } from 'open-api-souscription-typescript';

export interface IProps {
  documents: Document[];
  devisId: number;
  maxDocumentsToDisplay: number;
  showAllDocuments: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  documents: null,
  devisId: 0,
  maxDocumentsToDisplay: 3,
  showAllDocuments: false
});

const emit = defineEmits(['updateShowAllDocuments']);

const toggleVisibility = () => {
  emit('updateShowAllDocuments', !props.showAllDocuments);
};
</script>
