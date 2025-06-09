<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-09 16:06:43
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/distribute/distributeList/index.vue
-->
<template>
  <div class="distribute-list">
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
          :filterDataRules="filterDataRules"
          :tableFormAttrs="tableFormAttrs"
          @selectChange="selectChange"
          @submitForm="nextSecond"
        >
        </Detail>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="nextSecond()">下一步</el-button>
        </div>
      </template>
      <template v-if="createIndex === 1">
        <Table
          v-if="Object.keys(dialogTableDataSecond).length"
          :listLoading="loadingStatusSecond"
          :list-query-params.sync="secondListQueryParams"
          :config="dialogTableConfigSecond"
          :tableData="dialogTableDataSecond"
          :isMulSelect="true"
          :isHasButtons="false"
          :isShowNumber="true"
          :initCheckData="checkData"
          :initRadio="initRadio"
          @subClickPagination="handleSizeChange"
          @subCheckAll="subCheckAll"
          @subCheckedData="handleCurrentChange"
        />
        <template v-else>
          <div class="empty">暂无数据</div>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button class="previousButton" @click="createIndex = 0"
            >上一步</el-button
          >
          <el-button class="nextButton" type="primary" @click="nextThird"
            >下一步</el-button
          >
        </div>
      </template>
      <template v-if="createIndex === 2">
        <Table
          :listLoading="loadingStatusThird"
          :list-query-params.sync="thirdListQueryParams"
          :config="dialogTableConfigThird"
          :tableData="dialogTableDataThird"
          :isRadio="true"
          :isHasButtons="false"
          :isShowNumber="true"
          @subClickPagination="handleSizeChangeThird"
          @getCurrentRow="getCurrentRow"
        />
        <div slot="footer" class="dialog-footer">
          <el-button class="previousButton" @click="createIndex = 1"
            >上一步</el-button
          >
          <el-button class="nextButton" type="primary" @click="submitDialogForm"
            >发布</el-button
          >
        </div></template
      >
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Detail from "@/components/Detail/index.vue";
import Search from "@/components/Search/index.vue";
import DialogTable from "@/components/DialogTable/index.vue";
import Cookies from "js-cookie";

import {
  createDistribution,
  distributionList,
  updateDistribution,
  applyCoupon,
} from "@/api/distribute.js";
import { channelList } from "@/api/channel.js";
import { merchantList, storesList } from "@/api/business.js";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};
const secondDefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};
const thirdDefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};

