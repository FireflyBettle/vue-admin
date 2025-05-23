/*
 * @Author: chenyourong
 * @Date: 2025-05-23 10:34:54
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-23 18:30:23
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/api/order.js
 */
import request from '@/utils/request'

// 失效订单
export function reverseOrder(data) {
  return request({
    url: '/web/order/expire',
    method: 'post',
    data
  })
}
// 冲正订单
export function expireOrder(data) {
  return request({
    url: '/web/order/reverse',
    method: 'post',
    data
  })
}
// 查询订单列表
export function orderList(data) {
  return request({
    url: '/web/order/list',
    method: 'post',
    data
  })
}
// 查询订单详情
export function orderDetail(data) {
  return request({
    url: '/web/order/detail',
    method: 'post',
    data
  })
}