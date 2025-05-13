<template>
  <div class="distribute-detail">
    <div class="header">渠道详情</div>
    <Detail
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      @submitForm="submitForm"
    >
      <template v-slot:="button">
        <template v-if="isEdit">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm()">添 加</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="edit()">编 辑</el-button>
        </template>
      </template>
    </Detail>
  </div>
</template>

<script>
import Detail from "@/components/Detail/index.vue";
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
      tableFormAttrs: [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          prop: "name",
          disabled: true,
        },
        {
          title: "Logo:",
          type: "upload",
          prop: "logo",
          disabled: true,
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          prop: "des",
          disabled: true,
        },
        {
          title: "商户ID:",
          placeholder: "系统自生成",
          type: "input",
          prop: "shopName",
          disabled: true,
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          slot: "%",
          prop: "rate",
          disabled: true,
          required: true,
        },
        {
          title: "联系人:",
          placeholder: "请输入联系人",
          type: "input",
          prop: "contactPerson",
          disabled: true,
        },
        {
          title: "手机号:",
          placeholder: "请输入手机号",
          type: "input",
          prop: "phoneNumber",
          disabled: true,
        },
        {
          title: "邮箱:",
          placeholder: "请输入邮箱",
          type: "input",
          prop: "email",
          disabled: true,
        },
        {
          title: "状态:",
          placeholder: "请输入邮箱",
          type: "radio",
          prop: "status",
          disabled: true,
        },
        {
          title: "密码:",
          placeholder: "请输入密码",
          type: "input",
          prop: "password",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          alert(1);
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