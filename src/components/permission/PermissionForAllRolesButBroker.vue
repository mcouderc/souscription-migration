<template>
  <div v-show="doesHavePermissionAmongAllRolesButBroker()">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
const { doesHavePermissionAmongAllRolesButBroker } = usePermission();
</script>
