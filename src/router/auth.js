/*
 * @Author: chenyourong
 * @Date: 2025-04-25 16:44:47
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-26 17:26:06
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/router/auth.js
 */
import Layout from '@/layout'
import Cookies from "js-cookie";
import { getPathParam } from '@/utils'
// const urlType = getUrlParam(window.location.href,"type");
const type = getPathParam() || +Cookies.get("type"); // 默认值为1
console.log("🚀 ~ type:", type)



const asyncRoutes = [
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      hidden: [1].includes(type),
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index'),
          name: 'Dashboard',
          meta: { title: '总览', icon: 'dashboard', affix: true,roles:[2,3,4] }
        }
      ]
    },
    {
      path: '/business',
      component: Layout,
      redirect: '/business/businessList',
      alwaysShow: true,
      hidden: [2].includes(type),
      meta: {
        title: '商户管理',
        icon: 'el-icon-school',
      },
      children: [
        {
          path: '/business/businessList',
          component: () => import('@/views/businessManage/businessList/index'),
          name: 'businessList',
          meta: { title: '商户列表', icon: 'edit',roles: [1, 4] }
        },
        {
          path: '/business/shopList',
          component: () => import('@/views/businessManage/shopList/index'),
          name: 'shopList',
          meta: { title: '门店列表', icon: 'list',roles: [1,3] }
        },
        {
          path: '/business/businessList/:id',
          component: () => import('@/views/businessManage/businessList/detail'),
          name: 'businessDetail',
          meta: { title: '商户详情', icon: 'edit',activeMenu: '/business/businessList', roles: [1, 4] },
          hidden: true,
        },
      ]
    },
    {
      path: '/channel',
      component: Layout,
      redirect: '/channel/channelList',
      hidden: [2,3,4].includes(type),
      meta: {
        title: '渠道管理',
        icon: 'el-icon-monitor'
      },
      children: [
        {
          path: '/channel/channelList',
          component: () => import('@/views/channel/channelList/index'),
          name: 'businessList',
          meta: { title: '渠道列表', icon: 'edit',roles: [1,2] }
        },
        {
          path: '/channel/channelList/:id',
          component: () => import('@/views/channel/channelList/detail'),
          name: 'orderDetail',
          meta: { title: '渠道详情', icon: 'edit',activeMenu: '/channel/channelList',roles: [1,2] },
          hidden: true,
        },
        {
          path: '/distribute/404',
        }

      ]
  },
  {
    path: '/distribute',
    component: Layout,
    redirect: '/distribute/distributeList',
    meta: {
      title: '分发管理',
      icon: 'el-icon-wallet'
    },
    hidden: [3,4].includes(type),
    children: [
      {
        path: '/distribute/distributeList',
        component: () => import('@/views/distribute/distributeList/index'),
        name: 'distribute',
        meta: { title: '分发列表', icon: 'edit',roles: [1,2] },
      },
      {
        path: '/distribute/distributeList/:id',
        component: () => import('@/views/distribute/distributeList/detail'),
        name: 'distributeDetail',
        meta: { title: '分发详情', icon: 'edit',activeMenu: '/distribute/distributeList',roles: [1,2] },
        hidden: true,
      },
      {
        path: '/distribute/404',
      }

    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderList',
    meta: {
      title: '订单管理',
      icon: 'el-icon-news'
    },
    children: [
      {
        path: '/order/orderList',
        component: () => import('@/views/order/orderList/index'),
        name: 'orderList',
        meta: { title: '订单列表', icon: 'edit' }
      },
      {
        path: '/order/orderList/:id',
        component: () => import('@/views/order/orderList/detail'),
        name: 'orderListDetail',
        meta: { title: '订单详情', icon: 'edit',activeMenu: '/order/orderList' },
        hidden: true,
      },
      {
        path: '/order/404',
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/billRecord',
    meta: {
      title: '账单流水统计',
      icon: 'el-icon-discount'
    },
    children: [
      // {
      //   path: '/bill/billRecord',
      //   component: () => import('@/views/bill/billRecord/index'),
      //   name: 'billRecord',
      //   meta: { title: '账单记录', icon: 'edit' }
      // },
      {
        path: '/bill/runningRecord',
        component: () => import('@/views/bill/runningRecord/index'),
        name: 'runningRecord',
        meta: { title: '流水记录', icon: 'el-icon-discount' }
      }
    ]
  },
  {
    path: '/core',
    component: Layout,
    redirect: '/core/coreMetrics',
    meta: {
      title: '核心指标',
      icon: 'el-icon-s-data'
    },
    hidden: [2,3,4].includes(type),
    children: [
      {
        path: '/core/coreMetrics',
        component: () => import('@/views/core/coreMetrics/index'),
        name: 'coreMetrics',
        meta: { title: '核心指标', icon: 'el-icon-s-data' }
      },
    ]
  },
];

export default asyncRoutes