<template>
  <div class="max-w-xl mx-auto">
    <div>
      <div class="max-w-md mx-auto px-4">
        <img :src="logoDm" alt="dm.svg" class="mx-auto my-10 w-14" />
        <b class="text-center block mb-3">@danamart</b>
        <p class="text-center leading-normal" v-html="titleData"></p>

        <ul class="flex justify-center items-center gap-4 my-10">
          <li v-for="item in socmedData" :key="item.name">
            <a :href="item.link" target="_blank" rel="noopener noreferrer" v-if="item.show">
              <v-icon :name="item.name" scale="1.5" class="hover:scale-110 hover:text-emerald-500 transition-all duration-300 cursor-pointer" />
            </a>
          </li>
        </ul>
      </div>

      <div class="px-4 md:px-0 space-y-4 mb-20">
        <CustomButton v-for="(item, i) in linksData" :key="i" :text="item.text" :href="item.href" :avatar="item.avatar" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onValue } from "firebase/database";
import { db } from "@/firebase";
import { ref as vueRef, onMounted } from "vue";

import Footer from "@/components/molecules/Footer.vue";
import logoDm from "/public/dm.svg";
import CustomButton from "@/components/atoms/CustomButton.vue";

const socmedData = vueRef<{ name: string; link?: string; show: boolean }[]>([]);
const linksData = vueRef<{ avatar?: string, text: string; href: string }[]>([]);
const titleData = vueRef("");

onMounted(() => {
  const dbRef = ref(db, "social");
  const dbRefLinks = ref(db, "links");
  const dbRefTitle = ref(db, "title");

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      socmedData.value = data;
    }
  });

  onValue(dbRefLinks, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      linksData.value = data;
    }
  });

  onValue(dbRefTitle, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      titleData.value = data;
    }
  });
});
</script>