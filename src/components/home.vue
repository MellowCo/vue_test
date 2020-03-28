<template>
  <div>
    <div>home</div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // 清除本地的token
      window.sessionStorage.clear();
      //跳转到login
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scope>
</style>

