<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AdminSidebar/>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-50 px-6 max-h-screen overflow-y-scroll">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div class="flex-auto col-span-2">
          <slot />
        </div>
        <PreviewFrame/>
      </div>

      <!-- footer bar -->
       <FooterBar/>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/organisms/AdminSidebar.vue';
import FooterBar from '@/components/organisms/FooterBar.vue';
import PreviewFrame from "@/components/atoms/PreviewFrame.vue";
</script>