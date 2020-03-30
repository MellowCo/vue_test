<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_img">
        <img src="../assets/logo.png" alt />
      </div>

      <el-form ref="form" :model="loginform" class="login_form" :rules="loginrules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginform.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginform.password"></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="rest">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 返回表单数据
      loginform: {
        username: 'admin',
        password: '123456'
      },
      loginrules: {
        username: [
          { required: true, message: '用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    rest() {
      console.log(this.$data)
      this.$refs.form.resetFields()
    },
    login() {
      this.$refs.form.validate(async valid => {
        //验证不通过
        if (!valid) return

        // const res = await this.$axios.post("login", this.loginform);
        // const resdata = res.data;
        //两种写法相同
        const { data: resdata } = await this.$axios.post('login', this.loginform)
        console.log(resdata)
        if (resdata.meta.status != 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', resdata.data.token)
        //通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
}

.login_box {
  width: 450px;
  height: 300px;
  border-radius: 10px;
  background-color: white;
  /* 设置居中 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 10px #eee;
  padding: 10px;
  // 定位
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    // 设置图片大小 充满父元素
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  // 绝对定位 到底部
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  //设置盒子
  box-sizing: border-box;
}

.btns {
  // 排版
  display: flex;
  justify-content: flex-end;
}
</style>
