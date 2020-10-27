<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div>
        <el-button type="primary"
                   @click="addDialogVisible=true">添加角色</el-button>
      </div>
      <el-table border
                stripe
                :data="roleList">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>{{scope.row}}</div>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc"
                         label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="openEditDialog(scope.row.id)"
                       icon="el-icon-edit"
                       type="primary">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini"
                       type="warning"
                       icon="el-icon-setting"
                       @click="deleteUser(scope.row.id)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色"
               :visible.sync="addDialogVisible"
               width="50%"
               @close='closeAddDialog'>
      <el-form :model="addRoleForm"
               :rules="addRoleRules"
               ref="addRoleFormRef"
               label-width="100px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑角色"
               :visible.sync="editDialogVisible"
               width="50%"
               @close='closeEditDialog'>
      <el-form :model="editRoleForm"
               :rules="editRoleRules"
               ref="editRoleFormRef"
               label-width="100px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRole">编 辑</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    var checkEditDesc = (rule, val, callback) => {
      if (val !== '') {
        return callback()
      }
      callback(new Error('未更改角色描述，请重新输入!'))
    }
    return {
      roleList: [],
      addRoleRules: {
        roleName: { required: true, message: '请输入角色名称', trigger: 'blur' }
      },
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleRules: {
        roleName: { required: true, message: '请输入角色名称', trigger: 'blur' },
        roleDesc: { validator: checkEditDesc, trigger: 'blur' }
      },
      editRoleForm: {
        roleId: '',
        roleDesc: '',
        roleName: ''
      },
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      const { status: code, msg } = res.meta
      // 提示信息
      if (code !== 200) return this.$msg.error(msg)
      else {
        this.roleList = res.data // 输出的对象类型为 Observer页面可以生效
        console.log(this.roleList)
      }
    },
    closeAddDialog () {
      this.$refs.addRoleFormRef.resetFields()
    },
    closeEditDialog () {
      this.$refs.editRoleFormRef.resetFields()
    },
    addRole () {
      this.$refs.addRoleFormRef.validate(async validate => {
        if (!validate) return
        // 请求后台api添加用户
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        const { status: code, msg } = res.meta
        // 提示信息
        if (code !== 201) this.$msg.error(msg)
        else {
          // 添加成功 刷新用户列表
          this.$msg.success(msg)
          this.getRoleList()
        }
        // 关闭窗口
        this.addDialogVisible = false
      })
    },
    async openEditDialog (id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      const { status: code, msg } = res.meta
      // 提示信息
      if (code !== 200) return this.$msg.error(msg)
      else {
        /*
        注：不能单纯的赋值对象引用, 会导致 双向绑定监听失败
          使用 assign 赋值属性里面的值 （还是不行）
        */
        // this.editRoleForm = res.data
        Object.assign(this.editRoleForm, res.data)
        this.editDialogVisible = true
      }
    },
    editRole () {
      this.$refs.editRoleFormRef.validate(async validate => {
        console.log(this.editRoleForm)
        if (!validate) return
        // 关闭窗口
        this.editDialogVisible = false
        // 请求后台api添加用户
        const { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}`, this.editRoleForm)
        const { status: code, msg } = res.meta
        // 提示信息
        if (code !== 200) this.$msg.error(msg)
        else {
          // 添加成功 刷新用户列表
          this.$msg.success(msg)
          this.getRoleList()
        }
      })
    },
    async deleteRole (id) {
      const statusText = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      // 取消操作
      if (statusText === 'cancel') {
        return this.$message({ type: 'info', message: '已取消删除' })
      }
      // 确认操作
      const { data: ret } = await this.$http.delete(`roles/${id}`)
      if (ret.meta.status === 200) {
        this.$msg.success('删除成功！')
        this.getRoleList()
      } else {
        this.$msg.error(ret.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
