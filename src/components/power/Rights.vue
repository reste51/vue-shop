<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table border
                stripe
                :data="rightsList">
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="authName"
                         label="权限名称"></el-table-column>
        <el-table-column prop="path"
                         label="路径"></el-table-column>
        <el-table-column prop="level"
                         label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-if="scope.row.level==='1'"
                    type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==='2'"
                    type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightList()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightList () {
      const { data: res } = await this.$http.get('/rights/list')
      const { status: code, msg } = res.meta
      // 提示信息
      if (code !== 200) return this.$msg.error(msg)
      else {
        this.rightsList = res.data // 输出的对象类型为 Observer页面可以生效
        // Object.assign(this.rightsList, res.data)  // Array 页面没有被监听数据的改变
        console.log(this.rightsList)
      }
    }
  }

}
</script>

<style lang="less" scoped>
</style>
