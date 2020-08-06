<template>

	<el-container>
		<!-- Breadcrumb 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<div id="myChart" style="width:1000px;height:480px;"></div>
		</el-card>


	</el-container>

</template>

<script>
// //引入Echarts
import echarts from "echarts";
import lodash from "lodash";

export default {
  data() {
    return {};
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById("myChart"));
    const { data: res } = await this.$http.get("reports/type/1");
    console.log(res);
    if (res.meta.status !== 200) return this.$message("获取折线图数据失败!");
    console.log(res.data.legend.data);
    // const result = lodash.merge(res.data, this.options)
    const option = {
      title: {
        text: "用户数据来源",
        left: "center",
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: res.data.legend.data,
        orient: "vertical",
        bottom: "bottom",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: res.data.xAxis[0].data,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: res.data.series[0].name,
          type: "bar",
          data: res.data.series[0].data,
        },
        {
          name: res.data.series[1].name,
          type: "bar",
          data: res.data.series[1].data,
          markLine: {
            lineStyle: {
              type: "dashed",
            },
            data: [[{ type: "min" }, { type: "max" }]],
          },
        },
        {
          name: res.data.series[2].name,
          type: "bar",
          data: res.data.series[2].data,
        },
        {
          name: res.data.series[3].name,
          type: "bar",
          data: res.data.series[3].data,
        },
        {
          name: res.data.series[4].name,
          type: "bar",
          data: res.data.series[4].data,
        },
      ],
    };

    // myChart.setOption(result)
    myChart.setOption(option);
  },
};
</script>

<style lang="less" scoped="scoped">
.el-card {
  width: 80%;
  height: 500px;
  position: absolute;
  bottom: 10%;
}
</style>
