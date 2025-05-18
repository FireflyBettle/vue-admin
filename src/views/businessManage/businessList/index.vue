<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-16 10:35:20
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="572px">
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
    <!-- 删除商户 -->
    <el-dialog
      title=""
      :visible.sync="deleteShopDialogVisible"
      width="30%"
      :show-close="false"
      class="deleteShopDialog"
    >
      <i class="el-icon-warning-outline"></i>
      <span>确认删除商户名称?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteShopDialogVisible = false">否</el-button>
        <el-button type="primary" @click="deleteShopDialogVisible = false"
          >是</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Detail from "@/components/Detail/index.vue";
import Search from "@/components/Search/index.vue";
import md5 from 'js-md5';

import { createShop } from '@/api/business'

import testData from "./data.json";

const DefaultTableQuery = {
  page: 1,
  limit: 10,
  total: 0,
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
          label: "ID",
          width: "60",
          prop: "id",
        },
        {
          label: "商户名称",
          width: "90",
          prop: "name",
        },
        {
          label: "商户描述",
          width: "260",
          prop: "des",
        },
        {
          label: "商户ID",
          width: "120",
          prop: "shopName",
        },
        {
          label: "折扣率",
          width: "70",
          prop: "rate",
        },
        {
          label: "门店数",
          width: "70",
          prop: "storeNumber",
        },
        {
          label: "联系人",
          width: "80",
          prop: "contactPerson",
        },
        {
          label: "手机号",
          width: "70",
          prop: "phoneNumber",
        },
        {
          label: "邮箱",
          width: "90",
          prop: "email",
        },
        {
          label: "状态",
          width: "70",
          prop: "status",
        },
      ],
      tableFormAttrs: [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          prop: "merchantName",
          required: true,
        },
        {
          title: "Logo:",
          type: "upload",
          prop: "merchantLogo",
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          prop: "merchantDesc",
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          prop: "discountRate",
          required: true,
        },
        {
          title: "联系人:",
          placeholder: "请输入联系人",
          type: "input",
          prop: "contact",
          required: true,
        },
        {
          title: "手机号:",
          placeholder: "请输入手机号",
          type: "input",
          prop: "phone",
          inputType: "number",
          required: true,
        },
        {
          title: "邮箱:",
          placeholder: "请输入邮箱",
          type: "input",
          prop: "email",
          required: true,
        },
        {
          title: "状态:",
          placeholder: "请输入邮箱",
          type: "radio",
          prop: "status",
        },
        {
          title: "密码:",
          placeholder: "请输入密码",
          type: "input",
          inputType: "text",
          prop: "passwd",
          isClosePwd: true,
        },
      ],
      // 表格加载loading
      loadingStatus: false,
      buttonsName: ["查看", "编辑", "删除"],
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
        pageInfo: {
          pageSize: 10,
          pageNo: 1,
        },
      },
      filterButtonText: [
        {
          label: "添加商户",
          type: "primary",
        },
        {
          label: "删除商户",
          type: "info",
        },
      ],
      filterOptions: [
        {
          type: "multiSelect",
          placeholder: "商户名称",
          inputValue: "",
          isSearch: true,
          inputWidth: "264px",
          selectWidth: "105px",
          options: [
            {
              value: "选项1",
              label: "黄金糕",
            },
            {
              value: "选项2",
              label: "双皮奶",
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
        isSelection: true,
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
    getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageInfo.pageSize = this.listQueryParams.limit;
        this.params.pageInfo.pageNo = this.listQueryParams.page;
        // 发送请求,请求到的数据格式见下文，
        // const { data, cntData } = await TalentServe.getTalentList(this.params)
        const { data, cntData } = testData;
        console.log("🚀 ~ getList ~ testData:", testData);
        const tableData = data || [];
        // 分页组件显示  this.listQueryParams.total 值大于0才会出现
        this.listQueryParams.total = cntData;
        // 数据给表格
        this.tableData = data;
        this.loadingStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
    handleAvatarSuccess(file) {
      this.shopForm.merchantLogo = URL.createObjectURL(file.raw);
    },
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          this.shopForm.discountRate = this.shopForm.discountRate / 100;
          this.shopForm.passwd = md5(md5(this.shopForm.passwd));
          this.shopForm.ipWhiteList = 'test'
          createShop(this.shopForm).then((res) => {
            console.log("🚀 ~ submitForm ~ res:", res);
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialogFormVisible = false;
          });
          alert(1);
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
    changeDialogFormVisible(val) {
      this.dialogFormVisible = val;
    },
    showAddShop() {},
    handleFilter(val) {
      console.log("🚀 ~ handleFilter ~ val:", val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 表格操作功能 index：表格索引, row：表格行数据, option：按钮名称
    handleTableOption(index, row, option) {
      this.operationalData = { ...row };
      if (option === "查看") {
        console.log(index, row, option);
      } else if (option === "编辑") {
        console.log(index, row, option);
      } else if (option === "删除") {
        console.log(index, row, option);
      }
    },

    // 选择的数据回调
    handleSelectionChange(data) {
      console.log("🚀 ~ handleSelectionChange ~ data:", data);
    },

    // 分页操作
    handleRefreshList() {
      this.getList();
    },
    clickSearch() {
      console.log("🚀 ~ clickSearch ~ val:", "clickSearch");
    },
    handleFilterButton(val) {
      console.log("🚀 ~ handleFilterButton ~ val:", val);
      if (val === "添加商户") {
        this.dialogFormVisible = true;
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
