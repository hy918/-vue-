import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/home'


Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
     redirect:'/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})

router.beforeEach((to,from,next)=>{
 // 访问登录页，放行
 if (to.path === '/login') return next()
 // 获取token
 const tokenStr = window.sessionStorage.getItem('token')
 // 没有token, 强制跳转到登录页
 if (!tokenStr) return next('/login')
 next()
})

export default router;
