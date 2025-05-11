<template>
  <div class="shopList">
    <Table :tableData="tableData"></Table>
  </div>
</template>

<script>
import Table from "@/components/Table/index.vue";
export default {
  name: "shopList",
  components: {
    Table,
  },
  data() {
    return {
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
    }
  }
};
</script>

<style lang="scss">
</style>
