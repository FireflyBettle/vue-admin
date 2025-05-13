<template>
  <div class="list-detail">
    <!-- <div class="header">{{ title }}</div> -->
    <div class="content" :class="styleType ? styleType : ''">
      <el-form :model="tableData" :rules="tableDataRules" ref="tableData">
        <el-form-item
          v-for="(item, index) in tableFormAttrs"
          :label="item.title"
          :label-width="formLabelWidth"
          :prop="item.required ? item.prop : ''"
          :key="index"
        >
          <!-- 输入框 -->
          <template v-if="item.type === 'input'">
            <el-input
              v-model="tableData[item.prop]"
              autocomplete="off"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
            >
              <template slot="append" v-if="item.slot">{{
                item.slot
              }}</template>
              ></el-input
            >
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
              <img v-if="tableData[item.prop]" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
          <!-- 多文本框 -->
          <template v-if="item.type === 'textarea'">
            <el-input
              v-model="item.name"
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
              <el-radio v-model="tableData[item.prop]" label="1">启用</el-radio>
              <el-radio v-model="tableData[item.prop]" label="2">暂停</el-radio>
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
    styleType:{
      type: String,
    },
  },
  data() {
    return {
      imageUrl: "",
      formLabelWidth: "84px",
      tableDataRules: {
        name: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        rate: [{ required: true, message: "请输入折扣率", trigger: "blur" }],
        contactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
      isLimitReached: false,
      passwordType: "password",
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.tableData.logo = this.imageUrl;
    },
    handleInput(item) {
      // 检查是否达到限制
      this.isLimitReached = item.name.length >= 100;

      // 如果超过100个字符，截取前100个
      if (item.name.length > 100) {
        item.name = item.name.substring(0, 100);
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
}
</style>