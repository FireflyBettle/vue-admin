<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-26 16:36:53
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/businessManage/shopList/index.vue
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
        formLabelWidth="91px"
        @resetSecret="resetSecret"
        :isEdit="title === '编辑门店'"
        @handleAreaChange="handleAreaChange"
      >
      </Detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">{{
          sureButtonsName
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
import { regionData } from "element-china-area-data";

import {
  createStores,
  merchantList,
  storesList,
  changeStores,
  deleteStores,
  resetStoresSecret,
} from "@/api/business";

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
      title: "添加门店",
      sureButtonsName: "添加",
      styleType: "dialog",
      regionData,
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [],
      tableConfig: [
        {
          label: "门店名称",
          width: "90",
          value: "storeName",
        },
        {
          label: "门店地址",
          width: "110",
          value: "storeAddr",
        },
        {
          label: "门店ID",
          width: "110",
          value: "merchantId",
        },
        {
          label: "App ID",
          width: "110",
          value: "AppId",
        },
        {
          label: "App Secret",
          width: "110",
          value: "AppSecret",
        },
        {
          label: "IP白名单",
          width: "110",
          value: "ipWhiteList",
        },
        {
          label: "所属商户",
          width: "90",
          value: "merchantName",
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
          width: "70",
          format: "status",
          value: "status",
        },
      ],
      dialogFormAttrs: [
        {
          title: "门店名称:",
          placeholder: "请输入门店名称",
          type: "input",
          value: "storeName",
          required: true,
        },
        {
          title: "省市区/县:",
          placeholder: "请选择省市区/县",
          type: "multipleSelect",
          value: "area",
          required: true,
          options: [],
        },
        {
          title: "详细地址:",
          placeholder: "请输入详细地址",
          type: "textarea",
          value: "storeAddr",
          required: true,
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
          title: "所属商户:",
          placeholder: "请输入所属商户",
          type: "select",
          value: "merchantId",
          required: true,
          options: [],
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
          label: "编辑",
        },
        {
          label: "删除",
        },
      ],
      optionWidth: 148,
      dialogFormVisible: false,
      dialogForm: {},
      // url参数
      params: {
        pageSize: 10,
        pageNum: 0,
        searchKey: "",
        searchVal: "",
      },
      filterButtonText: [
        {
          label: "添加门店",
          type: "primary",
        },
        {
          label: "删除门店",
          type: "info",
        },
      ],
      filterOptions: [
        {
          type: "multiSelect",
          placeholder: "请选择",
          selectValue: "storeName",
          inputValue: "",
          isSearch: true,
          inputWidth: "264px",
          selectWidth: "105px",
          options: [
            {
              label: "门店名称",
              width: "90",
              value: "storeName",
            },
            {
              label: "门店ID",
              width: "120",
              value: "storeId",
            },
            {
              label: "手机号",
              width: "120",
              value: "phone",
            },
          ],
        },
      ],
      selectedAreaText: "",
      dialogStoreId: "",
      multipleSelection: []
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
        isSelection: true,
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
  watch: {
    multipleSelection: {
      handler: function (val) {
        this.filterButtonText.forEach(item => {
          if (item.label === '删除门店') {
            item.type = val.length ? 'primary' : 'info'
          }
        })
      },
      immediate: true,
    },
  },
  created() {
    this.dialogFormAttrs.forEach((item) => {
      if (item.type === "multipleSelect") {
        item.options = this.regionData;
      }
      if (item.value === "merchantId") {
        // val.options
        merchantList({
          pageNum: 0,
          pageSize: 1000,
        }).then((res) => {
          res.data.list.forEach((val) => {
            item.options.push({
              label: val.merchantName,
              value: val.merchantId,
            });
          });
        });
      }
    });
    this.getList();
  },
  methods: {
    // 获取列表
    async getList(storeId) {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await storesList(this.params);
        if (data.list) {
          data.list.forEach((item) => {
            if (item.storeId === storeId) {
              this.dialogForm.AppSecret = item.AppSecret;
            }
            item.status = item.status.toString();
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
    resetSecret() {
      this.$confirm("确认重置App Secret?", "", {
        type: "warning",
        confirmButtonText: "是",
        cancelButtonText: "否",
      })
        .then((res) => {
          resetStoresSecret({
            storeId: this.dialogForm.storeId,
          }).then((res) => {
            this.getList(this.dialogForm.storeId);
            this.$message.success("重置App Secret成功");
          });
        })
        .catch(() => {
          this.$message.info(`已取消重置App Secret`);
        });
    },
    // 点击添加按钮
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          const params = {
            storeName: this.dialogForm.storeName,
            // storeAddr: this.dialogForm.storeAddr,
            merchantId: this.dialogForm.merchantId,
            contact: this.dialogForm.contact,
            phone: this.dialogForm.phone,
            email: this.dialogForm.email,
            ipWhiteList: this.dialogForm.ipWhiteList,
            // passwd: this.dialogForm.passwd
            //   ? md5(md5(this.dialogForm.passwd))
            //   : md5(md5("")),
            status: Number(this.dialogForm.status),
          };
          params.storeAddr = this.selectedAreaText + this.dialogForm.storeAddr;
          if (this.title === "添加门店") {
            params.passwd = md5(md5(this.dialogForm.passwd));
            createStores(params).then((res) => {
              this.getList();
              this.$message({
                message: "添加成功",
                type: "success",
              });
            });
            this.dialogFormVisible = false;
          }
          if (this.title === "编辑门店") {
            if (this.dialogForm.passwd) {
              params.passwd = md5(md5(this.dialogForm.passwd));
            }else {
              delete params.passwd;
            }
            params.storeId = this.dialogStoreId;
            changeStores(params).then((res) => {
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
    handleAreaChange(value) {
      let areaText = "";
      let currentOptions = this.regionData;
      value.forEach((code, index) => {
        const option = currentOptions.find((item) => item.value === code);
        if (option) {
          areaText += option.label + " ";
          currentOptions = option.children || [];
        }
      });
      this.selectedAreaText = areaText;
    },
    // 删除商户
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
      this.params.searchKey = val.selectValue;
    },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("🚀 ~ handleSelectionChange ~ this.multipleSelection:", this.multipleSelection)
    },
    // 点击编辑
    handleTableOption(index, row, option) {
      this.operationalData = { ...row };
      if (option.label === "查看") {
        console.log(index, row, option);
      } else if (option.label === "编辑") {
        var row = JSON.parse(JSON.stringify(row));
        this.dialogFormVisible = true;
        this.title = "编辑门店";
        this.sureButtonsName = "确定";
        this.dialogForm = row;
        this.dialogForm.status = row.status.toString();
        // 处理省市区过略
        let arr = [];
        let currentOptions = this.regionData;
        this.dialogForm.storeAddr.split(" ").forEach((code, index) => {
          const option = currentOptions.find((item) => item.label === code);
          if (option) {
            arr.push(option.value);
            currentOptions = option.children || [];
          }
        });
        this.dialogForm.area = arr;
        this.selectedAreaText = this.dialogForm.storeAddr;
        this.dialogForm.storeAddr = this.dialogForm.storeAddr
          .split(" ")
          .slice(-1)[0];
        this.dialogStoreId = this.dialogForm.storeId;
        // this.selectedAreaText = arr;

        this.dialogFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "重置密码:";
          }
          if (val.value === "AppSecret") {
            val.icon = "el-icon-refresh-right";
          }
        });
        console.log(index, row, option);
      } else if (option.label === "删除") {
        this.$confirm("确定删除门店吗?", "", {
          type: "warning",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
          .then(async () => {
            deleteStores({
              storeIds: [row.storeId],
            }).then((res) => {
              this.getList();
              this.$message.success(" 删除成功");
            });
          })
          .catch(() => {
            this.$message.info(" 已取消删除");
          });

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
    // 点击右上角添加门店或者删除门店按钮
    async handleFilterButton(val) {
      if (val === "添加门店") {
        this.dialogFormVisible = true;
        this.title = "添加门店";
        this.sureButtonsName = "添加";
        this.dialogForm = {};
        this.dialogFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "密码:";
          }
          if (val.value === "AppSecret") {
            val.icon = "";
          }
        });
      }
      if (val === "删除门店") {
        if (!this.multipleSelection.length) return false;
        this.$confirm("确定删除吗?", "", {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(async () => {
            const storeIds = this.multipleSelection.map(val => val.storeId);
            await deleteStores({
              storeIds
            });
            this.getList();
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
