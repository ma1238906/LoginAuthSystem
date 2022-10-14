<template>
    <div>
        <el-dialog title="添加商品" :visible.sync="dialogVisible" width="70%" :before-close="clreaForm">

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                <el-form-item label="类目选择">
                    <el-button type="primary" @click="innerVisible = true">类目选择</el-button>
                    <span>{{ruleForm.category}}</span>
                </el-form-item>

                <el-form-item label="商品名称" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="price">
                    <el-input v-model="ruleForm.price"></el-input>
                </el-form-item>

                <el-form-item label="商品数量" prop="num">
                    <el-input v-model="ruleForm.num"></el-input>
                </el-form-item>

                <el-form-item label="发布时间" prop="time">
                    <el-col :span="11">
                        <el-form-item prop="date1">
                            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="date2">
                            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="商品卖点" prop="sellPoint">
                    <el-input v-model="ruleForm.sellPoint"></el-input>
                </el-form-item>

                <el-form-item label="商品图片" prop="image">
                    <el-button type="primary" @click="innerVisibleImg = true">商品图片</el-button>
                    <!-- <img :src="ruleForm.image" alt="" height="150px"></img> -->
                    <img :src="ruleForm.image" alt="" height="150px">
                </el-form-item>

                <el-form-item label="商品描述" prop="descs">
                    <textarea name="" id="" cols="30" rows="10" v-model="ruleForm.descs"></textarea>
                </el-form-item>

                <!-- <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item> -->
            </el-form>

            <!-- 内弹框 类目选择-->
            <el-dialog width="30%" title="类目选择" :visible.sync="innerVisible" append-to-body>
                <GoodsTree @sendSelectedCategory="getCategory"></GoodsTree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="selecteCategory">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 内弹框 上传图片-->
            <el-dialog width="30%" title="上传图片" :visible.sync="innerVisibleImg" append-to-body>
                <UploadImage @sendImgUrl="sendImgUrl"></UploadImage>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button @click="innerVisibleImg = false">取 消</el-button> -->
                    <el-button type="primary" @click="showImage">确 定</el-button>
                </span>
            </el-dialog>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
import GoodsTree from './GoodsTree.vue'
import UploadImage from './UploadImage.vue'
export default {
    components: {
        GoodsTree,
        UploadImage
    },
    props: {
        // 'dialogVisible': Boolean
    },
    data() {
        return {
            dialogVisible: false,//自身弹框
            innerVisible: false,//类目弹框(二级)
            category: {},//选择的类目
            innerVisibleImg: false,//图片弹框(二级)
            imageUrl: '',//子组件发送后接收的图片地址
            //表单容器
            ruleForm: {
                title: '',//商品名称
                price: '',//商品价格
                num: '',//商品数量
                sellPoint: '',//商品卖点
                image: '',//商品图片
                descs: '',//商品描述
                category: '',//商品类目
                date1: '',//发布时间  测试用，后台没有接收
                date2: '',
                cid: '',
            },
            //校验规则
            rules: {
                title: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入价格', trigger: 'blur' }
                ],
                num: [
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        //确定按钮 -- 关闭弹框 显示图片
        showImage() {
            this.innerVisibleImg = false;
            this.ruleForm.image = this.imageUrl;
        },
        //接收图片地址
        sendImgUrl(val) {
            //console.log(val);
            this.imageUrl = val;
        },
        selecteCategory() {
            this.innerVisible = false;
            this.ruleForm.category = this.category.name;
            this.ruleForm.cid = this.category.cid;
        },
        getCategory(data) {
            this.category = data;
        },
        close() {
            this.$emit('changeDialog');
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //console.log(this.ruleForm)
                    //alert('submit!');
                    //title cid  category sellPoint price num descs paramsInfo image
                    let { title, cid, category, sellPoint, price, num, descs, image} =
                        this.ruleForm;
                    this.$api.addGoods({ title, cid, category, sellPoint, price, num, descs, image })
                        .then(res => {
                            console.log('商品添加结果：',res.data);
                            if(res.data.status === 200)
                            {
                                this.clreaForm();
                                this.$parent.http(1);//2.添加成功后更新父组件的商品列表
                                //3.提示
                                this.$message({
                                    message:'添加成功！',
                                    type:'success'
                                })
                                
                            }
                            else
                            {
                                this.$message.error('添加失败！');
                            }
                        }
                        )
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            this.dialogVisible = false
        },
        clreaForm(){
            this.dialogVisible = false;//1.关闭弹窗
            //4.清空弹框数据
            this.$refs.ruleForm.resetFields();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
.line {
    text-align: center;
}
</style>