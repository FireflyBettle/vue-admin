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

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/web/account/logout',
    method: 'get'
  })
}
// 发送短信
export function sendSms(data) {
  return request({
    url: '/web/send/sms',
    method: 'post',
    data
  })
}
// 短信验证码验证
export function verifySms(data) {
  return request({
    url: '/web/verify/sms',
    method: 'post',
    data
  })
}
// 修改账户信息
export function setUserProfile(data) {
  return request({
    url: '/web/user/profile/set',
    method: 'post',
    data
  })
}
// 删除账户信息  ???
export function deleteInfo(data) {
  return request({
    url: '/web/verify/sms',
    method: 'post',
    data
  })
}
// 账户重置密码
export function passwdForget(data) {
  return request({
    url: '/web/passwd/forget',
    method: 'post',
    data
  })
}
// 修改账户信息
export function accountProfile(data) {
  return request({
    url: '/web/account/profile',
    method: 'post',
    data
  })
}
