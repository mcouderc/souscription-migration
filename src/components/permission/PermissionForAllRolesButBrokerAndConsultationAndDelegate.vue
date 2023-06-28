<template>
  <div v-show="doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
const { doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate } = usePermission();
</script>
