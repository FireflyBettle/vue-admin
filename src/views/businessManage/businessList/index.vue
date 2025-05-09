<!--
 * @Author: chenyourong
 * @Date: 2025-05-08 18:06:50
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-09 18:17:38
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/views/businessManage/businessList/index.vue
-->
<template>
  <div class="shop-list">
    <div class="filter-container">
      <div class="filter-container__left">
        <el-select
          v-model="value"
          size="medium"
          filterable
          placeholder="商户名称"
          @change="handleFilter"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="filter-container__right">
        <el-button type="primary">添加商户</el-button>
        <el-button type="info" plain>删除商户</el-button>
      </div>
    </div>
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
          width="90"
        ></el-table-column>
        <el-table-column
          prop="des"
          label="商户描述"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="shopName"
          label="商户ID"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="rate"
          label="折扣率"
          width="70"
        ></el-table-column>
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
        <el-table-column
          prop="status"
          label="状态"
          width="70"
        ></el-table-column>
        <el-table-column prop="operation" label="操作" width="160">
          <template slot-scope="scope">
            <span class="operation" @click="handleEdit(scope.$index, scope.row)"
              >查看</span
            >
            <span class="operation" @click="handleEdit(scope.$index, scope.row)"
              >编辑</span
            >
            <span
              class="operation"
              @click="handleDelete(scope.$index, scope.row)"
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
  </div>
</template>

<script>
export default {
  name: "businessList",
  data() {
    return {
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
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      input: "",

      tableData: [
        {
          id: "1",
          name: "麦当劳",
          des: "这里是商户描述",
          shopName: "022A15EFC727DCAD",
          rate: "10%",
          storeNumber: "10",
          contactPerson: "麦当劳",
          phoneNumber: "19538383838",
          email: "1403939393@qq.com",
          status: "已启用",
        },
        {
          id: "1",
          name: "麦当劳",
          des: "这里是商户描述",
          shopName: "022A15EFC727DCAD",
          rate: "10%",
          storeNumber: "10",
          contactPerson: "麦当劳",
          phoneNumber: "19538383838",
          email: "1403939393@qq.com",
          status: "已启用",
        },
        {
          id: "1",
          name: "麦当劳",
          des: "这里是商户描述",
          shopName: "022A15EFC727DCAD",
          rate: "10%",
          storeNumber: "10",
          contactPerson: "麦当劳",
          phoneNumber: "19538383838",
          email: "1403939393@qq.com",
          status: "已启用",
        },
      ],
      multipleSelection: [],
      currentPage: 5,
    };
  },
  methods: {
    handleFilter(val) {
      console.log("🚀 ~ handleFilter ~ val:", val);
    },
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
.filter-container {
  .el-input {
    width: 265px;
    input {
      height: 32px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
  .el-select {
    margin-right: 4px;
    .el-input {
      width: 106px;
    }
  }
  .el-input-group__append {
    background: #fff;
  }
  .el-button {
    padding: 12px;
  }
  .filter-container__right {
    .el-button {
      width: 88px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      font-size: 14px;
    }
    .el-button--primary {
      background: #1890ff;
    }
    .el-button--info {
      background: #f5f5f5;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
.main {
  .el-pagination {
    text-align: right;
    margin-top: 16px;
  }
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background: #fff;
    border: 1px solid #D9D9D9;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #fff;
    color: #1890FF;
    border: 1px solid #1890FF;
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.shop-list {
  .filter-container {
    @include flex;
    justify-content: space-between;
    padding: 0 24px;
    width: 100%;
    height: 80px;
    background: #fff;
  }
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
  }
}
</style>