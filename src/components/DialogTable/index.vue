<template>
  <div class="dialog-table">
    <!-- 表头 -->
    <div v-if="title" class="table-title">{{ title }}</div>

    <!-- 表格主体 -->
    <el-table
      :ref="ref"
      v-loading="listLoading"
      :data="dialogTableData"
      :element-loading-text="loadingText"
      :header-cell-style="{ backgroundColor: '#FAFAFA', color: '#333' }"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <!-- 表格索引 -->
      <el-table-column
        v-if="isShowNumber"
        fixed="left"
        type="index"
        :index="tableIndex"
      ></el-table-column>

      <!-- 表格行  item.showOverflowTooltip 设置表格文字过长显示省略号 -->
      <el-table-column
        v-for="(item, index) in dialogTableConfig"
        :key="index"
        :prop="item.prop"
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
              :src="scope.row[item.prop]"
            />
          </span>

          <!-- format = timestamp, 把时间戳转换成YYYY-MM-dd HH:mm:ss ，parseTime过滤器后文会提到   -->
          <span v-if="item.format === 'timestamp'">{{
            scope.row[item.prop] | timeFormat
          }}</span>

          <!-- format = money, 显示金额 -->
          <span v-else-if="item.format === 'money'">{{
            "￥" + scope.row[item.prop]
          }}</span>

          <!-- format = rate, 显示比例 -->
          <span v-else-if="item.format === 'rate'">{{
            scope.row[item.prop] + "%"
          }}</span>

          <!-- format = number, 显示数字-->
          <span v-else-if="item.format === 'number'">{{
            Number(scope.row[item.prop])
          }}</span>

          <!-- format = a, 网页跳转 -->
          <span v-else-if="item.format === 'a'">
            <u class="link">
              <a :href="scope.row[item.prop]" target="_blank">{{
                scope.row[item.prop]
              }}</a>
            </u>
          </span>

          <!-- 需要添加其他数据处理，继续添加 v-else-if="item.format === ''" 就好 -->

          <!-- 没有format -->
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <!-- 多选配置 -->
      <el-table-column type="selection" width="55"></el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div v-if="isShowPagination && total > 0" class="pagination-container">
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :current-page="page"
        :page-sizes="pageSizeList"
        :page-size="limit"
        :total="total"
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
    dialogTableData: {
      type: Array,
      required: true,
    },
    // 表格配置信息
    dialogTableConfig: {
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
  },
  // data() {
  //   return {
  //     timeFormat,
  //   }
  // },
  // filters: {
  //   timeFormat() {
  //     return this.timeFormat;
  //   }
  // },

  computed: {
    // 看是否是多选表格
    ref: function () {
      return this.isSelection ? "multipleTable" : undefined;
    },
    // 第几页
    page: function () {
      return this.listQueryParams.page || 1;
    },
    // 每页数据数
    limit: function () {
      return this.listQueryParams.limit || 10;
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
      this.listQueryParams.limit = val;
      // 改变翻页数目，将页面=1
      this.listQueryParams.page = 1;
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("subClickPagination", this.listQueryParams);
    },

    // 跳到当前是第几页
    handleCurrentChange(val) {
      this.listQueryParams.page = val;
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("subClickPagination", this.listQueryParams);
    },

    // 重写索引生成方法
    tableIndex(index) {
      const i = (this.page - 1) * this.limit + index + 1;
      return i;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-table {
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

 <style lang="scss" >
.dialog-table {
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
  .el-table th:last-child>.cell {
    margin-left: 3px;
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
