import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios'

// 配置请求根路径
// 接口地址
axios.defaults.baseURL = 'http://212.64.72.253:3000/api/private/v1/'
// 挂在到Vue实例，通过this调用
Vue.prototype.$http = axios



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
