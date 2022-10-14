<template>
  <div class="goods">

    <!-- 2. 表格区域展示视图数据 -->
    <div class="wrapper">
      <el-table :data="tableData" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="程序ID" width="100">
        </el-table-column>
        <el-table-column prop="programName" label="程序名称">
        </el-table-column>
        <el-table-column label="允许登陆">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.globalEntry" :active-value="'true'" :inactive-value="'false'"
              active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 3. 分页 -->
    <MyPagination :total="total" :pageSize="pageSize" @changePage="changePage" :currentPage='currentPage' />

    <!-- 4.弹框添加商品 -->
    <!-- <GoodsDialog :dialogVisible='dialogVisible' @changeDialog='changeDialog'></GoodsDialog> -->
    <!-- <GoodsDialog ref="dialog"></GoodsDialog> -->

  </div>
</template>

<script>
import MyPagination from "../../components/MyPagination.vue";
export default {
  components: {
    MyPagination,
  },
  data() {
    return {
      input: "",
      tableData: [],
      total: 10,
      pageSize: 1,
      type: 1,
      list: [],
      currentPage: 1
      //dialogVisible:false,
    };
  },
  methods: {
    changeSwitch(row) {
      this.$api.getProgramAuth({ programID: row.id, programState: row.globalEntry }).then(
        res => {
          //console.log(res.data)
        }
      )
    },
    changeDialog() {
      //this.dialogVisible = false;

    },
    /**
     * 分页页码--
     */
    changePage(num) {
      this.currentPage = num;
      if (this.type == 1) {
        this.http(num);
      }
      else {
        //搜索的分页处理
        this.tableData = this.list.slice((num - 1) * 2, num * 2);
      }
    },
    /**
     * 列表获取
     */
    http(page) {
      this.$api
        .getProgramList({
          page,
        })
        .then((res) => {
          //console.log(res.data);
          if (res.data.status === 200) {
            this.tableData = res.data.data; //数据列表
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;
          }
        });
    },
  },
  //生命周期函数
  created() {
    this.http(1)
  },
};
</script>

<style lang='less' scoped>
.goods {
  margin: 20px;
}

.header {
  display: flex;

  button {
    margin-left: 20px;
  }
}

.wrapper {
  margin: 20px 0;
}
</style>