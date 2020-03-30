<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 打开添加弹窗 -->
    <el-button @click="openDialog">添加分类</el-button>
    <el-card class="box-card">
      <zk-table
        :data="categoriesList"
        :columns="columns"
        :expand-type="settings.expandType"
        :selection-type="settings.selectionType"
        :border="settings.border"
        index-text="#"
        show-index
      >
        <template v-slot:isOk="data">
          <i
            class="el-icon-success"
            v-if="data.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 商品级别 -->
        <template v-slot:catLevel="data">
          <el-tag v-if="data.row.cat_level === 0">等级一</el-tag>
          <el-tag type="success" v-else-if="data.row.cat_level === 1">等级二</el-tag>
          <el-tag type="warning" v-else>等级三</el-tag>
        </template>

        <template v-slot:opt>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </zk-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="queryInfo.pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的弹窗 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" clearable></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- options 绑定的可选项数据源 键名可通过 Props 属性配置-->
          <!-- clearable 可以清空 -->
          <el-cascader
            v-model="selectKeys"
            :options="catePraterList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //分类列表
      categoriesList: [],
      // 总数
      total: 0,
      // 设置table中显示的数据
      columns: [
        {
          // 显示的标签头
          label: '商品名',
          // 对应列内容的属性名
          prop: 'cat_name',
          width: '200px',
          //对应列内容的对齐方式
          align: 'left',
          //对应列标题的对齐方式
          headerAlign: 'center'
        },
        {
          // 显示的标签头
          label: '是否可用',
          // 对应列内容的属性名
          prop: 'cat_deleted',
          width: '200px',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '商品级别',
          prop: 'cat_level',
          type: 'template',
          template: 'catLevel'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      //table的设置
      settings: {
        //是否为展开行类型表格
        expandType: false,
        //是否为多选类型表格
        selectionType: false,
        //是否显示纵向边框
        border: true
      },
      // 弹窗显示
      dialogVisible: false,
      // 添加分类的数据
      addForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器的 数据源
      // 打开弹窗时 对其赋值
      catePraterList: [],
      // 级联选择器设置
      cascaderProps: {
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        // 选择任意一级选项
        checkStrictly: true
      },
      //选择父分类的key
      selectKeys: []
    }
  },
  methods: {
    // 获取所有商品
    async getCategoriesList() {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })

      // console.log(res)
      if (res.meta.status != 200) return this.$message.error('获取商品分类失败')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    //分页
    sizeChange(size) {
      this.queryInfo.pagesize = size
      this.getCategoriesList()
    },
    currentChange(curPage) {
      this.queryInfo.pagenum = curPage
      this.getCategoriesList()
    },
    // 打开弹窗
    openDialog() {
      //获取数据 打开弹窗
      this.getCatePraterList()
      console.log(this.selectKeys)

      this.dialogVisible = true
    },
    // 弹窗中 获取父级分类
    async getCatePraterList() {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      // console.log(res)

      if (res.meta.status != 200) return this.$message.error('获取商品分类失败')
      this.catePraterList = res.data
      console.log(this.catePraterList)
    },
    //当选择框 发送变化
    handleChange(val) {
      const selectKeyArr = this.selectKeys
      if (selectKeyArr.length > 0) {
        this.addForm.cat_pid = selectKeyArr[selectKeyArr.length - 1]
        this.addForm.cat_level = selectKeyArr.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
      console.log(val)
      console.log(this.addForm)
    },
    // 增加分类的请求
    async addCate() {
      // console.log(this.$refs.addFormRef)

      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入分类名')

        const { data: res } = await this.$axios.post('categories', this.addForm)
        if (res.meta.status != 201) return this.$message.error('添加失败')

        this.$message.success('添加成功')
        this.getCategoriesList()
        this.dialogVisible = false
      })
    },
    // 关闭弹出 重置表单信息
    closeDialog() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
      // 重置级联选择器
      this.selectKeys = []
    }
  },
  created() {
    this.getCategoriesList()
  }
}
</script>

<style lang="less" scoped>
</style>