<template>
  <div>
    <el-button type="primary" @click="goAdd">添加商品</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goAdd() {
      this.$router.push('/goods/add')
    }
  }
}
</script>