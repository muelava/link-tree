<template>
  <div class="max-w-xl mx-auto">
    <div>
      <div class="max-w-md mx-auto px-4">
        <img :src="logo" alt="logo.svg" class="mx-auto my-10 w-14" />
        <b class="text-center block mb-3">{{ profileData.username }}</b>
        <p class="text-center leading-normal">{{ profileData.title }}</p>

        <ul class="flex justify-center items-center gap-4 my-10">
          <li v-for="(item, index) in socmedData" :key="index">
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              <v-icon :name="item.name" scale="1.5" class="hover:scale-110 hover:text-emerald-500 transition-all duration-300 cursor-pointer" />
            </a>
          </li>
        </ul>
      </div>

      <div class="px-4 md:px-0 space-y-4 mb-20">
        <CustomButton v-for="(item, i) in linksData" :key="i" :text="item.text" :href="item.href" :avatar="logo" />
      </div>
    </div>
    <Footer :copyright-text="profileData.username" />
  </div>
</template>

<script setup lang="ts">
import { ref, onValue } from "firebase/database";
import { db } from "@/firebase";
import { ref as vueRef, onMounted } from "vue";

import Footer from "@/components/molecules/Footer.vue";
import logo from "/public/vite.svg";
import CustomButton from "@/components/atoms/CustomButton.vue";

interface SocmedItem {
  name: string;
  link: string;
  show: boolean;
}

const socmedData = vueRef<{ name: string; link?: string; show: boolean }[]>([]);
const linksData = vueRef<{ avatar?: string, text: string; href: string }[]>([]);
const profileData = vueRef<{username:string; title:string}>({username:"", title:""});

onMounted(() => {
  const dbRef = ref(db, "social");
  const dbRefLinks = ref(db, "links");
  const dbRefProfile = ref(db, "profile");

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      socmedData.value = data.filter((item:SocmedItem) => item.show);
    }
  });

  onValue(dbRefLinks, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      linksData.value = data;
    }
  });

  onValue(dbRefProfile, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      profileData.value = data;
    }
  });
});
</script>