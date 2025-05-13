<template>
  <div>
    <Search v-bind="filterAttrs" v-on="filterEvent"></Search>
    <app-table
      :list-query-params.sync="listQueryParams"
      v-bind="tableAttrs"
      v-on="tableEvent"
    />
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="572px"
    >
      <Detail
        ref="getTable"
        :title="title"
        :styleType="styleType"
        :tableData="shopForm"
        :tableFormAttrs="tableFormAttrs"
        @submitForm="submitForm"
      >
      </Detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()"
          >添 加</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AppTable from "@/components/AppTable/index.vue";
import Search from "@/components/Search/index.vue";
import Dialog from "@/components/Dialog/index.vue";
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
  name: "distributeList",
  components: {
    AppTable,
    Search,
    Dialog,
    Detail,
  },
  data() {
    return {
      title: '添加商户',
      styleType: 'dialog',
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
          label: "商户名称",
          width: "90px",
          prop: "name",
        },
        {
          label: "商户描述",
          width: "267px",
          prop: "des",
          flex: 1,
        },
        {
          label: "商户ID",
          width: "168px",
          prop: "shopName",
        },
        {
          label: "折扣率",
          width: "90",
          prop: "rate",
        },
        {
          label: "门店数",
          width: "80",
          prop: "storeNumber",
        },
        {
          label: "联系人",
          width: "70",
          prop: "contactPerson",
          // 显示时间
          // format: 'timestamp'
        },
        {
          label: "手机号",
          width: "80",
          prop: "phoneNumber",
        },
        {
          label: "邮箱",
          width: "80",
          prop: "email",
          format: "email",
        },
        // 最后一个不给宽度让表格自适应
        {
          label: "状态",
          prop: "status",
        },
      ],
      tableFormAttrs: [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          prop: "name",
          required: true,
        },
        {
          title: "Logo:",
          type: "upload",
          prop: "logo",
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          prop: "des",
        },
        {
          title: "商户ID:",
          placeholder: "系统自生成",
          type: "input",
          prop: "shopName",
          disabled: true,
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          slot: "%",
          prop: "rate",
          required: true,
        },
        {
          title: "联系人:",
          placeholder: "请输入联系人",
          type: "input",
          prop: "contactPerson",
          required: true,
        },
        {
          title: "手机号:",
          placeholder: "请输入手机号",
          type: "input",
          prop: "phoneNumber",
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
          prop: "password",
        },
      ],
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
      dialogFormVisible: false,
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
        status: "1",
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
  created() {
    this.getList();
  },
  methods: {
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          alert(1)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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


