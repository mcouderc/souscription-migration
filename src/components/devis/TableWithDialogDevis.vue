<template>
  <div>
    <v-dialog
      v-model="showDialogRef"
      :light="true"
      persistent
      max-width="60%"
      :retain-focus="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
          :disabled="props.disabled"
          v-if="props.showBtnAddDialog && !props.isToContrat"
        >
          {{ addButtonText }}
        </v-btn>
      </template>
      <v-card :light="true">
        <validation-observer v-if="showDialogRef" ref="observerModelToEditRef">
          <form>
            <v-card-text class="pt-5">
              <slot name="edit"></slot>
            </v-card-text>
            <v-card-actions class="card__actions">
              <v-btn type="button" color="error" @click="onCloseDialog()">
                <v-icon right class="mr-2"> mdi-close</v-icon>
                {{ $t('forms.buttons.close') }}
              </v-btn>
              <v-btn v-if="!isUpdatedRef" type="button" color="primary" @click="addItem()">
                <v-icon right class="mr-2"> mdi-content-save</v-icon>
                {{ $t('forms.buttons.save') }}
              </v-btn>
              <v-btn v-else type="button" color="primary" @click="updateItem()">
                <v-icon right class="mr-2"> mdi-content-save</v-icon>
                {{ $t('forms.buttons.update') }}
              </v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </v-dialog>
    <ListItemsDevis
      v-show="itemsListRef?.length > 0"
      :header="headersRef"
      :array-items="itemsListRef || []"
      :labels="[]"
      :collection="props.collection"
      :taking-status-into-account="props.takingStatusIntoAccount"
      :statut="devis.statut"
      :is-to-contrat="props.isToContrat"
      :show-btn-add="props.showBtnAddTable"
      :show-btn-delete="props.showBtnDeleteTable"
      @removeItemPosition="removeItemPosition('genericModelValue', $event)"
      @updateItem="loadUpdateItem('genericModelValue', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import type VueI18n from 'vue-i18n';
import ListItemsDevis from '@/components/devis/ListItemsDevis.vue';
import { ValidationObserver } from 'vee-validate';
import useDevis from '@/composables/useDevis';
import type { DataOptions } from 'vuetify';

export interface IProps {
  header: IGenericTableHeader[];
  itemsList: any[];
  itemToEdit: any;
  showBtnDeleteTable?: boolean;
  showBtnAddTable?: boolean;
  showBtnAddDialog?: boolean;
  addButtonText: VueI18n.TranslateResult;
  isToContrat: boolean;
  statut?: string;
  takingStatusIntoAccount?: boolean;
  disabled?: boolean;
  collection: string;
}

export interface IGenericTableHeader {
  text: VueI18n.TranslateResult;
  value: string;
}

const props = withDefaults(defineProps<IProps>(), {
  showBtnDeleteTable: true,
  showBtnAddTable: true,
  showBtnAddDialog: true,
  isToContrat: false,
  disabled: false
});
const { devis } = useDevis();

const emit = defineEmits(['itemsListUpdated', 'resetEditedItem', 'loadEditedItem']);

const headersRef = ref(props.header);
const itemsListRef = ref(props.itemsList);
const itemToEditRef = ref(props.itemToEdit);

const updatePositionItemRef = ref(-1);

const showDialogRef = ref(false);

const isUpdatedRef = ref(false);

const observerModelToEditRef = ref(null);

const removeItemPosition = async (type: string, position: number) => {
  const clone = [...itemsListRef.value];
  clone.splice(position, 1);
  itemsListRef.value = clone;
  propagateNewValues();
};

const loadUpdateItem = async (
  type: string,
  {
    item,
    position,
    pageWithPagination
  }: { item: any; position: number; pageWithPagination: DataOptions }
) => {
  isUpdatedRef.value = true;
  itemToEditRef.value = item;
  updatePositionItemRef.value =
    (pageWithPagination.page - 1) * pageWithPagination.itemsPerPage + position;
  emit('loadEditedItem', itemToEditRef.value);
  showDialogRef.value = true;
};

const onCloseDialog = () => {
  setTimeout(() => {
    showDialogRef.value = false;
    isUpdatedRef.value = false;
    itemToEditRef.value = {};
    updatePositionItemRef.value = -1;
    emit('resetEditedItem');
  }, 100);
};

const updateItem = async () => {
  const isValidEditedItem = await observerModelToEditRef.value.validate();
  setTimeout(() => {
    if (isValidEditedItem) {
      const clone = [...itemsListRef.value];
      clone[updatePositionItemRef.value] = { ...itemToEditRef.value };
      itemsListRef.value = clone;
      showDialogRef.value = false;
      propagateNewValues();

      itemToEditRef.value = {};
      updatePositionItemRef.value = -1;
      isUpdatedRef.value = false;
    }
  }, 100);
};

const addItem = async () => {
  isUpdatedRef.value = false;

  const isValidAddedITem = await observerModelToEditRef.value.validate();
  if (isValidAddedITem) {
    if (!itemsListRef.value) {
      itemsListRef.value = [];
    }
    const clone = [...itemsListRef.value];

    clone.push(itemToEditRef.value);
    itemsListRef.value = clone;
    showDialogRef.value = false;
    propagateNewValues();

    itemToEditRef.value = {};
  } else {
    //TODO: Gestion erreur snackbar
  }
};

const propagateNewValues = () => {
  emit('itemsListUpdated', itemsListRef);
  emit('resetEditedItem');
};

watch(
  () => props.itemToEdit,
  (newVal) => {
    itemToEditRef.value = newVal;
  }
);

watch(
  () => props.itemsList,
  (newVal) => {
    itemsListRef.value = newVal;
  }
);
</script>
<style scoped>
.v-card {
  padding: 15px 20px;
}
.card__actions {
  justify-content: space-between;
}
</style>
