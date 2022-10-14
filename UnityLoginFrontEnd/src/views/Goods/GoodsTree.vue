<template>
    <div>
        <el-tree :props="props" :load="loadNode" @node-click="nodeClick" lazy accordion>
        </el-tree>
    </div>
</template>

<script>
export default {
    data() {
        return {
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
        };
    },
    methods: {
        nodeClick(data){
            this.$emit('sendSelectedCategory',data);
        },
        loadNode(node, resolve) {//resolve(list) 成功返回的数据结果 list子级数组
            //打开页面时首次获取数据
            if (node.level === 0) {
                this.$api.getSelectCategory().then(
                    res => {
                        //console.log(res.data)
                        return resolve(res.data.result);
                    }
                )
            }
            //根据cid获取节点下面的子节点
            else {
                this.$api.getSelectCategory({ id: node.data.cid }).then(
                    res => {
                        //console.log(res.data)
                        if (res.data.status === 200)
                            return resolve(res.data.result);
                        else
                            return resolve([])
                    }
                )
            }
        }
    }
};
</script>

<style lang="less" scoped>

</style>