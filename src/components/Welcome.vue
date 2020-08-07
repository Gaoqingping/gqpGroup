<template>
	<div>
		<el-col>
			<!-- Breadcrumb 面包屑 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>后台首页</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>


		<el-row :gutter="20">

			<el-col :span="6">
				<div class="grid-content bg-purple">
					<i class="iconfont icon-yonghu" style="font-size: 50px;color: #feb018;"></i>
					<div class="txt">
						用户总数
						<p>
							{{userTotal}}
						</p>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple">
					<i class="iconfont icon-jiaoseguanli" style="font-size: 50px;color:#4d9bce;"></i>
					<div class="txt">
						角色总数
						<p>
							{{orderTotal}}
						</p>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple">
					<i class="iconfont icon-shangpinguanli1" style="font-size: 50px;color:#cd2572;"></i>
					<div class="txt">
						商品总数
						<p>
							{{goodTotal}}
						</p>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple">
					<i class="iconfont icon-dingdan" style="font-size: 50px;color: #2c8ec8;"></i>
					<div class="txt">
						订单总数
						<p>{{orderTotal}}</p>
					</div>
				</div>
			</el-col>

			<!-- <el-col :span="6" v-for="(item,index) in cardArr">
				<img :src="item.imgUrl" />
				{{item.title}}
				{{item.count}}
			</el-col> -->

		</el-row>
		
		<el-card>
			<div id="main" style="width: 100%;height:320px;"></div>
		</el-card>

	</div>
</template>

<script>
	import '@/assets/fonts/iconfont.css'
	import echarts from 'echarts'
	export default {
		data: function() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				goodTotal: 0,
				orderTotal: 0,
				userTotal: 0,
				roleTotal: 0,
				cardArr: [],
				
			}

		},


		created() {
			this.getGoodsList();
			this.getOrderList();
			this.getUserList();
			this.getRolesList();
		},
		methods: {
			async getGoodsList() {
				const {
					data: res
				} = await this.$http.get('goods', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品列表失败！')
				}
				this.goodTotal = res.data.total;
			},
			async getOrderList() {
				const {
					data: res
				} = await this.$http.get('orders', {
					params: this.queryInfo
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取订单列表失败！')
				}
				this.orderTotal = res.data.total;
			},

			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户列表失败！')
				}
				this.userTotal = res.data.total;
			},
			async getRolesList() {
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败！')
				}
				this.roleTotal = res.data.total;
			},


		},
		
		//DOM初始化完毕
		async mounted() {
			this.cardArr = [{
					imgUrl: require("@/assets/img/avatar.png"),
					title: "总用户",
					count: this.userTotal,
				},
				{
					imgUrl: require("../assets/img/avatar.png"),
					title: "总角色",
					count: this.roleTotal,
				},
				{
					imgUrl: require("../assets/img/avatar.png"),
					title: "总商品",
					count: this.goodTotal,
				},
				{
					imgUrl: require("../assets/img/avatar.png"),
					title: "总订单",
					count: this.orderTotal,
				},
			]
			
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('main'));
		// 使用刚指定的配置项和数据显示图表。
		const option = {
			title: {
				text: '折线图堆叠'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['用户总数', '角色总数', '商品总数', '订单总数']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			},
			yAxis: {
				type: 'value'
			},
			series: [{
					name: '用户总数',
					type: 'line',
					stack: '总量',
					data: [120, 132, 101, 134, 90, 230, 210]
				},
				{
					name: '角色总数',
					type: 'line',
					stack: '总量',
					data: [220, 182, 191, 234, 290, 330, 310]
				},
				{
					name: '商品总数',
					type: 'line',
					stack: '总量',
					data: [150, 232, 201, 154, 190, 330, 410]
				},
				{
					name: '订单总数',
					type: 'line',
					stack: '总量',
					data: [320, 332, 301, 334, 390, 330, 320]
				},
			]
		};
		myChart.setOption(option);
			
		}
	}
</script>

<style lang="less" scoped="scoped">
	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
		display: flex;
		justify-content: space-evenly;
		padding: 10px;
		background: #fff;
		border-radius: 10px;

		&:hover {
			transition: all 0.2s linear;
			transform: translateY(2px);
			box-shadow: 0px 0px 5px 5px #d3dce6;
		}


		.txt {
			text-align: center;
			// color: gainsboro;
			font-size: 16px;

			p {
				font-weight: bolder;
				font-size: 30px;
			}
		}
	}

	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	/deep/ .el-card{
		margin-top: 30px;
		height: 360px;
	}
	/deep/.el-breadcrumb {
    margin-bottom: 20px;
    font-size: 20px;
	.el-breadcrumb__item{
		margin-bottom: 20px;
		font-size: 20px;
	}
}
</style>
