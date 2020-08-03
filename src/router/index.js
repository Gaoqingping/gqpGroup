
import Vue from "vue";
import VueRouter from "vue-router";




// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/User.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')
const Error = () => import(/* webpackChunkName: "Order_Report" */ '../components/error/404.vue')

Vue.use(VueRouter)


const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      { path: '/home', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ] },
	
	// 错误路由
	  {path: "/404",name: "404",component: Error,visible: false,},
	  {path: "*",redirect: "/404",visible: false,},

]

const router = new VueRouter({
  routes
})


// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
