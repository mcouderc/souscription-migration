<template>
  <div>
    <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
      <strong>* </strong>
    </span>
    <label :class="`${labelStyle(errors, props.isDisabled)}${' '}${labelClass}`">{{
      props.title
    }}</label>
    <div class="d-flex align-center">
      <v-combobox
        :class="`mt-0 pt-0 ${inputClass}`"
        :id="props.inputId"
        v-model="value"
        density="default"
        v-bind:items="itemsRef"
        :clearable="isClearable"
        :multiple="isMultiple"
        :title="props.title"
        :data-cy="props.inputId"
        :item-title="itemsKeys && itemsKeys.length > 0 ? itemsKeys[1] : 'label'"
        :item-value="itemsKeys && itemsKeys.length > 0 ? itemsKeys[2] : null"
        :maxlength="props.maxLength"
        :search-input.sync="searchItemRef"
        :required="props.isRequired"
        :return-object="returnObject"
        :readonly="props.isReadonly || lockInputRef"
        :error-messages="errors"
        :disabled="props.isDisabled || lockInputRef"
        @paste="pasteSiretAction($event)"
        @input="
          onCheckIfObjectIsSameAction(true);
          onEventInputAction(searchItemRef);
          onSelectEventInputAction(modelRef);
        "
        @change="emitsEvent"
      >
        <template v-if="isCustomType()" v-slot:selection="{ item }">
          {{
            props.type === 'address' && typeof item === 'object'
              ? item.value.address
              : props.type === 'siret' && typeof item === 'object'
              ? item.value.nom_entreprise
              : item
          }}
        </template>
        <template v-if="isCustomType()" v-slot:item="{ item }">
          {{
            props.queryTarget === 'siret'
              ? `${item.value.nom_entreprise} - ${item.value.siege.siret}`
              : item.value.label
          }}
        </template>
      </v-combobox>
      <div class="ml-2" v-if="isCustomType()">
        <v-progress-circular
          v-if="pendingRef"
          color="primary"
          size="24"
          width="2"
          indeterminate
        ></v-progress-circular>
        <v-icon v-else>mdi-map-marker</v-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
import { computed, onMounted, ref, toRef, watch } from 'vue';
import searchAddress from '@/services/address';
import searchSiret from '@/services/siret';
import { useField } from 'vee-validate';
/**
 * props
 */
export interface IProps {
  value?: any;
  title: string;
  inputId: string;
  isReadonly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  itemsKeys?: any[];
  items?: any[];
  cityCode?: boolean;
  regex?: string;
  maxLength?: number;
  isClearable?: boolean;
  returnObject?: boolean;
  isMultiple?: boolean;
  type?: string;
  querySearchLimit?: number;
  queryTarget?: string;
  inputClass?: string;
  labelClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  value: '',
  isReadonly: false,
  isDisabled: false,
  isRequired: false,
  cityCode: false,
  regex: '',
  inputClass: '',
  labelClass: '',
  querySearchLimit: 10,
  type: 'default',
  queryTarget: 'nom_entreprise,siret',
  items: () => [],
  itemsKeys: () => []
});

const TIME_SLEEP = 300;

const itemsRef = ref<any>(props.value.items || []);
const modelRef = ref<any>(props.value || '');
const timeOutRef = ref<any>(null);
const pendingRef = ref<boolean>(false);
const lockInputRef = ref<boolean>(false);

const { labelStyle, starStyle } = inputStyle();
const { searchAddressData } = searchAddress();
const { searchSiretData, onPasteSiretEvent } = searchSiret();
const emit = defineEmits([
  'input',
  'checkIfObjectIsSame',
  'setCity',
  'setAddress',
  'setZipCode',
  'selectedItem',
  'clearMsgError',
  'selected',
  'change'
]);

