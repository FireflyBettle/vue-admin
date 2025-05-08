<template>
  <div class="forget">
    <!-- 忘记密码 -->
    <el-form
      v-if="isForget"
      ref="forgetForm"
      :model="forgetForm"
      :rules="forgetRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="des">忘记密码</div>
      <el-form-item prop="phone">
        <el-input
          v-model="forgetForm.phone"
          placeholder="请输入手机号或邮箱"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
          prefix-icon="el-icon-mobile"
        />
      </el-form-item>

      <el-form-item prop="code">
        <el-input
          prop="code"
          v-model="forgetForm.code"
          type="number"
          placeholder="请输入验证码"
          name="code"
          tabindex="2"
          auto-complete="on"
          prefix-icon="el-icon-message"
          class="getCode"
          @keyup.enter.native="handleLogin"
        />
        <el-button
          :loading="isSendingCode"
          class="login"
          style="width: 100%; flex: auto; margin-left: 10px"
          @click="sendCode"
          >{{ buttonText }}</el-button
        >
      </el-form-item>
      <div class="next">
        <el-button
          :loading="loading"
          class="login"
          style="width: 100%"
          @click.native.prevent="submitPrevious"
          >取消找回</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          class="login"
          style="width: 100%"
          @click.native.prevent="submitNext"
          >下一步</el-button
        >
      </div>
    </el-form>

    <!-- 重置密码 -->
    <el-form
      v-if="isReset"
      ref="resetForm"
      :model="resetForm"
      :rules="resetRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="des">重置密码</div>
      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="resetForm.password"
          placeholder="请输入密码(至少6位字符)"
          name="password"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="resetPassword">
        <el-input
          :key="resetPasswordType"
          ref="resetPassword"
          v-model="resetForm.resetPassword"
          :type="resetPasswordType"
          placeholder="确认密码"
          name="resetPassword"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <div class="next">
        <el-button
          :loading="loading"
          class="login"
          style="width: 100%"
          @click.native.prevent="submitPrevious"
          >取消重置</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          class="login"
          style="width: 100%"
          @click.native.prevent="sure"
          >确认</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "forget",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入密码"));
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
    const validatePhone = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请输入手机号或邮箱"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      resetForm: {
        password: "",
        resetPassword: "",
      },
      resetRules: {
        password: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        resetPassword: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      resetPasswordType: "password",
      redirect: undefined,
      isRememberTheAccount: false,
      isReset: false,


      forgetForm: {
        phone: "",
        code: "",
      },
      forgetRules: {
        phone: [
          { required: true, trigger: "blur", validator: validatePhone },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
      },
      isForget: false,
      isSendingCode: false,
      buttonText: "发送验证码",
      countdown: 0,
    };
  },
  methods: {
    showPwd() {
      if (this.resetPasswordType === "password") {
        this.resetPasswordType = "";
      } else {
        this.resetPasswordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.resetPassword.focus();
      });
    },
    sure() {
      this.$refs.resetForm.validate((valid) => {
        console.log("🚀 ~ this.$refs.resetForm.validate ~ valid:", valid)
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.resetForm)
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
    sendCode() {
      this.$refs.forgetForm.validateField("phone", (valid) => {
        console.log(
          "🚀 ~ this.$refs.forgetForm.validateField ~ this.$refs.forgetForm:",
          this.$refs.forgetForm
        );
        console.log("🚀 ~ this.$refs.forgetPassword.validate ~ valid:", !valid);
        if (!valid) {
          this.isSendingCode = true;
          this.buttonText = "60s后重试";
          this.countdown = 60;
          let timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--;
              this.buttonText = `${this.countdown}s 后重试`;
            } else {
              clearInterval(timer);
              this.isSendingCode = false;
              this.buttonText = "发送验证码";
            }
          }, 1000);
          // 这里调用发送验证码的接口
          // axios.post('/sendCode',  { phone: this.loginForm.phone  })
          //   .then(response => {
          //     // 处理响应
          //   })
          //   .catch(error => {
          //     // 处理错误
          //   });
        }
      });
    },
    sendCode() {
      this.$refs.forgetForm.validateField("phone", (valid) => {
        console.log(
          "🚀 ~ this.$refs.forgetForm.validateField ~ this.$refs.forgetForm:",
          this.$refs.forgetForm
        );
        console.log("🚀 ~ this.$refs.forgetPassword.validate ~ valid:", !valid);
        if (!valid) {
          this.isSendingCode = true;
          this.buttonText = "60s后重试";
          this.countdown = 60;
          let timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--;
              this.buttonText = `${this.countdown}s 后重试`;
            } else {
              clearInterval(timer);
              this.isSendingCode = false;
              this.buttonText = "发送验证码";
            }
          }, 1000);
          // 这里调用发送验证码的接口
          // axios.post('/sendCode',  { phone: this.loginForm.phone  })
          //   .then(response => {
          //     // 处理响应
          //   })
          //   .catch(error => {
          //     // 处理错误
          //   });
        }
      });
    },
    submitNext() {
      this.$refs.forgetForm.validate((valid) => {
        console.log("🚀 ~ this.$refs.forgetForm.validate ~ valid:", valid);
        if (valid) {
          // 调用登录接口
          // axios.post('/login',  this.loginForm)
          //   .then(response => {
          //     // 处理响应
          //   })
          //   .catch(error => {
          //     // 处理错误
          //   });
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.forget {
  width: 360px;
  .des {
    font-family: Roboto;
    font-size: 20px;
    line-height: 28px;
    color: #000000d9;
    margin-bottom: 22px;
  }
  .login {
    height: 40px;
  }
  .next {
    display: flex;
  }
}
</style>
