<template>
  <v-navigation-drawer
    absolute
    floating
    app
    width="flex"
    color="white"
    class="uppercase font-medium"
  >
    <v-list subheader>
      <div v-for="({ icon, title, link, children }, index) in rootNavigation" :key="title">
        <v-list-item
          v-if="!children"
          :key="index"
          :to="link"
          active-class="bg-default"
          class="white"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon>{{ icon }}</v-icon>
          </template>
          <v-list-item-title class="tracking-wider">{{ $t(title) }}</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-else
          :key="title"
          no-action
          active-class="bg-default"
          class="white"
          color="primary"
        >
          <template #activator>
            <v-icon>{{ icon }}</v-icon>
            <v-list-item-title class="tracking-wider">{{ $t(title) }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="{ childTitle, childLink } in children"
            :key="childTitle"
            :to="childLink"
            active-class="bg-default"
            class="white"
            color="primary"
          >
            <v-list-item-title class="tracking-wider">
              {{ $t(childTitle) }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import rootNavigation from '@/router/RootNavigation';
</script>

<style>
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 10px !important;
}
</style>
