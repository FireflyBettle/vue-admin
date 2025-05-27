<!--
 * @Author: chenyourong
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-27 16:06:53
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/layout/index.vue
-->
<template>
  <div :class="classObj" class="app-wrapper">
    <div class="bac">
      <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar"
          :src="avatar ? avatar : require('@/assets/index_logo.png')"
          alt=""
        />
            <span class="user-name">{{ username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { Navbar, Sidebar, AppMain } from "./components";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  data() {
    return {
      avatar: Cookies.get("avatar"),
      username: Cookies.get("username"),
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    async logout() {
      const arr = ['/login/platform','/login/channel','/login/merchant','/login/store'];
      await this.$store.dispatch('user/logout')
      this.$router.push(arr[Cookies.get("type") - 1]);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  // height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.bac {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  background: #001529;
  width: 100%;
  height: 48px;
  z-index: 9;
  padding-right: 28px;
  .avatar-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #001529;
    cursor: pointer;
    .user-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 8px;
    }
    .user-name {
      font-family: Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
    }
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
