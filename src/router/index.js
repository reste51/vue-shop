import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', name: 'login', component: () => import('../components/Login') }
]

export default new VueRouter({
  routes
})
