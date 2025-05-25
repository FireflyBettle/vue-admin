import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import md5 from 'js-md5';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    type: '', //用户权限 1-平台，2-渠道，3-商户，4-门店
    uid: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, type } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: username.trim(), passwd: md5(md5(password)), type: type }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_TYPE', type);
        commit('SET_TYPE', data.uid);
        setToken(data.token)
        Cookies.set("type", type)
        Cookies.set("username", data.name)
        Cookies.set("avatar", data.avatar)
        Cookies.set("channelId", data.channelId)
        Cookies.set("merchantId", data.merchantId)
        Cookies.set("storeId", data.storeId)
        Cookies.set("uid", data.uid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
    getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // commit('SET_NAME', 'Normal Editor')
        // commit('SET_AVATAR', '')
        let roles = state.type.length ? state.type : +Cookies.get('type');
        commit('SET_ROLES', [roles])
        resolve({
          roles: [roles],
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      commit('SET_ROLES', [])

      resolve()
    })
  },
  //变更角色时动态更新路由表，这个也先复制过来
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)
    const { roles } = await dispatch('getInfo')
    resetRouter()
    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    // dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

