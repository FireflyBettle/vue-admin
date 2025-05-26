<template>
  <div class="distribute-detail">
    <div v-if="$route.meta" class="header">{{ $route.meta.title }}</div>
    <Detail
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      :filterDataRules="filterDataRules"
      @submitForm="submitForm"
      @handleAvatarSuccess="handleAvatarSuccess"
    >
      <el-button type="primary" @click="expireOrder()">作废</el-button>
    </Detail>
  </div>
</template>

<script>
import Detail from "@/components/Detail/index.vue";

import { orderDetail, expireOrder } from "@/api/order";
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
      filterDataRules: ["discountRate"],
      tableFormAttrs: [
        {
          title: "券码ID:",
          placeholder: "-",
          type: "input",
          value: "voucherId",
          disabled: true,
        },
        {
          title: "金额:",
          type: "input",
          placeholder: "-",
          value: "amount",
          disabled: true,
        },
        {
          title: "券码描述:",
          placeholder: "-",
          type: "textarea",
          value: "voucherDesc",
          disabled: true,
        },
        {
          title: "商户:",
          placeholder: "-",
          type: "input",
          value: "merchantName",
          disabled: true,
        },
        {
          title: "核销门店:",
          placeholder: "-",
          type: "input",
          value: "storeName",
          disabled: true,
        },
        {
          title: "商户结款:",
          placeholder: "-",
          type: "input",
          value: "merchantSettlement",
          inputType: "number",
          disabled: true,
        },
        {
          title: "渠道:",
          placeholder: "-",
          type: "input",
          value: "channelName",
          disabled: true,
        },
        {
          title: "预付款:",
          placeholder: "-",
          type: "input",
          value: "advancePayment",
          disabled: true,
        },
        {
          title: "状态:",
          placeholder: "-",
          type: "input",
          value: "status",
          disabled: true,
        },
        {
          title: "创建时间:",
          placeholder: "-",
          type: "input",
          value: "createTime",
          disabled: true,
        },
        {
          title: "过期时间:",
          placeholder: "-",
          type: "input",
          value: "expireTime",
          disabled: true,
        },
        {
          title: "操作时间:",
          placeholder: "-",
          type: "input",
          value: "operateTime",
          disabled: true,
        },
      ],
    };
  },
  watch: {
    isEdit(val) {
      this.tableFormAttrs.forEach((item) => {
        item.disabled = !val;
        if (item.prop === "shopName") {
          item.disabled = true;
        }
      });
    },
  },
  created() {
    this.getOrderDetail();
  },
  methods: {
    async getOrderDetail() {
      const { data } = await orderDetail({
        voucherId: this.$route.params.id,
      });
      const statusType = {
        0: "待核销",
        1: "已核销",
        2: "冲正",
        3: "作废",
      };
      this.tableForm = data;
      this.tableForm.status = statusType[this.tableForm.status];
      this.tableForm.amount = this.tableForm.amount / 100;
      this.tableForm.advancePayment = this.tableForm.advancePayment / 100;
    },
    async expireOrder() {
      this.$confirm("确认作废吗?", "", {
        type: "warning",
        confirmButtonText: "是",
        cancelButtonText: "否",
      })
        .then(async () => {
          await expireOrder({
            voucherId: this.$route.params.id,
          });
          this.getList();
          this.$message.success("作废成功");
        })
        .catch(() => {
          // this.$message.info(" 已取消作废");
        });
    },
  },
};
</script>

<style lang="scss">
.distribute-detail {
  position: relative;
  .content {
    padding-bottom: 26px;
  }
  .header {
    color: rgba(0, 0, 0, 0.85);
    padding: 0 0 24px 24px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
    background: #fff;
    padding-top: 20px;
  }
}
</style>
