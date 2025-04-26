<template>
    <div class="fixed bottom-0 left-0 right-0 bg-white text-center p-5 max-w-xl mx-auto">
        <span class="text-sm">
            <small>Made With</small> <b>{{ copyrightText }}</b>
        </span>
    </div>
</template>

<script setup lang="ts">
defineProps<{copyrightText:string}>();
</script>