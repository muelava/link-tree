<template>
  <AdminLayout>
    <div class="sticky top-0 backdrop-blur-lg h-20 flex justify-between items-center w-full">
      <h1 class="text-2xl font-semibold text-neutral-800 flex-auto">Your Links</h1>
      <div v-if="isDirty">
        <button @click="saveLinks" class="bg-emerald-500 mx-auto text-white text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-emerald-600 transition-all duration-300">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>

    <div class="max-w-3xl mx-auto pb-10 mt-5">
      <LinksSekeleton v-if="isLoad" :count="6" />

      <draggable v-model="linksData" item-key="id" v-if="!isLoad">
        <template #item="{ element, index }">
          <div class="grid grid-cols-1 md:grid-cols-12 md:gap-3 flex-row m-3 py-3 px-2 bg-white shadow rounded-xl cursor-grab active:cursor-grabbing">
            <!-- Drag Handle -->
            <div class="hidden md:flex items-center justify-center md:col-span-1">
              <v-icon name="oi-grabber" scale="1" class="drag-handle" />
            </div>

            <!-- Website Text -->
            <input
              type="text"
              v-model="element.text"
              placeholder="Website"
              class="border-b col-span-4 border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white"
            />

            <!-- Website Link -->
            <input
              type="url"
              v-model="element.href"
              placeholder="https://"
              class="border-b col-span-6 border-neutral-400 focus:border-emerald-600 font-light text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white"
            />

            <!-- Delete Button -->
            <button
              @click="deleteLink(index)"
              class="flex items-center text-xs justify-center w-full rounded-xl text-rose-500 cursor-pointer py-2 md:py-0 mt-3 md:mt-0 bg-rose-50 hover:bg-rose-100 transition-all duration-300"
            >
              <v-icon name="bi-trash-fill" scale="0.8" />
            </button>
          </div>
        </template>
      </draggable>

      <div class="px-3 mt-5">
        <button
          @click="addNewLink"
          class="border border-emerald-500 w-full text-emerald-500 p-2 rounded-full cursor-pointer hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
        >
          Add Link
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/layouts/AdminLayout.vue";
import LinksSekeleton from "@/components/molecules/LinksSekeleton.vue";
import draggable from 'vuedraggable';
import { ref as dbRef, onValue, set } from "firebase/database";
import { db } from "@/firebase";
import { ref, onMounted, watch } from "vue";
import isEqual from "lodash/isEqual";
import { useToast } from "vue-toastification";

const toast = useToast();

const linksData = ref<{ id: number; text: string; href: string }[]>([]);
const originalLinksData = ref<{ id: number; text: string; href: string }[]>([]);
const isDirty = ref(false);
const isLoading = ref(false);
const isLoad = ref(true);

onMounted(() => {
  const dbRefLinks = dbRef(db, "links");

  onValue(dbRefLinks, (snapshot) => {
    const data = snapshot.val();
    if (data && Array.isArray(data)) {
      linksData.value = data.map((item, index) => ({
        id: index + 1,
        text: item.text || '',
        href: item.href || ''
      }));
      originalLinksData.value = JSON.parse(JSON.stringify(linksData.value));
    }
    isLoad.value = false;
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
  const newId = linksData.value.length > 0 ? Math.max(...linksData.value.map(i => i.id)) + 1 : 1;
  linksData.value.push({ id: newId, text: "", href: "" });
};

const deleteLink = (index: number) => {
  linksData.value.splice(index, 1);
};

const saveLinks = async () => {
  isLoading.value = true;
  try {
    const payload = linksData.value.map(({ id, ...rest }) => rest);

    await set(dbRef(db, "links"), payload);

    toast.success("Link berhasil disimpan!");
    originalLinksData.value = JSON.parse(JSON.stringify(linksData.value));
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    alert("Terjadi kesalahan saat menyimpan.");
  } finally {
    isLoading.value = false;
  }
};
</script>
