<template>
  <el-container class="home-container">
    <!-- 头部 1-->
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapsed ? '56px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eef"
          unique-opened
          :collapse-transition="false"
          :collapse="collapsed"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="menu.id + ''"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <template slot="title">
              <i :class="menuIcon[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 子菜单 -->
            <el-menu-item
              :index="'/' + subMenu.path"
              v-for="subMenu in menu.children"
              :key="subMenu.id"
              @click="updateActivePath('/' + subMenu.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subMenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由承载页面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  /**
   * 开启左侧子菜单点击的链接:
   * 1. 在el-main 中router 模式,  添加 router即可
   * 2. el-menu-item的index作为跳转路径
   *    2.1 绝对的根路径, 需要在 前面加入 '/'+subMenu.path ;  /users
   *    2.2 相对父组件/home/ 后增加链接,  subMenu.path      /home/users
   */
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      // 一级菜单的图标, {id:iconStr}
      menuIcon: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 菜单的展开和折叠状态
      collapsed: false,
      // 当前激活的菜单path
      activePath: ''
    }
  },
  methods: {
    // 退出登录，1.清空token, 2.跳转登录页面
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 请求接口 获取菜单数据
    async getMenuList() {
      const { data: ret } = await this.$http.get('menus')
      const { status: code, msg } = ret.meta

      if (code !== 200) return this.$msg.error(msg)

      this.menuList = ret.data
    },
    // 控制菜单的折叠和展开的函数
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    /*
      1. 点击每个二级菜单, 存储当前点击的path 到sessionStorage中 -- 在用户刷新页面(created 生命周期函数获取)
      2. 动态更新data值
    */
    updateActivePath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
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

  // 使文字 居中
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
// 一级菜单的图标 设置间距
.iconfont {
  margin-right: 10px;
}
// 控制菜单折叠与 展开的按钮
.toggle-button {
  text-align: center;
  letter-spacing: 0.21em;
  color: white;
  cursor: pointer;
  font-size: 14px;
  background-color: #4a5064;
  line-height: 24px;
}
</style>
