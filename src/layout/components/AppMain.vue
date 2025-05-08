<!--
 * @Author: chenyourong
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-08 18:30:31
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/layout/components/AppMain.vue
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 170px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
  margin-top: 20px;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
