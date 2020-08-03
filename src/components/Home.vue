<template>
	<el-container>
		<!-- 头部 -->
		<el-header>
		  <div>
		    <img src="../assets/logo.png" alt />
		    <span>苏宁易购后台管理系统</span>
		  </div>
		  <el-button type="danger" @click="logout">退出登录</el-button>
		</el-header>
	</el-container>
</template>

<script>
	export default{
		data:function(){
			return{
				
			}
		},
		methods:{
			logout () {
			  // 清空token
			  window.sessionStorage.clear()
			  this.$router.push('/login')
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
	.el-container {
	  height: 100%;
	}
	.el-header {
	  background-color: #0018bb;
	  display: flex;
	  justify-content: space-between;
	  padding-left: 0;
	  align-items: center;
	  color: #fff;
	  font-size: 20px;
	  > div {
	    display: flex;
	    align-items: center;
	    img {
	      height: 40px;
	    }
	    span {
	      margin-left: 15px;
	    }
	  }
	}
</style>
