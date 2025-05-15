<template>
  <div>
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <app-table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
  </div>
</template>

<script>
import AppTable from "@/components/AppTable/index.vue";
import Search from "@/components/Search/index.vue";

import XLSX from 'xlsx'; 

import testData from "./data.json";
const DefaultTableQuery = {
  page: 1,
  limit: 10,
  total: 0,
};

export default {
  name: "orderList",
  components: {
    AppTable,
    Search,
  },
  data() {
    return {
      filterButtonText: [
        {
          label: "导出Excel",
          type: "primary",
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
      listQueryParams: { ...DefaultTableQuery },
      tableConfig: [
        {
          label: "ID",
          width: "60",
          prop: "id",
        },
        {
          label: "商户",
          width: "90",
          prop: "name",
        },
        {
          label: "门店数",
          width: "80",
          prop: "storeNumber",
        },
        {
          label: "折扣率",
          width: "80",
          prop: "rate",
        },
        {
          label: "配置渠道",
          width: "80",
          prop: "configureChannels",
        },
        {
          label: "佣金率",
          width: "80",
          prop: "commissionRate",
        },
        {
          label: "券码类型",
          width: "90",
          prop: "couponCodeType",
        },
        {
          label: "券码描述",
          width: "105",
          prop: "couponCodeDescription",
        },
        {
          label: "券码有效时间",
          width: "105",
          prop: "couponValidTime",
        },
        {
          label: "创建金额",
          width: "80",
          prop: "createAnAmount",
        },
        {
          label: "待核销金额",
          width: "80",
          prop: "amountToBeWrittenOff",
        },
        {
          label: "核销金额",
          width: "80",
          prop: "writeOffAmount",
        },
        // 最后一个不给宽度让表格自适应
        {
          label: "状态",
          prop: "status",
        },
      ],
      // 列表数据
      tableData: [],
      // 表格加载loading
      loadingStatus: false,
      // 操作栏按钮
      buttonsName: ["查看", "编辑", "删除"],
      //  操作栏宽度
      optionWidth: 148,
      params: {
        pageInfo: {
          pageSize: 10,
          pageNo: 1,
        },
      },
    };
  },
  computed: {
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
        handleFilterButton: this.exportExcel,
        clickSearch: this.clickSearch,
      };
    },
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
    exportExcel() { 
      const ws = XLSX.utils.json_to_sheet(this.tableData);  
      const wb = XLSX.utils.book_new();  
      XLSX.utils.book_append_sheet(wb,  ws, 'Sheet1'); 
      XLSX.writeFile(wb,  'table_data.xlsx');  
    },
    clickSearch() {
      console.log("🚀 ~ clickSearch ~ val:", "clickSearch");
    },
  },
};
</script>

<style>
</style>