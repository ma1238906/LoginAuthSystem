<template>
  <div>
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#1b3554" text-color="#fff"
      active-text-color="#409EFF" router :collapse="isCollapse">
      <el-menu-item>
        <span slot="title">Unity程序后台系统</span>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">程序配置</span>
      </el-menu-item>
      <el-menu-item index="/loginInfo">
        <i class="el-icon-menu"></i>
        <span slot="title">登陆记录</span>
      </el-menu-item>
      <el-menu-item index="/clientInfo">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ["isCollapse"],
  data() {
    return {
      // isCollapse:false
    };
  },
};
</script>

<style lang='less' scoped>
.el-menu {
  border-right: 0;

  .is-active {
    background: #054476 !important;
    color: #fff !important;
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>