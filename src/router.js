import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome'
import User from './components/user/User'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome', children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User }
      ]
    },

  ]
})
router.beforeEach((to, from, next) => { //路由守卫，设置登录拦截
  if (to.path === '/login') return next()
  const keyToken = sessionStorage.getItem('token')
  if (!keyToken) return next('/login')
  next()
})
export default router
