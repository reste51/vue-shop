<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      total: 0,
      currentNum: 0,
      requestParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: ret } = await this.$http.get('users', {
        params: this.requestParams
      })
      const { status: code, msg } = ret.meta
      if (code !== 200) {
        return this.$msg.error(msg)
      } else {
        // 无错，则赋值
        this.userList = ret.data.users
        this.total = ret.data.total
        this.currentNum = ret.data.pagenum
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped></style>
