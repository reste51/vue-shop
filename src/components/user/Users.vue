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
                       @click="openEditUserDialog(scope.row.id)"
                       icon="el-icon-edit"
                       type="primary"></el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip content="分配角色"
                        effect="dark"
                        placement="top"
                        :enterable="false">
              <el-button size="mini"
                         type="warning"
                         icon="el-icon-setting"
                         @click="setRoleDialog(scope.row)"></el-button>
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
               width="50%"
               @close='closeAddDialog'>
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
                   @click="addUser">添 加</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑用户"
               :visible.sync="editDialogVisible"
               width="50%">
      <el-form :model="editUserForm"
               :rules="addUserRules"
               ref="editUserFormRef"
               label-width="100px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editUserForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser">编 辑</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               width="50%"
               @close="setRoleDialogClosed">
      <p>当前的用户： {{userInfo.username}}</p>
      <p>当前的角色： {{userInfo.role_name}}</p>
      <p>分配新角色：
        <el-select v-model="setRoleId"
                   placeholder="请选择">
          <el-option v-for="item in roleList"
                     :key="item.id"
                     :label="item.roleName"
                     :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="setRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data () {
    // 声明自定义的校验函数
    var checkEmail = (rule, val, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(val)) {
        return callback()
      }
      callback(new Error('邮箱输入不合法，请重新输入!'))
    }
    var checkMobile = (rule, val, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(val)) {
        return callback()
      }
      callback(new Error('手机号输入不合法，请重新输入!'))
    }

    return {
      userList: [],
      total: 0, // 当前数据的总数
      requestParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户的表单
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      // 设置角色的 显示和隐藏
      setRoleDialogVisible: false,
      // 当前分配的用户信息
      userInfo: {},
      roleList: [],
      setRoleId: ''
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
    },
    // 关闭窗口的回调函数_ 重置表单
    closeAddDialog () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户操作
    addUser () {
      this.$refs.addUserFormRef.validate(async validate => {
        if (!validate) return
        // 请求后台api添加用户
        const { data: res } = await this.$http.post('users', this.addUserForm)
        const { status: code, msg } = res.meta
        // 提示信息
        if (code !== 201) this.$msg.error(msg)
        else {
          // 添加成功 刷新用户列表
          this.$msg.success(msg)
          this.getUserList()
        }
        // 关闭窗口
        this.addDialogVisible = false
      })
    },
    // 打开编辑窗口 并且 根据id获取 用户信息
    async openEditUserDialog (userId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`/users/${userId}`)
      const { status: code, msg } = res.meta
      // 提示信息
      if (code !== 200) return this.$msg.error(msg)
      else {
        Object.assign(this.editUserForm, res.data)
      }
    },
    // 编辑用户的操作
    editUser () {
      this.$refs.editUserFormRef.validate(async validate => {
        if (!validate) return
        console.log(this.editUserForm)
        // 请求后台api添加用户
        const { data: res } = await this.$http.put(`users/${this.editUserForm.id}`, this.editUserForm)
        const { status: code, msg } = res.meta
        // 提示信息
        if (code !== 200) this.$msg.error(msg)
        else {
          // 添加成功 刷新用户列表
          this.$msg.success(msg)
          this.getUserList()
        }
        // 关闭窗口
        this.editDialogVisible = false
      })
    },
    async deleteUser (userId) {
      /*
        当用户 按 确认后， 返回 字符串 'confirm'
        取消后， 会抛异常， 因此用catch返回错误后， 'cancel'
      */
      const statusText = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      // 取消操作
      if (statusText === 'cancel') {
        return this.$message({ type: 'info', message: '已取消删除' })
      }
      // 确认操作
      const { data: ret } = await this.$http.delete(`users/${userId}`)
      if (ret.meta.status === 200) {
        this.$msg.success('删除成功！')
        this.getUserList()
      } else {
        this.$msg.error(ret.meta.msg)
      }
    },
    // 分配角色
    async setRoleDialog (userInfo) {
      this.userInfo = userInfo
      // 获取 所有的角色数据
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$msg.error(res.meta.msg)
      } else {
        this.roleList = res.data
      }
      this.setRoleDialogVisible = true
      console.log(this.setRoleId)
    },
    setRoleDialogClosed () {
      this.userInfo = {}
      this.setRoleId = ''
      this.setRoleDialogVisible = false
    },
    // 设置用户的 新角色
    async setRole () {
      console.log(this.setRoleId, this.userInfo)
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.setRoleId })
      if (res.meta.status !== 200) {
        this.$msg.error(res.meta.msg)
      } else {
        this.$msg.success(res.meta.msg)
        this.getUserList()
      }
      this.setRoleDialogVisible = false
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped></style>
