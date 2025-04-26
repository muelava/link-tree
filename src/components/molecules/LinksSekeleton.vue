<template>
    <div v-for="n in count" :key="n" class="grid grid-cols-1 md:grid-cols-12 md:gap-3 m-3">
      <div class="h-12 w-full bg-gray-200 animate-pulse rounded-2xl mb-3 col-span-4"></div>
      <div class="h-12 w-full bg-gray-200 animate-pulse rounded-2xl mb-3 col-span-7"></div>
      <div class="h-12 w-full bg-gray-200 animate-pulse rounded-2xl mb-3 col-span-1"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    count: number
  }>();
  </script>
  