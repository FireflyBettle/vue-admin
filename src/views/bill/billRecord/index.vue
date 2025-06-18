<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-18 10:59:00
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/bill/billRecord/index.vue
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
import Cookies from "js-cookie";

import {
  billRecordList,
  billMerchantList,
  billChannelList,
  billStoreList,
} from "@/api/bill";

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
      tableConfig: [],
      // 表格加载loading
      loadingStatus: false,
      optionWidth: 148,
      // url参数
      params: {
        pageSize: 10,
        pageNum: 0,
      },
      filterButtonText: [
        {
          label: "导出Excel",
          type: "primary",
        },
      ],
      filterOptions: [
        {
          format: "mulDate",
        },
        {
          type: "button",
        },
      ],
      multipleSelection: [],
      dateValue: "",
      type: +Cookies.get("type"), //// 1-平台，2-渠道，3-商户，4-门店，5-门店店员
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
    this.requestInitData();
  },
  methods: {
    requestInitData() {
      if (this.type === 1) {
        this.getList();
      }
      if (this.type === 2) {
        this.getChannelList();
      }
      if ([3, 4].includes(this.type)) {
        this.getMerchantOrStoreList();
      }
    },
    // 获取列表
    getListFilter(data) {
      data.forEach((item) => {
        item.createAmount = item.createAmount / 100;
        item.invalidAmount = item.invalidAmount / 100;
        item.verifyAmount = item.verifyAmount / 100;
        item.reverseAmount = item.reverseAmount / 100;
        item.expireAmount = item.expireAmount / 100;
        item.lockAdvancePayment = item.lockAdvancePayment / 100;
        item.deductAdvancePayment = item.deductAdvancePayment / 100;
        item.merchantSettlement = item.merchantSettlement / 100;
        item.platformProfitability = item.platformProfitability / 100;
      });
    },
    async getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        this.params.date = this.dateValue;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await billRecordList(this.params);
        if (data.list) {
          this.getListFilter(data.list);
        }
        this.listQueryParams.total = data.total;
        // 数据给表格
        this.tableConfig = [
          {
            label: "创建金额",
            width: "80",
            value: "createAmount",
          },
          {
            label: "创建数量",
            width: "80",
            value: "createQuantity",
          },
          {
            label: "取消金额",
            width: "83",
            value: "invalidAmount",
          },
          {
            label: "取消数量",
            width: "83",
            value: "invalidQuantity",
          },
          {
            label: "过期金额",
            width: "83",
            value: "expireAmount",
          },
          {
            label: "过期数量",
            width: "83",
            value: "expireQuantity",
          },
          {
            label: "核销金额",
            width: "80",
            value: "verifyAmount",
          },
          {
            label: "核销数量",
            width: "80",
            value: "verifyQuantity",
          },
          {
            label: "冲正金额",
            width: "80",
            value: "reverseAmount",
          },
          {
            label: "冲正数量",
            width: "80",
            value: "reverseQuantity",
          },
          {
            label: "锁定预付款",
            width: "95",
            value: "lockAdvancePayment",
          },
          {
            label: "扣除预付款",
            width: "95",
            value: "deductAdvancePayment",
          },
          {
            label: "商户结款",
            width: "80",
            value: "merchantSettlement",
          },
          {
            label: "平台盈利",
            width: "80",
            value: "platformProfitability",
          },
          {
            label: "开始时间",
            width: "96",
            format: "wrap",
            value: "startTime",
          },
          {
            label: "结束时间",
            width: "96",
            format: "wrap",
            value: "endTime",
          },
        ];
        this.tableData = data.list || [];
        this.loadingStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
    getMerchantOrStoreListFilter(data) {
      data.forEach((item) => {
        item.verifyAmount = item.verifyAmount / 100;
        item.reverseAmount = item.reverseAmount / 100;
        item.merchantSettlement = item.merchantSettlement / 100;
        item.StoreSettlement = item.StoreSettlement / 100;
      });
    },
    async getMerchantOrStoreList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        this.params.date = this.dateValue;
        let tableData = [];
        // 发送请求,请求到的数据格式见下文，
        if (this.type === 3) {
          const { data } = await billMerchantList(this.params);
          tableData = data;
        }
        if (this.type === 4) {
          const { data } = await billStoreList(this.params);
          tableData = data;
        }
        if (tableData.list) {
          this.getMerchantOrStoreListFilter(tableData.list);
        }
        this.listQueryParams.total = tableData.total;
        // 数据给表格
        this.tableData = tableData.list || [];
        this.loadingStatus = false;
        this.tableConfig = [
          {
            label: "核销金额",
            width: "80",
            value: "verifyAmount",
          },
          {
            label: "核销数量",
            width: "80",
            value: "verifyQuantity",
          },
          {
            label: "冲正金额",
            width: "80",
            value: "reverseAmount",
          },
          {
            label: "冲正数量",
            width: "80",
            value: "reverseQuantity",
          },
          {
            label: this.type === 3 ? "商户结款" : "门店结款",
            width: "80",
            value: this.type === 3 ? "merchantSettlement" : "StoreSettlement",
          },
          {
            label: "开始时间",
            width: "96",
            format: "wrap",
            value: "startTime",
          },
          {
            label: "结束时间",
            width: "96",
            format: "wrap",
            value: "endTime",
          },
        ];
      } catch (error) {
        console.log(error);
      }
    },
    getChannelListFilter(data) {
      data.forEach((item) => {
        item.createAmount = item.createAmount / 100;
        item.invalidAmount = item.invalidAmount / 100;
        item.expireAmount = item.expireAmount / 100;
        item.verifyAmount = item.verifyAmount / 100;
        item.reverseAmount = item.reverseAmount / 100;
        item.lockAdvancePayment = item.lockAdvancePayment / 100;
        item.deductAdvancePayment = item.deductAdvancePayment / 100;
        item.returnAdvancePayment = item.returnAdvancePayment / 100;
      });
    },
    async getChannelList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // this.params.date = this.dateValue;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await billChannelList(this.params);
        if (data.list) {
          this.getChannelListFilter(data.list);
        }
        this.listQueryParams.total = data.total;
        // 数据给表格
        this.tableData = data.list || [];
        this.loadingStatus = false;
        this.tableConfig = [
          {
            label: "创建金额",
            width: "96",
            value: "createAmount",
          },
          {
            label: "创建数量",
            width: "96",
            value: "createQuantity",
          },
          {
            label: "取消金额",
            width: "83",
            value: "invalidAmount",
          },
          {
            label: "取消数量",
            width: "83",
            value: "invalidQuantity",
          },
          {
            label: "过期金额",
            width: "83",
            value: "expireAmount",
          },
          {
            label: "过期数量",
            width: "83",
            value: "expireQuantity",
          },
          {
            label: "核销金额",
            width: "96",
            value: "verifyAmount",
          },
          {
            label: "核销数量",
            width: "96",
            value: "verifyQuantity",
          },
          {
            label: "冲正金额",
            width: "96",
            value: "reverseAmount",
          },
          {
            label: "冲正数量",
            width: "96",
            value: "reverseQuantity",
          },
          // {
          //   label: "锁定预付款",
          //   width: "96",
          //   value: "lockAdvancePayment",
          // },
          {
            label: "扣除预付款",
            width: "96",
            value: "deductAdvancePayment",
          },
          {
            label: "返还预付款",
            width: "96",
            value: "returnAdvancePayment",
          },
          {
            label: "开始时间",
            width: "96",
            format: "wrap",
            value: "startTime",
          },
          {
            label: "结束时间",
            width: "96",
            format: "wrap",
            value: "endTime",
          },
        ];
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
      console.log("🚀 ~ changeDate ~ val:", val);
      this.params.startDate = val[0];
      this.params.endDate = val[1];
      // this.dateValue = val;
    },
    // 分页操作
    handleRefreshList() {
      this.requestInitData();
    },
    clickSearch() {
      // if (!this.dateValue) {
      //   this.$message.warning(" 请选择日期");
      //   return;
      // }
      this.listQueryParams.pageNum = 1; // 重置页码
      this.requestInitData();
    },
    async exportExcel() {
      let headers = [];
      let keys = [];
      if ([1].includes(this.type)) {
        headers = [
          "创建金额",
          "创建数量",
          "取消金额",
          "取消数量",
          "过期金额",
          "过期数量",
          "核销金额",
          "核销数量",
          "冲正金额",
          "冲正数量",
          "锁定预付款",
          "扣除预付款",
          "商户结款",
          "平台盈利",
          "开始时间",
          "结束时间",
        ];
        keys = [
          "createAmount",
          "createQuantity",
          "invalidAmount",
          "invalidQuantity",
          "expireAmount",
          "expireQuantity",
          "verifyAmount",
          "verifyQuantity",
          "reverseAmount",
          "reverseQuantity",
          "lockAdvancePayment",
          "deductAdvancePayment",
          "merchantSettlement",
          "platformProfitability",
          "startTime",
          "endTime",
        ];
      }
      if ([2].includes(this.type)) {
        headers = [
          "创建金额",
          "创建数量",
          "取消金额",
          "取消数量",
          "过期金额",
          "过期数量",
          "核销金额",
          "核销数量",
          "冲正金额",
          "冲正数量",
          "扣除预付款",
          "返还预付款",
          "开始时间",
          "结束时间",
        ];
        keys = [
          "createAmount",
          "createQuantity",
          "invalidAmount",
          "invalidQuantity",
          "expireAmount",
          "expireQuantity",
          "verifyAmount",
          "verifyQuantity",
          "reverseAmount",
          "reverseQuantity",
          "deductAdvancePayment",
          "returnAdvancePayment",
          "startTime",
          "endTime",
        ];
      }
      if ([3, 4].includes(this.type)) {
        headers = [
          "核销金额",
          "核销数量",
          "冲正金额",
          "冲正数量",
          `${this.type === 3 ? "商户结款" : "门店结款"}`,
          "开始时间",
          "结束时间",
        ];
        keys = [
          "verifyAmount",
          "verifyQuantity",
          "reverseAmount",
          "reverseQuantity",
          `${this.type === 3 ? "merchantSettlement" : "StoreSettlement"}`,
          "startTime",
          "endTime",
        ];
      }
      let exportData = [];
      let arr = [];
      if (this.multipleSelection.length) {
        arr = this.multipleSelection;
      } else {
        const { data } = await billRecordList({
          pageSize: 1000,
          pageNum: 0,
          startDate: this.params.startDate,
          endDate: this.params.endDate,
        });
        this.getListFilter(data.list);
        arr = data.list;
      }
      exportData = arr.map((item) => {
        return keys.map((key) => item[key]);
      });
      // 将表头添加到数据的第一行
      exportData.unshift(headers);
      // 创建工作簿
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      if ([1].includes(this.type)) {
        ws["!cols"] = [
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 21 },
          { wch: 21 },
        ];
      }
      if ([2].includes(this.type)) {
        ws["!cols"] = [
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 21 },
          { wch: 21 },
        ];
      }
      if ([3, 4].includes(this.type)) {
        ws["!cols"] = [
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 21 },
          { wch: 21 },
        ];
      }
      const wb = XLSX.utils.book_new();
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // 导出文件
      XLSX.writeFile(wb, `账单记录${getPathName()}.xlsx`);
    },
    // 点击右上角导出excel按钮
    async handleFilterButton(val) {
      if (val === "导出Excel") {
        this.exportExcel();
        // if (this.type === 1) {
        //   this.exportExcel();
        // }
        // if (this.type === 2) {
        //   this.exportChannelList();
        // }
        // if ([3, 4].includes(this.type)) {
        //   this.exportMerchantOrStoreList();
        // }
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
