<template>
  <div class="order-detail">
    <div v-if="$route.meta" class="header">{{ $route.meta.title }}</div>
    <Detail
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      :formLabelWidth="formLabelWidth"
      @submitForm="submitForm"
    >
      <template v-slot:="button">
        <template v-if="isEdit">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">添加</el-button>
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
export default {
  name: "orderDetail",
  components: {
    Detail,
  },
  data() {
    return {
      isEdit: false,
      tableForm: {},
      formLabelWidth: '100px',
      tableFormAttrs: [
        {
          title: "商户:",
          placeholder: "请选择商户",
          type: "select",
          prop: "name",
          options: [
            {
              value: "选项1",
              label: "黄金糕",
            },
            {
              value: "选项2",
              label: "双皮奶",
            },
            {
              value: "选项3",
              label: "蚵仔煎",
            },
          ],
          disabled: true,
        },
        {
          title: "商户ID:",
          placeholder: "系统自生成",
          type: "input",
          prop: "id",
          disabled: true,
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          slot: "%",
          prop: "rate",
          disabled: true,
        },
        {
          title: "券码类型:",
          placeholder: "请选择券码类型",
          type: "select",
          prop: "couponCodeType",
          required: true,
          options: [
            {
              value: "选项1",
              label: "黄金糕",
            },
            {
              value: "选项2",
              label: "双皮奶",
            },
            {
              value: "选项3",
              label: "蚵仔煎",
            },
          ],
          disabled: true,
        },
        {
          title: "券码有效期:",
          placeholder: "请输入券码有效期",
          type: "input",
          slot: "小时",
          prop: "couponValidTime",
          required: true,
          disabled: true,
        },
        {
          title: "券码描述:",
          placeholder: "请输入渠道描述",
          type: "textarea",
          prop: "couponCodeDescription",
          disabled: true,
        },
        {
          title: "渠道:",
          placeholder: "请选择渠道",
          type: "select",
          prop: "configureChannels",
          options: [
            {
              value: "选项1",
              label: "黄金糕",
            },
            {
              value: "选项2",
              label: "双皮奶",
            },
            {
              value: "选项3",
              label: "蚵仔煎",
            },
          ],
          disabled: true,
        },
        {
          title: "渠道ID:",
          placeholder: "系统自生成",
          type: "input",
          prop: "configureChannelsId",
          disabled: true,
        },
        {
          title: "佣金率:",
          placeholder: "请输入折扣率",
          type: "input",
          slot: "%",
          prop: "commissionRate",
          disabled: true,
        },
        {
          title: "状态:",
          type: "radio",
          prop: "status",
          disabled: true,
        },
        {
          title: "创建金额:",
          placeholder: "请输入创建金额",
          type: "input",
          prop: "createAnAmount",
          disabled: true,
        },
        {
          title: "待核销金额:",
          placeholder: "请输入待核销金额",
          type: "input",
          prop: "amountToBeWrittenOff",
          disabled: true,
        },
        {
          title: "核销金额:",
          placeholder: "请输入核销金额",
          type: "input",
          prop: "writeOffAmount",
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
.order-detail {
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