<template>
  <div class="main">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="42"></el-table-column>
      <el-table-column prop="id" label="ID" width="59"></el-table-column>
      <el-table-column
        prop="name"
        label="商户名称"
        width="100%"
      ></el-table-column>
      <el-table-column
        prop="des"
        label="商户描述"
        :flex="1"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="shopName"
        label="商户ID"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="rate" label="折扣率" width="70"></el-table-column>
      <el-table-column
        prop="storeNumber"
        label="门店数"
        width="70"
      ></el-table-column>
      <el-table-column
        prop="contactPerson"
        label="联系人"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="手机号"
        width="70"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="70"></el-table-column>
      <el-table-column prop="operation" label="操作" width="160">
        <template slot-scope="scope">
          <span class="operation" @click="handleEdit(scope.$index, scope.row)"
            >查看</span
          >
          <span class="operation" @click="handleEdit(scope.$index, scope.row)"
            >编辑</span
          >
          <span class="operation" @click="handleDelete(scope.$index, scope.row)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="sizes, prev, pager, next,jumper"
      :total="1000"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      multipleSelection: [],
      currentPage: 5,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style lang="scss">
.main {
  width: 100%;
  height: 400px;
  background: #fff;
  margin-top: 20px;
  padding: 20px;
  .operation {
    cursor: pointer;
    color: #1890ff;
    margin-right: 16px;
    font-size: 14px;
  }
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
</style>
