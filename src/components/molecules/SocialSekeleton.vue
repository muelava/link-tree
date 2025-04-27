<template>
    <div v-for="n in count" :key="n" class="flex gap-3 m-3">
      <div class="size-12 bg-gray-200 animate-pulse rounded-2xl mb-3"></div>
      <div class="h-12 bg-gray-200 animate-pulse rounded-2xl mb-3 flex-auto"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    count: number
  }>();
  </script>
  