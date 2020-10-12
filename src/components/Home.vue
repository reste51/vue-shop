<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eef"
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
              :index="subMenu.id + ''"
              v-for="subMenu in menu.children"
              :key="subMenu.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subMenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>项目主体部分</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
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
      }
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
</style>
