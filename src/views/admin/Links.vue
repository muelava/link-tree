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

            <div v-if="'img' in element" class="col-span-2">
              <UploadLIstImage :current-image="element.img" :is-load="isLoad" :img-url-changed="(url: string) => element.img = url" />
            </div>

            <!-- Website Text -->
            <input v-if="'text' in element" type="text" v-model="element.text" placeholder="Website" class="border-b col-span-4 border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white" />

            <!-- Website Image -->
            <input v-if="'img' in element" type="url" v-model="element.img" placeholder="Image URL" class="hidden border-b col-span-4 border-neutral-400 focus:border-emerald-600 font-light text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white mt-2" />

            <!-- Website Link -->
            <input type="url" v-model="element.href" placeholder="https://" :class="`${'img' in element ? 'col-span-8' : 'col-span-6'} border-b border-neutral-400 focus:border-emerald-600 font-light text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white`" />

            <!-- Delete Button -->
              <button @click="deleteLink(index)" class=" flex items-center text-xs justify-center w-full rounded-xl text-rose-500 cursor-pointer py-2 md:py-0 mt-3 md:mt-0 bg-rose-50 hover:bg-rose-100 transition-all duration-300">
                <v-icon name="bi-trash-fill" scale="0.8" />
              </button>
          </div>
        </template>
      </draggable>

      <div class="px-3 mt-5">
        <button @click="addNewLink" class="border border-emerald-500 w-full text-emerald-500 p-2 rounded-full cursor-pointer hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300">Add Link</button>
      </div>
    </div>

    <!-- modals -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 text-center">
            <h2 class="text-lg font-semibold text-neutral-700">Choose Type</h2>
            <button @click="confirmAdd('link')" class="w-full py-2 cursor-pointer transition-all duration-300 bg-emerald-500 text-white rounded-full hover:bg-emerald-600">Add Link</button>
            <button @click="confirmAdd('image')" class="w-full py-2 cursor-pointer transition-all duration-300 bg-blue-500 text-white rounded-full hover:bg-blue-600">Add Image</button>
            <button @click="showModal = false" class="text-sm text-rose-500 mt-2 hover:underline cursor-pointer">Cancel</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/layouts/AdminLayout.vue";
import LinksSekeleton from "@/components/molecules/LinksSekeleton.vue";
import UploadLIstImage from "@/components/molecules/UploadListImage.vue";
import draggable from "vuedraggable";
import { ref as dbRef, onValue, set } from "firebase/database";
import { db } from "@/firebase";
import { ref, onMounted, watch } from "vue";
import isEqual from "lodash/isEqual";
import { useToast } from "vue-toastification";

const toast = useToast();

const linksData = ref<{ id: number; text?: string; href: string; img?: string }[]>([]);
const originalLinksData = ref<{ id: number; text?: string; href: string; img?: string }[]>([]);
const isDirty = ref(false);
const isLoading = ref(false);
const isLoad = ref(true);
const showModal = ref(false);

onMounted(() => {
  const dbRefLinks = dbRef(db, "links");

  onValue(dbRefLinks, (snapshot) => {
    const data = snapshot.val();
    if (data && Array.isArray(data)) {
      linksData.value = data.map((item, index) => {
        const base: { id: number; href: string; text?: string; img?: string } = {
  id: index + 1,
  href: item.href || "",
};
  
  if (item.text !== "") {
    base.text = item.text;
  }

  if (item.img !== "") {
    base.img = item.img;
  }

  return base;
});

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
  showModal.value = true;
};

const confirmAdd = (type: "link" | "image") => {
  const newId = linksData.value.length > 0 ? Math.max(...linksData.value.map((i) => i.id)) + 1 : 1;

  if (type === "link") {
    linksData.value.push({ id: newId, text: "", href: "" });
  } else if (type === "image") {
    linksData.value.push({ id: newId, href: "", img: "" });
  }

  showModal.value = false;
};

const deleteLink = (index: number) => {
  linksData.value.splice(index, 1);
};

const saveLinks = async () => {
  isLoading.value = true;
  try {
    const payload = linksData.value.map(({ id, ...rest }) => ({
      ...rest,
      text: "text" in rest ? rest.text : "",
      img: "img" in rest ? rest.img : "",
    }));

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
