<template>
  <v-col>
    <v-row>
      <v-col cols="6">
        <v-combobox
          id="emisPar"
          v-model="modelRef"
          :title="$t('forms.labels.devisBy')"
          :placeholder="$t('forms.labels.devisBy')"
          :items="getRedactorFilteredComputed"
          :maxlength="50"
          clearable
          :menu-props="{ auto: true, overflowY: true }"
          @update:search-input="onEventInputAction"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        >
        </v-combobox>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useRedactor from '@/composables/useRedactor';
import useDevis from '@/composables/useDevis';

export interface IProps {
  value?: string;
}

const { getRedactorsAction, getRedactorFilteredComputed } = useRedactor();

const { devis } = useDevis();
const emit = defineEmits(['input', 'checkIfObjectIsSame']);
const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};
const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const modelRef = ref('');

onMounted(() => {
  getRedactorsAction();
  if (devis.value.numeroDevis) {
    modelRef.value = devis.value?.emisPar;
  }
});
</script>
