<template>
  <div>
    订单
    <el-card>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in info"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>

      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      info: [],
      // 准备图标的数据
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    async getInfo() {
      const { data: res } = await this.$axios.get('kuaidi/1106975712662')
      console.log(res)

      this.info = res.data
    },
    async createEchats() {
      // 基于准备好的dom，初始化echarts实例
      const main = echarts.init(document.getElementById('main'))

      //获取数据
      const { data: res } = await this.$axios.get('reports/type/1')
      console.log(res)
      //通过lodash 合并对象
      const edata = _.merge(res.data, this.option)

      console.log(edata)

      // 使用刚指定的配置项和数据显示图表。
      main.setOption(edata)
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {
    this.createEchats()
  }
}
</script>


<style lang="less" scoped>
</style>