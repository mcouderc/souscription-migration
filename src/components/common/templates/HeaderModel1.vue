<template>
  <div>
    <h1 class="title-helios"><slot name="Header-Title" /></h1>
    <p :class="[{ 'text-primary': props.color }, 'sub-title-helios font-semibold']">
      <slot name="Header-SubTitle" />
    </p>
    <p class="devis-header-info">
      <slot name="Header-Text" />
    </p>
  </div>
</template>
<script setup lang="ts">
export interface IProps {
  color?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  color: true
});
</script>
