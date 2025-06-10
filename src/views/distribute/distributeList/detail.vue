<template>
  <div class="distribute-detail">
    <div v-if="$route.meta" class="header">{{ $route.meta.title }}</div>
    <Detail
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      :filterDataRules="filterDataRules"
      formLabelWidth="95px"
      @submitForm="submitForm"
      @handleAvatarSuccess="handleAvatarSuccess"
    >
      <template v-slot:="button">
        <template v-if="isEdit">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存</el-button>
        </template>
        <template v-else>
          <el-button v-if="type !== 2" type="primary" @click="edit()">编辑</el-button>
        </template>
      </template>
    </Detail>
  </div>
</template>

<script>
import Detail from "@/components/Detail/index.vue";

import { distributionDetail, updateDistribution } from "@/api/distribute";
import Cookies from 'js-cookie'
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
      filterDataRules: ['effectiveTime'],
      tableFormAttrs: [
        {
          title: "商户:",
          placeholder: "请输入商户名称",
          type: "input",
          value: "merchantName",
          disabled: true,
        },
        {
          title: "商户ID:",
          placeholder: "请输入商户ID",
          type: "input",
          value: "merchantId",
          disabled: true,
        },
        {
          title: "分发ID:",
          placeholder: "请输入分发ID",
          type: "input",
          value: "distributeId",
          disabled: true,
        },
         {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          value: "discountRate",
          disabled: true,
        },
        {
          title: "券码金额",
          placeholder: "自定义",
          type: "select",
          inputType: "number",
          value: "couponAmount",
          disabled: true,
          options: [
            {
              label: '自定义',
              value: 0
            }
          ]
        },
         {
          title: "券码有效期",
          placeholder: "请输入券码有效期",
          type: "input",
          slot: "小时",
          value: "effectiveTime",
          disabled: true,
          required: true,
        },
        {
          title: "券码描述",
          placeholder: "请输入券码描述",
          type: "input",
          value: "couponDesc",
          disabled: true,
        },
         {
          title: "渠道名称",
          placeholder: "请输入渠道名称",
          type: "input",
          value: "channelName",
          disabled: true,
        },
        {
          title: "渠道ID",
          placeholder: "请输入渠道ID",
          type: "input",
          value: "channelId",
          disabled: true,
        },
        {
          title: "佣金率",
          inputType: "number",
          placeholder: "请输入佣金率",
          type: "input",
          slot: "%",
          value: "commissionRate",
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
          title: "创建金额",
          placeholder: "0",
          type: "input",
          inputType: "number",
          value: "createAmount",
          disabled: true,
        },
        {
          title: "待核销金额",
          placeholder: "0",
          inputType: "number",
          type: "input",
          value: "pendingAmount",
          disabled: true,
        },
        {
          title: "核销金额",
          placeholder: "0",
          inputType: "number",
          type: "input",
          value: "pendedAmount",
          disabled: true,
        },
      ],
      type: +Cookies.get('type'),
    };
  },
  watch: {
    isEdit(val) {
      this.tableFormAttrs.forEach((item) => {
        item.disabled = true;
        if (['effectiveTime', 'couponDesc', 'commissionRate', 'status'].includes(item.value)) {
          item.disabled = val ? false : true;
        }
      });
    },
  },
  created() {
    this.getMerchantDetail();
  },
  methods: {
    async getMerchantDetail() {
      const { data } = await distributionDetail({
        distributeId: this.$route.params.id,
      });
      this.tableForm = data;
      this.tableForm.status = this.tableForm.status.toString();
      this.tableForm.commissionRate = this.tableForm.commissionRate * 100;
      this.tableForm.discountRate = this.tableForm.discountRate * 100;
      // this.tableForm.couponAmount = this.tableForm.couponAmount / 100;
      this.tableForm.couponAmount = 0;
      this.tableForm.createAmount = this.tableForm.createAmount / 100;
      this.tableForm.pendingAmount = this.tableForm.pendingAmount / 100;
      this.tableForm.pendedAmount = this.tableForm.pendedAmount / 100;
    },
    async submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        console.log(valid);
        if (valid) {
          const params = {
            distributeId: this.$route.params.id,
            merchantId: this.tableForm.merchantId,
            couponAmount: this.tableForm.couponAmount * 100,
            couponDesc: this.tableForm.couponDesc,
            effectiveTime: +this.tableForm.effectiveTime,
            channelId: this.tableForm.channelId,
            storeIds: this.tableForm.storeIds,
            status: +this.tableForm.status,
            commissionRate: this.tableForm.commissionRate / 100,
          }
          // params.discountRate = this.tableForm.discountRate / 100;
          // params.status = +this.tableForm.status
          // params.passwd  = this.tableForm.passwd ? md5(md5(this.tableForm.passwd)) : md5(md5(''));
          updateDistribution(params).then((res) => {
            if (res.code === 0) {
              this.$message.success("修改成功");
              this.isEdit = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAvatarSuccess(file) {
      this.tableForm.merchantLogo = URL.createObjectURL(file.raw);
    },
    cancel() {
      this.isEdit = false;
      this.tableFormAttrs.forEach((item) => {
        item.disabled = true;
      });
    },
    edit() {
      this.isEdit = true;
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