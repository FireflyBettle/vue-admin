<template>
  <!-- 添加商户 -->
  <el-dialog title="添加商户" :visible.sync="localDialogVisible" width="572px">
    <el-form
      :model="tableData"
      :rules="tableDataRules"
      ref="tableData"
      @click.native="alert(22)"
    >
      <el-form-item
        v-if="tableData.name || tableData.name == ''"
        label="商户名称:"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-input
          v-model="tableData.name"
          autocomplete="off"
          placeholder="请输入商户名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="tableData.logo || tableData.logo == ''"
        label="Logo:"
        :label-width="formLabelWidth"
      >
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        v-if="tableData.des || tableData.des == ''"
        label="商户描述:"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="tableData.des"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          maxlength="100"
          autocomplete="off"
          placeholder="请输入商户描述"
          show-word-limit
          @input="handleInput"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="tableData.shopName || tableData.shopName == ''"
        label="商户ID:"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="tableData.shopName"
          autocomplete="off"
          placeholder="系统自生成"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="tableData.rate || tableData.rate == ''"
        label="折扣率:"
        :label-width="formLabelWidth"
        prop="rate"
      >
        <el-input
          v-model="tableData.rate"
          autocomplete="off"
          placeholder="请输入折扣率"
        >
          <template slot="append">%</template></el-input
        >
      </el-form-item>
      <el-form-item
        v-if="tableData.contactPerson || tableData.contactPerson == ''"
        label="联系人:"
        :label-width="formLabelWidth"
        prop="contactPerson"
      >
        <el-input
          v-model="tableData.contactPerson"
          autocomplete="off"
          placeholder="请输入联系人"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="tableData.phoneNumber || tableData.phoneNumber == ''"
        label="手机号:"
        :label-width="formLabelWidth"
        prop="phoneNumber"
      >
        <el-input
          v-model="tableData.phoneNumber"
          autocomplete="off"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="tableData.email || tableData.email == ''"
        label="邮箱:"
        :label-width="formLabelWidth"
        prop="email"
      >
        <el-input
          v-model="tableData.email"
          autocomplete="off"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="tableData.status || tableData.status == ''"
        label="状态:"
        :label-width="formLabelWidth"
      >
        <el-radio-group v-model="tableData.status">
          <el-radio label="启用"></el-radio>
          <el-radio label="暂停"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="tableData.password || tableData.password == ''"
        label="密码:"
        prop="password"
        :label-width="formLabelWidth"
      >
        <el-input
          :key="passwordType"
          ref="password"
          v-model="tableData.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="
              passwordType === 'password' ? 'EyeInvisible' : 'EyeInvisible-open'
            "
          />
        </span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="localDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('tableData')"
        >添 加</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      required: true,
    },
    dialogFormVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localDialogVisible: this.dialogVisible,
      formLabelWidth: "125px",
      imageUrl: "",
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
  watch: {
    dialogFormVisible(newVal) {
      this.localDialogVisible = newVal;
    },
    localDialogVisible(newVal) {
      this.$emit("changeDialogFormVisible", newVal);
    },
  },
  methods: {
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleInput() {
      // 检查是否达到限制
      this.isLimitReached = this.textarea1.length >= 100;

      // 如果超过100个字符，截取前100个
      if (this.textarea1.length > 100) {
        this.textarea1 = this.textarea1.substring(0, 100);
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("submitForm", this.tableData);
          this.dialogFormVisible = false;
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
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  .el-button {
    flex: 1;
    overflow: auto;
    width: 60px;
    height: 32px;
    padding: 0;
  }
  .el-dialog__body {
    padding: 30px 24px;
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
    width: 348px;
  }
}
</style>
