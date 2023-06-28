<template>
  <validation-provider
    v-slot="{ errors }"
    :name="labelComputed(props.country)"
    :vid="props.id"
    :rules="{
      required: props.isRequired,
      confirmed: isValidateSiret()
    }"
  >
    <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
      <strong>* </strong>
    </span>
    <label :class="labelStyle(errors, props.isDisabled)">{{ labelComputed(props.country) }}</label>
    <v-text-field
      class="mt-0 pt-0 siret"
      v-model="siretRef"
      :id="props.id"
      :light="true"
      data-cy="input-siret"
      :counter="counterComputed"
      :error-messages="errors"
      :disabled="props.isDisabled"
      :required="props.isRequired"
      @paste="pasteSiretAction($event)"
      @keypress="keyPressCondition($event)"
      @input="onInputSiretAction(siretRef)"
    >
    </v-text-field>
  </validation-provider>
</template>

<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
import { computed, ref, watch } from 'vue';
import { extend, ValidationProvider } from 'vee-validate';
import validationRulesSiret from '@/services/validationRulesSiret';
import { confirmed } from 'vee-validate/dist/rules';
import { useI18n } from 'vue-i18n';

/**
 * props
 */
export interface IProps {
  value?: string | number;
  isDisabled: boolean;
  country: string;
  countryParent?: string;
  id?: string;
  isRequired?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  value: '',
  isDisabled: false,
  country: ''
});

const { labelStyle, starStyle } = inputStyle();
const { siretIsValid, keyPressCondition, pastCondition, labelComputed } = validationRulesSiret();
extend('confirmed', confirmed);
extend('confirmed', {
  message: i18n.tc('page.subscription.siret.siretBadFormat')
});

/**
 * ref
 */
const siretRef = ref(props.value);

const getSiretValidity = (): boolean => {
  const country = props.countryParent ? props.countryParent : props.country;
  return siretIsValid(props?.value?.toString(), country);
};

const isValidateSiret = (): boolean => {
  return (!props.isDisabled && !getSiretValidity()) || false;
};

/**
 * emit
 */
const emit = defineEmits(['input', 'clearMsgError', 'checkIfObjectIsSame', 'paste']);
const onInputSiretAction = (siref: string | number) => {
  emit('clearMsgError');
  emit('input', siref);
};

const pasteSiretAction = (event: ClipboardEvent) => {
  siretRef.value = pastCondition(siretRef.value, event);
  emit('paste', event);
  onInputSiretAction(siretRef.value);
};

const counterComputed = computed(() => {
  return {
    FR: 14,
    BE: 10,
    MC: 8,
    AD: 8,
    LX: 7,
    '': 0
  }[props.country];
});

watch(
  () => props.value,
  (newVal) => {
    siretRef.value = newVal;
  }
);
</script>
