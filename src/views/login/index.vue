<template>
  <div class="login-container">
    <div class="title-container">
      <div class="title">
        <img src="@/assets/logo.png" alt="" />
        <h3>测试</h3>
        <!-- <h3>测试数据中台系统</h3> -->
      </div>
    </div>
    <el-form
      v-if="isLogin"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="des">登录</div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入手机号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          prefix-icon="el-icon-user"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          prefix-icon="el-icon-lock"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <div class="info">
        <el-checkbox
          v-model="isRememberTheAccount"
          @change="changeRememberTheAccount"
          >记住账号</el-checkbox
        >
        <div class="forgetThePassword" @click="forgetPassword">忘记密码 ？</div>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        class="login"
        style="width: 100%"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
    </el-form>
    <Forget
      :isForget="isForget"
      :isReset="isReset"
      v-on="handleClickEvent"
    ></Forget>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import Forget from "./forget.vue";
import Cookies from "js-cookie";

const validateUsername = (rule, value, callback) => {
  console.log("🚀 ~ validateUsername ~ value:", value);
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!/^(1[3-9]\d{9})$/.test(value)) {
    callback(new Error("请输入正确的手机号格式"));
  } else {
    callback();
  }
};
const validatePassword = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};

export default {
  name: "Login",
  components: {
    Forget,
  },
  data() {
    return {
      isForget: false,
      isReset: false,
      loginForm: {
        username: Cookies.get("name") || "",
        password: "admin111",
        type: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      isRememberTheAccount: Cookies.get("name") ? true : false,
      isLogin: true,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  computed: {
    handleClickEvent() {
      return {
        submitNext: this.submitNext,
        submitPrevious: this.submitPrevious,
        resetPasswordEvent: this.sureSubmit,
        sureSubmit: this.sureSubmit,
      };
    },
  },
  created() {
    this.loginForm.type = +Cookies.get('type') ? +Cookies.get('type') : 1;
    // this.$store.dispatch("user/authType", this.type)
  },
  methods: {
    forgetPassword() {
      this.isForget = true;
      this.isLogin = false;
    },
    submitPrevious() {
      this.isForget = false;
      this.isLogin = true;
    },
    sureSubmit() {
      this.isReset = false;
      this.isForget = false;
      this.isLogin = true;
    },
    submitNext() {
      this.isReset = true;
      this.isForget = false;
    },
    changeRememberTheAccount() {
      if (this.isRememberTheAccount) {
        Cookies.set("name", this.loginForm.username, { expires: 7 });
      } else {
        Cookies.remove("name");
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // let a = md5(this.loginForm.password);
          // console.log("🚀 ~ this.$refs.loginForm.validate ~ a:", md5(md5(this.loginForm.password)))
          // return
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.loading = false;
              if (+this.loginForm.type === 1) {
                console.log("🚀 ~ .then ~ this.loginForm.type:", this.loginForm.type)
                return this.$router.push({
                  path: "/business",
                });
              }
              return this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: rgba(0, 0, 0, 0.25);
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item__content {
    display: flex;
    // background: #fff;
    // border: 1px solid #d9d9d9;
    // height: inherit;
  }
  .el-input {
    display: inline-block;
    height: 40px;
    background: #fff;
    border: 1px solid #d9d9d9;
    // height: inherit;
    .el-input__inner {
      height: 40px;
      line-height: 40px;
    }

    /* 同时调整图标垂直居中 */
    .el-input__prefix,
    .el-input__suffix {
      line-height: 40px;
    }

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 33px;
      color: #333;
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .getCode {
    input {
      width: 235px;
    }
  }

  .el-form-item {
    border-radius: 5px;
    color: #454545;
    margin-bottom: 28px;
    .el-input__prefix .el-icon-user,
    .el-input__prefix .el-icon-mobile,
    .el-input__prefix .el-icon-message,
    .el-input__prefix .el-icon-lock {
      color: #1890ff; /* 图标颜色 */
      font-size: 14px; /* 图标大小 */
    }
  }
  .el-checkbox {
    display: flex;
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      font-family: Roboto;
      font-size: 14px;
    }
  }
  .el-button {
    border: 1px solid #d9d9d9;
    border-radius: 0px;
  }
  .el-form-item__error {
    padding-top: 11px;
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
$bg: #f0f2f5;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  @include flex;
  flex-direction: column;
  background: url("../../assets/bg.png") no-repeat center center;
  width: 1441px;
  height: 645px;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form,
  .forgetPassword {
    position: relative;
    width: 360px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      @include flex;
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      h3 {
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 33px;
        vertical-align: middle;
        color: #000000d9;
        margin-left: 5px;
      }
    }
  }
  .des {
    font-family: Roboto;
    font-size: 20px;
    line-height: 28px;
    color: #000000d9;
    margin-bottom: 22px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .logo {
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
  .info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
    .forgetThePassword {
      font-size: 14px;
      color: #1890ff;
      cursor: pointer;
    }
  }
  .login {
    height: 40px;
  }
  .next {
    display: flex;
  }
}
</style>
