<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-19 18:20:29
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/businessManage/businessList/index.vue
-->
<template>
  <div class="shop-list">
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <Table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" width="572px">
      <Detail
        ref="getTable"
        :title="title"
        :styleType="styleType"
        :tableData="shopForm"
        :tableFormAttrs="tableFormAttrs"
        @handleAvatarSuccess="handleAvatarSuccess"
      >
      </Detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Detail from "@/components/Detail/index.vue";
import Search from "@/components/Search/index.vue";
import md5 from "js-md5";

import { createMerchant, merchantList, changeMerchant } from "@/api/business";

import testData from "./data.json";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 3,
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
      title: "添加商户",
      styleType: "dialog",
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [],
      tableConfig: [
        {
          label: "商户名称",
          width: "90",
          value: "merchantName",
        },
        {
          label: "商户描述",
          width: "260",
          value: "merchantDesc",
        },
        {
          label: "商户ID",
          width: "120",
          value: "merchantId",
        },
        {
          label: "折扣率",
          width: "70",
          value: "discountRate",
          format: "rate",
        },
        {
          label: "门店数",
          width: "70",
          value: "storeNumber",
        },
        {
          label: "联系人",
          width: "80",
          value: "contact",
        },
        {
          label: "手机号",
          width: "70",
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
      tableFormAttrs: [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          value: "merchantName",
          required: true,
        },
        {
          title: "Logo:",
          type: "upload",
          value: "merchantLogo",
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          value: "merchantDesc",
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          value: "discountRate",
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
          title: "密码:",
          placeholder: "请输入密码",
          type: "input",
          inputType: "text",
          value: "passwd",
          isClosePwd: true,
        },
      ],
      // 表格加载loading
      loadingStatus: false,
      buttonsName: ["查看", "编辑"],
      optionWidth: 148,
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
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      input: "",
      dialogFormVisible: false,
      deleteShopDialogVisible: false,
      shopForm: {
        merchantName: "",
        merchantDesc: "",
        merchantLogo: "",
        discountRate: "",
        contact: "",
        phone: "",
        email: "",
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
          label: "添加商户",
          type: "primary",
        },
        // {
        //   label: "删除商户",
        //   type: "info",
        // },
      ],
      filterOptions: [
        {
          type: "multiSelect",
          placeholder: "请选择",
          selectValue: "merchantName",
          inputValue: "",
          isSearch: true,
          inputWidth: "264px",
          selectWidth: "105px",
          options: [
            {
              label: "商户名称",
              width: "90",
              value: "merchantName",
            },
            {
              label: "商户ID",
              width: "120",
              value: "merchantId",
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
    async getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await merchantList(this.params);
        if (data.list) {
          data.list.forEach((item) => {
            item.discountRate =parseInt(item.discountRate * 100);
            item.status = item.status.toString();
          });
        }
        // const { data, cntData } = testData;
        // const tableData = data.list || [];
        // 分页组件显示  this.listQueryParams.total 值大于0才会出现
        this.listQueryParams.total = data.total;
        // 数据给表格
        this.tableData = data.list || [];
        this.loadingStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
    handleAvatarSuccess(file) {
      this.shopForm.merchantLogo = URL.createObjectURL(file.raw);
    },
    // 点击添加按钮
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          const params = {
            ...this.shopForm,
            discountRate: this.shopForm.discountRate / 100,
            passwd: this.shopForm.passwd ? md5(md5(this.shopForm.passwd)) : md5(md5('')),
            status: Number(this.shopForm.status),
          };
          if (this.title === "添加商户") {
            createMerchant(params).then((res) => {
              this.getList();
              this.$message({
                message: "添加成功",
                type: "success",
              });
            });
          }
          if (this.title === "编辑商户") {
            changeMerchant(params).then((res) => {
              this.getList();
              this.$message({
                message: "修改成功",
                type: "success",
              });
            });
          }
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击编辑
    handleTableOption(index, row, option) {
      this.operationalData = { ...row };
      if (option === "查看") {
        console.log(index, row, option);
      } else if (option === "编辑") {
        this.dialogFormVisible = true;
        this.title = "编辑商户";
        this.shopForm = row;
        // this.shopForm.passwd = "";
        this.shopForm.status = row.status.toString();
        // this.shopForm.passwd = '12';
        // this.shopForm.discountRate = row.discountRate * 100;
        this.tableFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "重置密码:";
          }
        });
        console.log(index, row, option);
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
      this.getList();
    },
    handleFilterButton(val) {
      if (val === "添加商户") {
        this.dialogFormVisible = true;
        this.title = "添加商户";
        this.shopForm = {};
        this.tableFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "密码:";
          }
        });
      }
      if (val === "删除商户") {
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
