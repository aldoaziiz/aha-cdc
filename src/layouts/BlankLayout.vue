<template>
  <div class="blank-layout-wrapper">
    <v-main>
      <slot />
    </v-main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.blank-layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
