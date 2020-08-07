<template>
	
	
	
<!-- 	<el-container>
			<el-header>
			  <div>
			    <img src="../assets/logo.png" alt />
			    <span>苏宁易购后台管理系统</span>
			  </div>
			  <el-button type="infor" @click="logout">退出登录</el-button>
			</el-header>
		    
			<el-container>
				<el-aside :width="isCollapse ? '64px' : '200px'">
				
				
				 <el-menu 
				 unique-opened 
				 :collapse="isCollapse"
				  :collapse-transition="false" 
				  router 
				  :default-active="activePath" 
				 
				  >
		
				   <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
				     <template slot="title">
						 <i :class="iconObj[item.id]" class="icos"></i>
				       <span> 
					   {{ item.authName}}
					   </span>
				     </template>
				     <el-menu-item 
					 :index="'/' + subItem.path"
					  v-for="subItem in item.children" 
					  :key="subItem.id"
					   @click="saveNavState('/' + subItem.path)">
					   
					   
				  
				       <template slot="title">
				         <i class="iconfont icon-shuzhuangtu"></i>
				         <span>{{ subItem.authName}}</span>
				       </template>
				     </el-menu-item>
				   </el-submenu>
				 </el-menu>
						
				      
				
				
				<div class="toggle-button" @click="isCollapse = !isCollapse">
					<i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i>
				</div>
				
				
				
				
				
				
				
				</el-aside>
				
				
				<el-main>
				  <router-view></router-view>
				</el-main>
				
			</el-container>
		</el-container> -->
		
		
		<!-- 总体布局改造 -->
		<el-container>
		  <el-aside :width="isCollapse ? '64px' : '240px'">
		  
		  <el-menu
		  unique-opened
		  :collapse="isCollapse"
		   :collapse-transition="false" 
		   :default-active="activePath" 
		  >
			 <div :width="isCollapse ? '64px' : '240px'">
				 <img src="../assets/logo.png" alt />
			   <span v-if="!isCollapse">苏宁小店后台管理系统</span>
			 </div>
		  </el-menu>
		  
		   <el-menu 
		   unique-opened 
		   :collapse="isCollapse"
		    :collapse-transition="false" 
		    router 
		    :default-active="activePath" 
		   
		    >
		  	
			
				
		     <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
		       <template slot="title">
		  		 <i :class="iconObj[item.id]" class="icos"></i>
		         <span> 
		  	   {{ item.authName}}
		  	   </span>
		       </template>
		       <el-menu-item 
		  	 :index="'/' + subItem.path"
		  	  v-for="subItem in item.children" 
		  	  :key="subItem.id"
		  	   @click="saveNavState('/' + subItem.path)">
		  	   
		  	   
		    
		         <template slot="title">
		           <i class="iconfont icon-shuzhuangtu"></i>
		           <span>{{ subItem.authName}}</span>
		         </template>
		       </el-menu-item>
		     </el-submenu>
		   </el-menu>
		  		
		        
		  
		  
		  <div class="toggle-button" @click="isCollapse = !isCollapse">
		  	<i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i>
		  </div>
		  
		  
		  
		  
		  
		  
		  
		  </el-aside>
		  <!-- <el-container>
			  <el-header>
			  <el-button type="infor" @click="logout">退出登录</el-button>
			  
			  </el-header>
		    <el-main>
				
				
					
				<router-view></router-view>
			</el-main>
		  </el-container> -->
		  <el-container>
		      <el-header>
			  
			  <el-row>
				  <el-col class="header-right">
				    <el-dropdown @command="handerCommand">
				      <span>
				        欢迎您 {{ account }}
				        <i class="el-icon-arrow-down el-icon--right"></i>
				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item command="home"><i class="iconfont icon-guanlizhongxin"></i> 个人中心</el-dropdown-item>
				        <el-dropdown-item command="logout"><i class="iconfont icon-tuichudenglu"></i>退出登录</el-dropdown-item>
				      </el-dropdown-menu>
				    </el-dropdown>
				    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
						
					</el-avatar>
				  </el-col>
			  </el-row>
			  <!-- <el-button type="infor" @click="logout">退出登录</el-button> -->
			  </el-header>
		      <el-main>
				 <router-view></router-view> 
			  </el-main>
		    </el-container>
		</el-container>
		
		
		
		
