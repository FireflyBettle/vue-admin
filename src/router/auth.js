/*
 * @Author: chenyourong
 * @Date: 2025-04-25 16:44:47
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-08 18:13:19
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/router/auth.js
 */
import Layout from '@/layout'

const asyncRoutes = [
  {
    path: '/business',
    component: Layout,
    redirect: '/business',
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
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },
];

export default asyncRoutes