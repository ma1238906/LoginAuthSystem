import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/reset.css'
import './assets/css/iconfont.css'
// import './assets/css/iconfont/iconfont.css'
import api from './api/index'
Vue.prototype.$api = api;

Vue.config.productionTip = false
//持久化
let user = localStorage.getItem('user')
if(user)
{
  user = JSON.parse(user);
  console.log(user)
  store.commit('loginModule/setUser',user)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
