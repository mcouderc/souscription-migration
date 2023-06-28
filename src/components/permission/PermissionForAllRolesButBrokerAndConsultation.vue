<template>
  <div v-show="doesHavePermissionAmongAllRolesButBrokerAndConsultation()">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
const { doesHavePermissionAmongAllRolesButBrokerAndConsultation } = usePermission();
</script>
