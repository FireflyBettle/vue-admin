<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-21 18:16:23
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
    <el-dialog
      :title="title"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      width="572px"
    >
      <Detail
        ref="getTable"
        :title="title"
        :styleType="styleType"
        :tableData="dialogForm"
        :tableFormAttrs="dialogFormAttrs"
        @handleAvatarSuccess="handleAvatarSuccess"
      >
      </Detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">{{ sureButtonsName }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
import Detail from "@/components/Detail/index.vue";
import Search from "@/components/Search/index.vue";
import md5 from "js-md5";

import { createDistribution, distributionList, updateDistribution } from "@/api/distribute.js";

const DefaultTableQuery = {
  pageNum: 1,
  pageSize: 10,
};

export default {
  name: "businessList",
  components: {
    Table,
    Detail,
    Search,
  },
  data() {
    return {
      title: "添加商户",
      sureButtonsName: '添加',
      styleType: "dialog",
      // 参数
      listQueryParams: { ...DefaultTableQuery },
      tableData: [],
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
      // 表格加载loading
      loadingStatus: false,
      buttonsName: [
        {
          label: "查看",
          route: "merchantId",
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
        searchKey: "",
        searchVal: "",
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
      this.params.searchKey = val.selectValue;
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
