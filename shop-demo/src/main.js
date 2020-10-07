// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ZkTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.use(ZkTable)

Vue.use(ElementUI);
// 挂在到Vue实例，后面可通过this调用
// 配置请求根路径
// 本机地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'


axios.interceptors.request.use(config =>{
 
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
// 远程后台地址
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

Vue.config.productionTip = false


// 格式化时间
Vue.filter('dateFormat', originVal=>{
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m =( dt.getMonth()+1+"").padStart(2,'0')
  const d =( dt.getDate()+"").padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

   // yyyy-mm-dd hh:mm:ss
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
