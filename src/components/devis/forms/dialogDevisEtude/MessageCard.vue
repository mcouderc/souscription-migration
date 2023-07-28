<template>
  <div>
    <p class="mt-5 font-weight-bold">{{ $tc('forms.popupEtude.commentaire') }} :</p>
    <ul class="mt-5 list_style">
      <li>- {{ $tc('forms.popupEtude.commentaire1') }}</li>
      <li>- {{ $tc('forms.popupEtude.commentaire2') }}</li>
    </ul>
    <v-textarea
      v-model="messageRef"
      outlined
      auto-grow
      hide-details
      rows="3"
      class="mt-4"
      @input="changeMessage()"
    />
  </div>
</template>
<script setup lang="ts">
import { VTextarea } from 'vuetify/components';
import { ref } from 'vue';

const emit = defineEmits(['editMessage']);

const messageRef = ref('');

const changeMessage = () => {
  emit('editMessage', messageRef.value);
};
</script>
<style scoped>
.list_style {
  list-style: none;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px !important;
}
</style>
