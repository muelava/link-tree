<template>
    <div class="flex flex-col items-center gap-5">
      <label for="fileInput" class="rounded-lg text-xs py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-all duration-300">
        <img :src=" imageUrl ? imageUrl : currentImage" :alt="currentImage" class="size-20 rounded-full mx-auto mb-1 object-cover" />
        <p>Choose your file</p>
      </label>
      <input type="file" id="fileInput" @change="handleFileChange" class="hidden" />
      <button v-if="hasChange" @click="uploadImage" :disabled="isLoading" class="bg-emerald-500 text-white text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-emerald-600 transition-all duration-300">
        <span v-if="isLoading">Uploading...</span>
        <span v-if="!isLoading">Upload</span>
      </button>
      <p v-if="error" class="text-red-600 text-xs">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { useToast } from "vue-toastification";
const toast = useToast();

defineProps({
  currentImage: String | null,
});

// State variables
const file = ref(null);
const isLoading = ref(false);
const error = ref("");
const imageUrl = ref("");
const hasChange = ref(false);

const handleFileChange = (event) => {
  file.value = event.target.files[0];
  hasChange.value = true;
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

    // Call saveProfile function to store the image URL in Firebase
    saveProfile(response.data.secure_url);
    toast.success('Image uploaded!')
    hasChange.value = false;
  } catch (err) {
    error.value = "Upload failed, please try again.";
    console.error("Error uploading image:", err);
  } finally {
    isLoading.value = false;
  }
};

// Save the profile image URL to Firebase Realtime Database
const saveProfile = async (secure_url) => {
  try {
    const dbRefPath = dbRef(getDatabase(), "profile/avatar");
    await set(dbRefPath, secure_url);
    console.log("Profile image saved to Firebase!");
  } catch (err) {
    console.error("Error saving profile image:", err);
    error.value = "Failed to save image to database.";
  }
};
</script>
