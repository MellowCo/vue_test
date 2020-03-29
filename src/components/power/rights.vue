<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" width="180"></el-table-column>
        <el-table-column prop="authName" label="权限说明" width="180"></el-table-column>
        <el-table-column prop="path" label="权限路径" width="180"></el-table-column>
        <!-- 设置权限样式 -->
        <el-table-column prop="level" label="权限层级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    // 获取权限列表
    async getUserList() {
      const { data: res } = await this.$axios.get("/rights/list");

      if (res.meta.status != 200)
        return this.$message.error("请求权限列表失败");

      this.rightsList = res.data;
      this.$message.success("请求权限列表成功");
    }
  },
  created() {
    this.getUserList();
  }
};
</script>