<<<<<<< HEAD
import Vue from "vue";
import VueRouter from "vue-router";
=======
import Vue from 'vue'
import VueRouter from 'vue-router'


const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')


>>>>>>> gqp/master

//路由懒加载
const Add = () => import("../components/goods/Add.vue");
const Cate = () => import("../components/goods/Cate.vue");
const List = () => import("../components/goods/List.vue");
const Params = () => import("../components/goods/Params.vue");

<<<<<<< HEAD
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
=======
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}


  const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  // 错误路由
    {
      path: "/404",
      name: "404",
      component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/error/404.vue'),
      visible: false,
    },
    {
      path: "*",
      redirect: "/404",
      visible: false,
    },
]

const router = new VueRouter({
  routes
})
>>>>>>> gqp/master

export default router;
