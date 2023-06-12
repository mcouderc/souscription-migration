<template>
  <ContainerModel2>
    <template #Header>
      <HeaderModel1>
        <template #Header-Title> {{ getTitle() }} </template>
      </HeaderModel1>
    </template>
    <template #Body>
      <validation-observer ref="observerDateRef">
        <form @submit.prevent="onSubmit()">
          <v-row no-gutters align-start>
            <v-col cols="4">
              <BaseDatePicker
                v-model="dateSouhaiteeRef"
                :validation-is-required="true"
                placeholder="JJ-MM-AAAA"
                :label="getIntituleInput()"
                :min="noMinDateComputed"
                :max="maxDateComputed"
              ></BaseDatePicker>
            </v-col>
            <v-col cols="12" class="pa-0 mt-5">
              <ContainerButtons1 @cancelResponse="back()" @submitResponse="onSubmit()">
                <template #Cancel>
                  <v-icon left> mdi-close-thick </v-icon>
                  {{ $t('forms.buttons.cancel') }}
                </template>
                <template #Submit>
                  <v-icon left> mdi-check </v-icon>
                  {{ $t('forms.buttons.valid') }}
                </template>
              </ContainerButtons1>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
    </template>
  </ContainerModel2>
</template>

<script setup lang="ts">
import { ValidationObserver } from 'vee-validate';
import BaseDatePicker from '@/components/common/BaseDatePicker.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';
import ContainerModel2 from '@/components/common/templates/ContainerModel2.vue';
import ContainerButtons1 from '@/components/common/templates/ContainerButtons1.vue';
import { computed, onMounted, ref } from 'vue';
import { formatISO, format } from 'date-fns';
import useSnackBar from '@/composables/useSnackBar';
import useProduct from '@/composables/useProduct';
import router from '@/router';
import { devisInitiatorApi, verificationDateEffetApi } from '@/plugins/open-api';
import { useRoute } from 'vue-router/composables';
import {
  DevisEntrepriseTypeRisqueEnum,
  DevisInitiatorDevisHydratationTypeRisqueEnum,
  type DevisInitiatorDevisHydratation,
  type VerificationDateEffet
} from 'open-api-souscription-typescript';
import _ from 'lodash';
import useDevis from '@/composables/useDevis';
import useContractStepper from '@/composables/useContractStepper';
import { useI18n } from 'vue-i18n';
import usePermission from '@/composables/authenticate/usePermission';

export interface IProps {
  required?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  required: false
});
const toDayDate = format(new Date(), 'yyyy-MM-dd');
const dateSouhaiteeRef = ref('');
const observerDateRef = ref(null);
const { t } = useI18n();

const noMinDateComputed = computed((): string => {
  let minDate = new Date();
  if (isContractStepper.value) {
    if (doesHavePermissionAmongRoleBoker() || doesHavePermissionAmongRoleDelegate()) {
      minDate.setDate(minDate.getDate() - 7);
    } else if (doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()) {
      minDate = new Date(new Date().getFullYear(), 0, 1);
    }
  } else {
    // Lors de la création d'un devis, on vérifie que la date d'effet souhaitée soit
    // supérieure à la date d'hier
    minDate.setDate(minDate.getDate() - 1);
  }
  return formatISO(minDate);
});

const maxDateComputed = computed((): string => {
  const currentDate = new Date();
  const maxDate = new Date(currentDate.setMonth(currentDate.getMonth() + 8));
  return formatISO(maxDate);
});

const { isContractStepper } = useContractStepper();
const { addMessageErrorSnackBarAction } = useSnackBar();
const { devis, setDevisAction } = useDevis();
const { product } = useProduct();
const route = useRoute();
const {
  doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate,
  doesHavePermissionAmongRoleBoker,
  doesHavePermissionAmongRoleDelegate
} = usePermission();
const devisRef = ref(devis);

const emit = defineEmits(['nextStep']);

const onNextAction = () => {
  emit('nextStep', true);
};

