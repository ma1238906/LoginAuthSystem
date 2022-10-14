<template>
  <div class="goods">
    <!-- 1. 搜索区域 -->
    <div class="header">
      <!-- 仅在输入框失去焦点或用户按下回车时触发 -->
      <el-input @change="searchInput" v-model="input" placeholder="请输入内容"></el-input>
      <el-button type="primary">查询</el-button>
      <!-- <el-button type="primary">
        <router-link to="/add-goods" style="color:#fff">添加-页面</router-link>
      </el-button>
      <el-button type="primary" @click="addGoods">添加-弹框</el-button> -->
    </div>
    <!-- 2. 表格区域展示视图数据 -->
    <div class="wrapper">
      <el-table :data="tableData" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="商品ID" width="100">
        </el-table-column>
        <el-table-column prop="title" label="商品名称" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="price" label="商品价格" width="100">
        </el-table-column>
        <el-table-column prop="num" label="商品数量" width="100">
        </el-table-column>
        <el-table-column prop="category" label="规格类目" width="100">
        </el-table-column>
        <el-table-column prop="image" label="商品图片" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sellPoint" label="商品卖点" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="descs" label="商品描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 3. 分页 -->
    <MyPagination :total="total" :pageSize="pageSize" @changePage="changePage" :currentPage='currentPage' />

    <!-- 4.弹框添加商品 -->
    <!-- <GoodsDialog :dialogVisible='dialogVisible' @changeDialog='changeDialog'></GoodsDialog> -->
    <GoodsDialog ref="dialog"></GoodsDialog>

  </div>
</template>

<script>
import MyPagination from "../../components/MyPagination.vue";
import GoodsDialog from './GoodsDialog.vue'
export default {
  components: {
    MyPagination,
    GoodsDialog
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
    changeDialog() {
      //this.dialogVisible = false;

    },
    /**
     * 打开弹框添加商品
     */
    addGoods() {
      this.$refs.dialog.dialogVisible = true;
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
     * 搜索
     */
    searchInput(val) {
      if (val === '') {
        this.type = 1;
        this.http(1);
        this.currentPage = 1;
        return;
      }
      console.log('搜索' + val);
      this.$api.getSearch({ search: val }).then(res => {
        console.log(res.data);
        if (res.data.status === 200) {
          this.list = res.data.result;//获取总数据
          //一般后台会带分页，这次没给 我们模拟分页
          this.total = res.data.result.length;
          this.pageSize = 2;//搜索的分页，每页长度为2条
          this.tableData = res.data.result.slice(0, 2);
          this.type = 2;
          this.currentPage = 1;
        }
        else {
          this.tableData = [];
          this.total = 1;
          this.pageSize = 1;
          this.type = 1;
          this.currentPage = 1;
        }
      })
    },
    /**
     * 编辑操作
     */
    handleEdit() { },
    /**
     * 删除操作
     */
    handleDelete(index, row) {
      console.log('删除', index, row);
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //后台接口
        this.$api.deleteGoods({ id: row.id }).then(res => {
          if (res.data.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.http(1);
          }
          else {
            this.$message({
              type: 'success',
              message: '删除失败!'
            });
          }
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 商品列表获取
     */
    http(page) {
      this.$api
        .getGoodsList({
          page,
        })
        .then((res) => {
          console.log(res.data);
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