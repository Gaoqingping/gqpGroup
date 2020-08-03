import Vue from 'vue'
import VueRouter from 'vue-router'


const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')



Vue.use(VueRouter)

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

export default router
