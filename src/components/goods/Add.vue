<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card>
      <!-- 警告信息 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 进度条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="商品完成"></el-step>
      </el-steps>

      <!-- tab表单 -->
      <el-tabs tab-position="left" v-model="activeIndex">
        <el-tab-pane label="基本信息" name="0">用户管理</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="fileUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            ref="uploadRef"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        <el-tab-pane label="商品完成" name="5">商品完成</el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 预览图 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>图片</span>
      <el-image :src="imgSrc"></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      // 文件上传
      file: {},
      // 文件上传路径 需要完整
      fileUrl: 'http://127.0.0.1:8888/api/private/v1/uploaddddddddd',
      // 添加请求头
      headers: { Authorization: window.sessionStorage.getItem('token') },
      // 文件列表
      imgSrcList: [],
      dialogVisible: false,
      // 上传图路径
      imgSrc: '',
      fileList: []
    }
  },
  methods: {
    // 预览
    handlePreview(file) {
      // console.log(this.headers)
      this.imgSrc = file.response.data.url
      this.dialogVisible = true
      // console.log(file)
    },
    handleRemove(file, list) {
      console.log(file)
      console.log(list)
    },
    // 监听文件上传
    handleSuccess(res, file, list) {
      if (res.meta.status != 200) {
        // this.$refs.uploadRef.abort()
        // this.handleError()
        this.$message.error('文件上传失败')

        console.log(res)
        console.log(file)
        console.log(list)
        console.log(this.fileList)

        return
      }
    },
    handleError(err, file, list) {
      console.log('err')
      console.log(err)
      console.log(file)
      console.log(list)
    }
  }
}
</script>