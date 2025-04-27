import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/home/Home.vue";
import Dashboard from "@/views/admin/Dashboard.vue";
import Login from "@/views/auth/Login.vue";

// 🔥 Firebase Auth
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import Links from "@/views/admin/Links.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/links",
    name: "DashboardLinks",
    component: Links,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/social',
    name: 'DashboardSocial',
    component: () => import('@/views/admin/Social.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory('/'), // previous: /link-tree/
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();

    if (requiresAuth && !user) {
      next({ name: 'Login' });
    } else if (guestOnly && user) {
      next({ name: 'Dashboard' });
    } else {
      next();
    }
  });
});

export default router;
