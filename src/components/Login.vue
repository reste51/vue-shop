<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <el-form
        class="loginForm"
        ref="formRef"
        :rules="rules"
        :model="loginForm"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      // 提交表单预验证
      this.$refs.formRef.validate(async valid => {
        // 如果验证成功，则请求后台api登录验证
        if (valid) {
          /*
            post返回Promise对象，通过await解析, 在他的外部方法(valid){} 需要用async来修饰
          */
          const result = await this.$http.post('login', this.loginForm)
          // 由于只需要data(重命名为 ret), 其余属性为axios创建的(request,headers...)
          const { data: ret } = result
          const { status, msg } = ret.meta
          if (status === 200) {
            this.$msg.success('login success!')
            /*
            登录成功后的操作：
              1.sessionStorage 存储token, 访问其他api 需要携带token
              2.编程式router跳转到Home组件中
            */
            window.sessionStorage.setItem('token', ret.data.token)

            this.$router.push('/home')
          } else {
            this.$msg.error(msg)
          }
        } else {
          alert('please checkout your input !')
        }
      })
    },
    // 重置表单
    reset() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: cornflowerblue;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: cornsilk;
  /** 居中定位 */
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  // 水平居中
  // margin: 0px auto;
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    // 水平offset  垂直offset 模糊度(越小越清晰)  颜色
    box-shadow: 0 0 10px #888888;

    // 水平居中/ 向上移动自身50%
    position: absolute;
    left: 50%; // 向左移动 是父盒子(login_box)的50%
    transform: translate(-50%, -50%);

    // 图片与 父盒子的内边距
    padding: 10px;
    background-color: cornsilk;
    // 边框圆角
    border-radius: 50%;
    img {
      // 大小与 父元素一致
      height: 100%;
      width: 100%;

      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.loginForm {
  /** 定位下部 */
  position: absolute;
  bottom: 0px;

  /**与 父login_box 同宽*/
  width: 100%;

  /**增加 每个元素的内边距 */
  padding: 20px;
  /** 以 父盒子为绘画边界， 不能绘制超出父边框的部分;
    默认元素为content-box,以内容的方式会超过边框 */
  box-sizing: border-box;
}

.btns {
  /**使 按钮居右 */
  // float: right;
  display: flex;
  justify-content: flex-end;
}
</style>
