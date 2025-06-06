/*
 * @Author: chenyourong
 * @Date: 2025-05-12 09:51:02
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-04 16:54:01
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/main.js
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import Cookies from 'js-cookie'; 
 
// // 设置 Cookie，SameSite 属性为 'Strict' 
// Cookies.set('myCookie',  'cookieValue', { 
//     sameSite: 'Strict', 
//     path: '/', // 可选，指定 Cookie 的路径 
//     expires: 7 // 可选，指定 Cookie 的过期时间（天） 
// }); 

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// main.js 
import * as filters from '@/filters'
Object.keys(filters).forEach(key  => {
  Vue.filter(key,  filters[key])
})


// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
