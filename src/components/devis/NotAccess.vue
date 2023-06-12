<template>
  <ContainerModel2>
    <template #Header>
      <HeaderModel1>
        <template #Header-Title>Not access</template>
        <template #Header-SubTitle>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum aperiam velit asperiores
          fugit minima quod animi doloribus necessitatibus fugiat?
        </template>
      </HeaderModel1>
    </template>
    <template #Body>
      <p>Not access</p>
      <v-btn :to="{ name: 'OverviewDevis', query: { id: props.devisId } }"> Back </v-btn>
    </template>
  </ContainerModel2>
</template>
<script setup lang="ts">
import ContainerModel2 from '@/components/common/templates/ContainerModel2.vue';
import HeaderModel1 from '@/components/common/templates/HeaderModel1.vue';

export interface IProps {
  devisId?: number;
}
const props = withDefaults(defineProps<IProps>(), {
  devisId: null
});
</script>
