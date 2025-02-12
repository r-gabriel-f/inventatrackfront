import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";

const isAuthenticated = () => !!localStorage.getItem("token");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../components/salidas/index.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/");
  } else {
    next();
  }
});

export default router;
