<template>
  <validation-observer>
    <v-menu
      v-model="menu"
      :light="true"
      :close-on-content-click="false"
      :open-on-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on }">
        <validation-provider
          ref="observer"
          v-slot="{ errors }"
          :name="label"
          :rules="{
            required: validationIsRequired,
            regex: REGEX.DATE,
            max_value: checkMaxDate(),
            min_value: checkMinDate()
          }"
        >
          <span v-if="validationIsRequired" :class="starStyle(false)">
            <strong>* </strong>
          </span>
          <label :class="labelStyle(errors, false)">{{ label }}</label>
          <v-text-field
            class="mt-0 pt-0"
            v-model="computedDateText"
            :light="true"
            :error-messages="errors"
            type="date"
            dense
            clearable
            :max="getDate(props.max)"
            :min="getDate(props.min)"
            @input="inputDatePickerAction(dateText)"
          >
          </v-text-field>
        </validation-provider>
      </template>
    </v-menu>
  </validation-observer>
</template>

<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
import { computed, ref, watch } from 'vue';
import { format, isAfter, isBefore, parse } from 'date-fns';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import type VueI18n from 'vue-i18n';
import useConstante from '@/composables/useConstante';
import { useI18n } from 'vue-i18n';
import { max_value, min_value } from 'vee-validate/dist/rules';

export interface IProps {
  validationIsRequired?: boolean;
  value?: string;
  label: VueI18n.TranslateResult;
  max?: string;
  min?: string;
}
const { REGEX } = useConstante();
const { labelStyle, starStyle } = inputStyle();
/**
 * props
 */
const props = withDefaults(defineProps<IProps>(), {
  validationIsRequired: false,
  label: 'true',
  value: ''
});
/**
 * ref
 */
const observer = ref(null);
const menu = ref(false);
const dateText = ref('');
extend('max_value', max_value);
extend('max_value', {
  message: (): string =>
    `${i18n.tc('forms.errors.maxDate')}${format(new Date(props.max), 'dd-MM-yyyy')}`
});
extend('min_value', min_value);
extend('min_value', {
  message: (): string =>
    `${i18n.tc('forms.errors.minDate')}${format(new Date(props.min), 'dd-MM-yyyy')}`
});

/**
 * emit
 */
const emit = defineEmits(['input']);

/**
 * computed
 */
const computedDateText = computed({
  get() {
    return props.value ? converter(props.value) : '';
  },
  set(newValue: string) {
    dateText.value = newValue ? converter(newValue) : '';
  }
});

const checkMaxDate = (): boolean => {
  if (props?.max && computedDateText.value) {
    const currentDate = format(new Date(computedDateText.value), 'yyyy-MM-dd');
    return isAfter(new Date(currentDate), new Date(props?.max));
  }
  return false;
};

const getDate = (date: string): string => {
  return date ? format(new Date(date), 'yyyy-MM-dd') : null;
};

const checkMinDate = (): boolean => {
  if (props?.min && computedDateText.value) {
    const currentDate = format(new Date(computedDateText.value), 'yyyy-MM-dd');
    return isBefore(new Date(currentDate), new Date(props?.min));
  }
  return false;
};

/**
 * methods
 */
const inputDatePickerAction = (dateRenseigne: string) => {
  emit('input', dateRenseigne);
};

const getParseDate = (date: string, delimiter: string): Date => {
  return parse(date, `yyyy${delimiter}MM${delimiter}dd`, new Date());
};

const converter = (date: string): string => {
  const delimiterSelected = '-';
  const parseDateUse = getParseDate(date, delimiterSelected);
  if (parseDateUse.toString() !== 'Invalid Date') {
    return getFormatDate(parseDateUse, delimiterSelected);
  }
  return date;
};

const getFormatDate = (dateToFormat: Date, delimiter: string): string => {
  return dateToFormat ? format(dateToFormat, `yyyy${delimiter}MM${delimiter}dd`) : '';
};

/**
 * watch
 */
watch(
  () => props.value,
  () => {
    if (!props.value) {
      dateText.value = '';
    } else {
      dateText.value = computedDateText.value || '';
    }
  }
);
</script>
<style>
.v-date-picker-table {
  padding: 0px !important;
  height: auto !important;
}
</style>
