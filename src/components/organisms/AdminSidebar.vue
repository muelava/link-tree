<template>
  <aside class="w-64 text-neutral-700 py-6 border-r border-neutral-300 hidden lg:block">
    <h2 class="text-base font-semibold mb-6 px-4 flex gap-3"><img src="/public/dm.svg" alt="dm.svg">Danamart</h2>
    <ul class="space-y-2.5">
      <li><router-link to="/dashboard" :class="['hover:bg-neutral-50 text-sm block px-4 py-2 transition-all', route.path === '/dashboard' ? 'bg-neutral-100 font-medium' : '']"><v-icon name="co-home" /> Dashboard</router-link></li>
      <li><router-link to="/dashboard/links" :class="['hover:bg-neutral-50 text-sm block px-4 py-2 transition-all', route.path === '/dashboard/links' ? 'bg-neutral-100 font-medium' : '']"><v-icon name="co-link" /> Links</router-link></li>
      <li><router-link to="/dashboard/social" :class="['hover:bg-neutral-50 text-sm block px-4 py-2 transition-all', route.path === '/dashboard/social' ? 'bg-neutral-100 font-medium' : '']"><v-icon name="bi-chat-quote" /> Social</router-link></li>
      <li @click="logout" class="hover:bg-rose-50 text-sm block px-4 py-2 transition-all text-rose-500 cursor-pointer"><v-icon name="hi-logout" /> Sign Out</li>
    </ul>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useLogout } from "@/compposable/useLogout";

const route = useRoute();
const { logout } = useLogout();
</script>