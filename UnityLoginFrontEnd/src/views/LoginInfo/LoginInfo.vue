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
                <el-table-column prop="id" label="登陆记录ID" width="100">
                </el-table-column>
                <el-table-column prop="clientID" label="客户端ID" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="programName" label="程序名称">
                </el-table-column>
                <el-table-column prop="loginTime" label="登陆时间">
                </el-table-column>
                <el-table-column prop="clientIP" label="客户端IP" width="150">
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
                this.tableData = this.list.slice((num - 1) * 8, num * 8);
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
            this.$api.getSearchByID({ search: val }).then(res => {
                console.log(res.data);
                if (res.data.status === 200) {
                    this.list = res.data.result;//获取总数据
                    //一般后台会带分页，这次没给 我们模拟分页
                    this.total = res.data.result.length;
                    this.pageSize = 8;//搜索的分页，每页长度为8条
                    this.tableData = res.data.result.slice(0, 8);
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
         * 商品列表获取
         */
        http(page) {
            this.$api
                .getLoginInfo({
                    page,
                })
                .then((res) => {
                    //console.log(res.data);
                    if (res.data.status === 200) {
                        for (let index = 0; index < res.data.data.length; index++) {
                            let dateStr = this.getLocalTime(res.data.data[index].loginTime);
                            res.data.data[index].loginTime = dateStr;

                        }
                        this.tableData = res.data.data; //数据列表
                        this.total = res.data.total;
                        this.pageSize = res.data.pageSize;
                    }
                });
        },
        //时间戳转日期格式
        getLocalTime(ns) {
            ns = parseInt(ns);
            let n = new Date(ns);
            return n.toLocaleDateString().replace(/\//g, "-") + " " + n.toTimeString().substr(0, 8)
        }
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