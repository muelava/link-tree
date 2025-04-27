<template>
  <main class="flex items-center h-screen p-4">
    <div class="max-w-sm mx-auto mt-20 space-y-4 bg-white shadow-2xl p-10 rounded-2xl">
      <h1 class="text-2xl font-semibold text-center mb-10 text-neutral-700">Halo sayang, silakan masuk!</h1>
      <form @submit.prevent="login" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email"
          class="border border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white" />
        <input v-model="password" type="password" placeholder="Password"
          class="border border-neutral-400 focus:border-emerald-600 text-sm px-4 rounded-xl w-full p-2 outline-0 bg-white" />
        <button type="submit" :disabled="isLoading"
          class="from-emerald-500 to-emerald-600 bg-gradient-to-r text-white px-4 py-2 rounded-xl w-full hover:opacity-80 transition-all duration-150 cursor-pointer disabled:opacity-70">
          <span v-if="isLoading">loading...</span>
          <span v-if="!isLoading">Login</span>
        </button>
      </form>
      <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const router = useRouter();

const login = async () => {
  error.value = "";
  isLoading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (err: any) {
    // error.value = err.message;
    error.value = "Email or password is incorrect!";
  } finally {
    isLoading.value = false;
  }
};
</script>
