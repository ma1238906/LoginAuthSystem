<template>

    <!-- ref='upload' -->
    <div>
        <el-upload class="upload-demo" ref="upload" :action="url" :on-preview="handlePreview" :on-remove="handleRemove"
            :on-success="successUpload" :file-list="fileList" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
import base from '../../api/base';
import url from '../../api/base'

export default {
    data() {
        return {
            url: url.upLoadUrl,
            fileList: [
            ]
        };
    },
    methods: {
        submitUpload() {
            this.$refs.upload.submit();
        },
        successUpload(res, file, fileList) {
            // console.log(res);
            // console.log(file);
            // console.log(fileList);
            //弹框显示上传成功
            this.$message({
                message: '上传成功',
                type: 'success'
            });
            //把结果传给父组件
            let imageUrl = base.host + '/' + res.url.slice(7);
            this.$emit("sendImgUrl",imageUrl);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }
    }
}
</script>

<style lang="less" scoped>

</style>