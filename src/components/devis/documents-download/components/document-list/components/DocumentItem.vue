<template>
  <v-list-item :light="true" class="doc-items w-100">
    <v-list-item-title class="text-capitalize font-semibold text-sm text-default">
      {{ props.document.nom }}
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
          @click="
            downloadDocument(
              props.document.printLink,
              props.document.printLinkUnion,
              props.document.type
            )
          "
        >
          <v-icon>mdi-file-eye</v-icon>
        </v-btn>
        <v-btn
          small
          elevation="0"
          plain
          icon
          color="primary"
          @click="
            downloadDocument(
              props.document.downloadLink,
              props.document.downloadLinkUnion,
              props.document.type
            )
          "
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-list-item-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script setup lang="ts">
import useConstante from '@/composables/useConstante';
import type { Document } from 'open-api-souscription-typescript';

export interface IProps {
  document: Document;
  documentIPID: Document;
}

const props = withDefaults(defineProps<IProps>(), {
  document: null,
  documentIPID: null
});

const { TYPE_DOC_DEVIS, HASH_UNION, UID_UNION } = useConstante();

const downloadDocument = (linkDownload: string, linkDownloadWithUnion: string, type: string) => {
  const lienFormattedDevisIPID = retrieveLinkConcatDevisWithIPID(linkDownloadWithUnion, type);
  const lienDownloadFinal = lienFormattedDevisIPID ?? linkDownload;
  window.open(lienDownloadFinal);
};

const retrieveLinkConcatDevisWithIPID = (lienPourConcatenation: string, type: string): string => {
  let lienDownload = null;
  if (TYPE_DOC_DEVIS === type && props.documentIPID) {
    lienDownload = lienPourConcatenation
      .replace(HASH_UNION, props.documentIPID.hash)
      .replace(UID_UNION, props.documentIPID.uid);
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
</style>
