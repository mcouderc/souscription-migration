<template>
  <div v-show="doesHavePermissionAmongRoleBroker()">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
const { doesHavePermissionAmongRoleBroker } = usePermission();
</script>
