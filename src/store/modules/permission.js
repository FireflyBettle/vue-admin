/*
 * @Author: chenyourong
 * @Date: 2025-04-25 17:19:39
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-04-27 15:51:45
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/store/modules/permission.js
 */
import {
  asyncRoutes,
  constantRoutes
} from '@/router'

// 使用roles:Array<string> 和 route:{path,component,meta:{roles:[]}}
// 判断当前用户能不能访问当前路由规则，返回布尔值。
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
      // 如果路由规则上有meta，并且meta上有roles这个自定义字段，说明这条路由是有权限的，要进行过滤权限。
      return roles.some(role => route.meta.roles.includes(role))
  } else {
      // 如果路由规则上没有meta这个属性，或者meta上没有roles这个自定义字段，任何用户都可以访问。
      return true
  }
}

// 使用roles:Array<string>, 和Ò routes:Array<route> 
// 生成当前用户可访问的路由规则。
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
      // 深复制（深拷贝）仅对那些比较简单对象进行深拷贝
      const tmp = {
          ...route
      }
      // hasPermission(['admin', 'editor'], {path,component,meta:{roles:['editor']}}): boolean
      if (hasPermission(roles, tmp)) {
          // 有没有嵌套视图，如果进行递归
          if (tmp.children) {
              tmp.children = filterAsyncRoutes(tmp.children, roles)
          }
          res.push(tmp)
      }
  })
  return res
}

const state = {
  routes: [], // 静态路由规则 + 当前用户可访问的动态路由规则
  addRoutes: [] // 只是当前用户可访问的动态路由规则
}

const mutations = {
  SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
      console.log("🚀 ~ state.routes:", state.routes)
  }
}

const actions = {
  // 用于生成当前用户可访问的路由规则
  // roles = ['admin', 'editor']
  generateRoutes({
      commit
  }, roles) {
      return new Promise(resolve => {
          let accessedRoutes
          if (roles.includes('admin')) {
              // admin用户
              // 工作经验：工作中的管理系统，admin一般只用看到功能性页面，不需要看那些业务性页面。
              // accessedRoutes = asyncRoutes || []
              accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          } else {
              // 非admin用户
              accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          }
          // 把当前用户可访问的路由规则放在vuex中
          commit('SET_ROUTES', accessedRoutes)
          // 把当前用户可访问的路由规则给到.then()
          resolve(accessedRoutes)
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}