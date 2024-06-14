import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/MainPage.vue'
import Test from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import UserAdmin from '@/components/admin/UserAdmin.vue'
import DataAdmin from '@/components/admin/DataAdmin.vue'
import Home from '@/components/user/Home.vue'
import UserHome from '@/components/user/UserHome.vue'
import Notice from '@/components/user/Notice.vue'
import NoticeSender from '@/components/user/NoticeSender.vue'

import MainData from '@/components/function/MainData.vue'
import UnderwaterSystem from '@/components//function/UnderwaterSystem.vue'
import DataCenter from '@/components/function/DataCenter.vue'
import IntelligenceCenter from '@/components/function/IntelligenceCenter.vue'

Vue.use(Router)

const routes = {
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'Login',
      component: Test
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'admin',
          component: UserAdmin
        },
        {
          path: 'datas',
          component: DataAdmin
        },
        {
          path: 'userhome',
          component: UserHome
        },
        {
          path: 'main-data',
          name: 'main-data',
          component: MainData
        },
        {
          path: 'underwater-system',
          name: 'underwater-system',
          component: UnderwaterSystem
        },
        {
          path: 'data-center',
          name: 'data-center',
          component: DataCenter
        },
        {
          path: 'intelligence-center',
          name: 'intelligence-center',
          component: IntelligenceCenter
        },
        {
          path: 'notice',
          name: 'notice',
          component: Notice
        },
        {
          path: 'notice_sender',
          name: 'notice_sender',
          component: NoticeSender
        }
      ]
    }
  ]
}

const router = new Router(routes)

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login' || to.path === '/register' || to.path === '/home/userhome') {
    next()
  } else {
    // 从本地存储里获取token
    let token = localStorage.getItem('token')
    // 判断token是否为空如果为空则跳转到登录页 如果有则放行
    if (token === null || token === '') {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
