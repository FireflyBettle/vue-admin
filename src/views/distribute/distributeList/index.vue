<template>
  <div>
    <!-- <Search></Search> -->
    <app-table :list-query-params.sync="listQueryParams" v-bind="tableAttrs" v-on="tableEvent" />
  </div>
</template>

<script>
import AppTable from '@/components/AppTable/index.vue'
import Search from "@/components/Dialog/index.vue";
// 定义的接口根据自己项目更换
// import TalentServe from '@/api/talent'
import testData from './data.json'
//  表格查询参数
const DefaultTableQuery = {
  page: 1,
  limit: 10,
  total: 0
}

export default {
  name: 'distributeList',
  components: {
    AppTable,
    Search
  },
  data() {
    return {
      // 表格加载loading
      loadingStatus: false,
      //  操作栏宽度
      optionWidth: 148,
      // 表头配置  prop字段和服务端数据给的字段一致
      tableConfig: [
        {
          label: 'ID',
          width: '59',
          prop: 'id',
        },
        {
          label: '商户名称',
          width: '90px',
          prop: 'name'
        },
        {
          label: '商户描述',
          width: '120px',
          prop: 'des'
        },
        {
          label: '商户ID',
          width: '120px',
          prop: 'shopName'
        },
        {
          label: '折扣率',
          width: '70',
          prop: 'rate'
        },
        {
          label: '门店数',
          width: '70',
          prop: 'storeNumber'
        },
        {
          label: '联系人',
          width: '80',
          prop: 'contactPerson',
          // 显示时间
          // format: 'timestamp'
        },
        {
          label: '手机号',
          width: '70',
          prop: 'phoneNumber'
        },
        {
          label: '邮箱',
          width: '90',
          prop: 'email',
          format: 'email'
        },
        // 最后一个不给宽度让表格自适应
        {
          label: '状态',
          prop: 'status'
        }
      ],
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      // 列表数据
      tableData: [],
      // url参数
      params: {
        pageInfo: {
          pageSize: 10,
          pageNo: 1
        }
      },
      // 操作栏按钮
      buttonsName: ['查看', '编辑', '删除'],
      // 选择数据
      selectData: [],
      // 操作数据
      operationalData: {}
    }
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
        isSelection: true
      }
    },
    // 表格事件
    tableEvent() {
      return {
        // 按钮操作
        subOpitonButton: this.handleTableOption,
        // 分页
        subClickPagination: this.handleRefreshList,
        // 表格数据选择
        subSelected: this.handleSelectionChange
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
     getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true
        // 分页数据作为参数给服务端
        this.params.pageInfo.pageSize = this.listQueryParams.limit
        this.params.pageInfo.pageNo = this.listQueryParams.page
        // 发送请求,请求到的数据格式见下文，
        // const { data, cntData } = await TalentServe.getTalentList(this.params)
        const { data, cntData } = testData
        console.log("🚀 ~ getList ~ testData:", testData)
        const tableData = data || []
        // 分页组件显示  this.listQueryParams.total 值大于0才会出现
        this.listQueryParams.total = cntData
        // 数据给表格
        this.tableData = data
        this.loadingStatus = false
      } catch (error) {
        console.log(error)
      }
    },

    // 表格操作功能 index：表格索引, row：表格行数据, option：按钮名称
    handleTableOption(index, row, option) {
      this.operationalData = { ...row }
      if (option === '查看') {
        console.log(index, row, option)
      } else if (option === '编辑') {
        console.log(index, row, option)
      } else if (option === '删除') {
        console.log(index, row, option)
      }
    },

    // 选择的数据回调
    handleSelectionChange(data) {
      console.log("🚀 ~ handleSelectionChange ~ data:", data)
    },

    // 分页操作
    handleRefreshList() {
      this.getList()
    }
  }
}
</script>


