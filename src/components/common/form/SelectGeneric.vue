<template>
  <validation-provider
    v-slot="{ errors }"
    :name="props.title"
    :vid="inputId"
    :rules="isRequired ? 'required' : ''"
  >
    <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
      <strong>* </strong>
    </span>
    <label :class="`${labelStyle(errors, props.isDisabled)}${' '}${labelClass}`">{{
      props.title
    }}</label>
    <v-select
      :class="`mt-0 pt-0 ${inputClass}`"
      v-model="modelRef"
      :light="true"
      dense
      :id="props.inputId"
      :value="value"
      :items="items"
      :item-text="itemsKeys ? itemsKeys[1] : null"
      :item-value="itemsKeys ? itemsKeys[2] : null"
      :data-cy="inputId"
      :menu-props="{ bottom: true, offsetY: true, light: true }"
      :error-messages="errors"
      :required="isRequired"
      :readonly="isReadonly"
      :disabled="isDisabled"
      :title="props.title"
      :clearable="isClearable"
      :multiple="isMultiple"
      :maxlength="props.maxLength"
      @input="onSelectEventInputAction(modelRef)"
      @change="checkIfObjectIsSameAction(true)"
    >
    </v-select>
  </validation-provider>
</template>

<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
import { ValidationProvider } from 'vee-validate';
import { ref, watch } from 'vue';

export interface IProps {
  value?: any;
  items: any[];
  itemsKeys?: any[];
  inputId: string;
  isRequired?: boolean;
  isReadonly?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  isMultiple?: boolean;
  title: string;
  maxLength?: number;
  labelClass?: string;
  inputClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  value: '',
  items: () => [],
  itemsKeys: () => [],
  isReadonly: false,
  isRequired: false,
  isDisabled: false,
  inputClass: '',
  labelClass: ''
});

const modelRef = ref(props.value);

const { labelStyle, starStyle } = inputStyle();
const emit = defineEmits(['input', 'checkIfObjectIsSame', 'selectedItem']);

const onSelectEventInputAction = (modelValug) => {
  emit('input', modelValug);
};

const checkIfObjectIsSameAction = (objectIsSame: boolean) => {
  emit('selectedItem', modelRef);
  emit('checkIfObjectIsSame', objectIsSame);
};

watch(
  () => props.value,
  (newVal) => {
    modelRef.value = newVal;
  }
);
</script>
