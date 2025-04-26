<template>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <AdminSidebar/>
  
      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 p-6">
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