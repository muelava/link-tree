<template>
    <AdminLayout>
      <div class="sticky top-0 backdrop-blur-lg py-3 flex justify-between items-center w-full">
        <h1 class="text-2xl font-semibold text-neutral-800 flex-auto">Social Media</h1>
        <div v-if="isDirty">
          <button @click="saveLinks" class="bg-emerald-500 mx-auto text-white text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-emerald-600 transition-all duration-300">
            <span v-if="isLoading">Loading...</span>
            <span v-if="!isLoading">Save Changes</span>
          </button>
        </div>
      </div>
      <br />
      <form action="javascript:" method="POST" class="max-w-3xl mx-auto pb-10">
        <SocialSekeleton v-if="isLoad" :count="8" />
        <div v-if="!isLoad" v-for="(item, index) in socialData" :key="index" class="grid grid-cols-12 md:gap-3 items-center flex-row gap-1 m-3 py-3 px-2 bg-white shadow rounded-xl">
          <label :for="`showHide-${index}`" class="col-span-2 md:col-span-1 flex items-center gap-1">
            <input :id="`showHide-${index}`" v-model="item.show" type="checkbox" class="size-3 md:size-4 peer rounded accent-emerald-600 checked:bg-emerald-600 checked:border-transparent">
            <v-icon :name="item.name" scale="1.3" class="text-neutral-600 peer-checked:text-emerald-600" />
          </label>
          <input type="url" v-model="item.link" placeholder="https://" class="border-2 col-span-10 md:col-span-11 border-neutral-300 focus:border-emerald-600 font-light text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white" />
        </div>
      </form>
    </AdminLayout>
  </template>
  
  <script setup lang="ts">
  import AdminLayout from "@/layouts/AdminLayout.vue";
  import SocialSekeleton from "@/components/molecules/SocialSekeleton.vue";
  import { ref as dbRef, onValue, set } from "firebase/database";
  import { db } from "@/firebase";
  import { ref, onMounted } from "vue";
  import isEqual from "lodash/isEqual";
  import { watch } from "vue";
  
  import { useToast } from "vue-toastification";
  
  const toast = useToast();
  
  const socialData = ref<{ name: string; link: string; show: boolean; }[]>([]);
  
  const originalSocialData = ref<{ name: string; link: string; show: boolean; }[]>([]);
  const isDirty = ref(false);
  const isLoading = ref(false);
  const isLoad = ref(true)
  
  onMounted(() => {
    const dbRefLinks = dbRef(db, "social");
  
    onValue(dbRefLinks, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        socialData.value = data;
        originalSocialData.value = JSON.parse(JSON.stringify(data));
        isLoad.value = false
      }
    });
  });
  
  watch(
    socialData,
    (newVal) => {
      isDirty.value = !isEqual(newVal, originalSocialData.value);
    },
    { deep: true }
  );
  
  // Save data into realtime database
  const saveLinks = async () => {
    isLoading.value = true;
    try {
      await set(dbRef(db, "social"), socialData.value);
      toast.success("Link berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  