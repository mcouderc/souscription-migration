<template>
  <validation-provider
    v-slot="{ errors }"
    :name="props.title"
    :vid="props.radioButtonId"
    :rules="{ required: props.isRequired }"
  >
    <v-radio-group
      :id="props.radioButtonId"
      row
      v-model="modelRef"
      :label="props.title"
      :error-messages="errors"
      :disabled="props.isDisabled"
      :readonly="props.isReadonly"
      :required="props.isRequired"
      @change="onEventInputAction(modelRef)"
    >
      <template #label>
        <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
          <strong>* </strong>
        </span>
        <label :class="labelStyle(errors, props.isDisabled)">{{ props.title }}</label>
      </template>
      <v-radio :key="1" :label="props.labelButton1" :value="true"> </v-radio>
      <v-radio :key="2" :label="props.labelButton2" :value="false"> </v-radio>
    </v-radio-group>
  </validation-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ValidationProvider } from 'vee-validate';
import { VRadioGroup, VRadio } from 'vuetify/components';
import inputStyle from '@/services/inputStyle';

export interface IProps {
  value?: boolean;
  radioButtonId: string;
  isReadonly?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  title: string;
  labelButton1: string;
  labelButton2: string;
}

const props = withDefaults(defineProps<IProps>(), {
  isReadonly: false,
  isDisabled: false,
  isRequired: false
});

const modelRef = ref<boolean>(props.value);

const { starStyle, labelStyle } = inputStyle();

const emit = defineEmits(['input', 'blur']);

const onEventInputAction = (modelValue) => {
  emit('blur', true);
  emit('input', modelValue);
};

watch(
  () => props.value,
  (newVal) => {
    modelRef.value = newVal;
  }
);
</script>
