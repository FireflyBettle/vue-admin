<template>
  <div class="distribute-detail">
    <div v-if="$route.meta" class="header">{{ $route.meta.title }}</div>
    <Detail
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      :filterDataRules="filterDataRules"
      @submitForm="submitForm"
    >
      <template v-slot:="button">
        <template v-if="isEdit">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="edit()">编辑</el-button>
        </template>
      </template>
    </Detail>
  </div>
</template>

<script>
import Detail from "@/components/Detail/index.vue";

import { merchantDetail } from "@/api/business";
export default {
  name: "distributeDetail",
  components: {
    Detail,
  },
  data() {
    return {
      isEdit: false,
      tableForm: {
        name: "",
        des: "",
        logo: "",
        des: "",
        shopName: "",
        rate: "",
        contactPerson: "",
        phoneNumber: "",
        email: "",
        status: "1",
        password: "",
      },
      filterDataRules: ['merchantName'],
      tableFormAttrs: [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          value: "merchantName",
          disabled: true,
        },
        {
          title: "Logo:",
          type: "upload",
          value: "merchantLogo",
          disabled: true,
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          value: "merchantDesc",
          disabled: true,
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          value: "discountRate",
          // disabled: true,
          required: true,
        },
        {
          title: "联系人:",
          placeholder: "请输入联系人",
          type: "input",
          value: "contact",
          disabled: true,
        },
        {
          title: "手机号:",
          placeholder: "请输入手机号",
          type: "input",
          value: "phone",
          inputType: "number",
          disabled: true,
        },
        {
          title: "邮箱:",
          placeholder: "请输入邮箱",
          type: "input",
          value: "email",
          disabled: true,
        },
        {
          title: "状态:",
          placeholder: "请输入邮箱",
          type: "radio",
          value: "status",
          disabled: true,
        },
        {
          title: "密码:",
          placeholder: "请输入密码",
          type: "input",
          inputType: "text",
          value: "passwd",
          isClosePwd: false,
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.getMerchantDetail();
  },
  methods: {
    async getMerchantDetail() {
      const { data } = await merchantDetail({
        merchantId: this.$route.params.id,
      });
      this.tableForm = data;
      this.tableForm.status = this.tableForm.status.toString();
    },
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.isEdit = false;
      this.tableFormAttrs.forEach((item) => {
        item.disabled = true;
      });
    },
    edit() {
      this.isEdit = true;
      this.tableFormAttrs.forEach((item) => {
        item.disabled = false;
        if (item.prop === "shopName") {
          item.disabled = true;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.distribute-detail {
  position: relative;
  .header {
    color: rgba(0, 0, 0, 0.85);
    padding: 0 0 24px 24px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
    background: #fff;
    padding-top: 20px;
  }
}
</style>
