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
          placeholder="请输入手机号"
          name="phone"
          type="number"
          tabindex="1"
          auto-complete="on"
          maxlength="11"
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
          maxlength="6"
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
          class="login"
          style="width: 100%"
          @click.native.prevent="submitPrevious"
          >取消找回</el-button
        >
        <el-button
          :loading="nextLoading"
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
          placeholder="请输入密码(至少8位字符)"
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
          class="login"
          style="width: 100%"
          @click.native.prevent="cannelReset"
          >取消重置</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          class="login"
          style="width: 100%"
          @click.native.prevent="sureSubmit"
          >确认</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  sendSms,
  verifySms,
  passwdForget,
  accountProfile,
  setUserProfile,
  deleteInfo,
} from "@/api/user";
import md5 from "js-md5";
import { getPathParam } from '@/utils'

export default {
  name: "forget",
  props: {
    isForget: {
      type: Boolean,
      default: false,
    },
    isReset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error("请输入密码"));
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,}$/.test(value)) {
        callback(new Error("密码至少为8位且包含字符和数字"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error("请输入密码"));
      } else if (value !== this.resetForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请输入手机号"));
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号"));
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
      // isReset: false,

      forgetForm: {
        phone: "",
        code: "",
      },
      forgetRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
      },
      // isForget: false,
      isSendingCode: false,
      nextLoading: false,
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
    // 重置
    sureSubmit() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          passwdForget({
            type: getPathParam(),
            phone: this.forgetForm.phone.toString(),
            passwd: md5(md5(this.resetForm.password)),
            smsToken: this.sms_token,
          }).then((res) => {
            this.$emit("sureSubmit");
            this.isSendingCode = false;
            this.countdown = 0;
            this.$router.push({ path: this.redirect || "/" });
            this.loading = false;
          });

          // this.$emit("submitNext");
          // this.loading = true;
          // this.$store
          //   .dispatch("user/login", this.resetForm)
          //   .then(() => {
          //     this.$router.push({ path: this.redirect || "/" });
          //     this.loading = false;
          //   })
          //   .catch(() => {
          //     this.loading = false;
          //   });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击发送验证码
    sendCode() {
      this.$refs.forgetForm.validateField("phone", (valid) => {
        if (!valid) {
          this.isSendingCode = true;
          this.nextLoading = false;
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
          sendSms({
            phone: this.forgetForm.phone,
            sign: md5(this.forgetForm.phone + "|qifutong"),
          })
            .then((res) => {
              this.$message.success("验证码发送成功");
            })
            .catch((err) => {
              this.$message.error(err);
            });
        }
      });
    },
    submitPrevious() {
      this.isSendingCode = false;
      this.countdown = 0;
      this.nextLoading = false;
      this.$emit("submitPrevious");
    },
    // 下一步
    submitNext() {
      this.$refs.forgetForm.validate((valid) => {
        if (valid) {
          this.nextLoading = true;
          verifySms({
            phone: this.forgetForm.phone.toString(),
            code: "666666",
          })
            .then((res) => {
              this.sms_token = res.data.sms_token;
              if (res.data) {
                this.$emit("submitNext");
                this.nextLoading = false;
              } else {
                this.$message.error("验证码错误");
                this.nextLoading = false;
              }
            })
            .catch((err) => {
              this.$message.error(err);
            });
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
    cannelReset() {
      this.isSendingCode = false;
      this.countdown = 0;
      this.loading = false;
      this.$emit("sureSubmit");
    },
  },
};
</script>

<style lang="scss">
.forget {
  width: 360px;
  .el-form-item:nth-child(3) {
    margin-bottom: 69px !important;
  }
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
