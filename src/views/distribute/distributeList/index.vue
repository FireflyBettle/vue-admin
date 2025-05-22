<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-22 18:27:40
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
          @submitForm="nextSecond"
        >
        </Detail>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="nextSecond()">下一步</el-button>
        </div>
      </template>
      <template v-if="createIndex === 1">
        <el-table
          ref="singleTable"
          v-loading="false"
          :data="dialogTableDataSecond"
          element-loading-text="加载中..."
          :header-cell-style="{ backgroundColor: '#FAFAFA', color: '#333' }"
          empty-text="暂无数据"
          @selection-change="handleSecondSelectionChange"
        >
          <el-table-column
            fixed="left"
            type="index"
            label="ID"
            :index="1"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in dialogTableConfigSecond"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-checkbox-group
              v-model="checkbox"
                @change="handleCheckedCitiesChange"
              >
              <el-checkbox
                :label="scope.row.storeId"
                >{{ "" }}</el-checkbox
              >
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="secondListQueryParams.total > 0"
          class="pagination-container"
        >
          <el-pagination
            background
            layout="sizes, prev, pager, next, jumper"
            :page-sizes="[1, 2, 30, 50, 100]"
            :current-page="secondListQueryParams.pageNum"
            :page-size="secondListQueryParams.pageSize"
            :total="secondListQueryParams.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </div>
        <!-- <dialog-table
          :list-query-params.sync="secondListQueryParams"
          :dialogTableConfig="dialogTableConfigSecond"
          :dialogTableData="dialogTableDataSecond"
          :isSelection="isSelection"
          @subSelected="handleSecondSelectionChange"
          :isShowNumber="true"
        /> -->
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
        <el-table
          ref="getThirdTable"
          v-loading="false"
          :data="dialogTableDataThird"
          element-loading-text="加载中..."
          :header-cell-style="{ backgroundColor: '#FAFAFA', color: '#333' }"
          empty-text="暂无数据"
        >
          <el-table-column
            fixed="left"
            type="index"
            label="ID"
            :index="1"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in dialogTableConfigThird"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="item.format === 'input'">
                <el-input v-model="scope.row[item.prop]">
                  <template slot="append">%</template>
                </el-input>
              </span>
              <span> {{ scope.row[item.prop] }} </span>
            </template>
          </el-table-column>
          <el-table-column width="55" label="选择">
            <template slot-scope="scope">
              <el-radio
                class="radio"
                :label="scope.row.channelId"
                v-model="radio"
                @change.native="getCurrentRow(scope.row)"
                >{{ "" }}</el-radio
              >
            </template>
          </el-table-column>
        </el-table>
        <div v-if="thirdListQueryParams.total > 0" class="pagination-container">
          <el-pagination
            background
            layout="sizes, prev, pager, next, jumper"
            :page-sizes="[1, 2, 30, 50, 100]"
            :current-page="thirdListQueryParams.pageNum"
            :page-size="thirdListQueryParams.pageSize"
            :total="thirdListQueryParams.total"
            @current-change="handleCurrentChangeThird"
            @size-change="handleSizeChangeThird"
          ></el-pagination>
        </div>
        <!-- <dialog-table
          ref="getThirdTable"
          :list-query-params.sync="thirdListQueryParams"
          :dialogTableConfig="dialogTableConfigThird"
          :dialogTableData="dialogTableDataThird"
          :isRadio="isRadio"
          :isShowNumber="true"
          @subSelected="handleThirdSelectionChange"
        /> -->
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
import md5 from "js-md5";

