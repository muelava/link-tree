<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="border-2 border-emerald-400 flex justify-between w-full p-3.5 md:p-5 cursor-pointer hover:scale-105 transition-all duration-300 hover:text-emerald-400 hover:shadow-md rounded-full items-center">
    <img v-if="avatar" :src="avatar" alt="avatar" class="w-8 md:w-10 h-8 md:h-10 rounded-full" />
    <span class="mx-auto text-sm md:text-base">{{ text }}</span>
    <img src="/public/dm.svg" alt="dm.svg" class="w-6 h-6 invisible" />
  </a>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  href: string;
  avatar?: string | null;
}>();
</script>
