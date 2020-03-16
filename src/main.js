import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import './style/reset.css'
// 引入样式重置文件
import 'animate.css/animate.css'
import axios from './utils/axios'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// 将axios挂载在vue的原型上因为组件继承自实例，所以vue原型有的属性组件也有
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/favicon.ico',
  loading: '/timg.gif',
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
