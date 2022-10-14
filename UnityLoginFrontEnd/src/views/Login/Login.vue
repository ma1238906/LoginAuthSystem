<template>
  <div>
    <div>
      <div class="login-box">
        <h3 class="title">登陆</h3>
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="60px" class="demo-ruleForm">
          <el-form-item label="账号" prop="username">
            <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import jwt from 'jwt-decode'
import { mapMutations } from 'vuex'
export default {
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      } else {

        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapMutations('loginModule',['setUser']),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //console.log('校验通过',this.loginForm);
          let { username, password } = this.loginForm;
          //请求登陆接口
          this.$api.getLogin({
            username, password
          }).then(res => {
            console.log('登陆', res.data);
            if (res.data.status === 200) {
              console.log('解析', jwt(res.data.data))//从token中解析出账号
              //登陆成功：1.存储登陆信息 2.跳转页面 3.顶部区域显示用户名 4.数据持久化cookie
              let obj = {
                user:jwt(res.data.data).username,
                token:res.data.data
              }
              this.setUser(obj);//vuex
              localStorage.setItem('user',JSON.stringify(obj))//本地存储
              //跳转
              this.$router.push('/')
            }
            else {
              //账号或密码错误
              this.$message.error('账号或密码错误！');
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.login-box {
  width: 400px;
  height: 300px;
  padding: 20px;
  margin: 150px auto;
  border: 1px solid #eee;
  background: #fff;
}

.title {
  margin-bottom: 20px;
  text-align: center;
  color: #666;
}
</style>