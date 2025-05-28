<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-28 11:34:11
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/order/orderList/index.vue
-->
<template>
  <div class="order-list">
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
import Cookies from "js-cookie";

import { orderList, reverseOrder, expireOrder } from "@/api/order";
import { merchantList } from "@/api/business.js";
import { channelList } from "@/api/channel.js";

import { storesList } from "@/api/business";

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
          label: "券码ID",
          width: "120",
          value: "voucherId",
        },
        {
          label: "金额",
          width: "60",
          value: "amount",
        },
        {
          label: "券码描述",
          width: "130",
          value: "voucherDesc",
        },
        {
          label: "商户",
          width: "90",
          value: "merchantName",
        },
        {
          label: "核销门店",
          width: "90",
          value: "storeName",
        },
        {
          label: "商户结款",
          width: "77",
          value: "merchantSettlement",
        },
        {
          label: "渠道",
          width: "90",
          value: "channelName",
        },
        {
          label: "预付款",
          width: "70",
          value: "advancePayment",
        },
        {
          label: "创建时间",
          width: "96",
          format: "wrap",
          value: "createTime",
        },
        {
          label: "过期时间",
          width: "96",
          format: "wrap",
          value: "expireTime",
        },
        {
          label: "操作时间",
          width: "96",
          format: "wrap",
          value: "operateTime",
        },
        {
          label: "状态",
          width: "70",
          value: "specialStatus",
        },
      ],
      // 表格加载loading
      loadingStatus: false,
      buttonsName: [
        {
          label: "查看",
        },
        {
          label: "",
        },
      ],
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
          type: "multiSelect",
          placeholder: "商户",
          inputValue: "",
          isSearch: false,
          inputWidth: "136px",
          selectWidth: "110px",
          noShowInput: true,
          options: [],
        },
        {
          type: "multiSelect",
          placeholder: "渠道",
          inputValue: "",
          isSearch: false,
          inputWidth: "136px",
          selectWidth: "110px",
          noShowInput: true,
          options: [],
        },
        {
          type: "multiSelect",
          placeholder: "门店",
          inputValue: "",
          isSearch: false,
          inputWidth: "136px",
          selectWidth: "110px",
          noShowInput: true,
          options: [],
        },
        {
          type: "multiSelect",
          placeholder: "状态",
          inputValue: "",
          isSearch: false,
          inputWidth: "136px",
          selectWidth: "110px",
          noShowInput: true,
          options: [
            {
              value: "0",
              label: "待核销",
            },
            {
              value: "1",
              label: "已核销",
            },
            {
              value: "2",
              label: "冲正",
            },
            {
              value: "3",
              label: "作废",
            },
          ],
        },
        {
          type: "button",
        },
      ],
      multipleSelection: [],
      type: +Cookies.get('type'),
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
        isStatusButtons: true,
        isHasButtons: false,
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
    this.init();
    this.getList();
  },
  methods: {
    init() {
      const params = {
        ...this.params,
        pageSize: 1000,
        pageNum: 0,
      };
      merchantList(params).then((res) => {
        this.filterOptions[0].options = res.data.list.map((val) => {
          return {
            value: val.merchantId,
            label: val.merchantName,
          };
        });
      });
      channelList(params).then((res) => {
        this.filterOptions[1].options = res.data.list.map((val) => {
          return {
            value: val.channelId,
            label: val.channelName,
          };
        });
      });
      storesList(params).then((res) => {
        this.filterOptions[2].options = res.data.list.map((val) => {
          return {
            value: val.storeId,
            label: val.storeName,
          };
        });
      });
    },
    // 获取列表
    async getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await orderList(this.params);
        const specialStatusStatusType = {
          0: "待核销",
          1: "已核销",
          2: "冲正",
          3: "作废",
          4: "过期",
        };
        const operationStatusStatusType = {};
        if ([1].includes(this.type)) {
          operationStatusStatusType[0] = '作废';
          if ([1].includes(this.type)) {
            operationStatusStatusType[1] = '冲正';
          }
        }
        if ([3,4].includes(this.type)) {
          operationStatusStatusType[1] = '冲正';
        }
        
        if (data.list) {
          data.list.forEach((item) => {
            item.status = item.status.toString();
            item.amount = item.amount / 100;
            item.advancePayment = item.advancePayment / 100;
            item.merchantSettlement = item.merchantSettlement / 100;
            item.specialStatus = specialStatusStatusType[item.status];
            item.operationSpecialStatus = operationStatusStatusType[item.status];
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
    handleFilter(val) {
      this.params.merchantId =
        val.placeholder === "商户" ? val.selectValue : this.params.merchantId;
      this.params.channelId =
        val.placeholder === "渠道" ? val.selectValue : this.params.channelId;
      this.params.storeId =
        val.placeholder === "门店" ? val.selectValue : this.params.storeId;
      this.params.status =
        val.placeholder === "状态" ? +val.selectValue : +this.params.status;
    },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击编辑  渠道2，平台1只能操作作废   门店4,商户3只能操作冲正
    async handleTableOption(row) {
      // 0-待核销状态，4过期状态 可以操作作废
      if ([0].includes(+row.status) && [1,2].includes(this.type)) {
        this.$confirm("确认作废吗?", "", {
          type: "warning",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
          .then(async () => {
            await expireOrder({
              voucherId: row.voucherId,
            });
            this.getList();
            this.$message.success("作废成功");
          })
          .catch(() => {
            this.$message.info(" 已取消作废");
          });
      }
      // 1-已核销状态， 可以操作冲正
      if (+row.status === 1  && [1,3,4].includes(this.type)) {
        this.$confirm("确认冲正吗?", "", {
          type: "warning",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
          .then(async () => {
            await reverseOrder({
              voucherId: row.voucherId,
            });
            this.getList();
            this.$message.success(" 冲正成功");
          })
          .catch(() => {
            this.$message.info(" 已取消冲正");
          });
      }
    },
    // 分页操作
    handleRefreshList() {
      this.getList();
    },
    clickSearch() {
      this.params.searchKey = val.selectValue;
      this.params.searchVal = val.inputValue;
      this.listQueryParams.pageNum = 1; // 重置页码
      this.getList();
    },
    async exportExcel() {
      const headers = [
        "券码ID",
        "金额",
        "券码描述",
        "商户",
        "核销门店",
        "商户结款",
        "渠道",
        "预付款",
        "创建时间",
        "过期时间",
        "操作时间",
        "状态",
      ];
      const keys = [
        "voucherId",
        "amount",
        "voucherDesc",
        "merchantName",
        "storeName",
        "merchantSettlement",
        "channelName",
        "advancePayment",
        "createTime",
        "expireTime",
        "operateTime",
        "specialStatus",
      ];
      const statusType = {
        0: "待核销",
        1: "已核销",
        2: "冲正",
        3: "作废",
        4: "过期",
      };
      let exportData = [];
      let arr = [];
      if (this.multipleSelection.length) {
        arr = this.multipleSelection;
      } else {
        const { data } = await orderList({
          pageSize: 1000,
          pageNum: 0,
        });
        data.list.forEach((item) => {
          item.status = item.status.toString();
          item.amount = item.amount / 100;
          item.advancePayment = item.advancePayment / 100;
          item.merchantSettlement = item.merchantSettlement / 100;
        });
        arr = data.list;
      }
      exportData = arr.map((item) => {
        item.specialStatus = statusType[item.status];
        return keys.map((key) => item[key]);
      });
      // 将表头添加到数据的第一行
      exportData.unshift(headers);
      // 创建工作簿
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      // 设置列宽度
      ws["!cols"] = [
        { wch: 15 }, // 第一列宽度为 15 个字符宽度
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 21 },
        { wch: 21 },
        { wch: 21 },
        { wch: 10 },
      ];
      const wb = XLSX.utils.book_new();
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // 导出文件
      XLSX.writeFile(wb, "table_export.xlsx");
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
.order-list {
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
      margin-right: 0px;
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
.order-list {
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
