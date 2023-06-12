<template>
  <v-text-field
    class="mt-0 pt-0"
    v-model="value"
    dense
    :light="true"
    :id="props.inputId"
    :label="label"
    :error-messages="errors"
    :type="props.inputType"
    :data-cy="props.inputId"
    :required="props.isRequired"
    :readonly="props.isReadonly"
    :disabled="props.isDisabled"
    :suffix="currencyToShowComputed"
    hide-spin-buttons
    @wheel="$event.target.blur()"
    @keyup="onCheckIfObjectIsSameAction(true)"
    @input="onEventInputAction(value)"
  >
    <template #label>
      <label :class="labelStyle(errors, props.isDisabled)">{{ props.title }}</label>
      <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
        <strong> * </strong>
      </span>
    </template>
  </v-text-field>
</template>
<script setup lang="ts">
import { computed, toRef, watch } from 'vue';
import { useField } from 'vee-validate';
import inputStyle from '@/services/inputStyle';

export interface IProps {
  value?: string;
  inputType?: string;
  inputId?: string;
  regex?: string;
  isReadonly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  title?: string;
  counter?: number;
  suffix?: boolean;
  maxLength?: number;
  name?: string;
  type?: string;
  label?: string;
  // name: { type: string; required: true };
  // type: { type: string; required: true };
  // label: { type: string; required: true };
}
const props = withDefaults(defineProps<IProps>(), {
  value: '',
  isReadonly: false,
  isDisabled: false,
  isRequired: false,
  counter: null,
  regex: '',
  name: '',
  type: '',
  label: '',
  title: ''
});

const { labelStyle, starStyle } = inputStyle();
const currencyEuro = '€';
const emit = defineEmits(['input', 'checkIfObjectIsSame']);

// const modelValue = ref(props.value);

const { value, errors } = useField(toRef(props, 'name'), undefined);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const currencyToShowComputed = computed(() => {
  return props.suffix ? currencyEuro : '';
});

watch(
  () => props.value,
  (newVal) => {
    value.value = newVal;
  }
);
</script>
