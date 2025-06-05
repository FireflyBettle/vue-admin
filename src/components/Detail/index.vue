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
              }}</template>
              <template slot="append" v-if="item.icon">
                <el-button
                  slot="append"
                  :icon="item.icon"
                  @click="resetSecret"
                ></el-button>
              </template>
            </el-input>
            <template v-if="item.isClosePwd && !item.disabled">
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
          <!-- 图片 -->
          <template v-if="item.type === 'img'">
            <el-image
              :src="tableData[item.value]"
              :preview-src-list="[tableData[item.value]]"
              fit="cover"
              :hide-on-click-modal="true"
            ></el-image>
            <!-- <img @click="enlargeImg(tableData[item.value])" class="img" :src="tableData[item.value]" alt=""> -->
          </template>
          <!-- 上传 -->
          <template v-if="item.type === 'upload'">
            <el-upload
              class="avatar-uploader"
              action="http://www.jifeng.online:8871/web/fs/upload"
              :show-file-list="false"
              :disabled="item.disabled"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="urlImg" :src="urlImg" class="avatar" />

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
          <!-- 多选框 -->
          <template v-if="item.type === 'multipleSelect'">
            <el-cascader
              v-model="tableData[item.value]"
              :options="item.options"
              placeholder="请选择省市区"
              @change="handleAreaChange"
            ></el-cascader>
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
              @input="handleInput(tableData[item.value])"
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
import { uploadImg } from "@/api/business";
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
    isEdit: {
      type: Boolean,
    },
    formLabelWidth: {
      type: String,
      default: "84px",
    },
    merchantLogo: {
      type: String,
      default: "",
    },
    filterDataRules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
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
    const validatePasswd = (rule, value, callback) => {
      const passwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
      if (this.isEdit && !value) {
        console.log("🚀 ~ validatePasswd ~ this.isEdit:", this.isEdit);
        callback();
      }
      if (!value) {
        // 如果手机号为空，触发原有的提示信息
        return callback(new Error("请输入密码"));
      }
      if (!passwd.test(value)) {
        // 如果手机号格式不符合正则表达式，给出格式错误的提示
        callback(new Error("密码至少为8位且包含字符和数字"));
      } else {
        // 手机号格式正确，通过验证
        callback();
      }
    };
    return {
      tableDataRules: {
        passwd: [
          { required: !this.isEdit, message: "请输入密码", trigger: "blur" },
          { validator: validatePasswd, trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
        ],
        merchantId: [
          { required: true, message: "请选择商户", trigger: "blur" },
        ],
        couponAmount: [
          { required: true, message: "请输入券码金额", trigger: "blur" },
        ],
        effectiveTime: [
          { required: true, message: "请输入券码有效期", trigger: "blur" },
        ],
        effectiveTime: [
          { required: true, message: "请输入券码有效期", trigger: "blur" },
        ],
        merchantName: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
        ],
        merchantId: [
          { required: true, message: "请选择商户", trigger: "blur" },
        ],
        channelName: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
        ],
        storeName: [
          { required: true, message: "请输入门店名称", trigger: "blur" },
        ],
        area: [{ required: true, message: "请选择省市区/县", trigger: "blur" }],
        storeAddr: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        merchantId: [
          { required: true, message: "请选择所属商户", trigger: "blur" },
        ],
        // ipWhiteList: [
        //   { required: true, message: "请输入IP白名单", trigger: "blur" },
        // ],
        discountRate: [
          { required: true, message: "请输入折扣率", trigger: "blur" },
        ],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        // phone: [
        //   { required: true, message: "请输入手机号", trigger: "blur" },
        //   { validator: validatePhone, trigger: "blur" },
        // ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"],
          },
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
      urlImg: "",
    };
  },
  created() {
    this.urlImg = this.merchantLogo;
    console.log("🚀 ~ created ~ this.merchantLogo:", this.merchantLogo);
    if (this.filterDataRules.length) {
      let obj = {};
      this.filterDataRules.forEach((item) => {
        Object.keys(this.tableDataRules).forEach((key) => {
          if (key === item) {
            obj[item] = this.tableDataRules[item];
          }
        });
      });
      this.tableDataRules = obj;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.urlImg = this.merchantLogo;
    });
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // 1. 获取文件类型
      const fileType = file.raw.type;

      // 2. 将文件转换为base64
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);

      reader.onload = () => {
        // 3. 获取base64数据（去掉前面的data:image/png;base64,前缀）
        const base64Data = reader.result.split(",")[1];

        // 4. 调用API接口
        uploadImg({
          file_data: base64Data,
        }).then((res) => {
          this.urlImg = res.data.download_url; // 假设返回的URL在res.data.url中
          this.$emit("handleAvatarSuccess", this.urlImg);
        });

        // 5. 预览图片
      };
    },
    enlargeImg(val) {
      this.$emit("enlargeImg", val);
    },
    handleAreaChange(val) {
      this.$emit("handleAreaChange", val);
    },
    resetSecret() {
      this.$emit("resetSecret");
    },
    handleInput(value) {
      // 检查是否达到限制
      this.isLimitReached = value.length >= 100;

      // 如果超过100个字符，截取前100个
      if (value.length > 100) {
        value = value.substring(0, 100);
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
  // padding-bottom: 26px;
  .el-button {
    flex: 1;
    overflow: auto;
    height: 32px;
    line-height: 1;
    padding: 0 10px;
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
  .img,
  .el-image {
    width: 32px !important;
    height: 32px !important;
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
