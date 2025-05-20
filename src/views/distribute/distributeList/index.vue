<template>
  <div class="channelList">
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <Table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px">
      <div
        :class="[
          'dialog-header',
          createIndex === 1 ? 'first' : createIndex === 2 ? 'second' : '',
        ]"
      >
        <div class="dots">
          <span class="dot"></span>
          <span class="border"></span>
          <span class="dot"></span>
          <span class="border"></span>
          <span class="dot"></span>
        </div>
        <div class="names">
          <span>选择商户</span>
          <span>选择门店</span>
          <span>选择渠道</span>
        </div>
      </div>
      <template v-if="createIndex === 0">
        <Detail
          ref="getTable"
          :title="title"
          :styleType="styleType"
          :tableData="shopForm"
          :formLabelWidth="formLabelWidth"
          :tableFormAttrs="tableFormAttrs"
          @submitForm="nextSecond"
        >
        </Detail>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="nextSecond()">下一步</el-button>
        </div>
      </template>
      <template v-if="createIndex === 1">
        <dialog-table
          :list-query-params.sync="listQueryParams"
          :dialogTableConfig="dialogTableConfigSecond"
          :dialogTableData="dialogTableDataSecond"
        />
        <div slot="footer" class="dialog-footer">
          <el-button class="previousButton" @click="createIndex = 0">上一步</el-button>
          <el-button class="nextButton" type="primary" @click="createIndex = 2">下一步</el-button>
        </div>
      </template>
      <template v-if="createIndex === 2">
        <dialog-table
          :list-query-params.sync="listQueryParams"
          :dialogTableConfig="dialogTableConfigThird"
          :dialogTableData="dialogTableDataThird"
        />
        <div slot="footer" class="dialog-footer">
          <el-button class="previousButton" @click="createIndex = 1">上一步</el-button>
          <el-button class="nextButton" type="primary" @click="submitDialogForm">发布</el-button>
        </div></template>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Search from "@/components/Search/index.vue";
import DialogTable from "@/components/DialogTable/index.vue";
import Detail from "@/components/Detail/index.vue";

// 定义的接口根据自己项目更换
// import TalentServe from '@/api/talent'
import testData from "./data.json";
//  表格查询参数
const DefaultTableQuery = {
  page: 1,
  limit: 10,
  total: 0,
};

