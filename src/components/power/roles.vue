<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-row
              v-for="items in scope.row.children"
              :key="items.id"
              :gutter="20"
              class="martop vcenter"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable type="success">{{items.authName}}</el-tag>
              </el-col>
              <!-- 2 3 级权限 -->
              <el-col :span="19">
                <el-row
                  :gutter="20"
                  v-for="item in items.children"
                  :key="item.id"
                  class="martop vcenter"
                >
                  <el-col :span="5">
                    <el-tag closable>{{item.authName}}</el-tag>
                  </el-col>

                  <el-col :span="10">
                    <el-tag
                      closable
                      type="info"
                      v-for="ite in item.children"
                      :key="ite.id"
                    >{{ite.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="180"></el-table-column>
        <el-table-column prop="authName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <!-- 设置权限样式 -->
        <el-table-column prop="level" label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-share"
              size="mini"
              @click="openDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 角色授权的弹窗 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
        <!-- 树型 -->
        <el-tree
          :data="rightsList"
          node-key="id"
          :props="rightsProps"
          default-expand-all
          show-checkbox
          :default-checked-keys="defRights"
          ref="rightsTreeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.martop {
  margin-top: 20px;
  border-top: 1px #eee solid;
  border-bottom: 1px #eee solid;
}

// 上下居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>

<script>
export default {
  data() {
    return {
      //角色列表
      rolesList: [],
      // 弹窗
      dialogVisible: false,
      // 权限列表
      rightsList: [],
      // 指定子节点
      rightsProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点
      defRights: [],
      //分配 权限的id
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    async getUserList() {
      const { data: res } = await this.$axios.get('roles')

      if (res.meta.status != 200) return this.$message.error('请求角色列表失败')

      this.rolesList = res.data
      this.$message.success('请求角色列表成功')
    },
    // 打开弹窗
    openDialog(role) {
      //将分配权限的uid
      this.roleId = role.id
      //获取权限列表
      this.getRightsList()
      //获取默认选中的权限
      this.getRights(role, this.defRights)
      this.dialogVisible = true
    },
    //获取权限列表
    async getRightsList() {
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status != 200) return this.$message.error('请求权限列表失败')
      // console.log(res);

      this.rightsList = res.data
      this.$message.success('请求权限列表成功')
    },
    //递归获取权限
    getRights(role, arr) {
      if (!role.children) return arr.push(role.id)

      role.children.forEach(item => this.getRights(item, arr))
    },
    //关闭弹窗 清理默认权限数组
    closeDialog() {
      this.defRights = []
    },
    //修改权限
    async setRights() {
      //先获取选中的id
      const key = [...this.$refs.rightsTreeRef.getCheckedKeys(), ...this.$refs.rightsTreeRef.getHalfCheckedKeys()]

      //将数组通过 , 拼接
      const idStr = key.join(',')

      //发送请求
      //roleId 在打开弹窗时 以赋值
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getUserList()
      this.dialogVisible = false
    }
  },
  created() {
    this.getUserList()
  }
}
</script>