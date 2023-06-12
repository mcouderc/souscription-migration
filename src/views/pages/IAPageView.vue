<template>
  <v-container fluid class="h-100">
    <v-row align="center" justify="center" dense class="h-100">
      <v-col
        cols="12"
        lg="6"
        md="6"
        class="fill-height d-flex flex-column justify-center align-center"
      >
        <v-card theme="light">
          <v-card-title>
            <h1 class="title-helios">{{ $t('page.ia.title') }}</h1>
          </v-card-title>
          <v-card-text>
            <v-data-table
              v-if="props.brokers"
              :headers="header"
              theme="light"
              :items="props.brokers"
              item-key="code"
              :items-per-page="5"
              :search="search"
            >
              <template v-slot:top>
                <v-row>
                  <v-col cols="8">
                    <v-text-field
                      v-model="search"
                      label="Rechercher"
                      append-icon="mdi-magnify"
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="isGestion" cols="4">
                    <v-combobox
                      v-model="delegationSelected"
                      input-id="delegations"
                      :items="delegationsList"
                      title="Délégation"
                      :is-clearable="true"
                      :is-required="false"
                      item-text="keyDelegation"
                      item-value="valueDelegation"
                      multiple
                      clearable
                      :label="$t('forms.labels.groupeComptable')"
                      :return-object="false"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-divider class="my-5" />
              </template>
              <!-- <template v-slot:[`item.groupeComptable`]="{ item }">
                {{
                  $t('forms.labels.delegationLabel', {
                    groupeComptable: item.groupeComptable,
                    siteGroupeComptable: item.siteGroupeComptable
                  })
                }}
              </template>
              <template v-slot:[`item.siteGroupeComptable`]="{ item }">
                {{
                  $t('forms.labels.gererParLabel', {
                    siteGroupeComptable: item.siteGroupeComptable
                  })
                }}
              </template> -->
              <template v-slot:[`item.action`]="{ item }">
                <v-btn
                  small
                  color="primary"
                  :ripple="false"
                  class="font-weight-regular text-body no-background-hover"
                  @click="IACodeSelected(JSON.stringify(item.raw.code))"
                >
                  {{ $t('forms.buttons.select') }}
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Courtier } from 'open-api-espace-partenaire-souscription-typescript/dist/fr/cfdp/jaxrs/generated/espace-partenaire-souscription/skeleton/model';
import { computed, ref } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';

export interface IProps {
  isGestion: boolean;
  brokers: Courtier[];
  delegations: string[];
}

const props = defineProps<IProps>();

const { t } = useI18n();

const delegationsList = [
  ...new Set(
    props.brokers.map((broker) => {
      const keyDelegation = t('forms.labels.delegationLabel', {
        groupeComptable: broker?.groupeComptable,
        siteGroupeComptable: broker?.siteGroupeComptable
      });
      return { keyDelegation, valueDelegation: broker?.groupeComptable };
    })
  )
];

const search = ref('');
const delegationSelected = ref([]);

const emits = defineEmits(['IACodeSelected']);

const IACodeSelected = (code: string) => {
  emits('IACodeSelected', code);
};

const header = computed(() => initHeader(props.isGestion));
type Headers = InstanceType<typeof VDataTable>['headers'];
type ArrayArrayItems<T> = T extends Array<Array<infer I>> ? I : never;
type DataTableHeader = ArrayArrayItems<Headers>;

const initHeader = (isGestion: boolean): DataTableHeader[] => {
  const headers: DataTableHeader[] = [
    {
      title: t('forms.labels.id'),
      align: 'start',
      sortable: false,
      value: 'code',
      key: 'id'
    },
    {
      title: t('forms.labels.nom'),
      align: 'start',
      sortable: false,
      value: 'nom',
      key: 'nom'
    }
  ];
  if (isGestion) {
    headers.push({
      title: t('forms.labels.groupeComptable'),
      align: 'start',
      sortable: false,
      value: 'groupeComptable',
      key: 'groupeComptable'
      // filter: (value: any): boolean => {
      //   if (!delegationSelected.value.length) {
      //     return true;
      //   }
      //   return delegationSelected.value.includes(value);
      // }
    });
  } else {
    headers.push({
      title: t('forms.labels.gererPar'),
      align: 'start',
      sortable: false,
      value: 'siteGroupeComptable',
      key: 'gerePar'
    });
  }

  headers.push({
    title: '',
    value: 'action',
    align: 'end',
    sortable: false,
    key: 'action'
  });
  return headers;
};
</script>
