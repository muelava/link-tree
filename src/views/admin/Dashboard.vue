<template>
  <AdminLayout>
    <div class="sticky top-0 backdrop-blur-lg h-20 flex justify-between items-center w-full">
      <h1 class="text-2xl font-semibold text-neutral-800 flex-auto">Your Title</h1>
      <div v-if="isDirty">
        <button @click="saveTitle" class="bg-emerald-500 mx-auto text-white text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-emerald-600 transition-all duration-300">
          <span v-if="isLoading">Loading...</span>
          <span v-if="!isLoading">Save Changes</span>
        </button>
      </div>
    </div>
    <br />
    <form action="javascript:" method="POST" class="max-w-3xl mx-auto pb-10">
      <div class="grid grid-cols-1 flex-row m-3 py-3 px-2 bg-white shadow rounded-xl">
        <input v-if="!isLoad" type="text" v-model="profileData.username" placeholder="Title" class="border col-span-4 border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white mb-5" />
        <textarea v-if="!isLoad" placeholder="Title" v-model="profileData.title" class="field-sizing-content border col-span-4 border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-lg w-full p-2 outline-0 bg-white"></textarea>
        <div v-if="isLoad" class="h-10 w-full bg-gray-200 animate-pulse rounded-2xl mb-3"></div>
        <div v-if="isLoad" class="h-10 w-full bg-gray-200 animate-pulse rounded-2xl"></div>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/layouts/AdminLayout.vue";
import { ref as dbRef, onValue, set } from "firebase/database";
import { db } from "@/firebase";
import { ref, onMounted } from "vue";
import isEqual from "lodash/isEqual";
import { watch } from "vue";

import { useToast } from "vue-toastification";

const toast = useToast();

const profileData = ref<{ username: string; title: string }>({
  username: "",
  title: "",
});

const originalProfileData = ref<{ username: string; title: string }>({
  username: "",
  title: "",
});
const isDirty = ref(false);
const isLoading = ref(false);
const isLoad = ref(true)

onMounted(() => {
  const dbRefProfile = dbRef(db, "profile");

  onValue(dbRefProfile, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      profileData.value = data;
      originalProfileData.value = JSON.parse(JSON.stringify(data));
    }
    isLoad.value = false
  });
});

watch(
  profileData,
  (newVal) => {
    isDirty.value = !isEqual(newVal, originalProfileData.value);
  },
  { deep: true }
);


// Save data into realtime database
const saveTitle = async () => {
  isLoading.value = true;

  try {
    await set(dbRef(db, "profile"), profileData.value);
    toast.success("Title berhasil disimpan!");
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    alert("Terjadi kesalahan saat menyimpan.");
  } finally {
    isLoading.value = false;
  }
};
</script>
