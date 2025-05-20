/*
 * @Author: chenyourong
 * @Date: 2025-04-25 16:44:47
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-16 15:49:26
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/router/auth.js
 */
import Layout from '@/layout'

const asyncRoutes = [
    {
    path: '/channel',
    component: Layout,
    redirect: '/channel',
    meta: {
      title: '渠道管理',
      icon: 'el-icon-monitor'
    },
    children: [
      {
        path: '/channel/channelList',
        component: () => import('@/views/channel/channelList/index'),
        name: 'businessList',
        meta: { title: '渠道列表', icon: 'edit' }
      },
      {
        path: '/channel/channelList/:id',
        component: () => import('@/views/channel/channelList/detail'),
        name: 'orderDetail',
        meta: { title: '渠道详情', icon: 'edit',activeMenu: '/channel/channelList' },
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
    children: [
      {
        path: '/distribute/distributeList',
        component: () => import('@/views/distribute/distributeList/index'),
        name: 'distribute',
        meta: { title: '分发列表', icon: 'edit' },
      },
      {
        path: '/distribute/distributeList/:id',
        component: () => import('@/views/distribute/distributeList/detail'),
        name: 'distributeDetail',
        meta: { title: '分发详情', icon: 'edit',activeMenu: '/distribute/distributeList' },
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
    redirect: '/order',
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
        path: '/order/404',
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill',
    meta: {
      title: '账单流水统计',
      icon: 'el-icon-discount'
    },
    children: [
      {
        path: '/bill/businessList',
        component: () => import('@/views/businessManage/businessList/index'),
        name: 'businessList',
        meta: { title: '账单记录', icon: 'edit' }
      },
      {
        path: '/bill/shopList',
        component: () => import('@/views/businessManage/shopList/index'),
        name: 'shopList',
        meta: { title: '流水记录', icon: 'list' }
      }
    ]
  },
];

export default asyncRoutes