onMounted(async () => {
  if (
    (isContractStepper.value && devis?.value?.dateEffet && toDayDate < devis?.value.dateEffet) ||
    (!isContractStepper.value && devis?.value?.dateEffet)
  ) {
    // Si on transforme le devis en contrat, si la date d'effet existe et si elle est supérieure à la date du
    // jour, on indique la date d'effet:
    dateSouhaiteeRef.value = devis?.value.dateEffet;
  } else {
    // Autres cas: nouveau devis pour ce souscripteur et création d'un devis normal
    //  -> on met la date du jour:
    dateSouhaiteeRef.value = toDayDate;
  }
});

const getIntituleInput = (): string => {
  return isContractStepper.value
    ? t('page.subscription.popupDate.inputDataContractStepper')
    : t('page.subscription.popupDate.input');
};

const getTitle = (): string => {
  return isContractStepper.value
    ? t('page.subscription.popupDate.titleContractStepper')
    : t('page.subscription.popupDate.title');
};

//TODO Vérifier que les params/query sont gérés correctement
const back = () => {
  const id = route.query.id;
  if (props.required) {
    router.push({
      name: 'OverviewDevis',
      query: {
        id: id
      }
    });
  } else {
    const product = route.params.product;
    router.push({
      name: 'SouscriptionMarketProduct',
      params: {
        id: product
      }
    });
  }
};

const onSubmit = async () => {
  observerDateRef.value.validate().then((isValid: boolean) => {
    if (dateSouhaiteeRef.value && isValid) {
      verificationDateEffet(dateSouhaiteeRef.value, props.required);
    } else {
      addMessageErrorSnackBarAction(t('snackBar.errorDateFormat'));
    }
  });
};

const verificationDateEffet = async (date, isTransformation: boolean) => {
  const dateVerifTranformation: VerificationDateEffet = {
    type: 'DATE_EFFET_TRANSFORMATION',
    date: date.toString(),
    idDevis: devis?.value?.id
  };
  const dateVerifCreation: VerificationDateEffet = {
    type: 'DATE_EFFET_EMISSION',
    date: date.toString(),
    idProduit: product?.value?.id
  };
  const dateToVerif: VerificationDateEffet = isTransformation
    ? dateVerifTranformation
    : dateVerifCreation;
  return verificationDateEffetApi()
    .verificationDateEffet(dateToVerif)
    .then(() => {
      nextStep();
    })
    .catch((error) => {
      addMessageErrorSnackBarAction(error.response.data.detail ?? t('snackBar.errorVerif'));
    });
};

const nextStep = () => {
  observerDateRef.value.reset();
  //Utilisation d'une variable intermédiaire pour pouvoir mettre à jour le Devis Store via setDevisAction
  if (product.value?.id) {
    devisRef.value.dateEffet = dateSouhaiteeRef.value;
    devisRef.value.formuleSouscrite.idProduit = product.value?.id;
    devisRef.value.formuleSouscrite.nomProduit = product.value?.nom;
    devisRef.value.typeRisque = product.value?.typeRisque;
    setDevisAction(devisRef.value);
    //si type parcours est différent de pro alors faire le init avant le nextAction
    if (
      !isContractStepper &&
      devis.value.typeRisque !== DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise
    ) {
      devisInitiator();
    }
  }
  onNextAction();
};

const devisInitiator = () => {
  const initDevis = {
    dateEffet: devis.value.dateEffet,
    typeRisque: devis.value.typeRisque as DevisInitiatorDevisHydratationTypeRisqueEnum
  } as DevisInitiatorDevisHydratation;

  devisInitiatorApi()
    .initiateDevis(initDevis)
    .then((response) => {
      if (response.status === 201) {
        setDevisAction(_.merge(devis.value, response.data));
      } else {
        addMessageErrorSnackBarAction("Erreur lors de l'initialisation du devis");
      }
    })
    .catch(() => addMessageErrorSnackBarAction("Erreur lors de l'init"));
};
</script>
<style scoped>
.v-radio:hover,
.v-item--active {
  background-color: rgba(44, 111, 167, 0.5);
  border-radius: 0.25rem;
}
.v-radio:hover.theme--light /deep/ label,
.v-item--active.theme--light /deep/ label {
  color: #fff;
}
</style>
