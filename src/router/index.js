import Vue from "vue";
import VueRouter from "vue-router";

//路由懒加载
const Add = () => import("../components/goods/Add.vue");
const Cate = () => import("../components/goods/Cate.vue");
const List = () => import("../components/goods/List.vue");
const Params = () => import("../components/goods/Params.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
