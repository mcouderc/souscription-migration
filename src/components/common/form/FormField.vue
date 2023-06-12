<template>
  <v-text-field
    v-model.number="modelRef"
    label="Emis par"
    @input="onEventInputAction(modelRef)"
  ></v-text-field>
</template>

<script setup lang="ts">
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import { ref, watch } from 'vue';

export interface IProps {
  value?: DevisEntreprise;
  takingStatusIntoAccount?: boolean;
  // filialeValueValidate?: IFilialeValidate;
  buttonDisabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  data: {},
  buttonDisabled: false
});

const emit = defineEmits(['input']);

const onEventInputAction = (modelValue) => {
  console.log('🚀 ~ file: FormField.vue:27 ~ onEventInputAction ~ modelValue:', modelValue);
  emit('input', modelValue);
};

const modelRef = ref(props.value);
</script>