</template>

<script>
	import local from "@/utils/local";
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
			  activePath: '',
			  account:'',
			  breadArr: [], // 面包屑导航
			}
		},
		created () {
		  this.getMenuList()
		  this.activePath = window.sessionStorage.getItem('activePath');
		  this.account = local.get('username');
		  this.calcBread()
		},
		
		methods: {
			handerCommand(cmd) {
			  console.log(cmd);
			  if (cmd === "home") {
			    // 去到home页面
			    this.$router.push("/home");
			  } else {
			    this.$message.warning("您已成功退出!!");
			    // 清空token
			    window.sessionStorage.clear()
				local.clear();
			    this.$router.push('/login')
			    // 刷新浏览器【重新初始化路由】
			    location.reload();
			  }
			},
			
			
		  // logout () {
		  //   // 清空token
		  //   window.sessionStorage.clear()
		  //   this.$router.push('/login')
		  // },
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
		  },
		  
		  
		  // 计算面包屑
		  calcBread() {
		    let arr = [{ title: "首页", path: "/home" }];
		    this.$route.matched.forEach((v) => {
		      // console.log(v);
		      // 如果有Meta并且meta中有title，证明了配置有了
		      if (v.meta && v.meta.title) {
		        arr.push({
		          title: v.meta.title,
		          path: v.path,
		        });
		      }
		    });
		    this.breadArr = arr;
		    console.log(this.breadArr);
		  },
		  
		},
		mounted() {
			// console.log(this.$route.params.username)
		}
	}
</script>

<style scoped="scoped" lang="less">
	.el-container {
	  height: 100%;
	}
	.el-header {
	  background-color: #f8f9fc;
	  box-shadow:inset 0px 0px 20px 20px #e9eaed;
	  
	  display: flex;
	  justify-content:flex-end;
	  align-items: center;
	  color: #fff;
	  font-size: 20px;
	  .el-dropdown{
		font-size: 20px;  
	  }
	}
	.el-aside {
	  background:linear-gradient(to bottom,#4e73df,#3d63d2);
	
	  .el-menu {
	    border: none;
		
		> div {
		  display: flex;
		  align-items: center;
		  overflow: hidden;
		  flex-wrap: nowrap;
		  font-weight: 900;
		  background:linear-gradient(to bottom,#4e73df,#3d63d2);
		  color: #fff;
		  img {
		    height: 56px;
		  }
		  span {
		    margin-left: 10px;
		  }
		}
		
		
		
	  }
	  .el-menu-item,
	  /deep/ .el-submenu__title {
	    color: rgba(255,255,255,0.6);
		background:linear-gradient(to bottom,#4e73df,#3d63d2);
		  
	  }
	  /deep/ .el-menu-item:focus,
	  /deep/ .el-menu-item:hover,
	  /deep/.el-submenu__title:hover {
	    outline: 0;
		color: #fff;
		background-color: rgb(49,83,120);
		.icos{
			color: #fff;
		}
	  }
	  /deep/ .el-menu-item.is-active {
	    color: #fff;
		background-color:#ffffff;
		border-radius: 10px;
	  }
	  
	  .icos{
		  color: rgba(255,255,255,0.6);
		  &:hover{
			  color: #fff;
		  }
	  }
	  
	  
	}
	.el-main {
	  background-color: #f8f9fc;
	  box-shadow:inset 0px 0px 20px 20px #e9eaed;
	}
	
	.iconfont{
	  margin-right: 10px;
	  
	}
	
	.toggle-button {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	  background: rgb(102, 133, 221);
	  color: rgb(181, 196, 240);
	  text-align: center;
	  line-height: 50px;
	  opacity: 0.8;
	  margin: 50px auto;
	  
	 &:hover{
		  cursor: pointer;
		  opacity: 1;
	 }
	 i{
		 font-weight: 900;
	 }
	}
	.el-icon-d-arrow-right::before{
		font-size: 16px;
		font-weight: 900;
	}
	.el-icon-d-arrow-left::before{
		font-size: 16px;
		font-weight: 900;
	}
</style>