export default {
  name: "channelList",
  components: {
    Table,
    Search,
    Detail,
    DialogTable,
  },
  data() {
    return {
      title: "创建分发（1/3）",
      createIndex: 0,
      formLabelWidth: "97px",
      styleType: "dialog",
      // 表格加载loading
      loadingStatus: false,
      //  操作栏宽度
      optionWidth: 148,
      // 表头配置  prop字段和服务端数据给的字段一致
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
      tableFormAttrs: [
        {
          title: "商户:",
          placeholder: "请选择商户",
          type: "select",
          prop: "shopPerson",
          required: true,
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
          ],
        },
        {
          title: "商户ID:",
          placeholder: "系统自生成",
          type: "input",
          prop: "shopId",
          disabled: true,
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          slot: "%",
          prop: "rate",
          disabled: true,
        },
        {
          title: "券码类型:",
          placeholder: "请选择券码类型",
          type: "select",
          prop: "couponType",
          required: true,
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
          ],
        },
        {
          title: "券码有效期:",
          placeholder: "请输入券码有效期",
          type: "input",
          slot: "小时",
          prop: "couponTime",
          required: true,
        },
        {
          title: "券码描述:",
          placeholder: "请输入渠道描述",
          type: "textarea",
          prop: "des",
        },
      ],
      dialogTableConfigSecond: [
        {
          label: "ID",
          width: "60",
          prop: "id",
        },
        {
          label: "门店",
          width: "90",
          prop: "store",
        },
        {
          label: "门店地址",
          width: "225",
          prop: "storeAddress",
        },
        {
          label: "门店ID",
          width: "225",
          prop: "storeId",
        },
      ],
      dialogTableConfigThird: [
        {
          label: "ID",
          width: "60",
          prop: "id",
        },
        {
          label: "渠道",
          width: "90",
          prop: "store",
        },
        {
          label: "渠道描述",
          width: "150",
          prop: "storeDes",
        },
        {
          label: "门店ID",
          width: "150",
          prop: "storeId",
        },
        {
          label: "佣金率",
          width: "150",
          prop: "commissionRate",
          format: 'input'
        },
      ],
      dialogTableDataSecond: [
        {
          id: "1",
          store: "麦当劳",
          storeAddress: "这里是门店地址",
          storeId: "022A15EFC727DCAD",
        },
        {
          id: "1",
          store: "麦当劳",
          storeAddress: "这里是门店地址",
          storeId: "022A15EFC727DCAD",
        },
        {
          id: "1",
          store: "麦当劳",
          storeAddress: "这里是门店地址",
          storeId: "022A15EFC727DCAD",
        },
      ],
      dialogTableDataThird: [
        {
          id: "1",
          store: "麦当劳",
          storeDes: "这里是渠道描述",
          storeId: "022A15EFC727DCAD",
          commissionRate: "",
        },
        {
          id: "1",
          store: "麦当劳",
          storeDes: "这里是渠道描述",
          storeId: "022A15EFC727DCAD",
          commissionRate: "",
        },
        {
          id: "1",
          store: "麦当劳",
          storeDes: "这里是渠道描述",
          storeId: "022A15EFC727DCAD",
          commissionRate: "",
        },
      ],
      shopForm: {
        shopPerson: "",
        shopId: "",
        rate: "",
        couponType: "",
        couponTime: "",
        des: "",
      },
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      // 列表数据
      tableData: [],
      // url参数
      params: {
        pageInfo: {
          pageSize: 10,
          pageNo: 1,
        },
      },
      // 操作栏按钮
      buttonsName: ["查看", "编辑", "删除"],
      // 选择数据
      selectData: [],
      // 操作数据
      operationalData: {},
      filterButtonText: [
        {
          label: "创建分发",
          type: "primary",
        },
        {
          label: "删除分发",
          type: "info",
        },
      ],
      filterOptions: [
        {
          type: "multiSelect",
          placeholder: "商户",
          inputValue: "",
          isSearch: false,
          inputWidth: "136px",
          selectWidth: "90px",
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
        {
          type: "multiSelect",
          placeholder: "渠道",
          inputValue: "",
          isSearch: false,
          inputWidth: "136px",
          selectWidth: "90px",
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
        {
          type: "button",
        },
      ],
      dialogFormVisible: false,
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
    filterAttrs() {
      return {
        // 按钮名称
        filterButtonText: this.filterButtonText,
        filterOptions: this.filterOptions,
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
    filterEvent() {
      return {
        // 选择数据回调
        handleFilterButton: this.handleFilterButton,
        clickSearch: this.clickSearch,
      };
    },
  },
  watch: {
    createIndex: {
      handler: function(val, oldVal) {
        const arr = ['创建分发（1/3）','创建分发（2/3）','创建分发（3/3）'];
        return this.title = arr[val];
      },
      immediate: true
    },
  },
  created() {
    this.getList();
  },
  methods: {
    nextSecond() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          this.createIndex = 1;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitDialogForm() {
      console.log("🚀 ~ submitDialogForm ~ submitDialogForm:", "submitDialogForm")
    },
    clickSearch() {
      console.log("🚀 ~ clickSearch ~ val:", "clickSearch");
    },
    handleFilterButton(val) {
      console.log("🚀 ~ handleFilterButton ~ val:", val);
      if (val === "创建分发") {
        this.dialogFormVisible = true;
      }
      if (val === "删除分发") {
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
    // 获取列表
    getList() {
      console.log("🚀 ~ getList ~ getList:", this.$route.path)
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
.channelList {
  .dialog-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 66px;
    padding-top: 20px;
    .dots {
      display: flex;
      justify-content: center;
      align-items: center;
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #1890ff;
        margin: 0 4px;
      }
      .dot:nth-child(1) {
        width: 10px;
        height: 10px;
      }
      .border {
        width: 122px;
        height: 3px;
        background-color: #f0f0f0;
      }
    }
    .names {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      margin-top: 10px;
      line-height: 1;
      font-weight: normal;
      span:nth-child(2) {
        margin: 0 75px;
      }
      span:nth-child(1) {
        color: rgba(0, 0, 0, 0.85);
        font-weight: bold;
      }
    }
  }
  .dialog-header.first {
    .dot:nth-child(1) {
      width: 8px;
      height: 8px;
    }
    .dot:nth-child(3) {
      width: 10px;
      height: 10px;
    }
    .border:nth-child(2) {
      background-color: #1890ff;
    }
    .names {
      span {
        font-weight: normal;
      }
      span:nth-child(2) {
        color: rgba(0, 0, 0, 0.85);
        font-weight: bold;
      }
    }
  }
  .dialog-header.second {
    .dot:nth-child(1) {
      width: 8px;
      height: 8px;
    }
    .dot:nth-child(5) {
      width: 10px;
      height: 10px;
    }
    .border {
      background-color: #1890ff;
    }
    .names {
      span {
        font-weight: normal;
      }
      span:nth-child(3) {
        color: rgba(0, 0, 0, 0.85);
        font-weight: bold;
      }
    }
  }
  .el-dialog__body {
    padding: 0px 60px 20px;
  }
  .el-input-group__append {
    padding: 0 10px;
  }
}
</style>


