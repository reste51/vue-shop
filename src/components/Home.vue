<template>
  <div>
    Home 组件
    <el-button type="info"
               @click="logout">退出登录</el-button>
  </div>
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
</style>
