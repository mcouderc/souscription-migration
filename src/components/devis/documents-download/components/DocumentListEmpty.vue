<template>
  <div class="d-flex justify-center flex-column">
    <p class="empty-document-text mt-5">
      {{ $t('page.devisOverview.documents.empty') }}
    </p>
    <v-btn small color="primary" @click="onClickRefreshButton()">
      <v-icon class="mr-2" small>mdi-reload</v-icon>
      {{ $t('forms.buttons.refresh') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['getListDocuments']);

const onClickRefreshButton = () => {
  emit('getListDocuments', true);
};
</script>

<style scoped>
.empty-document-text {
  color: #bbb;
  font-size: 1.2rem;
  font-style: italic;
}
</style>
