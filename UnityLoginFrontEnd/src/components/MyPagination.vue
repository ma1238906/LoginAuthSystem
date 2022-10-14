<template>
    <div style="text-align:center;margin:20px;">
        <el-pagination background layout="total,prev, pager, next,jumper" :total="total" :page-size="pageSize"
            @current-change="changePage" :current-page.sync="currentPage">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        total: {
            type: Number,
            default: 100
        },
        pageSize: {
            type: Number,
            default: 10
        },
        currentPage: {
            type: Number,
            default: 1
        }
    },
    methods: {
        changePage(page) {
            this.$emit('changePage', page)
        }
    }
};
</script>

<style>

</style>