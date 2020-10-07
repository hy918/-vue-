import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/home'
import Welcome from '@/components/welcome'
import User from '@/components/user/users'
import Rights from '@/components/power/rights'
import Roles from '@/components/power/roles'
import Cate from '@/components/goods/cate'
import Params from '@/components/goods/params'
import GoodsList from '@/components/goods/goodList'
import Add from '@/components/goods/add'



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
      component: Home,
      redirect: '/welcome',
      children: [
        {
        path:'/welcome',
        name: 'Welcome',
        component:Welcome
      },{
        path:'/users',
        component:User
      },{
        path:'/rights',
        component:Rights
      },{
        path:'/roles',
        component:Roles
      },{
        path:'/categories',
        component:Cate
      },{
        path: '/params',
        component:Params
      },
      {
        path: '/goods',
        component:GoodsList
      },
      {
        path: '/goods/add',
        component:Add
      }
    ]
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
