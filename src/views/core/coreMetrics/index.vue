<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-26 18:31:38
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/core/coreMetrics/index.vue
-->
<template>
  <div class="bill-list">
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <div class="chart">
      <div id="channelAmount"></div>
      <div id="channelUnPaidAmount"></div>
      <div id="merchantCouponAmount"></div>
      <div id="merchantPaidAmount"></div>
      <div id="channelEarnAmount"></div>
      <div id="channelExpireUnPaidAmount"></div>
    </div>
  </div>
</template>

<script>
import Search from "@/components/Search/index.vue";
import echarts from "echarts";
import XLSX from "xlsx";
import { getPathName } from "@/utils/index.js";
import Cookies from "js-cookie";

import { billSerialList, coreDisplay } from "@/api/bill";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};

export default {
  name: "businessList",
  components: {
    Search,
  },
  data() {
    return {
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [],
      tableConfig: [
        {
          label: "操作类型",
          width: "95",
          value: "operationType",
        },
        {
          label: "券码金额",
          width: "80",
          value: "couponAmount",
        },
        {
          label: "券码ID",
          width: "120",
          value: "voucherId",
        },
        {
          label: "资金操作",
          width: "95",
          value: "financialOperations",
        },
        {
          label: "",
          width: "95",
          value: "amount",
        },
        {
          label: "商户金额",
          width: "80",
          value: "merchantSettlement",
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
        // {
        //   label: "导出Excel",
        //   type: "primary",
        // },
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
      // dateValue: "",
      type: +Cookies.get("type"),
      chart: null,
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
    amountDes() {
      return function (val) {
        const obj = {
          1: "渠道金额",
          2: "渠道金额",
          3: "商户金额",
          4: "门店金额",
        };
        return obj[val];
      };
    },
  },
  created() {
    // this.getList();
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    async initChart() {
      const { data } = await coreDisplay({
        startDate: this.params.startDate,
        endDate: this.params.endDate,
      });
      const {
        channelAmount,
        channelUnPaidAmount,
        merchantCouponAmount,
        merchantPaidAmount,
        channelEarnAmount,
        channelExpireUnPaidAmount,
      } = data;
      let channelAmountName = channelAmount.map((val) => val.channelName);
      let channelUnPaidAmountName = channelUnPaidAmount.map(
        (val) => val.channelName
      );
      let merchantCouponAmountName = merchantCouponAmount.map(
        (val) => val.merchantName
      );
      let merchantPaidAmountName = merchantPaidAmount.map(
        (val) => val.merchantName
      );
      let channelEarnAmountName = channelEarnAmount.map(
        (val) => val.channelName
      );
      let channelExpireUnPaidAmountName = channelExpireUnPaidAmount.map(
        (val) => val.channelName
      );

      let channelAmounts = channelAmount.map((val) => val.amount / 100);
      let channelUnPaidAmounts = channelUnPaidAmount.map(
        (val) => val.amount / 100
      );
      let merchantCouponAmounts = merchantCouponAmount.map(
        (val) => val.amount / 100
      );
      let merchantPaidAmounts = merchantPaidAmount.map(
        (val) => val.amount / 100
      );
      let channelEarnAmounts = channelEarnAmount.map((val) => val.amount / 100);
      let channelExpireUnPaidAmounts = channelExpireUnPaidAmount.map(
        (val) => val.amount / 100
      );
      this.getChart(
        "channelAmount",
        "渠道下单的券码金额汇总",
        channelAmountName,
        channelAmounts
      );
      this.getChart(
        "channelUnPaidAmount",
        "渠道金额（券码状态为：未核销，已核销）汇总",
        channelUnPaidAmountName,
        channelUnPaidAmounts
      );
      this.getChart(
        "merchantCouponAmount",
        "券码金额（券码为已核销）汇总",
        merchantCouponAmountName,
        merchantCouponAmounts
      );
      this.getChart(
        "merchantPaidAmount",
        "商户金额（券码为已核销状态）汇总",
        merchantPaidAmountName,
        merchantPaidAmounts
      );
      this.getChart(
        "channelEarnAmount",
        "平台券码核销利润汇总",
        channelEarnAmountName,
        channelEarnAmounts
      );
      this.getChart(
        "channelExpireUnPaidAmount",
        "平台券码沉淀汇总",
        channelExpireUnPaidAmountName,
        channelExpireUnPaidAmounts
      );
    },
    getChart(id, text, xAxisData, seriesData) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));

      // 指定图表的配置项和数据
      var channelAmountOption = {
        title: {
          text,
        },
        tooltip: {},
        legend: {
          data: ["金额(元)"],
        },
        xAxis: {
          data: xAxisData,
          boundaryGap: true, // 确保轴两端有空白
        },
        yAxis: {},
        series: [
          {
            // name: "金额(元)",
            type: "bar",
            data: seriesData,
            // 关键配置：显示标签
            label: {
              show: true, // 开启标签显示
              position: "top", // 标签位置（top/insideTop/inside等）
              formatter: "{c}元", // 显示数据值（{c} 代表当前数据）
            },
            barWidth: 30,
            itemStyle: {
              // ✅ 必须放在 itemStyle 内
              color: function (params) {
                const colors = [
                  "#4f7cc2",
                  "#f68754",
                  "#a6a6a6",
                  "#d48265",
                  "#91c7ae",
                  "#749f83",
                  "#ca8622",
                  "#FF8C42", // 橙色
                  "#673AB7", // 紫色
                  "#4CAF50", // 绿色
                  "#FF0000", // 红色
                  "#45B7D1", // 蓝色
                  "#FFEB3B", // 黄色
                  "#C2185B", // 粉色
                  "#795548", // 棕色
                  "#2196F3", // 亮蓝
                  "#FF6347", // 橙红
                  "#8BC34A", // 黄绿
                  "#512DA8", // 深紫
                  "#FFD700", // 金色
                  "#EC407A", // 玫红
                  "#607D8B", // 灰蓝
                  "#FF5252", // 亮红
                  "#98D8C8", // 薄荷绿
                  "#FF4500", // 橙红
                  "#7E57C2", // 紫罗兰
                  "#FFEE58", // 柠檬黄
                  "#D81B60", // 深粉
                  "#1565C0", // 深蓝
                  "#FFA07A", // 浅橙
                  "#CDDC39", // 黄绿
                  "#5E35B1", // 蓝紫
                  "#FF8E8E", // 粉红
                  "#689F38", // 橄榄绿
                  "#F06292", // 浅粉
                  "#263238", // 深灰
                  "#FFF176", // 浅黄
                ];
                return colors[params.dataIndex % colors.length];
              },
            },
            barWidth: "99%", // 关键设置（100%可能会溢出）
            barGap: "0%", // 系列间无间隙
            barCategoryGap: "0%", // 类目间无间隙
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(channelAmountOption);
    },
    // 获取列表
    async getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // this.params.date = this.dateValue;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await billSerialList(this.params);
        if (data.list) {
          data.list.forEach((item) => {
            item.couponAmount = item.couponAmount / 100;
            item.amount = item.amount / 100;
          });
        }
        this.listQueryParams.total = data.total;
        // 数据给表格
        this.tableData = data.list || [];
        this.tableConfig.forEach((item) => {
          if (item.value === "amount") {
            item.label = this.amountDes(this.type);
          }
        });
        // if ([3, 4].includes(this.type)) {
        //   this.tableConfig = this.tableConfig.filter((item) => {
        //     if ([4].includes(this.type)) {
        //       return !["channelName", "amount", 'merchantSettlement'].includes(item.value);
        //     }
        //     return !["channelName", 'merchantSettlement'].includes(item.value);
        //   });
        // }
        if ([3].includes(this.type)) {
          this.tableConfig = this.tableConfig.filter(
            (item) =>
              !["channelName", "merchantSettlement"].includes(item.value)
          );
        }
        if ([4].includes(this.type)) {
          this.tableConfig = this.tableConfig.filter(
            (item) =>
              !["channelName", "amount", "merchantSettlement"].includes(
                item.value
              )
          );
        }
        if ([2].includes(this.type)) {
          this.tableConfig = this.tableConfig.filter(
            (item) =>
              !["merchantName", "merchantSettlement"].includes(item.value)
          );
        }
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
      this.params.startDate = val[0];
      this.params.endDate = val[1];
      // this.dateValue = val;
    },
    // 分页操作
    handleRefreshList() {
      this.getList();
    },
    clickSearch() {
      // if (!this.dateValue) {
      //   this.$message.warning(" 请选择日期");
      //   return;
      // }
      this.listQueryParams.pageNum = 1; // 重置页码
      // this.getList();
      this.initChart();
    },
    async exportExcel() {
      let headers = [
        "操作类型",
        "券码金额",
        "券码ID",
        "资金操作",
        this.amountDes(this.type),
        "商户金额",
        "商户",
        "渠道",
        "流水号",
        "操作角色",
        "操作人",
        "操作备注",
        "操作端",
        "操作时间",
      ];
      let keys = [
        "operationType",
        "couponAmount",
        "voucherId",
        "financialOperations",
        "amount",
        "merchantSettlement",
        "merchantName",
        "channelName",
        "tx_no",
        "operationRole",
        "operator",
        "operationRemarks",
        "operatorTerminal",
        "operatorTime",
      ];
      // if ([3, 4].includes(this.type)) {
      //   keys = keys.filter((item) => {
      //     if ([4].includes(this.type)) {
      //       return !["channelName", "amount", "merchantSettlement"].includes(
      //         item
      //       );
      //     }
      //     return !["channelName", "merchantSettlement"].includes(item);
      //   });
      //   headers = headers.filter((item) => {
      //     if ([4].includes(this.type)) {
      //       return !["渠道", "商户金额", "门店金额"].includes(item);
      //     }
      //     return !["渠道"].includes(item);
      //   });
      // }
      if ([3].includes(this.type)) {
        keys = keys.filter((item) => {
          return !["channelName"].includes(item);
        });
        headers = headers.filter((item) => {
          return !["渠道"].includes(item);
        });
      }

      if ([4].includes(this.type)) {
        keys = keys.filter((item) => {
          return !["channelName", "amount", "merchantSettlement"].includes(
            item
          );
        });
        headers = headers.filter((item) => {
          return !["渠道", "商户金额", "门店金额"].includes(item);
        });
      }

      if ([2].includes(this.type)) {
        keys = keys.filter((item) => {
          return !["merchantName", "merchantSettlement"].includes(item);
        });
        headers = headers.filter((item) => {
          return !["商户", "商户金额"].includes(item);
        });
      }
      let exportData = [];
      let arr = [];
      if (this.multipleSelection.length) {
        arr = this.multipleSelection;
      } else {
        const { data } = await billSerialList({
          pageSize: 1000,
          pageNum: 0,
          startDate: this.params.startDate,
          endDate: this.params.endDate,
        });
        data.list.forEach((item) => {
          item.couponAmount = item.couponAmount / 100;
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
        { wch: 12 },
        { wch: 20 },
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
        { wch: 21 },
      ];
      const wb = XLSX.utils.book_new();
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // 导出文件
      XLSX.writeFile(wb, `流水记录${getPathName()}.xlsx`);
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
.chart {
  display: flex;
  flex-wrap: wrap;
  // flex-direction: column;
  width: 100%;
  background: #fff;
  padding: 20px;
  #channelAmount,
  #channelEarnAmount,
  #channelExpireUnPaidAmount,
  #channelUnPaidAmount,
  #merchantCouponAmount,
  #merchantPaidAmount {
    width: 500px;
    height: 500px;
  }
}
.bill-list {
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
