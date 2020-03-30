<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert title="只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 搜索 -->
      <el-row class="row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 切换标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button type="primary" :disabled="isSelect">动态属性</el-button>
          <!-- 表格 -->
          <el-table :data="manyTable" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="isSelect">静态参数</el-button>

          <el-table :data="onlyTable" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 循环标签数组 -->
              <template v-slot="data">
                <el-tag
                  :key="i"
                  v-for="(item,i) in data.row.attr_vals"
                  closable
                  :disable-transitions="false"
                >{{item}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="data.row.inputTagVisible"
                  v-model="data.row.inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="addTag(data.row)"
                  @blur="addTag(data.row)"
                ></el-input>

                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(data.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      //分类列表
      cateList: [],
      //选择的id
      selectKeys: [],
      //级联选择器 配置
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //激活的标签页 name
      activeName: 'many',
      manyTable: [],
      onlyTable: []
      // 在每个tag中单独设置
      // inputTagVisible: false,
      // inputTagValue: ''
    }
  },
  methods: {
    // 获取分类信息
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status != 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data
      console.log(this.cateList)
    },
    handleChange() {
      this.getParams()
    },
    // 标签页的点击事件
    handleClick() {
      //切换标签 获取数据
      this.getParams()
      // console.log(this.activeName)
    },
    // 获取属性 和 参数
    async getParams() {
      //不是3级id 不发送请求
      //清空表格
      if (this.selectKeys.length != 3) {
        this.manyTable = []
        this.onlyTable = []
        return
      }

      const { data: res } = await this.$axios.get(`categories/${this.getId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status != 200) return this.$message.error('获取失败')
      console.log(res)

      // 将字符串转化成数组
      res.data.forEach(element => {
        element.attr_vals = element.attr_vals ? element.attr_vals.split(',') : []
        //为每个标签设置一个单独的inputTagVisible inputTagValue
        element.inputTagVisible = false
        element.inputTagValue = ''
      })
      // console.log(res)

      this.$message.success('获取成功')
      if (this.activeName === 'many') {
        this.manyTable = res.data
      } else {
        this.onlyTable = res.data
      }
    },
    // 将标签保存
    //按下enter 或 blur
    async addTag(row) {
      if (row.inputTagValue) {
        // this.dynamicTags.push(row.inputTagValue)
        //创建新数组
        const tagArr = row.attr_vals
        tagArr.push(row.inputTagValue)
        //添加属性
        const data = {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: tagArr.join(',')
        }

        const { data: res } = await this.$axios.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, data)
        // console.log(data)
        console.log(row)
        console.log(tagArr)

        if (res.meta.status != 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')

        row.attr_vals = tagArr
        // console.log(res)
        // console.log(row.inputTagValue)
      }
      row.inputTagVisible = false
      row.inputTagValue = ''
    },
    showInput(row) {
      row.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  // 计算属性
  computed: {
    // 根据级联选择器 改变按钮可用状态
    isSelect() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取三级id
    getId() {
      return this.selectKeys[2]
    },
    //
    getTags() {}
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.row {
  margin: 15px 0;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>