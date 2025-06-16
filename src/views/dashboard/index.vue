<template>
  <div class="dashboard-detail">
    <div v-if="$route.meta" class="header">{{ title }}</div>
    <Detail
      v-if="Object.keys(tableForm).length"
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      :filterDataRules="filterDataRules"
      :merchantLogo="tableForm.merchantLogo"
      formLabelWidth="98px"
    >
    </Detail>
  </div>
</template>

<script>
import Detail from "@/components/Detail/index.vue";
import Cookies from "js-cookie";
import { channelDetail } from "@/api/channel.js";
import { merchantDetail, batchStoreInformation } from "@/api/business";
export default {
  name: "channelDetail",
  components: {
    Detail,
  },
  data() {
    return {
      title: "",
      tableForm: {},
      tableFormAttrs: [],
      filterDataRules: [""],
      type: "",
    };
  },
  created() {
    // type为3 商户 , 4为门店
    this.type = +Cookies.get("type");
    // type为2渠道
    if ([2].includes(this.type)) {
      this.title = "渠道详情";
      this.getChannelDetail();
    }
    if ([3].includes(this.type)) {
      this.title = "商户详情";
      this.getMerchantDetail();
    }
    if ([4].includes(this.type)) {
      this.title = "门店详情";
      this.getStoreDetail();
    }

    // this.getMerchantDetail();
  },
  methods: {
    commonFilter() {
      this.tableForm.status = this.tableForm.status ? this.tableForm.status.toString(): '';
      this.tableForm.discountRate = this.tableForm.discountRate ? this.tableForm.discountRate * 100 : '';
      this.tableForm.predepositAmount = this.tableForm.predepositAmount ? this.tableForm.predepositAmount / 100 : '';
      this.tableForm.availablePredeposit = this.tableForm.availablePredeposit ? 
        this.tableForm.availablePredeposit / 100 : '';
      this.tableForm.lockedPredeposit = this.tableForm.lockedPredeposit ? this.tableForm.lockedPredeposit / 100 : '';
    },
    async getStoreDetail() {
      const { data } = await batchStoreInformation({
        storeIds: [Cookies.get("storeId")],
      });
      this.tableForm = data.list[0];
      this.commonFilter()
      // this.tableForm.status = this.tableForm.status.toString();
      // this.tableForm.discountRate = this.tableForm.discountRate * 100;
      this.tableFormAttrs = [
        {
          title: "门店名称:",
          placeholder: "请输入门店名称",
          type: "input",
          value: "storeName",
          disabled: true,
        },
        {
          title: "详细地址:",
          placeholder: "请输入详细地址",
          type: "textarea",
          value: "storeAddr",
          disabled: true,
        },
        {
          title: "门店ID:",
          placeholder: "系统自动生成",
          type: "input",
          inputType: "number",
          value: "storeId",
          disabled: true,
        },
        {
          title: "App ID:",
          placeholder: "系统自动生成",
          type: "input",
          value: "AppId",
          disabled: true,
        },
        {
          title: "App Secret:",
          placeholder: "系统自动生成",
          type: "input",
          value: "AppSecret",
          icon: "el-icon-refresh-right",
          disabled: true,
        },
        {
          title: "IP白名单:",
          placeholder: "请输入IP白名单,多个ip用英文逗号分隔",
          type: "input",
          value: "ipWhiteList",
          disabled: true,
        },
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          value: "merchantName",
          disabled: true,
          options: [],
        },
        {
          title: "所属商户:",
          placeholder: "请输入所属商户",
          type: "input",
          value: "merchantId",
          disabled: true,
          options: [],
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
          placeholder: "••••••••",
          type: "input",
          // inputType: "text",
          value: "passwd",
          isClosePwd: false,
          disabled: true,
        },
      ];
    },
    async getMerchantDetail() {
      const { data } = await merchantDetail({
        merchantId: Cookies.get("merchantId"),
      });
      this.tableForm = data;
      this.commonFilter()
      this.tableFormAttrs = [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          value: "merchantName",
          disabled: true,
        },
        {
          title: "Logo:",
          type: "img",
          value: "merchantLogo",
          disabled: false,
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          value: "merchantDesc",
          disabled: true,
        },
        {
          title: "商户ID:",
          placeholder: "系统自动生成",
          type: "input",
          value: "merchantId",
          disabled: true,
        },
        {
          title: "商户折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          value: "discountRate",
          disabled: true,
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
          placeholder: "••••••••",
          type: "input",
          // inputType: "text",
          value: "passwd",
          isClosePwd: false,
          disabled: true,
        },
      ];
    },
    async getChannelDetail() {
      const { data } = await channelDetail({
        channelId: Cookies.get("channelId"),
      });
      this.tableForm = data;
      this.commonFilter()
      this.tableFormAttrs = [
        {
          title: "渠道名称:",
          placeholder: "请输入渠道名称",
          type: "input",
          value: "channelName",
          disabled: true,
        },
        {
          title: "渠道描述:",
          placeholder: "请输入渠道描述",
          type: "textarea",
          value: "channelDesc",
          disabled: true,
        },
        {
          title: "渠道ID:",
          placeholder: "请输入预存款金额",
          type: "input",
          inputType: "number",
          value: "channelId",
          disabled: true,
          disabled: true,
        },
        {
          title: "App ID:",
          placeholder: "系统自动生成",
          type: "input",
          value: "appId",
          disabled: true,
        },
        {
          title: "App Secret:",
          placeholder: "请输入App Secret",
          type: "input",
          value: "appSecret",
          icon: "el-icon-refresh-right",
          disabled: true,
        },
        {
          title: "IP白名单:",
          placeholder: "",
          type: "textarea",
          value: "ipWhiteList",
          disabled: true,
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
          title: "可用预存款:",
          placeholder: "0",
          type: "input",
          value: "availablePredeposit",
          inputType: "number",
          disabled: true,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
.dashboard-detail {
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
  .el-dialog__wrapper {
    .el-input,
    .el-textarea {
      width: 348px !important;
    }
  }
}
</style>
