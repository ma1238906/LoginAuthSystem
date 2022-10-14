import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout/index.vue'
import Home from '../views/Home/index.vue'
import Login from '../views/Login/Login.vue'
//异步
const Goods = () => import('../views/Goods/Goods.vue')

//子集路由
const LoginInfo = () => import('../views/LoginInfo/LoginInfo.vue')
const ClientInfo = () => import('../views/ClientInfo/ClientInfo.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Layout,
    meta: {
      isLogin: true
    },
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/goods',
        name: 'Goods',
        component: Goods
      },
      {
        path: '/loginInfo',
        name: 'LoginInfo',
        component: LoginInfo
      },
      {
        path: '/clientInfo',
        name: 'ClientInfo',
        component: ClientInfo
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

//获取vuex数据 判断是否已经登陆
import store from '../store/index'

//路由拦截
router.beforeEach((to, from, next) => {
  //1.判断是否需要登录
  if (to.matched.some(ele => ele.meta.isLogin)) {
    //2. 判断当前的用户是否已经登陆
    let token = store.state.loginModule.userinfo.token;
    if (token) {
      next();
    }
    else {
      next('/login');
      //next();
    }
  }
  else //不需要登陆
  {
    next();
  }
})

export default router
