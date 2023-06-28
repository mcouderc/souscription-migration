<template>
  <div v-show="doesHavePermissionAmongAllRolesButConsultation()">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
const { doesHavePermissionAmongAllRolesButConsultation } = usePermission();
</script>
