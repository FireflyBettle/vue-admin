<!--
 * @Author: chenyourong
 * @Date: 2025-05-12 17:36:48
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-21 17:12:42
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/components/Search/index.vue
-->
<template>
  <div class="filter-container">
    <div class="filter-container__left">
      <template v-if="filterOptions.length">
        <div
          class="select-item"
          v-for="(item, index) in filterOptions"
          :key="index"
        >
          <template v-if="item.type === 'multiSelect'">
            <el-select
              v-model="item.selectValue"
              size="medium"
              filterable
              :placeholder="item.placeholder"
              @change="handleFilter(item)"
              :style="{ width: item.selectWidth }"
            >
              <el-option
                v-for="val in item.options"
                :key="val.value"
                :label="val.label"
                :value="val.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="!item.noShowInput"
              :style="{ width: item.inputWidth }"
              type="text"
              v-model="input"
              placeholder="请输入内容"
              @keyup.enter.native="
                clickSearch({
                  selectValue: item.selectValue,
                  inputValue: input,
                })
              "
            >
              <el-button
                v-if="item.isSearch"
                slot="append"
                icon="el-icon-search"
                @click="
                  clickSearch({
                    selectValue: item.selectValue,
                    inputValue: input,
                  })
                "
              ></el-button>
            </el-input>
          </template>

          <template v-else-if="item.format === 'date'">
            <el-date-picker
              placeholder="请选择日期"
              v-model="dateValue"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="date"
              @change="changeDate"
            ></el-date-picker>
          </template>

          <template v-else-if="item.format === 'select'">
            <el-select
              v-model="value"
              size="medium"
              filterable
              placeholder="商户名称"
              @change="handleFilter"
            >
              <el-option
                v-for="val in options"
                :key="val.value"
                :label="val.label"
                :value="val.value"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'button'">
            <el-button type="primary" @click="clickSearch">搜索</el-button>
          </template>
        </div>
      </template>
      <template v-else>
        <div>商户门店</div>
      </template>
    </div>
    <div class="filter-container__right">
      <el-button
        @click="handleFilterButton(item.label)"
        :type="item.type"
        v-for="(item, index) in filterButtonText"
        :key="index"
        >{{ item.label }}</el-button
      >
      <!-- <el-button type="info" plain @click="deleteShopDialogVisible = true"
          >删除商户</el-button> -->
      <!-- <el-button type="info" plain @click="deleteShopDialog"
        >删除商户</el-button
      > -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    filterButtonText: {
      type: Array,
      required: true,
    },
    filterOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      value: "",
      input: "",
      dateValue: "",
      pickerOptions: {
        disabledDate(time) {
          // 禁用今天之后的日期
          return time.getTime() > Date.now();
        },
      },
    };
  },
  methods: {
    handleFilterButton(val) {
      this.$emit("handleFilterButton", val);
    },
    changeDate(val) {
      this.$emit("changeDate", val);
    },
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
      this.$emit("handleFilter", val);
      // console.log("🚀 ~ handleFilter ~ val:", val);
    },
    clickSearch(val) {
      this.$emit("clickSearch", val);
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.filter-container {
  @include flex;
  justify-content: space-between;
  padding: 0 24px;
  width: 100%;
  height: 80px;
  background: #fff;
  margin-bottom: 20px;
  &__left {
    display: flex;
    .select-item {
      margin-right: 4px;
    }
    .el-button {
      height: 32px;
      padding: 0px !important;
      width: 60px;
    }
  }
  .el-input {
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
      // width: 77px;
      .el-select__caret {
        color: #606266;
      }
      .el-input__suffix {
        top: 2px;
      }
    }
    .is-focus {
      .el-input__suffix {
        top: -1px;
      }
    }
    .el-input__inner {
      padding-right: 15px;
    }
    .el-input__inner::placeholder {
      color: #606266; /* 默认灰色改为深灰色 */
    }
  }
  .el-input-group__append {
    background: #fff;
  }
  .el-button {
    padding: 12px;
  }
  &__right {
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
</style>
