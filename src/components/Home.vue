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
		    
			<!-- 主体 -->
			<el-container>
				<!-- 侧边栏 -->
				<el-aside :width="isCollapse ? '64px' : '200px'">
				
				<div class="toggle-button" @click="isCollapse = !isCollapse"><i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i></div>
				
				 <el-menu 
				 unique-opened 
				 :collapse="isCollapse"
				  :collapse-transition="false" 
				  router 
				  :default-active="activePath" 
				 
				  >
		
				   <!-- 一级菜单  -->
				   <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
				     <!-- 一级菜单的模板区域 -->
				     <template slot="title">
				       <i :class="iconObj[item.id]"></i>
				       <span>{{ item.authName}}</span>
				     </template>
				     <!-- 二级菜单 -->
				     <el-menu-item 
					 :index="'/' + subItem.path"
					  v-for="subItem in item.children" 
					  :key="subItem.id"
					   @click="saveNavState('/' + subItem.path)">
					   
					   
				       <!-- 导航开启路由模式：
				         将index值作为导航路由 -->
				       <!-- 二级菜单的模板区域 -->
				       <template slot="title">
				         <i class="iconfont icon-shuzhuangtu"></i>
				         <span>{{ subItem.authName}}</span>
				       </template>
				     </el-menu-item>
				   </el-submenu>
				 </el-menu>
						
				      
				
				
				
				
				
				
				
				
				
				
				</el-aside>
				
				
				<!-- 首页-->
				<el-main>
				  <router-view></router-view>
				</el-main>
				
			</el-container>
		</el-container>
		
		
	</el-container>
</template>

<script>
	export default{
		data:function(){
			return {
			  // 左侧菜单数据
			  menuList: [],
			  iconObj: {
			    '125': 'iconfont icon-yonghuguanli',
			    '103': 'iconfont icon-quanxianguanli',
			    '101': 'iconfont icon-shangpinguanli',
			    '102': 'iconfont icon-benbanzushengchandingdanguanli',
			    '145': 'iconfont icon-kltj'
			  },
			  // 默认不折叠
			  isCollapse: false,
			  // 被激活导航地址
			  activePath: ''
			}
		},
		created () {
		  this.getMenuList()
		  this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods: {
		  logout () {
		    // 清空token
		    window.sessionStorage.clear()
		    this.$router.push('/login')
		  },
		  // 获取请求菜单
		  async getMenuList () {
		    const { data: res } = await this.$http.get('menus')
		    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
		    this.menuList = res.data
		    // console.log(res)
		  },
		  
		  // 保存连接的激活地址
		  saveNavState (activePath) {
		    window.sessionStorage.setItem('activePath', activePath)
		  }
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
	.el-aside {
	  background-color: #2b3140;
	
	  // .el-menu {
	  //   border: none;
	  // }
	  .el-menu-item,
	  /deep/ .el-submenu__title {
	    color: #fff;
		background-color: #1c212b;
	  }
	  /deep/ .el-menu-item:focus,
	  /deep/ .el-menu-item:hover,
	  /deep/.el-submenu__title:hover {
	    outline: 0;
		color: #0055ff;
		background-color: rgb(49,83,120);
	  }
	  /deep/ .el-menu-item.is-active {
	    color: #ffaa00;
		background-color:#e5e9ef;
	  }
	  
	  
	  
	}
	.el-main {
	  background-color: #e5e9ef;
	}
	
	.iconfont{
	  margin-right: 10px;
	  
	}
	
	.toggle-button {
	  background-color: #29a1b1;
	  font-size: 10px;
	  line-height: 24px;
	  color: #fff;
	  text-align: center;
	  letter-spacing: 0.2em;
	 &:hover{
		  cursor: pointer;
		  background: #ff5d0d;
		  color: white;
	 }
	}
	.el-icon-d-arrow-right::before{
		font-size: 16px;
	}
	.el-icon-d-arrow-left::before{
		font-size: 16px;
	}
</style>
