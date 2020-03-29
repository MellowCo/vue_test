<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="userinfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="dialogVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch @change="changeStatus(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <div>
              <el-tooltip
                class="item"
                effect="dark"
                content="更改"
                placement="top"
                :enterable="false"
              >
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delUser(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button type="success" icon="el-icon-s-help" size="mini"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="userinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" @close="closeDialog" width="30%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
export default {
  data() {
    // 验证邮箱
    var checkEmail = (rule, value, callback) => {
      //邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的邮箱！"));
    };

    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      //手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号！"));
    };

    return {
      userinfo: { query: "", pagenum: 1, pagesize: 2 },
      userList: [],
      total: 0,
      // 隐藏对话框
      dialogVisible: false,
      // 添加表单的数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加表单的校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get("/users", {
        params: this.userinfo
      });
      if (res.meta.status != 200) return this.$message.error("错误");
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res.data);
      // console.log(this.userList);
    },
    // 页面大小
    handleSizeChange(size) {
      this.userinfo.pagesize = size;
      //重新获取请求
      this.getUserList();
    },
    handleCurrentChange(curPage) {
      this.userinfo.pagenum = curPage;
      //重新获取请求
      this.getUserList();
    },
    // 更改用户状态
    async changeStatus(info) {
      console.log(info);
      const { data: res } = await this.$axios.put(
        `users/${info.id}/state2/${info.mg_state}`
      );
      if (res.meta.status != 200) {
        //设置失败
        info.mg_state = !info.mg_state;
        return this.$message.error("设置失败");
      }
      this.$message.success("设置成功");
    },
    // 关闭对话框 重置表单
    closeDialog() {
      //获取表单对象并重置
      this.$refs.addFormRef.resetFields();
    },
    //验证提交表单
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //发送添加请求
        const { data: res } = await this.$axios.post("/users", this.addForm);

        console.log(res);

        if (res.meta.status != 201) return this.$message.error("添加失败");

        this.$message.success("添加成功");
        this.dialogVisible = false;
        //重新获取 所有用户
        this.getUserList();
      });
    },
    //删除用户
    delUser(id) {
      this.$confirm("是否删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete("/users/" + id)
            .then(res => {
              // console.log(res);

              if (res.data.meta.status != 200)
                return this.$message.error("删除失败");
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(err => {
              console.log("url 不对");
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },

  created() {
    this.getUserList();
  }
};
</script>