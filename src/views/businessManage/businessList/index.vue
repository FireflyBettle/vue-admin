<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-15 18:26:17
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/businessManage/businessList/index.vue
-->
<template>
  <div class="shop-list">
    <div class="filter-container">
      <div class="filter-container__left">
        <el-select
          v-model="value"
          size="medium"
          filterable
          placeholder="商户名称"
          @change="handleFilter"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="filter-container__right">
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加商户</el-button
        >
        <!-- <el-button type="info" plain @click="deleteShopDialogVisible = true"
          >删除商户</el-button> -->
        <el-button type="info" plain @click="deleteShopDialog"
          >删除商户</el-button
        >
      </div>
    </div>
    <Table :tableData="tableData"></Table>
    <app-table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
    <Dialog
      @changeDialogFormVisible="changeDialogFormVisible"
      :dialogFormVisible.sync="dialogFormVisible"
      :table-data="shopForm"
      @submitForm="submitForm"
    />
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
import Dialog from "@/components/Dialog/index.vue";
import Table from "@/components/Table/index.vue";
import AppTable from "@/components/AppTable/index.vue";

const DefaultTableQuery = {
  page: 1,
  limit: 10,
  total: 0,
};

export default {
  name: "businessList",
  components: {
    Dialog,
    Table,
    AppTable
  },
  data() {
    return {
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [
        {
          id: "1",
          name: "麦当劳",
          des: "这里是商户描述",
          shopName: "022A15EFC727DCAD",
          rate: "10%",
          storeNumber: "10",
          contactPerson: "麦当劳",
          phoneNumber: "19538383838",
          email: "1403939393@qq.com",
          status: "已启用",
        },
        {
          id: "1",
          name: "麦当劳",
          des: "这里是商户描述",
          shopName: "022A15EFC727DCAD",
          rate: "10%",
          storeNumber: "10",
          contactPerson: "麦当劳",
          phoneNumber: "19538383838",
          email: "1403939393@qq.com",
          status: "已启用",
        },
        {
          id: "1",
          name: "麦当劳",
          des: "这里是商户描述",
          shopName: "022A15EFC727DCAD",
          rate: "10%",
          storeNumber: "10",
          contactPerson: "麦当劳",
          phoneNumber: "19538383838",
          email: "1403939393@qq.com",
          status: "已启用",
        },
      ],
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
        name: "",
        des: "",
        logo: "",
        des: "",
        shopName: "",
        rate: "",
        contactPerson: "",
        phoneNumber: "",
        email: "",
        status: "",
        password: "",
      },
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
  },
  methods: {
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
    submitForm(formName) {
      alert("submit!");
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
  },
};
</script>
<style lang="scss">
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
