<!--
 * @Author: chenyourong
 * @Date: 2025-05-12 17:36:48
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-05-12 17:43:09
 * @Description: 
 * @FilePath: /vue-admin-template-master/src/components/Search/index.vue
-->
<template>
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
      <el-button type="primary"
        >添加商户</el-button
      >
      <!-- <el-button type="info" plain @click="deleteShopDialogVisible = true"
          >删除商户</el-button> -->
      <el-button type="info" plain @click="deleteShopDialog"
        >删除商户</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      input: '',
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
    };
  },
  methods: {
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
      console.log("🚀 ~ handleFilter ~ val:", val);
    },
  },
};
</script>

<style lang="scss">
</style>