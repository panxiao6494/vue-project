import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'
import moment from 'moment'

Vue.filter('dateFormat', () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
})
Vue.component('tree-table', TreeTable)
// 引入全局样式
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  'render': h => h(App)
}).$mount('#app')
