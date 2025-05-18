/*
 * @Author: chenyourong
 * @Date: 2025-05-09 15:07:11
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-16 10:54:02
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/api/user.js
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/web/account/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/web/account/logout',
    method: 'get'
  })
}
