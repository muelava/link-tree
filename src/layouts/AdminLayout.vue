<template>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <AdminSidebar/>
  
      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 px-6 pb-6 max-h-screen overflow-y-auto">
        <slot />

        <!-- footer bar -->
         <FooterBar/>
      </main>
    </div>
  </template>

<script setup>
import AdminSidebar from '@/components/organisms/AdminSidebar.vue';
import FooterBar from '@/components/organisms/FooterBar.vue';
</script>