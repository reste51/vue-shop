<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">侧边栏</el-aside>
      <el-main>项目主体部分</el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  methods: {
    // 退出登录，1.清空token, 2.跳转登录页面
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  // 元素贴边两侧
  justify-content: space-between;
  // 元素位于容器的中心
  align-items: center;
  padding-left: 0px;

  // 修饰文字
  color: white;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
