<template>
  <div>
    <!-- <label>{{ props.title }}</label> -->
    <v-text-field
      class="mt-0 pt-0"
      :id="props.inputId"
      v-model="modelRef"
      :light="true"
      dense
      :value="props.value"
      :type="props.inputType"
      step="any"
      :title="props.title"
      :data-cy="props.inputId"
      hide-spin-buttons
      @input="onEventInputAction(modelRef)"
      @keyup="onCheckIfObjectIsSameAction(true)"
    >
    </v-text-field>
    <v-text-field
      class="mt-0 pt-0"
      :id="props.inputId"
      v-model="value"
      :error-messages="errorMessage"
      :required="isRequired"
      :title="props.title"
    >
    </v-text-field>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useField } from 'vee-validate';
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
  regex: '',
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelRef: [String, Number]
});

const name = ref(props.name);
const modelRef = ref(props.value);
const { value, errorMessage } = useField(name, undefined, { initialValue: modelRef });

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelRef) => {
  console.log('🚀 InputGeneric1 onEventInputAction ~ modelRef:', modelRef);
  emit('input', modelRef);
};

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

onMounted(async () => {
  console.log('🚀 InputGeneric1 - props:', JSON.stringify(props));
});

watch(
  () => props.value,
  (newVal) => {
    modelRef.value = newVal;
    console.log('🚀 InputGeneric1.vue ~ modelRef:', modelRef);
  }
);
</script>
