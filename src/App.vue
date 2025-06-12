<!--
 * @Author: chenyourong
 * @Date: 2025-05-09 15:07:11
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-12 11:15:13
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/App.vue
-->
<template>
  <div id="app" @click="changeName">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return  {
      index: 1
    }
  },
  methods: {
    changeName() {
      this.$store.dispatch('user/changeName')
    }
  }
}
</script>
