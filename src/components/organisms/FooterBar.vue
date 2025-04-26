<template>
  <footer class="fixed lg:hidden bottom-0 left-0 right-0 bg-white shadow-2xl flex">
    <ul class="grid grid-cols-4 w-full">
      <li class="col-auto">
        <router-link to="/dashboard" :class="['hover:bg-neutral-50 text-sm flex flex-col items-center px-4 py-2 transition-all text-center md:text-start', route.path === '/dashboard' ? 'bg-neutral-100 font-medium text-emerald-600' : '']"
          ><v-icon name="co-home" scale="1.2" /> <small>Dashboard</small></router-link
        >
      </li>
      <li class="col-auto">
        <router-link to="/dashboard/links" :class="['hover:bg-neutral-50 text-sm flex flex-col items-center px-4 py-2 transition-all text-center md:text-start', route.path === '/dashboard/links' ? 'bg-neutral-100 font-medium text-emerald-600' : '']"
          ><v-icon name="co-link" scale="1.2" /> <small>Links</small></router-link
        >
      </li>
      <li>
        <router-link to="/dashboard/social" :class="['hover:bg-neutral-50 text-sm flex flex-col items-center px-4 py-2 transition-all text-center md:text-start', route.path === '/dashboard/social' ? 'bg-neutral-100 font-medium text-emerald-600' : '']"
          ><v-icon name="bi-chat-quote" scale="1.2" /> <small>Social</small></router-link
        >
      </li>
      <li @click="logout" class="hover:bg-rose-50 text-sm flex flex-col items-center px-4 py-2 transition-all text-center md:text-start text-rose-500 cursor-pointer text-nowrap"><v-icon name="hi-logout" scale="1.2" /> <small>Sign Out</small></li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useLogout } from "@/compposable/useLogout";

const route = useRoute();
const { logout } = useLogout();
</script>

<style lang="scss"></style>
