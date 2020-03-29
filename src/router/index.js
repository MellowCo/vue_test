import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/login.vue";
import home from "../views/home.vue";
import welcome from "../components/welcome.vue";
import users from "../components/users.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: login },
  {
    path: "/home",
    component: home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: welcome },
      { path: "/users", component: users }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path == "/login") next();

  const token = window.sessionStorage.getItem("token");
  if (!token) next("/login");
  next();
});

export default router;