onMounted(() => {
  if (props.type === 'address' && props.value) {
    lockInputRef.value = true;
    getAddressData(props.value);
  } else if (props.type === 'siret' && props.value) {
    searchSiretData(props.value, limitComputed.value, targetComputed.value, props.queryTarget).then(
      (response) => {
        emit('selected', response[0]);
      }
    );
  }
});

const isCustomType = () => {
  return props.type === 'address' || props.type === 'siret';
};

const searchItemRef = ref(isCustomType() && props.value ? props.value?.toString() : '');
const limitComputed = computed(() => {
  return `&longueur=${props.querySearchLimit}`;
});

const targetComputed = computed(() => {
  return `&cibles=${props.queryTarget}`;
});

const getSiretData = async (search) => {
  pendingRef.value = true;
  searchSiretData(search, limitComputed.value, targetComputed.value, props.queryTarget)
    .then((response) => {
      itemsRef.value = response;
    })
    .finally(() => {
      lockInputRef.value = false;
      pendingRef.value = false;
    });
};

const pasteSiretAction = (event: ClipboardEvent): string => {
  const searchItem = onPasteSiretEvent(event);
  onSelectSiretAction(searchItem);
  return searchItem;
};

const getAddressData = async (search) => {
  pendingRef.value = true;
  searchAddressData(search, props.value, props.cityCode)
    .then((response) => {
      itemsRef.value = response;
    })
    .finally(() => {
      lockInputRef.value = false;
      pendingRef.value = false;
    });
};

const onSelectEventInputAction = (modelValue: string[]) => {
  emit('input', modelValue);
};

const onEventInputAction = (value) => {
  emit('input', value);
};

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const onSetCityAction = (city) => {
  emit('setCity', city);
};

const onSetAddressAction = (address) => {
  emit('setAddress', address);
};

const onSetZipCodeAction = (codeCity) => {
  emit('setZipCode', codeCity);
};

const onSelectSiretAction = (siret: any) => {
  emit('clearMsgError');
  emit('selected', siret);
};

const emitsEvent = (address) => {
  if (props.type === 'address') {
    if (address && typeof address === 'object') {
      if (props.cityCode) {
        modelRef.value = address.city;
        onEventInputAction(address.city);
      } else {
        onEventInputAction(address.address);
      }
      onSetCityAction(address.city);
      onSetAddressAction(address.address);
      onSetZipCodeAction(address.codeCity);
    } else {
      onEventInputAction(address);
    }
    onCheckIfObjectIsSameAction(true);
  } else if (props.type === 'siret') {
    emit('clearMsgError');
    emit('selected', modelRef.value);
  } else {
    emit('selectedItem', modelRef.value);
  }
  emit('change', modelRef.value);
};

const { value, errors } = useField(toRef(props, 'value'), undefined);

/**
 * watchers
 */

watch(
  () => props.value,
  (newVal) => {
    if (props.type === 'address') {
      if (typeof newVal === 'string') {
        modelRef.value = newVal.trim();
        modelRef.value = newVal.trim();
      }
      searchItemRef.value = newVal;
    }
    modelRef.value = newVal;
  }
);

watch(
  () => searchItemRef.value,
  (newVal) => {
    if (isCustomType() && newVal) {
      clearTimeout(timeOutRef);
      timeOutRef.value = setTimeout(() => {
        if (props.type === 'address') {
          getAddressData(typeof newVal === 'string' ? newVal.trim() : newVal);
        } else {
          getSiretData(typeof newVal === 'string' ? newVal.trim() : newVal);
        }
      }, TIME_SLEEP);
    }
  }
);

watch(
  () => props.items,
  (newVal) => {
    itemsRef.value = newVal;
  },
  { immediate: true }
);

watch(
  () => props.isDisabled,
  (newVal: any) => {
    if (newVal) {
      modelRef.value = '';
      itemsRef.value = [];
    }
  }
);
</script>

<style scoped>
.v-autocomplete .v-input__slot {
  overflow-wrap: anywhere;
}
</style>
