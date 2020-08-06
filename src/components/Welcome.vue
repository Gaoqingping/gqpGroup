<template>
  <div>
	  <!-- Breadcrumb 面包屑 -->
	  <el-breadcrumb separator-class="el-icon-arrow-right">
	  	<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  	<el-breadcrumb-item>后台首页</el-breadcrumb-item>
	  </el-breadcrumb>
	  
	  
    <!-- 2.为Echarts准备一个Dom -->
    <el-row>
      <el-col :span="16">
         <div id="main" style="width: 1000px;height:600px;"></div>
      </el-col>
    
    </el-row>
  </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'

export default {
  // 此时,页面上的元素,已经被渲染完毕了
  async mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
   const option = {
        title: {
            text: '高清平小组项目分工',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['邹文', '高清平', '易元宇', '叶书东', '汪鑫']
        },
        series: [
            {
                name: '项目分工',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 666, name: '邹文'},
                    {value: 666, name: '高清平'},
                    {value: 666, name: '易元宇'},
                    {value: 666, name: '叶书东'},
                    {value: 666, name: '汪鑫'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped="scoped">
div{
   margin: 0;
   padding: 0;
}
</style>
