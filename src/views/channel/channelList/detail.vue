<template>
  <div class="cannel-detail">
    <div v-if="$route.meta" class="header">{{ $route.meta.title }}</div>
    <Detail
      ref="getTable"
      :tableData="tableForm"
      :tableFormAttrs="tableFormAttrs"
      :filterDataRules="filterDataRules"
      formLabelWidth="98px"
      @submitForm="submitForm"
      @resetSecret="resetSecret"
      @handleAvatarSuccess="handleAvatarSuccess"
    >
      <template v-slot:="button">
        <el-button type="primary" @click="recharge()">预付款充值</el-button>
        <el-button type="primary" @click="consume()">预付款冲正</el-button>
        <template v-if="isEdit">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存</el-button>
        </template>
        <template v-else>
          <el-button v-if="type !== 2" type="primary" @click="edit()">编辑</el-button>
        </template>
      </template>
    </Detail>
    <!-- 预付款充值弹窗 -->
    <el-dialog
      :title="title"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      width="572px"
    >
      <Detail
        ref="getDialogTable"
        :title="title"
        styleType="572px"
        formLabelWidth="110px"
        :tableData="dialogForm"
        :tableFormAttrs="dialogFormAttrs"
        :filterDataRules="filterDataRules"
        @handleAvatarSuccess="handleAvatarSuccess"
      >
      </Detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="rechargeOrConsume">{{
          buttonName
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Detail from "@/components/Detail/index.vue";
import md5 from "js-md5";
import Cookie from 'js-cookie';

import {
  channelDetail,
  updateChannel,
  ticketChannel,
  channelSecretReset,
  channelBalanceUpdate,
} from "@/api/channel.js";
export default {
  name: "channelDetail",
  components: {
    Detail,
  },
  data() {
    return {
      isEdit: false,
      dialogFormVisible: false,
      tableForm: {},
      filterDataRules: ["discountRate"],
      dialogForm: {},
      tableFormAttrs: [
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
          placeholder: "请输入IP白名单,多个ip用英文逗号分隔",
          type: "textarea",
          value: "ipWhiteList",
          disabled: true,
        },
        {
          title: "渠道ID:",
          placeholder: "请输入预存款金额",
          type: "input",
          inputType: "number",
          value: "channelId",
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
          inputType: "password",
          value: "passwd",
          disabled: true,
          isClosePwd: true,
        },
        {
          title: "预存款金额:",
          placeholder: "0",
          type: "input",
          value: "predepositAmount",
          inputType: "number",
          disabled: true,
        },
        {
          title: "锁定预存款:",
          placeholder: "0",
          type: "input",
          value: "lockedPredeposit",
          inputType: "number",
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
      ],
      filterDataRules: ["amount"],
      dialogFormAttrs: [
        {
          title: "渠道名称:",
          placeholder: "请输入渠道名称",
          type: "input",
          value: "channelName",
          disabled: true,
        },
        {
          title: "预存款余额(元):",
          placeholder: "0",
          type: "input",
          value: "predepositAmount",
          inputType: "number",
          disabled: true,
        },
        {
          title: "冲正金额(元):",
          placeholder: "请输入充值金额",
          type: "input",
          value: "amount",
          inputType: "number",
          required: true,
        },
        {
          title: "备注:",
          placeholder: "请输入备注",
          type: "input",
          value: "remark",
        },
      ],
      type: +Cookie.get('type')
    };
  },
  watch: {
    isEdit(val) {
      this.tableFormAttrs.forEach((item) => {
        item.disabled = !val;
        if (["appId", "appSecret", "channelId", 'predepositAmount', 'lockedPredeposit', 'availablePredeposit'].includes(item.value)) {
          item.disabled = true;
        }
        if (item.value === 'passwd') {
          item.inputType = val ? 'text' : 'password';
        }
      });
    },
    dialogFormVisible(val) {
      if (val) {
        this.dialogForm = {};
        this.dialogForm.channelId = this.tableForm.channelId;
        this.dialogForm.channelName = this.tableForm.channelName;
        this.dialogForm.predepositAmount = this.tableForm.predepositAmount;
      }
    },
  },
  created() {
    this.getMerchantDetail();
  },
  methods: {
    recharge() {
      this.dialogFormVisible = true;
      this.title = "预付款充值";
      this.buttonName = "充值";
      this.dialogFormAttrs.forEach(item => {
        if (item.value === 'amount') {
          item.title = '充值金额(元):';
        }
      })
    },
    consume() {
      this.dialogFormVisible = true;
      this.title = "预付款冲正";
      this.buttonName = "冲正";
      this.dialogFormAttrs.forEach(item => {
        if (item.value === 'amount') {
          item.title = '冲正金额(元):';
        }
      })
    },
    rechargeOrConsume() {
      this.$refs.getDialogTable.getTableRef().validate((valid) => {
        if (valid) {
          const params = {
            channelId: this.dialogForm.channelId,
            amount: +this.dialogForm.amount * 100,
            remark: this.dialogForm.remark,
          };
          let des = "";
          let message = "";
          if (this.buttonName === "充值") {
            params.type = "recharge";
            des = `确认向${this.dialogForm.channelName}充值¥${this.dialogForm.amount}吗?`;
            message = "充值成功";
          }
          if (this.buttonName === "冲正") {
            params.type = "consume";
            des = `确认向${this.dialogForm.channelName}冲正¥${this.dialogForm.amount}吗?`;
            message = "冲正成功";
          }
          this.$confirm(des, "", {
            type: "warning",
            confirmButtonText: "是",
            cancelButtonText: "否",
          })
            .then(async () => {
              ticketChannel(params).then((res) => {
                if (res.code === 0) {
                  channelBalanceUpdate({
                    channelId: this.dialogForm.channelId,
                    ticket: res.data.ticket
                  }).then(res => {
                    this.getMerchantDetail();
                    this.$message.success(message);
                    this.dialogFormVisible = false;
                  })
                }
              });
            })
            .catch(() => {
              this.$message.info(`已取消${this.buttonName}`);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getMerchantDetail() {
      const { data } = await channelDetail({
        channelId: this.$route.params.id,
      });
      this.tableForm = data;
      this.tableForm.status = this.tableForm.status.toString();
      this.tableForm.predepositAmount = this.tableForm.predepositAmount / 100;
      this.tableForm.availablePredeposit = this.tableForm.availablePredeposit / 100;
      this.tableForm.lockedPredeposit = this.tableForm.lockedPredeposit / 100;
    },
    resetSecret() {
      if (!this.isEdit) return false;
      this.$confirm("确认重置App Secret?", "", {
        type: "warning",
        confirmButtonText: "是",
        cancelButtonText: "否",
      })
        .then((res) => {
          channelSecretReset({
            channelId: this.tableForm.channelId,
          }).then((res) => {
            this.getMerchantDetail();
            this.$message.success("重置App Secret成功");
          });
        })
        .catch(() => {
          this.$message.info(`已取消重置App Secret`);
        });
    },
    async submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        console.log(valid);
        if (valid) {
          const params = {
            ...this.tableForm,
            discountRate: this.tableForm.discountRate / 100,
            status: +this.tableForm.status,
            passwd: this.tableForm.passwd
              ? md5(md5(this.tableForm.passwd))
              : md5(md5("")),
          };
          // params.discountRate = this.tableForm.discountRate / 100;
          // params.status = +this.tableForm.status
          // params.passwd  = this.tableForm.passwd ? md5(md5(this.tableForm.passwd)) : md5(md5(''));
          updateChannel(params).then((res) => {
            if (res.code === 0) {
              this.getMerchantDetail();
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
.cannel-detail {
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
