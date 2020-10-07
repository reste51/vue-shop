import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局的样式文件
import './assets/css/global.css'

// 导入第三方icon库
import './assets/fonts/iconfont.css'

// element-ui的使用
import elementUI from 'element-ui'
// 导入样式文件
import 'element-ui/lib/theme-chalk/index.css'

/*
配置 axios,
1.增加 api的 basePath 根路径
2.将对象挂载到 Vue.prototype中, 因此每个vue组件都可以使用 this.$http来操作
*/
import axios from 'axios'

Vue.use(elementUI)
// element ui 弹窗消息,挂载原型中; Message 为其中一个模块(*.js文件)
Vue.prototype.$msg = elementUI.Message

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios // 新增原型属性名为$http  引用axios对象

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