export default {
  name: "businessList",
  components: {
    Table,
    Detail,
    Search,
    DialogTable,
  },
  data() {
    return {
      title: "创建分发（1/3）",
      createIndex: 0,
      formLabelWidth: "97px",
      shopForm: {},
      styleType: "dialog",
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      secondListQueryParams: { ...secondDefaultTableQuery },
      thirdListQueryParams: { ...thirdDefaultTableQuery },
      tableData: [],
      tableFormAttrs: [
        {
          title: "商户:",
          placeholder: "请选择商户",
          type: "select",
          value: "merchantId",
          required: true,
          options: [],
        },
        {
          title: "商户ID:",
          placeholder: "系统自动生成",
          type: "input",
          value: "merchantId",
          disabled: true,
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          value: "discountRate",
          disabled: true,
        },
        {
          title: "券码金额",
          placeholder: "请选择券码金额",
          type: "select",
          inputType: "number",
          value: "couponAmount",
          required: true,
          options: [
            {
              label: '自定义',
              value: 0
            }
          ]
        },
        {
          title: "券码有效期",
          placeholder: "请输入券码有效期",
          type: "input",
          slot: "小时",
          value: "effectiveTime",
          required: true,
        },
        {
          title: "券码描述",
          placeholder: "请输入券码描述",
          type: "input",
          value: "couponDesc",
        },
      ],
      tableConfig: [
        {
          label: "商户名称",
          width: "90",
          value: "merchantName",
        },
        {
          label: "门店数",
          width: "80",
          value: "storeNumber",
        },
        {
          label: "折扣率",
          width: "70",
          value: "discountRate",
          format: "rate",
        },
        {
          label: "配置渠道",
          width: "80",
          value: "channelName",
        },
        {
          label: "佣金率",
          width: "70",
          value: "commissionRate",
          format: "rate",
        },
        {
          label: "券码金额",
          width: "90",
          value: "couponAmount",
        },
        {
          label: "券码描述",
          width: "105",
          value: "couponDesc",
        },
        {
          label: "券码有效时间",
          width: "105",
          value: "effectiveTime",
        },
        {
          label: "创建金额",
          width: "80",
          value: "createAmount",
        },
        {
          label: "待核销金额",
          width: "80",
          value: "pendingAmount",
        },
        {
          label: "核销金额",
          width: "80",
          value: "pendedAmount",
        },
        {
          label: "状态",
          width: "80",
          format: "status",
          value: "status",
        },
      ],
      dialogFormAttrs: [
        {
          title: "商户名称:",
          placeholder: "请输入商户名称",
          type: "input",
          value: "merchantName",
          required: true,
        },
        {
          title: "Logo:",
          type: "upload",
          value: "merchantLogo",
        },
        {
          title: "商户描述:",
          placeholder: "请输入商户描述",
          type: "textarea",
          value: "merchantDesc",
        },
        {
          title: "折扣率:",
          placeholder: "请输入折扣率",
          type: "input",
          inputType: "number",
          slot: "%",
          value: "discountRate",
          required: true,
        },
        {
          title: "联系人:",
          placeholder: "请输入联系人",
          type: "input",
          value: "contact",
          required: true,
        },
        {
          title: "手机号:",
          placeholder: "请输入手机号",
          type: "input",
          value: "phone",
          inputType: "number",
          required: true,
        },
        {
          title: "邮箱:",
          placeholder: "请输入邮箱",
          type: "input",
          value: "email",
          required: true,
        },
        {
          title: "状态:",
          placeholder: "请输入邮箱",
          type: "radio",
          value: "status",
        },
        {
          title: "密码:",
          placeholder: "请输入密码",
          type: "input",
          inputType: "text",
          value: "passwd",
          isClosePwd: true,
        },
      ],
      dialogTableConfigSecond: [
        {
          label: "门店",
          width: "90",
          value: "storeName",
        },
        {
          label: "门店地址",
          width: "225",
          value: "storeAddr",
        },
        {
          label: "门店ID",
          width: "225",
          value: "storeId",
        },
      ],
      dialogTableConfigThird: [
        {
          label: "渠道",
          width: "90",
          value: "channelName",
        },
        {
          label: "渠道描述",
          width: "150",
          value: "channelDesc",
        },
        {
          label: "门店ID",
          width: "150",
          value: "channelId",
        },
        {
          label: "佣金率",
          width: "150",
          value: "commissionRate",
          format: "input",
        },
      ],
      dialogTableDataSecond: [],
      dialogTableDataThird: [],
      // 表格加载loading
      loadingStatus: false,
      loadingStatusSecond: false,
      loadingStatusThird: false,
      buttonsName: [
        {
          label: "查看",
          route: "distributeId",
        },
        {
          label: "编辑",
        },
        {
          label: process.env.NODE_ENV === "production" ? "" : "发券",
        },
      ],
      optionWidth: 148,
      dialogFormVisible: false,
      // url参数
      params: {
        pageSize: 10,
        pageNum: 0,
        merchantId: "",
        channelId: "",
      },
      secondParams: {
        pageSize: 10,
        pageNum: 0,
        merchantId: "",
        channelId: "",
      },
      thirdParams: {
        pageSize: 10,
        pageNum: 0,
        merchantId: "",
        channelId: "",
      },
      filterButtonText: [
        {
          label: "创建分发",
          type: "primary",
        },
        // {
        //   label: "删除商户",
        //   type: "info",
        // },
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
          selectWidth: "110px",
          noShowInput: true,
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
      filterDataRules: ["merchantId", "couponAmount", "effectiveTime"],
      currentCannelId: "",
      initCheckData: [],
      checkData: [],
      initRadio: "",
      isEdit: false,
      type: +Cookies.get('type'),
      merchantList: [],
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
        isSelection: false,
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
  watch: {
    createIndex: {
      handler: function (val, oldVal) {
        let arr = [];
        if (this.isEdit) {
          arr = ["编辑分发（1/3）", "编辑分发（2/3）", "编辑分发（3/3）"];
        } else {
          arr = ["创建分发（1/3）", "创建分发（2/3）", "创建分发（3/3）"];
        }
        return (this.title = arr[val]);
      },
      immediate: true,
    },
    isEdit: {
      handler: function (val) {
        let title = "";
        if (val) {
          title = "编辑分发（1/3）";
        } else {
          title = "创建分发（1/3）";
        }
        return (this.title = title);
      },
      immediate: true,
    },
  },
  created() {
    this.init();
    this.getList();
    // this.getDialogThirdList();
  },
  methods: {
    handleSizeChange(val) {
      // console.log("🚀 ~ handleSizeChange ~ val:", val)
      // this.secondListQueryParams.pageSize = val;
      this.getStoreList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChangeThird(val) {
      // this.thirdListQueryParams.pageSize = val;
      this.getCannelList();
    },
    // handleCurrentChangeThird(val) {
    //   console.log("🚀 ~ handleCurrentChangeThird ~ val:", val)
    //   this.thirdListQueryParams.pageNum = val;
    //   this.getCannelList();
    // },
    getCurrentRow(val) {
      this.currentCannelId = val;
    },
    // 获取列表
    init() {
      if (this.type === 2) {
        this.filterButtonText = [];
      }
      const params = {
        ...this.params,
        pageSize: 1000,
        pageNum: 0,
      };
      merchantList(params).then((res) => {
        this.merchantList = res.data.list;
        this.filterOptions[0].options = res.data.list.map((val) => {
          return {
            value: val.merchantId,
            label: val.merchantName,
          };
        });
        this.tableFormAttrs.forEach((item) => {
          if (item.value === "merchantId") {
            item.options = this.merchantList.map((val) => {
              return {
                value: val.merchantId,
                label: val.merchantName,
              };
            });
          }
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
    },
    async getList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        // 分页数据作为参数给服务端
        this.params.pageSize = this.listQueryParams.pageSize;
        this.params.pageNum = this.listQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await distributionList(this.params);
        if (data.list) {
          data.list.forEach((item) => {
            item.discountRate = parseInt(item.discountRate * 100);
            item.status = item.status.toString();
            item.storeNumber = item.storeIds
              ? item.storeIds.split(",").length
              : 0;
            item.couponAmount = parseInt(item.couponAmount / 100);
            item.createAmount = parseInt(item.createAmount / 100);
            item.pendingAmount = parseInt(item.pendingAmount / 100);
            item.pendedAmount = parseInt(item.pendedAmount / 100);
            item.commissionRate = parseInt(item.commissionRate * 100);
          });
        }
        this.listQueryParams.total = data.total;
        // 数据给表格
        this.tableData = data.list || [];
        if ([2].includes(this.type)) {
          this.tableConfig = this.tableConfig.filter(
            (item) => !["discountRate"].includes(item.value)
          );
        }
        this.loadingStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 发布
    async submitDialogForm() {
      const params = {
        merchantId: this.shopForm.merchantId,
        couponDesc: this.shopForm.couponDesc,
        storeIds: this.shopForm.storeIds,
        couponAmount: this.shopForm.couponAmount * 100,
        effectiveTime: +this.shopForm.effectiveTime,
      };
      this.dialogTableDataThird.forEach((item) => {
        if (this.currentCannelId === item.channelId) {
          params.commissionRate = item.commissionRate
            ? item.commissionRate / 100
            : "";
          params.channelId = item.channelId;
        }
      });
      if (params.commissionRate === "") {
        this.$message.error("请填写佣金率");
        return;
      }
      if (this.isEdit) {
        // params.channelId = this.shopForm.channelId;
        // params.commissionRate = this.shopForm.commissionRate / 100;
        params.distributeId = this.shopForm.distributeId;
        await updateDistribution(params);
      } else {
        await createDistribution(params);
      }
      this.getList();
      this.$message.success("发布成功");
      this.shopForm = {};
      this.initCheckData = [];
      this.checkData = [];
      this.createIndex = 0;
      this.dialogFormVisible = false;
    },
    //门店列表
    async getStoreList() {
      try {
        // 表格加载loading
        this.dialogTableDataSecond = [];
        this.loadingStatusSecond = true;
        const params = {};
        // 分页数据作为参数给服务端
        params.pageSize = this.secondListQueryParams.pageSize;
        params.pageNum = this.secondListQueryParams.pageNum - 1;
        params.searchKey = "merchantId";
        params.searchVal = this.shopForm.merchantId;
        const { data } = await storesList(params);
        this.secondListQueryParams.total = data.total;
        if (data.list) {
          const storeIds = data.list.map((val) => val.storeId);
          const intersection = storeIds.filter((item) =>
            this.initCheckData.includes(item)
          );
          this.checkData = intersection;
        } else {
          this.shopForm.storeIds = "";
        }
        // this.shopForm.storeIds = this.initCheckData.join(",");

        // this.initCheckData = [];
        this.dialogTableDataSecond = data.list || [];
        this.loadingStatusSecond = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 渠道列表
    async getCannelList() {
      try {
        // 表格加载loading
        this.loadingStatusThird = true;
        const params = {};
        // 分页数据作为参数给服务端
        params.pageSize = this.thirdListQueryParams.pageSize;
        params.pageNum = this.thirdListQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await channelList(params);
        this.thirdListQueryParams.total = data.total;
        // 数据给表格
        data.list.forEach((val) => {
          if (this.shopForm.channelId === val.channelId) {
            val.commissionRate = this.shopForm.commissionRate;
          }
        });
        this.dialogTableDataThird = data.list || [];
        // this.dialogTableDataThird[0].commissionRate = 20;
        this.loadingStatusThird = false;
      } catch (error) {
        console.log(error);
      }
    },
    subCheckAll(val) {
      console.log(
        "🔍 ~ subCheckAll ~ src/views/distribute/distributeList/index.vue:721 ~ val:",
        val
      );
      let params = val.join(",");
      this.shopForm.storeIds = params;
    },
    handleCurrentChange(val) {
      console.log(
        "🔍 ~ handleCurrentChange ~ src/views/distribute/distributeList/index.vue:719 ~ val:",
        val
      );
      let params = val.join(",");
      this.shopForm.storeIds = params;
      // this.secondListQueryParams.pageNum = val;
      // this.getStoreList();
    },
    subCheckedData(val) {
      console.log(
        "🔍 ~ subCheckedData ~ src/views/distribute/distributeList/index.vue:726 ~ val:",
        val
      );
      let params = val.join(",");
      this.shopForm.storeIds = params;
    },
    selectChange(val) {
      this.merchantList.forEach(item => {
        if (item.merchantId === val) {
          this.shopForm.merchantId = item.merchantId;
          this.shopForm.discountRate = item.discountRate * 100;
        }
      })
    console.log("🚀 ~ selectChange ~ val:", val)

    },
    // 点击下一步（第二步）
    nextSecond() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          this.createIndex = 1;
          this.getStoreList();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击下一步（第三步）
    nextThird() {
      this.createIndex = 2;
      // this.isRadio = false;
      this.getCannelList();
    },
    handleFilter(val) {
      this.params.merchantId =
        val.placeholder === "商户" ? val.selectValue : this.params.merchantId;
      this.params.channelId =
        val.placeholder === "渠道" ? val.selectValue : this.params.channelId;
    },
    // 点击编辑
    handleTableOption(index, row, option) {
      this.operationalData = { ...row };
      if (option.label === "查看") {
        console.log(index, row, option);
      } else if (option.label === "编辑") {
        var row = JSON.parse(JSON.stringify(row));
        row.couponAmount = 0;
        this.createIndex = 0;
        this.dialogFormVisible = true;
        this.isEdit = true;
        this.shopForm = row;
        this.initCheckData = row.storeIds.split(",");
        this.initRadio = row.channelId;
        console.log(index, row, option);
      } else if (option.label === "发券") {
        applyCoupon({
          distributeId: row.distributeId
        }).then( res => {
          this.$message.success('发券成功');
          this.getList();
        });
        console.log(index, row, option);
      }
    },
    // 分页操作
    handleRefreshList() {
      this.getList();
    },
    clickSearch(val) {
      this.params.searchKey = val.selectValue;
      this.params.searchVal = val.inputValue;
      this.listQueryParams.pageNum = 1; // 重置页码
      this.getList();
    },
    // 点击创建分发按钮
    handleFilterButton(val) {
      if (val === "创建分发") {
        this.dialogFormVisible = true;
        this.isEdit = false;
        this.createIndex = 0;
        this.shopForm = {};
        this.initCheckData = [];
        this.initRadio = "";
      }
    },
  },
};
</script>
<style lang="scss">
.distribute-list {
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
  .el-radio {
    margin-left: 10px;
  }
  .pagination-container {
    .el-pagination {
      text-align: right;
      margin-top: 16px;
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      background: #fff;
      border: 1px solid #d9d9d9;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #fff;
      color: #1890ff;
      border: 1px solid #1890ff;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.distribute-list {
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
  .empty {
    text-align: center;
    margin-top: 20px;
    color: #939393;
  }

  .limit-reached {
    color: #f56c6c;
    font-weight: bold;
  }
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
