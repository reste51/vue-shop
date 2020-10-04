<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <el-form class="loginForm">
        <!--用户名-->
        <el-form-item>
          <el-input prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item>
          <el-input prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item class="btns">
          <el-button type="primary">提交</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

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