import {
  createDistribution,
  distributionList,
  updateDistribution,
} from "@/api/distribute.js";
import { channelList } from "@/api/channel.js";
import { merchantList, storesList } from "@/api/business.js";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};
const secondDefaultTableQuery = {
  pageNum: 1,
  pageSize: 2,
};
const thirdDefaultTableQuery = {
  pageNum: 1,
  pageSize: 2,
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
      createIndex: 2,
      radio: "",
      checkbox: [],
      formLabelWidth: "97px",
      shopForm: {},
      sureButtonsName: "添加",
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
          value: "merchantIds",
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
          placeholder: "请输入券码金额",
          type: "input",
          inputType: "number",
          value: "couponAmount",
          required: true,
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
          value: "storeIds",
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
          prop: "storeName",
        },
        {
          label: "门店地址",
          width: "225",
          prop: "storeAddr",
        },
        {
          label: "门店ID",
          width: "225",
          prop: "storeId",
        },
      ],
      dialogTableConfigThird: [
        {
          label: "渠道",
          width: "90",
          prop: "channelName",
        },
        {
          label: "渠道描述",
          width: "150",
          prop: "channelDesc",
        },
        {
          label: "门店ID",
          width: "150",
          prop: "channelId",
        },
        {
          label: "佣金率",
          width: "150",
          prop: "commissionRate",
          format: "input",
        },
      ],
      dialogTableDataSecond: [
        {
          storeName: "麦当劳",
          storeAddr: "这里是门店地址",
          storeId: "022A15EFC727DCAD",
        },
        {
          storeName: "麦当劳",
          storeAddr: "这里是门店地址",
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
      ],
      // 表格加载loading
      loadingStatus: false,
      buttonsName: [
        {
          label: "查看",
          route: "distributeId",
        },
        {
          label: "编辑",
        },
      ],
      optionWidth: 148,
      dialogFormVisible: false,
      dialogForm: {
        merchantName: "",
        merchantDesc: "",
        merchantLogo: "",
        discountRate: "",
        contact: "",
        phone: "",
        email: "",
        status: "",
        passwd: "",
      },
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
          label: "添加商户",
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
        const arr = ["创建分发（1/3）", "创建分发（2/3）", "创建分发（3/3）"];
        if (val === 1) {
          // this.$nextTick(() => {
          (this.isSelection = true), (this.isRadio = false);
          // })
        }
        if (val === 2) {
          // this.$nextTick(() => {
          (this.isSelection = false), (this.isRadio = true);
          // })
        }
        return (this.title = arr[val]);
      },
      immediate: true,
    },
  },
  created() {
    this.init();
    this.getList();
    this.getStoreList();
    this.getCannelList();
    // this.getDialogThirdList();
  },
  methods: {
    handleSizeChange(val) {
      this.secondListQueryParams.pageSize = val;
      this.getStoreList();
    },
    handleSizeChangeThird(val) {
      this.thirdListQueryParams.pageSize = val;
      this.getCannelList();
    },
    handleCurrentChange(val) {
      this.secondListQueryParams.pageNum = val;
      this.getStoreList();
    },
    handleCurrentChangeThird(val) {
      this.thirdListQueryParams.pageNum = val;
      this.getCannelList();
    },
    getCurrentRow(val) {
      this.templateSelection = val;
      console.log("🚀 ~ getCurrentRow ~ val:", val);
    },
    handleCheckedCitiesChange(value) {
      console.log("🚀 ~ handleCheckedCitiesChange ~ value:", value);
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 获取列表
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
        this.tableFormAttrs.forEach((item) => {
          if (item.value === "merchantId") {
            item.options = res.data.list.map((val) => {
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
    submitDialogForm() {
      console.log(
        "🚀 ~ submitDialogForm ~ submitDialogForm:",
        "submitDialogForm"
      );
    },
    async getStoreList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        const params = {};
        // 分页数据作为参数给服务端
        params.pageSize = this.secondListQueryParams.pageSize;
        params.pageNum = this.secondListQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await storesList(params);
        this.secondListQueryParams.total = data.total;
        // 数据给表格
        this.dialogTableDataSecond = data.list || [];
        this.loadingStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getCannelList() {
      try {
        // 表格加载loading
        this.loadingStatus = true;
        const params = {};
        // 分页数据作为参数给服务端
        params.pageSize = this.thirdListQueryParams.pageSize;
        params.pageNum = this.thirdListQueryParams.pageNum - 1;
        // 发送请求,请求到的数据格式见下文，
        const { data } = await channelList(params);
        this.thirdListQueryParams.total = data.total;
        // 数据给表格
        this.dialogTableDataThird = data.list || [];
        this.loadingStatus = false;

        this.$nextTick(() => {
          // 假设默认选择 id 为 1 和 2 的行
          const defaultSelectedRows = this.dialogTableDataThird.filter((item) =>
            ["channel_50008"].includes(item.appId)
          );
          defaultSelectedRows.forEach((row) => {
            this.$nextTick(() => {
              // this.$refs.getThirdTable
              //   .toggleRowSelection(row, true);
            });
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
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
    nextThird() {
      this.createIndex = 2;
      // this.isRadio = false;
      this.getCannelList();
    },
    // 点击上传
    handleAvatarSuccess(file) {
      console.log("🚀 ~ handleAvatarSuccess ~ file:", file);
      this.dialogForm.merchantLogo = URL.createObjectURL(file.raw);
    },
    // 点击添加按钮
    submitForm() {
      this.$refs.getTable.getTableRef().validate((valid) => {
        if (valid) {
          const params = {
            ...this.dialogForm,
            discountRate: this.dialogForm.discountRate / 100,
            passwd: this.dialogForm.passwd
              ? md5(md5(this.dialogForm.passwd))
              : md5(md5("")),
            status: Number(this.dialogForm.status),
          };
          if (this.title === "添加商户") {
            createDistribution(params).then((res) => {
              this.getList();
              this.$message({
                message: "添加成功",
                type: "success",
              });
            });
          }
          if (this.title === "编辑商户") {
            updateDistribution(params).then((res) => {
              this.getList();
              this.$message({
                message: "修改成功",
                type: "success",
              });
            });
          }
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除商户
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
    handleFilter(val) {
      this.params.merchantId =
        val.placeholder === "商户" ? val.selectValue : this.params.merchantId;
      this.params.channelId =
        val.placeholder === "渠道" ? val.selectValue : this.params.channelId;
      console.log(
        "🔍 ~ handleFilter ~ src/views/distribute/distributeList/index.vue:443 ~ this.params:",
        this.params
      );

      // this.params.searchKey = val.selectValue;
    },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击编辑
    handleTableOption(index, row, option) {
      this.operationalData = { ...row };
      if (option.label === "查看") {
        console.log(index, row, option);
      } else if (option.label === "编辑") {
        this.dialogFormVisible = true;
        this.title = "编辑商户";
        this.sureButtonsName = "确定";
        this.dialogForm = row;
        this.dialogForm.status = row.status.toString();
        this.dialogFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "重置密码:";
          }
        });
        console.log(index, row, option);
      } else if (option === "删除") {
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
      this.getList();
    },
    // 点击添加商户弹窗
    handleFilterButton(val) {
      if (val === "添加商户") {
        this.dialogFormVisible = true;
        this.title = "添加商户";
        this.sureButtonsName = "添加";
        this.dialogForm = {};
        this.dialogFormAttrs.forEach((val) => {
          if (val.isClosePwd) {
            val.title = "密码:";
          }
        });
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
    handleSecondSelectionChange(val) {
      console.log(
        "🔍 ~ handleSecondSelectionChange ~ src/views/distribute/distributeList/index.vue:777 ~ val:",
        val
      );
    },
    handleThirdSelectionChange(val) {
      console.log(
        "🔍 ~ handleThirdSelectionChange ~ src/views/distribute/distributeList/index.vue:794 ~ val:",
        val
      );
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
