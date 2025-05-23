/*
 * @Author: chenyourong
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-15 18:09:15
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/router/index.js
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import syncRoutes from './auth.js'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
{
    path: '/',
    component: Layout,
    redirect: '/business/businessList',
    meta: {
      title: '商户管理',
      icon: 'el-icon-school'
    },
    children: [
      {
        path: '/business/businessList',
        component: () => import('@/views/businessManage/businessList/index'),
        name: 'businessList',
        meta: { title: '商户列表', icon: 'edit' }
      },
      {
        path: '/business/shopList',
        component: () => import('@/views/businessManage/shopList/index'),
        name: 'shopList',
        meta: { title: '门店列表', icon: 'list' }
      },
      {
        path: '/business/businessList/:id',
        component: () => import('@/views/businessManage/businessList/detail'),
        name: 'businessDetail',
        meta: { title: '商户详情', icon: 'edit',activeMenu: '/business/businessList' },
        hidden: true,
      },
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
]

export const asyncRoutes = [
  ...syncRoutes,
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
