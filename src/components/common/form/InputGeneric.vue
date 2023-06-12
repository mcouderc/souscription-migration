<template>
  <validation-provider
    v-slot="{ errors }"
    :name="props.title"
    :rules="{
      required: props.isRequired ? 'required' : false,
      regex: props.regex === 'phone' ? REGEX.PHONE : props.regex
    }"
  >
    <template v-if="props.inputType === 'number'">
      <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
        <strong>* </strong>
      </span>
      <label :class="labelStyle(errors, props.isDisabled)">{{ props.title }}</label>
      <v-text-field
        class="mt-0 pt-0"
        :id="props.inputId"
        v-model.number="modelRef"
        :light="true"
        dense
        :value="props.value"
        :type="props.inputType"
        step="any"
        :min="0"
        :title="props.title"
        :data-cy="props.inputId"
        :error-messages="errors"
        :required="props.isRequired"
        :readonly="props.isReadonly"
        :disabled="props.isDisabled"
        :suffix="currencyToShowComputed"
        :maxlength="props.maxLength"
        hide-spin-buttons
        @wheel="$event.target.blur()"
        @input="onEventInputAction(modelRef)"
        @keyup="onCheckIfObjectIsSameAction(true)"
      >
      </v-text-field
    ></template>
    <template v-else>
      <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
        <strong>* </strong>
      </span>
      <label :class="labelStyle(errors, props.isDisabled)">{{ props.title }}</label>
      <v-text-field
        class="mt-0 pt-0"
        :id="props.inputId"
        v-model="modelRef"
        dense
        :light="true"
        :value="props.value"
        :title="props.title"
        :type="props.inputType"
        :counter="props.counter"
        :data-cy="props.inputId"
        :error-messages="errors"
        :required="props.isRequired"
        :readonly="props.isReadonly"
        :disabled="props.isDisabled"
        :maxlength="props.maxLength"
        hide-spin-buttons
        @wheel="$event.target.blur()"
        @input="onEventInputAction(modelRef)"
        @keyup="onCheckIfObjectIsSameAction(true)"
      >
      </v-text-field>
    </template>
  </validation-provider>
</template>

<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
// import { ValidationProvider } from 'vee-validate';
import useConstante from '@/composables/useConstante';
import { computed, ref, watch } from 'vue';

/**
 * props
 */
export interface IProps {
  value?: string | number;
  inputType: string;
  inputId: string;
  regex?: string;
  isReadonly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  title: string;
  counter?: number;
  suffix?: boolean;
  maxLength?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  value: '',
  isReadonly: false,
  isDisabled: false,
  isRequired: false,
  counter: null,
  regex: ''
});

const { labelStyle, starStyle } = inputStyle();
const { REGEX } = useConstante();
const modelRef = ref(props.value);
const currencyEuro = '€';

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

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
    modelRef.value = newVal;
  }
);
</script>
