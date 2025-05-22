<template>
  <div class="table">
    <!-- 表头 -->
    <div v-if="title" class="table-title">{{ title }}</div>

    <!-- 表格主体 -->
    <el-table
      :ref="ref"
      v-loading="listLoading"
      :data="tableData"
      :element-loading-text="loadingText"
      :header-cell-style="{ backgroundColor: '#FAFAFA', color: '#333' }"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选配置 -->
      <el-table-column
        v-if="isSelection"
        type="selection"
        width="55"
      ></el-table-column>

      <!-- 表格索引 -->
      <el-table-column
        v-if="isShowNumber"
        fixed="left"
        type="index"
        label="ID"
        :index="tableIndex"
      ></el-table-column>

      <!-- 表格行  item.showOverflowTooltip 设置表格文字过长显示省略号 -->
      <el-table-column
        v-for="(item, index) in config"
        :key="index"
        :value="item.value"
        :label="item.label"
        :min-width="item.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <!-- format = img, 显示图片 -->
          <span v-if="item.format === 'img'">
            <img
              title="点击查看大图"
              alt="图片"
              class="image-size"
              :src="scope.row[item.value]"
            />
          </span>

          <!-- format = timestamp, 把时间戳转换成YYYY-MM-dd HH:mm:ss ，parseTime过滤器后文会提到   -->
          <span v-if="item.format === 'timestamp'">{{
            scope.row[item.value] | timeFormat
          }}</span>

          <!-- format = money, 显示金额 -->
          <span v-else-if="item.format === 'money'">{{
            "￥" + scope.row[item.value]
          }}</span>

          <!-- format = rate, 显示比例 -->
          <span v-else-if="item.format === 'rate'">{{
            scope.row[item.value] + "%"
          }}</span>

          <span v-else-if="item.format === 'input'">
            <el-input v-model="scope.row[item.value]" @change="handleInputChange(scope.row[item.value])">
              <template slot="append">%</template>
            </el-input>
          </span>

          <!-- format = number, 显示数字-->
          <span v-else-if="item.format === 'number'">{{
            Number(scope.row[item.value])
          }}</span>

          <span v-else-if="item.format === 'status'">{{
            +scope.row[item.value] === 0 ? "启用" : "暂停"
          }}</span>

          <!-- format = a, 网页跳转 -->
          <span v-else-if="item.format === 'a'">
            <u class="link">
              <a :href="scope.row[item.value]" target="_blank">{{
                scope.row[item.value]
              }}</a>
            </u>
          </span>

          <!-- 需要添加其他数据处理，继续添加 v-else-if="item.format === ''" 就好 -->

          <!-- 没有format -->
          <span v-else>{{ scope.row[item.value] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="55" v-if="isMulSelect">
        <template slot="header">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          ></el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox-group v-model="checkData" @change="handleCheckedChange">
            <el-checkbox :label="scope.row.storeId">{{ "" }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>

      <el-table-column width="55" label="选择" v-if="isRadio">
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

      <!-- 表格操作按钮栏 -->
      <el-table-column
        v-if="isHasButtons"
        class="clearfix"
        :width="optionColumnWidth + 'px'"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <!-- 基本操作 -->
          <span
            v-for="(option, index) in getOptionsName(scope.row.buttonKey)"
            :key="index"
            class="button-margin-left"
          >
            <template v-if="option.label === '查看'">
              <router-link :to="`${$route.path}/${scope.row[option.route]}`">
                <span>{{ option.label }}</span>
              </router-link>
            </template>
            <span
              v-else
              @click="
                handleClickOption(scope.$index, scope.row, option, $event)
              "
              >{{ option.label }}</span
            >
            <!--  <el-button
              size="small"
              :type="index == 0 ? 'primary' : ''"
              @click="handleClickOption(scope.$index, scope.row, option,$event)"
            >
              <span v-html="getButtonHtml(option)"></span>
            </el-button> -->
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div
      v-if="isShowPagination && listQueryParams.total > 0"
      class="pagination-container"
    >
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :page-sizes="pageSizeList"
        :current-page="listQueryParams.pageNum"
        :page-size="listQueryParams.pageSize"
        :total="listQueryParams.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppTable",
  props: {
    // 是否需要序号
    isShowNumber: {
      type: Boolean,
      default: false,
    },
    // 是否需要翻页组件
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    // 是否需要栅格
    isBorder: {
      type: Boolean,
      default: true,
    },
    // 是否是多选表格，默认非多选 :ref="'multipleTable'"
    isSelection: {
      type: Boolean,
      default: false,
    },
    isMulSelect: {
      type: Boolean,
      default: false,
    },
    isRadio: {
      type: Boolean,
      default: false,
    },
    // 是否有操作按钮
    isHasButtons: {
      type: Boolean,
      default: true,
    },
    // 表头名称
    title: {
      type: String,
    },
    // 表格数据
    tableData: {
      type: Array,
      required: true,
    },
    // 表格配置信息
    config: {
      type: Array,
      required: true,
    },
    // loading提示框
    loadingText: {
      type: String,
      default: "加载中...",
    },
    // loading状态
    loadingStatus: {
      type: Boolean,
      default: false,
    },
    // 表格查询列表参数
    listQueryParams: {
      type: Object,
    },
    // 根据当前行的状态显示按钮的名称
    buttonsName: {
      type: Array,
    },
    // 操作列表宽度
    optionColumnWidth: {
      type: Number,
      default: 100,
    },
    // 分页数据
    pageSizeList: {
      type: Array,
      default: function () {
        return [10, 20, 30, 50, 100];
      },
    },
    initCheckData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    initRadio: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      allData: [],
      checkData: [],
      radio: "50008",
    };
  },
  // filters: {
  //   timeFormat() {
  //     return this.timeFormat;
  //   }
  // },
  created() {
    this.checkData = this.initCheckData;
    setTimeout(() => {
      this.radio = this.initRadio;
    }, 500);
  },

  computed: {
    // 看是否是多选表格
    ref: function () {
      return this.isSelection ? "multipleTable" : undefined;
    },
    // 第几页
    page: function () {
      return this.listQueryParams.pageNum || 1;
    },
    // 每页数据数
    pageSize: function () {
      return this.listQueryParams.pageSize || 10;
    },
    // 数据总数
    total: function () {
      return this.listQueryParams.total || 0;
    },
    // 获取当前loading的状态
    listLoading: function () {
      return this.loadingStatus;
    },
  },
  methods: {
    handleInputChange(val) {
      this.$emit("getCurrentRow", this.radio,val);
    console.log("🔍 ~ handleInputChange ~ src/components/Table/index.vue:319 ~ val:", val)

    },
    getCurrentRow(val) {
      this.$emit("getCurrentRow", this.radio);
    },
    handleCheckAllChange(val) {
      this.allData = [];
      this.tableData.forEach((item) => {
        this.allData.push(item.storeId);
      });
      this.checkData = val ? this.allData : [];
      this.isIndeterminate = false;
      this.$emit("subCheckAll", this.checkData);
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allData.length;
      this.$emit("subCheckedData", value);
    },
    // 获取当前操作的按钮组
    getOptionsName(key) {
      return this.buttonsName || [];
    },

    // 点击按钮传递给父组件
    handleClickOption(index, row, option) {
      this.$emit("subOpitonButton", index, row, option);
    },

    // 表格选择分发事件
    handleSelectionChange(val) {
      this.$emit("subSelected", val);
    },

    // 改变翻页组件中每页数据总数
    handleSizeChange(val) {
      this.listQueryParams.pageSize = val;
      // 改变翻页数目，将页面=1
      this.listQueryParams.pageNum = 1;
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("subClickPagination", this.listQueryParams);
    },

    // 跳到当前是第几页
    handleCurrentChange(val) {
      this.listQueryParams.pageNum = val;
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("subClickPagination", this.listQueryParams);
    },

    // 重写索引生成方法
    tableIndex(index) {
      const i = (this.page - 1) * this.pageSize + index + 1;
      return i;
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  background: #fff;
  padding: 20px;
}
.image-size {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.table-title {
  margin-top: 10px;
  font-size: 18px;
}
.button-margin-left {
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}
.button-margin-left:not(:first-child) {
  margin-left: 16px;
}

.link {
  cursor: pointer;
  color: #4876ff;
}
</style>

<style lang="scss">
.table {
  .el-table {
    .el-table__empty-block {
      height: unset;
    }
  }
  .custom-dropdown-menu {
    cursor: pointer;
    .custom-dropdown-menu-item {
      margin-top: 10px;
      text-align: center;
    }
    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
      background-color: #fff;
      color: #fff;
    }
  }
  .el-table th:first-child > .cell {
    padding-left: 14px;
  }
  .el-table .cell {
    word-break: keep-all;
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
