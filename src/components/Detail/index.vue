<template>
  <div class="list-detail">
    <!-- <div class="header">{{ title }}</div> -->
    <div class="content" :class="styleType ? styleType : ''">
      <el-form :model="tableData" :rules="tableDataRules" ref="tableData">
        <el-form-item
          v-for="(item, index) in tableFormAttrs"
          :label="item.title"
          :label-width="formLabelWidth"
          :value="item.required ? item.value : ''"
          :key="index"
          :prop="item.value"
          :required="item.required"
        >
          <!-- 输入框 -->
          <template v-if="item.type === 'input'">
            <el-input
              v-model="tableData[item.value]"
              :type="item.inputType ? item.inputType : 'text'"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
              :ref="item.isClosePwd ? 'password' : ''"
            >
              <template slot="append" v-if="item.slot">{{
                item.slot
              }}</template></el-input
            >
            <template v-if="item.isClosePwd">
              <span class="show-pwd" @click="showPwd(item)">
                <svg-icon
                  :icon-class="
                    passwordType === 'password'
                      ? 'EyeInvisible'
                      : 'EyeInvisible-open'
                  "
                />
              </span>
            </template>
          </template>
          <!-- 上传 -->
          <template v-if="item.type === 'upload'">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :disabled="item.disabled"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="tableData[item.value]"
                :src="tableData[item.value]"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
          <!-- 选择框 -->
          <template v-if="item.type === 'select'">
            <el-select
              v-model="tableData[item.value]"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="val in item.options"
                :key="val.value"
                :label="val.label"
                :value="val.value"
              >
              </el-option>
            </el-select>
          </template>
          <!-- 多文本框 -->
          <template v-if="item.type === 'textarea'">
            <el-input
              v-model="tableData[item.value]"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
              maxlength="100"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              show-word-limit
              @input="handleInput(item)"
            ></el-input>
          </template>
          <template v-if="item.type === 'radio'">
            <el-radio-group
              v-model="tableData.status"
              :disabled="item.disabled"
            >
              <el-radio v-model="tableData[item.value]" label="0"
                >启用</el-radio
              >
              <el-radio v-model="tableData[item.value]" label="1"
                >暂停</el-radio
              >
            </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <slot button="button"></slot>
      <!-- <el-button @click="localDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('tableData')"
        >添 加</el-button
      > -->
    </div>
  </div>
</template>

<script>
// 定义手机号的正则表达式，用于匹配中国手机号格式
const validatePhone = (rule, value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!value) {
    // 如果手机号为空，触发原有的提示信息
    return callback(new Error("请输入手机号"));
  }
  if (!phoneReg.test(value)) {
    // 如果手机号格式不符合正则表达式，给出格式错误的提示
    callback(new Error("请输入正确的手机号"));
  } else {
    // 手机号格式正确，通过验证
    callback();
  }
};
export default {
  props: {
    tableData: {
      type: Object,
      required: true,
    },
    tableFormAttrs: {
      type: Array,
      required: true,
    },
    styleType: {
      type: String,
    },
    formLabelWidth: {
      type: String,
      default: "84px",
    },
    filterDataRules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableDataRules: {
        merchantName: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
        ],
        discountRate: [
          { required: true, message: "请输入折扣率", trigger: "blur" },
        ],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] },
        ],
        shopPerson: [
          { required: true, message: "请选择券码类型", trigger: "blur" },
        ],
        couponType: [
          { required: true, message: "请选择券码类型", trigger: "blur" },
        ],
        couponTime: [
          { required: true, message: "请输入券码有效期", trigger: "blur" },
        ],
      },
      isLimitReached: false,
      passwordType: "",
    };
  },
  created() {
    // 监听输入框的输入事件
    if (this.filterDataRules) {
      this.filterDataRules.forEach((item) => {
        let obj = {};
        obj[item] = this.tableDataRules[item];
        this.tableDataRules = obj;
      });
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$emit("handleAvatarSuccess", file);
    },
    handleInput(item) {
      // 检查是否达到限制
      this.isLimitReached = item.name.length >= 100;

      // 如果超过100个字符，截取前100个
      if (item.name.length > 100) {
        item.name = item.name.substring(0, 100);
      }
    },
    showPwd(item) {
      if (this.passwordType === "password") {
        this.passwordType = "";
        item.inputType = "text";
      } else {
        this.passwordType = "password";
        item.inputType = "password";
      }
      this.$nextTick(() => {
        // item.inputType = 'text';
        console.log(
          "🔍 ~ showPwd ~ src/components/Detail/index.vue:194 ~ this.$refs.password:",
          this.$refs.password
        );
        // this.$refs.password[0].focus();
      });
    },
    getTableRef() {
      return this.$refs.tableData;
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.list-detail {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-top: 24px;
  padding-bottom: 26px;
  .el-button {
    flex: 1;
    overflow: auto;
    width: 60px;
    height: 32px;
    padding: 0;
  }
  .el-dialog__body {
    padding: 24px;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
  }
  .el-select {
    margin-right: 4px;
    .el-input {
      // width: 77px;
      .el-select__caret {
        color: #606266;
      }
      .el-input__suffix {
        top: 3px;
      }
    }
    .is-focus {
      .el-input__suffix {
        top: -6px;
      }
    }
    .el-input__inner {
      padding-right: 15px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 15px;
    color: #8c939d;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .avatar {
    width: 32px;
    height: 32px;
    display: block;
  }
  .avatar-uploader {
    line-height: 14px;
  }
  .el-input__count {
    line-height: 1;
    bottom: -17px;
    right: 0px;
  }
  .el-input,
  .el-textarea {
    width: 484px;
  }
  .header {
    color: rgba(0, 0, 0, 0.85);
    padding: 0 0 24px 24px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
  }
  .content {
    @include flex;
    // margin-top: 24px;
  }
  .footer {
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .dialog {
    .el-input,
    .el-textarea {
      width: 348px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>
