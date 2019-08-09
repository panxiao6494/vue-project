<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 900px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import { getEchart } from '../../api/api'
  import _ from 'lodash'

  export default {
    data () {
      return {
        options: {
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
    async mounted () {
      const myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await getEchart()
      if (res.meta.status !== 200) return this.$message.error('获取折线图失败')
      const result = _.merge(this.options, res.data)
      myChart.setOption(result)
    }
  }
</script>
