<template>
  <div class="login-container">
    <div class="title-container">
      <div class="title">
        <img src="@/assets/logo.png" alt="" />
        <h3>数据中台系统</h3>
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
          placeholder="请输入手机号或邮箱"
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
        <el-checkbox v-model="isRememberTheAccount">记住账号</el-checkbox>
        <div class="forgetThePassword">忘记密码 ？</div>
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
    <!-- 忘记密码 -->
    <div class="forgetPassword">
      <div class="des">找回密码</div>
      <div>1</div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入手机号或邮箱"
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
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入手机号或邮箱"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111",
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
      isRememberTheAccount: false,
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
  methods: {
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
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
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
    background: #fff;
    border: 1px solid #d9d9d9;
    height: inherit;
  }
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
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
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 28px;
    .el-input__prefix .el-icon-user,
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

  .login-form, .forgetPassword {
    position: relative;
    width: 520px;
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
    }
  }
  .login {
    height: 40px;
  }
}
</style>
