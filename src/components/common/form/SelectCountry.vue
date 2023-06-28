<template>
  <validation-provider
    v-slot="{ errors }"
    :name="props.title"
    :vid="props.inputId"
    :rules="isRequired ? 'required' : ''"
  >
    <span v-if="props.isRequired" :class="starStyle(props.isDisabled)">
      <strong>* </strong>
    </span>
    <label :class="labelStyle(errors, props.isDisabled)">{{ props.title }}</label>
    <v-select
      class="mt-0 pt-0"
      v-model="modelRef"
      :light="true"
      dense
      :value="value"
      :items="paysRef"
      :isUpperCase="props.isUpperCase"
      :item-text="itemsKeys ? itemsKeys[1] : null"
      :item-value="itemsKeys ? itemsKeys[2] : null"
      :data-cy="inputId"
      :menu-props="{ bottom: true, offsetY: true, light: true }"
      :error-messages="errors"
      :required="isRequired"
      :readonly="isReadonly"
      :disabled="isDisabled"
      :clearable="isClearable"
      @input="onSelectEventInputAction(modelRef)"
      @change="onChangeAction($event)"
    >
      <template v-if="!props.isInfoComp" #item="{ item: item }">
        <span :class="{ 'ml-2': isChildren(item) }"> {{ isUpperCase(item.nom) }} </span>
      </template>
      <template v-else #item="{ item: item }"> {{ isUpperCase(item.nom) }}</template>
      <template v-if="props.isUpperCase" v-slot:selection="{ item: item }">
        {{ item.nom.toUpperCase() }}
      </template>
    </v-select>
  </validation-provider>
</template>

<script setup lang="ts">
import inputStyle from '@/services/inputStyle';
import type { Pays } from 'open-api-souscription-typescript/dist/fr/cfdp/axios/generated/souscription/model/pays';
import type IPaysForSelect from '@/models/iPaysForSelect';
import { ValidationProvider } from 'vee-validate';
import { ref, watch } from 'vue';

export interface IProps {
  value?: any;
  items: Pays[];
  itemsKeys?: string[];
  inputId: string;
  isRequired: boolean;
  isReadonly?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  isInfoComp?: boolean;
  title: string;
  isUpperCase?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  value: '',
  items: () => [],
  itemsKeys: () => [],
  isReadonly: false,
  isDisabled: false,
  isInfoComp: false,
  isUpperCase: false
});

const modelRef = ref(props.value);
const paysRef = ref([]);

const { labelStyle, starStyle } = inputStyle();

const emit = defineEmits(['input', 'selectedItem', 'changeCountry']);
const onSelectEventInputAction = (modelValug) => {
  emit('input', modelValug);
};
const onChangeAction = (event) => {
  emit('changeCountry', event);
  emit('selectedItem', modelRef);
};

const isUpperCase = (nom: string): string => {
  return props.isUpperCase ? nom.toUpperCase() : nom;
};

const isChildren = (pays: IPaysForSelect): boolean => {
  return (pays.parent !== undefined && pays.parent !== null) || pays.isDoubleParent === true;
};

const organiseCountry = (tabPays: Pays[]) => {
  if (tabPays.length !== 0) {
    props.isInfoComp ? tabCountryWithoutChildren(tabPays) : tabCountryWithChildren(tabPays);
  }
};

const tabCountryWithoutChildren = (tabPays: Pays[]) => {
  tabPays.forEach((pays) => {
    if (!pays.parent) {
      paysRef.value.push(pays);
    }
  });
  paysRef.value.sort();
};

const tabCountryWithChildren = (tabPays: Pays[]) => {
  paysRef.value = Object.entries(groupByParent(countryOrderByAlphabetique(tabPays)))
    .map(([parentNom, children]: [string, any[]], index) => {
      if (index === [parentNom, children].length || tabPays.length === 1) {
        //Condition pour ne pas mettre de ligne si c'est le dernier element
        return [...children];
      } else if (children.length === 1) {
        //Ajout d'un parent sans enfant
        return [...children, { divider: true }];
      } else {
        children[0].isDoubleParent = true; //Ajout d'un parent avec enfant
        return [{ header: parentNom }, ...children, { divider: true }];
      }
    })
    .flat();
};

const groupByParent = (tabPays: Pays[]): Pays => {
  return tabPays.reduce((group, item) => {
    const parent = item.parent === undefined ? item.nom : item.parent.nom;
    group[parent] = group[parent] ?? [];
    group[parent].push(item);
    return group;
  }, {} as Pays);
};

const countryOrderByAlphabetique = (tabPays) => {
  tabPays.sort((firstCountry, secondCountry) => {
    return firstCountry.nom.localeCompare(secondCountry.nom);
  });
  tabPays.forEach((pays, index) => {
    if (pays.nom === 'France') {
      tabPays.splice(index, 1);
      tabPays.unshift(pays);
    }
  });
  return tabPays;
};

watch(
  () => props.value,
  (newVal) => {
    modelRef.value = newVal;
  }
);

watch(
  () => props.items,
  () => {
    organiseCountry(props.items);
  },
  { immediate: true }
);
</script>
