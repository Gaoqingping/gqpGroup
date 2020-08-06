import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/global.css";
// 导入字体图标
import "./assets/fonts/iconfont.css";

import axios from "axios";

//引入加载进度条
// 导入NProgress, 包对应的JS和CSS
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置请求根路径
// 接口地址
axios.defaults.baseURL = "http://212.64.72.253:3000/api/private/v1/";

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use((config) => {
  NProgress.start();
  console.log(config);
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须 return config
  return config;
});

// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});

// 挂在到Vue实例，通过this调用
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
