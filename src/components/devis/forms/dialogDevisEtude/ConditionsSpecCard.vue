<template>
  <div>
    <p class="mt-5 font-weight-bold">{{ $t('forms.popupEtude.conditionSpec') }} :</p>
    <ul class="mt-5 list_style">
      <li>- {{ $t('forms.popupEtude.conditionSpec1') }}</li>
      <li>- {{ $t('forms.popupEtude.conditionSpec2') }}</li>
      <li>- {{ $t('forms.popupEtude.conditionSpec3') }}</li>
    </ul>
    <v-textarea
      v-model="conditionSpecRef"
      outlined
      auto-grow
      hide-details
      rows="3"
      class="mt-4"
      @input="changeConditionSpec()"
    />
  </div>
</template>
<script setup lang="ts">
import { VTextarea } from 'vuetify/components';
import { ref } from 'vue';

const emit = defineEmits(['editConditionSpec']);

const conditionSpecRef = ref('');

const changeConditionSpec = () => {
  emit('editConditionSpec', conditionSpecRef.value);
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
