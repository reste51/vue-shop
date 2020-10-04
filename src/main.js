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

Vue.use(elementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
