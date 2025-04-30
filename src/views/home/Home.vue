<template>
  <div class="max-w-xl mx-auto">
    <div>
      <div class="max-w-md mx-auto px-4">
        <img v-if="!isLoad" :src="profileData.avatar" alt="logo.svg" class="mx-auto my-10 size-14 rounded-full object-cover" />
        <div v-if="isLoad" class="size-14 bg-gray-200 animate-pulse rounded-lg mb-3 mx-auto my-10"></div>

        <b v-if="!isLoad" class="text-center block mb-3">{{ profileData.username }}</b>
        <b v-if="isLoad" class="text-center block bg-gray-200 animate-pulse h-4 w-16 rounded-lg mx-auto mt-10 mb-3"></b>

        <p v-if="!isLoad" class="text-center leading-normal">{{ profileData.title }}</p>
        <b v-if="isLoad" class="text-center block bg-gray-200 animate-pulse h-5 w-sm rounded-lg mx-auto"></b>

        <ul v-if="!isLoad" class="flex justify-center items-center gap-4 my-10">
          <li v-for="(item, index) in socmedData" :key="index">
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              <v-icon :name="item.name" scale="1.5" class="text-neutral-500 hover:scale-110 hover:text-emerald-500 transition-all duration-300 cursor-pointer" />
            </a>
          </li>
        </ul>
      </div>
      <div v-if="isLoad" class="flex justify-center gap-4 my-10">
        <div class="size-8 bg-gray-200 animate-pulse rounded-lg"></div>
        <div class="size-8 bg-gray-200 animate-pulse rounded-lg"></div>
        <div class="size-8 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      
      <div v-if="!isLoad" class="px-4 md:px-0 space-y-4 mb-20">
        <CustomButton v-for="(item, i) in linksData" :key="i" :text="item.text" :href="item.href" :img="item.img" :avatar="profileData.avatar ? profileData.avatar : logo" />
      </div>
      <SocialSekeleton v-if="isLoad" :count="5"/>

    </div>
    <Footer v-if="!isLoad" :copyright-text="profileData.username" />
  </div>
</template>

<script setup lang="ts">
import { ref, onValue } from "firebase/database";
import { db } from "@/firebase";
import { ref as vueRef, onMounted } from "vue";

import Footer from "@/components/molecules/Footer.vue";
import logo from "/public/vite.svg";
import CustomButton from "@/components/atoms/CustomButton.vue";
import SocialSekeleton from "@/components/molecules/SocialSekeleton.vue";

interface SocmedItem {
  name: string;
  link: string;
  show: boolean;
}

const socmedData = vueRef<{ name: string; link?: string; show: boolean }[]>([]);
const linksData = vueRef<{ avatar?: string, text: string; href: string; img?: string }[]>([]);
const profileData = vueRef<{avatar:string; username:string; title:string}>({avatar:"", username:"", title:""});
const isLoad = vueRef(true)

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
      isLoad.value = false
    }
  });
});
</script>