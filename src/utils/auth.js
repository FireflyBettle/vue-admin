/*
 * @Author: chenyourong
 * @Date: 2025-05-16 18:30:22
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-28 12:19:24
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/utils/auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
