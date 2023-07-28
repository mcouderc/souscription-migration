<template>
  <v-menu :light="true" left offset-x>
    <template v-slot:activator="{ props }">
      <v-icon data-cy="listActions" color="blueHelios" v-bind="props"> mdi-dots-vertical </v-icon>
    </template>
    <v-list dense>
      <v-list-item-group>
        <template v-for="{ title, icon, cypress, action } in actionsComputed">
          <template>
            <v-list-item :key="title" @click.prevent="actionEmit(action, props.itemDevis)">
              <v-list-item-icon class="mr-2">
                <v-icon :data-cy="cypress" small color="blueHelios">
                  {{ icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content class="">
                <v-list-item-title>{{ title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
import { useI18n } from 'vue-i18n';
import { DevisEntrepriseStatutEnum, type DevisEntreprise } from 'open-api-souscription-typescript';
import { computed } from 'vue';

export interface IProps {
  itemDevis: DevisEntreprise;
}
const props = defineProps<IProps>();
const emit = defineEmits(['action']);
const actionEmit = (action: string, devis: DevisEntreprise) => {
  emit('action', { action, item: devis });
};
const {
  doesHavePermissionAmongAllRolesButConsultation,
  doesHavePermissionAmongAllRolesButBrokerAndConsultation,
  doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate
} = usePermission();
const { t } = useI18n();
const actions = [
  {
    title: t('forms.buttons.consult'),
    icon: 'mdi-eye-outline',
    cypress: '',
    action: 'viewer'
  },
  {
    title: t('forms.buttons.upgradeDate'),
    icon: 'mdi-calendar',
    cypress: '',
    action: 'update-date'
  },
  {
    title: t('forms.buttons.upgradeOffer'),
    icon: 'mdi-offer',
    cypress: '',
    action: 'update-offer'
  },
  {
    title: t('forms.buttons.upgradeInformation'),
    icon: 'mdi-file-document-outline',
    cypress: '',
    action: 'update-infos'
  },

  {
    title: t('forms.buttons.upgradeConvertContract'),
    icon: 'mdi-file-certificate-outline',
    cypress: '',
    action: 'transform-contrat'
  },
  {
    title: t('forms.buttons.newDevis'),
    icon: 'mdi-file',
    cypress: '',
    action: 'new'
  },
  {
    title: t('forms.buttons.clone'),
    icon: 'mdi-content-copy',
    cypress: '',
    action: 'duplicate'
  },
  {
    title: t('forms.buttons.treatment'),
    icon: 'mdi-wrench',
    cypress: '',
    action: 'treatment'
  }
];
const actionsComputed = computed(() => {
  switch (props.itemDevis.statut) {
    case DevisEntrepriseStatutEnum.BrouillonAValider: {
      if (doesHavePermissionAmongAllRolesButConsultation()) {
        return actions.filter((item) => {
          return (
            item.action === 'viewer' ||
            item.action === 'update-date' ||
            item.action === 'update-offer' ||
            item.action === 'update-infos'
          );
        });
      } else {
        return actions.filter((item) => {
          return item.action === 'viewer';
        });
      }
    }
    case DevisEntrepriseStatutEnum.Emis: {
      if (doesHavePermissionAmongAllRolesButConsultation()) {
        const historique = props.itemDevis?.historiques;
        if (
          historique &&
          (historique[historique?.length - 1]?.type === 'EN_ETUDE_VERS_EMIS' ||
            historique[historique?.length - 1]?.type === 'EN_ETUDE_VERS_VALIDE')
        ) {
          return actions.filter((item) => {
            return (
              item.action === 'viewer' ||
              item.action === 'transform-contrat' ||
              item.action === 'new'
            );
          });
        } else {
          return actions.filter((item) => {
            return (
              item.action === 'viewer' ||
              item.action === 'update-infos' ||
              item.action === 'transform-contrat' ||
              item.action === 'new'
            );
          });
        }
      } else {
        return actions.filter((item) => {
          return item.action === 'viewer';
        });
      }
    }
    case DevisEntrepriseStatutEnum.BrouillonEnCours: {
      if (doesHavePermissionAmongAllRolesButConsultation()) {
        return actions.filter((item) => {
          return (
            item.action === 'viewer' ||
            item.action === 'update-date' ||
            item.action === 'update-offer' ||
            item.action === 'update-infos'
          );
        });
      } else {
        return actions.filter((item) => {
          return item.action === 'viewer';
        });
      }
    }
    case DevisEntrepriseStatutEnum.Expire: {
      if (doesHavePermissionAmongAllRolesButConsultation()) {
        return actions.filter((item) => {
          return item.action === 'viewer' || item.action === 'duplicate';
        });
      } else {
        return actions.filter((item) => {
          return item.action === 'viewer';
        });
      }
    }
    case DevisEntrepriseStatutEnum.Transforme: {
      return actions.filter((item) => {
        return item.action === 'viewer';
      });
    }
    case DevisEntrepriseStatutEnum.EnEtudeN1: {
      if (doesHavePermissionAmongAllRolesButBrokerAndConsultation()) {
        return actions.filter((item) => {
          return item.action === 'viewer' || item.action === 'treatment';
        });
      } else {
        return actions.filter((item) => {
          return item.action === 'viewer';
        });
      }
    }
    case DevisEntrepriseStatutEnum.EnEtudeN2: {
      if (doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()) {
        return actions.filter((item) => {
          return item.action === 'viewer' || item.action === 'treatment';
        });
      } else {
        return actions.filter((item) => {
          return item.action === 'viewer';
        });
      }
    }
    default: {
      return actions.filter((item) => {
        return item.action === 'viewer';
      });
    }
  }
});
</script>
