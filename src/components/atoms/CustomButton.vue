<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="border-2 border-emerald-400 flex justify-between w-full p-3.5 md:p-5 cursor-pointer hover:scale-105 transition-all duration-300 hover:text-emerald-400 hover:shadow-md rounded-full items-center group">
    <img v-if="avatar" :src="avatar" alt="avatar" class="size-8 md:size-10 rounded-full object-cover" />
    <span class="mx-auto text-sm md:text-base">{{ text }}</span>
    <v-icon name="bi-arrow-right" class="text-gray-400 group-hover:text-emerald-600 transition-all duration-300" />
  </a>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  href: string;
  avatar?: string | null;
}>();
</script>
