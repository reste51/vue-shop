import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// path 和 component的配置
const routes = [
  { path: '/', redirect: 'login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    component: () => import('../components/Home'),
    redirect: '/home/welcome',
    children: [
      {
        path: '/home/welcome',
        component: () => import('../components/Welcome')
      },
      { path: '/users', component: () => import('../components/user/Users') }
    ]
  }
]
const router = new VueRouter({
  routes
})

/*
路由导航守卫的配置
  to 访问path, from 从哪里来
  next放行函数,调用方式: next(),  next('/login') 强制跳转到login页面
*/
router.beforeEach((to, from, next) => {
  // login 无权限控制, 直接放行
  if (to.path === '/login') return next()
  // 有权限的页面控制, 判断sessionStorage是否存在token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') // 无token则跳转登录页面

  next()
})
export default router
