<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-26 16:27:46
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/channel/channelList/index.vue
-->
<template>
  <div class="shop-list">
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <Table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
    <el-dialog
      :title="title"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      width="572px"
    >
      <Detail
        ref="getTable"
        :title="title"
        :styleType="styleType"
        :tableData="dialogForm"
        :tableFormAttrs="dialogFormAttrs"
        formLabelWidth="92px"
        @resetSecret="resetSecret"
        :isEdit="title === '编辑渠道'"
        @handleAvatarSuccess="handleAvatarSuccess"
      >
      </Detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">{{
          buttonName
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Detail from "@/components/Detail/index.vue";
import Search from "@/components/Search/index.vue";
import md5 from "js-md5";

import {
  createChannel,
  channelList,
  updateChannel,
  channelSecretReset,
} from "@/api/channel.js";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};

export default {
  name: "businessList",
  components: {
    Table,
    Detail,
    Search,
  },
  data() {
    return {
      title: "添加渠道",
      buttonName: "添加",
      styleType: "dialog",
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [],
      tableConfig: [
        {
          label: "渠道名称",
          width: "90",
          value: "channelName",
        },
        {
          label: "渠道描述",
          width: "167",
          value: "channelDesc",
        },
        {
          label: "渠道ID",
          width: "167",
          value: "channelId",
        },
        {
          label: "预存款金额",
          width: "90",
          value: "predepositAmount",
        },
        {
          label: "可用预存款",
          width: "90",
          value: "availablePredeposit",
        },
        {
          label: "锁定预存款",
          width: "90",
          value: "lockedPredeposit",
        },
        {
          label: "联系人",
          width: "70",
          value: "contact",
        },
        {
          label: "手机号",
          width: "90",
          value: "phone",
        },
        {
          label: "邮箱",
          width: "90",
          value: "email",
        },
        {
          label: "状态",
          width: "80",
          format: "status",
          value: "status",
        },
      ],
      dialogFormAttrs: [
        {
          title: "渠道名称:",
          placeholder: "请输入渠道名称",
          type: "input",
          value: "channelName",
          required: true,
        },
        {
          title: "渠道描述:",
          placeholder: "请输入渠道描述",
          type: "textarea",
          value: "channelDesc",
        },
        {
          title: "渠道ID:",
          placeholder: "系统自动生成",
          type: "input",
          inputType: "number",
          value: "channelId",
          disabled: true,
        },
        {
          title: "App Secret:",
          placeholder: "系统自动生成",
          type: "input",
          value: "appSecret",
          icon: "el-icon-refresh-right",
          disabled: true,
        },
        {
          title: "IP白名单:",
          placeholder: "请输入IP白名单",
          type: "textarea",
          value: "ipWhiteList",
          required: true,
        },
        {
          title: "联系人:",
          placeholder: "请输入联系人",
          type: "input",
          value: "contact",
          required: true,
        },
        {
          title: "手机号:",
          placeholder: "请输入手机号",
          type: "input",
          value: "phone",
          inputType: "number",
          required: true,
        },
        {
          title: "邮箱:",
          placeholder: "请输入邮箱",
          type: "input",
          value: "email",
          required: true,
        },
        {
          title: "状态:",
          placeholder: "请输入邮箱",
          type: "radio",
          value: "status",
        },
        {
          title: "初始密码:",
          placeholder: "请输入密码",
          type: "input",
          inputType: "text",
          value: "passwd",
          isClosePwd: true,
        },
      ],
      // 表格加载loading
      loadingStatus: false,
      buttonsName: [
        {
          label: "查看",
          route: "channelId",
        },
        {
          label: "编辑",
        },
      ],
      optionWidth: 148,
      dialogFormVisible: false,
      dialogForm: {
        channelName: "",
        channelDesc: "",
        merchantLogo: "",
        predepositAmount: "",
        contact: "",
        status: "",
        passwd: "",
      },
      // url参数
      params: {
        pageSize: 10,
        pageNum: 0,
        searchKey: "",
        searchVal: "",
      },
      filterButtonText: [
        {
          label: "添加渠道",
          type: "primary",
        },
        // {
        //   label: "删除渠道",
        //   type: "info",
        // },
      ],
      filterOptions: [
        {
          type: "multiSelect",
          placeholder: "请选择",
          selectValue: "channelName",
          inputValue: "",
          isSearch: true,
          inputWidth: "264px",
          selectWidth: "105px",
          options: [
            {
              label: "渠道名称",
              width: "90",
              value: "channelName",
            },
            {
              label: "渠道ID",
              width: "120",
              value: "channelId",
            },
            {
              label: "手机号",
              width: "120",
              value: "phone",
            },
          ],
        },
      ],
    };
  },
  computed: {
    // 表格属性
    tableAttrs() {
      return {
        // 表头配置
        config: this.tableConfig,
        // 表格数据
        tableData: this.tableData,
        // loading
        loadingStatus: this.loadingStatus,
        // 按钮名称
        buttonsName: this.buttonsName,
        // 操作栏宽度
        optionColumnWidth: this.optionWidth,
        // 是否需要选择
        isSelection: false,
        isShowNumber: true,
      };
    },
    // 表格事件
    tableEvent() {
      return {
        // 按钮操作
        subOpitonButton: this.handleTableOption,
        // 分页
        subClickPagination: this.handleRefreshList,
        // 表格数据选择
        subSelected: this.handleSelectionChange,
      };
    },
    filterAttrs() {
      return {
        // 按钮名称
        filterButtonText: this.filterButtonText,
        filterOptions: this.filterOptions,
      };
    },
    filterEvent() {
      return {
        // 选择数据回调
        handleFilter: this.handleFilter,
        handleFilterButton: this.handleFilterButton,
        clickSearch: this.clickSearch,
      };
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    async getList(channelId) {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await channelList(this.params);
        if (data.list) {
          data.list.forEach((item) => {
            if (item.channelId === channelId) {
              this.dialogForm.appSecret = item.appSecret;
            }
            item.availablePredeposit = item.availablePredeposit ? item.availablePredeposit / 100 : 0;
            item.lockedPredeposit = item.lockedPredeposit ? item.lockedPredeposit / 100 : 0;
            item.predepositAmount = item.predepositAmount ? item.predepositAmount / 100 : 0;
            item.status = item.status ? item.status.toString() : "0";
          });
        }
        this.listQueryParams.total = data.total;
        // 数据给表格
        this.tableData = data.list || [];
        this.loadingStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 点击上传
    handleAvatarSuccess(file) {
      console.log("🚀 ~ handleAvatarSuccess ~ file:", file);
      this.dialogForm.merchantLogo = URL.createObjectURL(file.raw);
    },
    resetSecret() {
      this.$confirm("确认重置App Secret?", "", {
        type: "warning",
        confirmButtonText: "是",
        cancelButtonText: "否",
      })
        .then((res) => {
          channelSecretReset({
            channelId: this.dialogForm.channelId,
          }).then((res) => {
            this.getList(this.dialogForm.channelId);
            this.$message.success("重置App Secret成功");
          });
        })
        .catch(() => {
          this.$message.info(`已取消重置App Secret`);
        });
    },
    // 弹窗点击添加按钮
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          const params = {
            ...this.dialogForm,
            // passwd: this.dialogForm.passwd
            //   ? md5(md5(this.dialogForm.passwd))
            //   : md5(md5("")),
            status: Number(this.dialogForm.status),
          };
          if (this.title === "添加渠道") {
            params.passwd = md5(md5(this.dialogForm.passwd));
            createChannel(params).then((res) => {
              this.getList();
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.dialogFormVisible = false;
            });
          }
          if (this.title === "编辑渠道") {
            if (this.dialogForm.passwd) {
              params.passwd = md5(md5(this.dialogForm.passwd));
            } else {
              delete params.passwd;
            }
            updateChannel(params).then((res) => {
              this.getList();
              this.$message({
                message: "修改成功",
                type: "success",
              });
            });
            this.dialogFormVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除渠道
    deleteShopDialog() {
      this.$confirm("确定删除吗?", "", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          this.$message.success(" 删除成功");
        })
        .catch(() => {
          this.$message.info(" 已取消删除");
        });
    },
    handleFilter(val) {
      console.log(
        "🔍 ~ handleFilter ~ src/views/channel/channelList/index.vue:411 ~ val:",
        val
      );
      this.params.searchKey = val.selectValue;
    },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击编辑
    handleTableOption(index, row, option) {
      this.operationalData = { ...row };
      if (option.label === "查看") {
        console.log(index, row, option);
      } else if (option.label === "编辑") {
        var row = JSON.parse(JSON.stringify(row));
        this.dialogFormVisible = true;
        this.title = "编辑渠道";
        this.buttonName = "确定";
        this.dialogForm = row;
        this.dialogForm.status = row.status.toString();
        this.dialogFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "重置密码:";
          }
          if (val.value === "appSecret") {
            val.icon = "el-icon-refresh-right";
          }
        });
      } else if (option === "删除") {
        console.log(index, row, option);
      }
    },
    // 分页操作
    handleRefreshList() {
      this.getList();
    },
    clickSearch(val) {
      this.params.searchKey = val.selectValue;
      this.params.searchVal = val.inputValue;
      this.listQueryParams.pageNum = 1; // 重置页码
      this.getList();
    },
    // 点击添加渠道弹窗
    handleFilterButton(val) {
      if (val === "添加渠道") {
        this.dialogFormVisible = true;
        this.title = "添加渠道";
        this.buttonName = "添加";
        this.dialogForm = {};
        // this.dialogForm.email = "140@qq.co"; // 测试，后面去掉
        // this.dialogForm.phone = "19412345671";
        this.dialogFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "初始密码:";
          }
          if (val.value === "appSecret") {
            val.icon = "";
          }
        });
      }
      if (val === "删除渠道") {
        this.$confirm("确定删除吗?", "", {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(async () => {
            this.$message.success(" 删除成功");
          })
          .catch(() => {
            this.$message.info(" 已取消删除");
          });
      }
    },
  },
};
</script>
<style lang="scss">
.shop-list {
  .filter-container {
    .el-input {
      width: 265px;
      input {
        height: 32px;
      }
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .el-select {
      margin-right: 4px;
      .el-input {
        width: 106px;
      }
    }
    .el-input-group__append {
      background: #fff;
    }
    .el-button {
      padding: 12px;
    }
    .filter-container__right {
      .el-button {
        width: 88px;
        height: 32px;
        line-height: 32px;
        padding: 0;
        font-size: 14px;
      }
      .el-button--primary {
        background: #1890ff;
      }
      .el-button--info {
        background: #f5f5f5;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
  .deleteShopDialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      display: flex;
      align-items: center;
      border: none;
    }
    .el-icon-warning-outline {
      font-size: 22px;
      color: #faad14;
      margin-right: 16px;
    }
    .el-dialog__footer {
      padding: 0px 20px 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.shop-list {
  .filter-container {
    @include flex;
    justify-content: space-between;
    padding: 0 24px;
    width: 100%;
    height: 80px;
    background: #fff;
  }
  .show-pwd {
    position: absolute;
    right: 60px;
    top: 0;
    font-size: 16px;
    color: #000;
    cursor: pointer;
    user-select: none;
  }
  .char-count {
    text-align: right;
    color: #666;
    font-size: 12px;
    margin-top: 4px;
  }

  .limit-reached {
    color: #f56c6c;
    font-weight: bold;
  }
}
</style>
