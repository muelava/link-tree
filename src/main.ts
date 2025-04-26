import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

import router from './router';

import VueToast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  BiWhatsapp,
  CoGmail,
  BiInstagram,
  BiLinkedin,
  BiTiktok,
  BiYoutube,
  IoOpenOutline,
  CoHome,
  HiLogout,
  FaEdit,
  BiTrashFill,
  CoLink,
  BiChatQuote,
  BiFacebook,
  BiTwitter,
  BiTelegram,
  BiArrowRight
} from 'oh-vue-icons/icons';

addIcons(BiWhatsapp, CoGmail, BiInstagram, BiLinkedin, BiTiktok, BiYoutube, IoOpenOutline, CoHome, HiLogout, FaEdit, BiTrashFill, CoLink, BiChatQuote, BiFacebook, BiTwitter, BiTelegram, BiArrowRight);

const app = createApp(App);

app.use(router);
app.use(VueToast, {
  position: 'top-right',
  duration: 1000,
  dismissible: true,
  pauseOnHover: false,
});
app.component('v-icon', OhVueIcon);

app.mount('#app');
