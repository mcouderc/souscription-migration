<template>
  <div>
    <Field name="{{props.name}}" />
  </div>
</template>
<script setup lang="ts">
import { useField } from 'vee-validate';
import { defineProps } from 'vue';
import { Form, Field } from 'vee-validate';

// make sure to wrap the name in a function to maintain its reactivity
// this way vee-validate can react to the field name changing
</script>
