<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <!-- logo -->
      <div>
        <img src="../assets/heima.png" alt />
        <span>后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 内容主体 -->
    <el-container>
      <!-- 左边菜单栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠菜单 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="this.$route.path"
        >
          <el-submenu :index="items.id+''" v-for="items in menulist" :key="items.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{items.authName}}</span>
            </template>

            <el-menu-item :index="'/' + item.path+''" v-for="item in items.children" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容去 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      // 是否折叠
      isCollapse: false
    }
  },
  // 在vue渲染页面时 调用方法
  created() {
    this.getMenuList()
    // console.log(this.$route.path);
    // console.log(this.$router);
    // console.log(this.$route);
  },
  methods: {
    logout() {
      // 清除本地的token
      window.sessionStorage.clear()
      //跳转到login
      this.$router.push('/login')
    },
    // 获取菜单栏
    async getMenuList() {
      const { data: res } = await this.$axios.get('/menus')
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('失败')

      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scope>
.el-container {
  height: 100%;
}

.el-header {
  padding-left: 0px !important;
  background-color: #373d41;
  // 设置元素左右贴边对齐
  display: flex;
  justify-content: space-between;
  //上下居中对齐
  align-items: center;

  font: 20px;
  color: white;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .toggle-button {
    line-height: 24px;
    font-size: 12px;
    color: white;
    text-align: center;
    background-color: #373d41;
  }
  .el-menu {
    border-right: 0px;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>

