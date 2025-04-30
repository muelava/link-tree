<template>
  <div class="flex gap-1 items-center">
    <label for="fileInput" class="flex group items-center gap-1 rounded-lg text-xs cursor-pointer hover:bg-gray-50 transition-all duration-300 px-0.5">
      <img v-if="!isLoad" :src="imageUrl ? imageUrl : currentImage" :alt="currentImage" class="size-8 rounded-lg mx-auto mb-1 object-cover aspect-square" />
      <div v-if="isLoad" class="bg-gray-200 animate-pulse size-8 rounded-full mx-auto mb-1"></div>
      <p v-if="!hasChange" class="text-[10px] group-hover:font-medium">Choose</p>
    </label>
    <input type="file" id="fileInput" @change="handleFileChange" class="hidden" accept="image/png, image/jpeg, image/jpg" />
    <button v-if="hasChange" @click="uploadImage" :disabled="isLoading" class="bg-emerald-500 text-white text-xs py-0.5 px-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-all duration-300">
      <v-icon v-if="isLoading" name="ri-loader-5-line" class="animate-spin" />
      <span v-if="!isLoading">Upload</span>
    </button>
    <p v-if="error" class="text-red-600 text-xs">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

const { currentImage, isLoad, imgUrlChanged } = defineProps({
  currentImage: String || null,
  isLoad: Boolean,
  imgUrlChanged: Function
});

// State variables
const file = ref(null);
const isLoading = ref(false);
const error = ref("");
const imageUrl = ref("");
const hasChange = ref(false);

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
    file.value = selectedFile;
    imageUrl.value = URL.createObjectURL(selectedFile);
    hasChange.value = true;
  }
};

// Upload image to Cloudinary
const uploadImage = async () => {
  if (!file.value) {
    error.value = "Please select a file first.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  // Cloudinary upload URL
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  // Create FormData to send the image
  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    // Send the request to Cloudinary
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Get the URL of the uploaded image
    imageUrl.value = response.data.secure_url;

    imgUrlChanged(imageUrl.value)
    // toast.success("Image uploaded!");
    hasChange.value = false;
  } catch (err) {
    error.value = "Upload failed, please try again.";
    console.error("Error uploading image:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>
