import Vue from "vue";
import VueRouter from "vue-router";

//路由懒加载
const Add = () => import("../components/goods/Add.vue");
const Cate = () => import("../components/goods/Cate.vue");
const List = () => import("../components/goods/List.vue");
const Params = () => import("../components/goods/Params.vue");

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  // 错误路由
  {
    path: "/404",
    name: "404",
    component: () =>
      import(
        /* webpackChunkName: "Login_Home_Welcome" */ "../components/error/404.vue"
      ),
    visible: false,
  },
  {
    path: "*",
    redirect: "/404",
    visible: false,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
