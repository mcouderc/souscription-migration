<template>
  <div class="justify-space-between d-flex my-2">
    <v-list :light="true" class="w-100">
      <DocumentItem
        :document="document"
        :documentIPID="props.documentIPID"
        v-for="document in props.documentList"
        :key="document.uid"
      />
    </v-list>
  </div>
</template>

<script setup lang="ts">
import DocumentItem from '@/components/devis/documents-download/components/document-list/components/DocumentItem.vue';
import type { Document } from 'open-api-souscription-typescript';

export interface IProps {
  documentList: Document[];
  documentIPID: Document;
}

const props = withDefaults(defineProps<IProps>(), {
  documentList: null,
  documentIPID: null
});
</script>
