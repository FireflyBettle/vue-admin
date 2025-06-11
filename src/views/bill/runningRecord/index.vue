<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-11 10:48:52
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/bill/runningRecord/index.vue
-->
<template>
  <div class="bill-list">
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <Table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Detail from "@/components/Detail/index.vue";
import Search from "@/components/Search/index.vue";
import XLSX from "xlsx";
import { getPathName } from "@/utils/index.js";

import { billSerialList } from "@/api/bill";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};

export default {
  name: "businessList",
  components: {
    Table,
    Search,
    Detail,
  },
  data() {
    return {
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [],
      tableConfig: [
        {
          label: "操作类型",
          width: "80",
          value: "operationType",
        },
        {
          label: "资金操作",
          width: "95",
          value: "financialOperations",
        },
        {
          label: "金额",
          width: "80",
          value: "amount",
        },
        {
          label: "券码ID",
          width: "120",
          value: "voucherId",
        },
        {
          label: "商户",
          width: "80",
          value: "merchantName",
        },
        {
          label: "渠道",
          width: "135",
          value: "channelName",
        },
        {
          label: "流水号",
          width: "135",
          value: "tx_no",
        },
        {
          label: "操作角色",
          width: "90",
          value: "operationRole",
        },
        {
          label: "操作人",
          width: "80",
          value: "operator",
        },
        {
          label: "操作备注",
          width: "80",
          value: "operationRemarks",
        },
        {
          label: "操作端",
          width: "80",
          value: "operatorTerminal",
        },
        {
          label: "操作时间",
          width: "160",
          value: "operatorTime",
        },
      ],
      // 表格加载loading
      loadingStatus: false,
      optionWidth: 148,
      // url参数
      params: {
        pageSize: 10,
        pageNum: 0,
        merchantId: "",
        channelId: "",
        storeId: "",
      },
      filterButtonText: [
        {
          label: "导出Excel",
          type: "primary",
        },
      ],
      filterOptions: [
        {
          format: "date",
        },
        {
          type: "button",
        },
      ],
      multipleSelection: [],
      dateValue: '',
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
        // 操作栏宽度
        optionColumnWidth: this.optionWidth,
        // 是否需要选择
        isSelection: true,
        isHasButtons: false,
        isShowNumber: true,
      };
    },
    // 表格事件
    tableEvent() {
      return {
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
        handleFilterButton: this.handleFilterButton,
        changeDate: this.changeDate,
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
        this.params.date = this.dateValue;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await billSerialList(this.params);
        if (data.list) {
          data.list.forEach((item) => {
            item.amount = item.amount / 100;
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
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeDate(val) {
      this.dateValue = val;
    },
    // 分页操作
    handleRefreshList() {
      this.getList();
    },
    clickSearch() {
      if (!this.dateValue) {
        this.$message.warning(" 请选择日期");
        return;
      }
      this.listQueryParams.pageNum = 1; // 重置页码
      this.getList();
    },
    async exportExcel() {
      const headers = [
        "操作类型",
        "资金操作",
        "金额",
        "券码ID",
        "商户",
        "渠道",
        "流水号",
        "操作角色",
        "操作人",
        "操作备注",
        "操作端",
        "操作时间",
      ];
      const keys = [
        "operationType",
        "financialOperations",
        "amount",
        "voucherId",
        "merchantName",
        "channelName",
        "tx_no",
        "operationRole",
        "operator",
        "operationRemarks",
        "operatorTerminal",
        "operatorTime",
      ];
      let exportData = [];
      let arr = [];
      if (this.multipleSelection.length) {
        arr = this.multipleSelection;
      } else {
        const { data } = await billSerialList({
          pageSize: 1000,
          pageNum: 0,
          date: this.dateValue,
        });
        data.list.forEach((item) => {
          item.amount = item.amount / 100;
        });
        arr = data.list;
      }
      exportData = arr.map((item) => {
        return keys.map((key) => item[key]);
      });
      // 将表头添加到数据的第一行
      exportData.unshift(headers);
      // 创建工作簿
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      // 设置列宽度
      ws["!cols"] = [
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 21 },
      ];
      const wb = XLSX.utils.book_new();
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // 导出文件
      XLSX.writeFile(wb,`流水记录${getPathName()}.xlsx`);
    },
    // 点击右上角添加门店或者删除门店按钮
    async handleFilterButton(val) {
      if (val === "导出Excel") {
        this.exportExcel();
      }
    },
  },
};
</script>
<style lang="scss">
.bill-list {
  .filter-container {
    .el-input {
      width: 145px;
      input {
        height: 32px;
      }
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .el-input__icon {
      line-height: 32px;
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
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.bill-list {
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
