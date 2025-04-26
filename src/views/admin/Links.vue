<template>
    <AdminLayout>
      <div class="sticky top-0 backdrop-blur-lg h-20 flex justify-between items-center w-full">
        <h1 class="text-2xl font-semibold text-neutral-800 flex-auto">Your Link</h1>
        <div v-if="isDirty">
          <button @click="saveLinks" class="bg-emerald-500 mx-auto text-white text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-emerald-600 transition-all duration-300">
            <span v-if="isLoading">Loading...</span>
            <span v-if="!isLoading">Save Changes</span>
          </button>
        </div>
      </div>
      <br />
      <div class="max-w-3xl mx-auto pb-10">
        <LinksSekeleton v-if="isLoad" :count="6"/>
        <div v-if="!isLoad" v-for="(item, index) in linksData" :key="index" class="grid grid-cols-1 md:grid-cols-12 md:gap-3 flex-row m-3 py-3 px-2 bg-white shadow rounded-xl">
          <input type="text" v-model="item.text" placeholder="Website" class="border-b col-span-4 border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white" />
          <input type="url" v-model="item.href" placeholder="https://" class="border-b col-span-7 border-neutral-400 focus:border-emerald-600 font-light text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white" />
          <button @click="deleteLink(index)" class="flex items-center text-xs justify-center w-full rounded-xl text-rose-500 cursor-pointer bg-red-50 md:bg-transparent py-2 md:py-0 mt-3 md:mt-0 hover:bg-rose-50 transition-all duration-300">
            <v-icon name="bi-trash-fill" scale="0.8" /><span class="block md:hidden ms-1">Delete</span>
          </button>
        </div>
        <div class="px-3">
          <button @click="addNewLink" class="border border-emerald-500 w-full text-emerald-500 p-2 rounded-full cursor-pointer hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300">Add Link</button>
        </div>
      </div>
    </AdminLayout>
  </template>
  
  <script setup lang="ts">
  import AdminLayout from "@/layouts/AdminLayout.vue";
  import LinksSekeleton from "@/components/molecules/LinksSekeleton.vue";
  import { ref as dbRef, onValue, set } from "firebase/database";
  import { db } from "@/firebase";
  import { ref, onMounted } from "vue";
  import isEqual from "lodash/isEqual";
  import { watch } from "vue";
  
  import { useToast } from "vue-toastification";
  
  const toast = useToast();
  
  const linksData = ref<{ text: string; href: string }[]>([]);
  
  const originalLinksData = ref<{ text: string; href: string }[]>([]);
  const isDirty = ref(false);
  const isLoading = ref(false);
  const isLoad = ref(true)
  
  onMounted(() => {
    const dbRefLinks = dbRef(db, "links");
  
    onValue(dbRefLinks, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        linksData.value = data;
        originalLinksData.value = JSON.parse(JSON.stringify(data));
      }
      isLoad.value = false
    });
  });
  
  watch(
    linksData,
    (newVal) => {
      isDirty.value = !isEqual(newVal, originalLinksData.value);
    },
    { deep: true }
  );
  
  const addNewLink = () => {
    linksData.value.push({ text: "", href: "" });
  };
  
  const deleteLink = (index: number) => {
    linksData.value.splice(index, 1);
  };
  
  // Save data into realtime database
  const saveLinks = async () => {
    isLoading.value = true;
  
    const updatedLinks = linksData.value.map(item => ({
      ...item,
      avatar: './vite.svg',
    }));
  
    try {
      await set(dbRef(db, "links"), updatedLinks);
      toast.success("Link berhasil disimpan!");
      originalLinksData.value = JSON.parse(JSON.stringify(updatedLinks))
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  