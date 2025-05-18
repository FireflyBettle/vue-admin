/*
 * @Author: chenyourong
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-16 18:32:08
 * @Description: 
 * @FilePath: /vue-admin-template-master/mock/user.js
 */

// const tokens = {
//   admin: {
//     token: 'admin-token'
//   },
//   editor: {
//     token: 'editor-token'
//   }
// }
const tokens = ['admin-token', 'editor-token']

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin122'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/web/account/login',
    type: 'post',
    response: (config) => {
      const { type } = config.body
      const token = tokens[type-1]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 0,
        data: {
          token: token,
          name: 'test',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          roles: ['admin'],
        }
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 0,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/web/account/logout',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]
