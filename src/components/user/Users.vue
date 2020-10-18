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
          <el-input placeholder="请输入内容"
                    v-model="requestParams.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域 -->
      <el-table border
                stripe
                :data="userList">
        <el-table-column type="index"
                         width="50"
                         label="#"></el-table-column>
        <el-table-column label="姓名"
                         prop="username"></el-table-column>
        <el-table-column label="邮箱"
                         prop="email"></el-table-column>
        <el-table-column label="电话"
                         prop="mobile"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态"
                         prop="">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="handleStateChange(scope.row)"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.$index, scope.row)"
                       icon="el-icon-edit"
                       type="primary"></el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.$index, scope.row)"></el-button>
            <el-tooltip content="分配角色"
                        effect="dark"
                        placement="top"
                        :enterable="false">
              <el-button size="mini"
                         type="warning"
                         icon="el-icon-setting"
                         @click="handleDelete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :page-sizes="[1, 2, 3, 5, 10]"
                     :page-size="requestParams.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :current-page="requestParams.pagenum"
                     :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%">
      <el-form :model="addUserForm"
               :rules="addUserRules"
               ref="addUserFormRef"
               label-width="100px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addUserForm.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addDialogVisible = false">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data () {
    return {
      userList: [],
      total: 0, // 当前数据的总数
      requestParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addDialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        email: { required: true, message: '请输入邮箱', trigger: 'blur' },
        mobile: { required: true, message: '请输入手机号', trigger: 'blur' }
      }
    }
  },
  methods: {
    searchData () {
      this.getUserList()
    },
    async getUserList () {
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
        this.requestParams.pagenum = ret.data.pagenum
      }
    },
    // 每页size 发生变化时, 当前页码重置为1
    handleSizeChange (newSize) {
      this.requestParams.pagesize = newSize
      this.requestParams.pagenum = 1
      // 请求参数发生变化则 重新请求api 取数据
      this.getUserList()
    },
    handleCurrentChange (newNum) {
      this.requestParams.pagenum = newNum
      this.getUserList()
    },
    // 用户状态 改变的监听事件
    async handleStateChange (row) {
      const { data: ret } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      const { status: code, msg } = ret.meta
      if (code !== 200) {
        this.$msg.error(msg)
        row.mg_state = !row.mg_state
      } else {
        this.$msg.success(msg)
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped></style>
