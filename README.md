#  Vue电商后台管理系统 

## 登录业务流程

### 路由导航守卫控制访问权限

> 如果用户没有登录,但是直接通过URL访问特定页面,需要重新导航到登录页面

```js
router.beforeEach((to,from,next) => {
    //如果用户访问的登录页,直接放行
    if (to.path === 'login') return next()
    //从sessionStorage中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem('token')
    //如果么有token,强制跳转到登录页
    if(!tokenStr) return next('/login')
    next()
})
```

> 如果用户输入错误路由，将进入404页面

```js
// 错误路由
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    visible: false,
  },
  {
    path: "*",
    redirect: "/404",
    visible: false,
  },
```
### 实现退出功能
> 在Home组件中添加一个退出功能按钮,给退出按钮添加点击事件，添加事件处理代码如下：

```js
export default {
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
```


## 主页布局

#### 通过接口获取菜单数据

> 通过axios请求拦截器添加token,保证拥有获取数据的权限

```js
// axios请求拦截
axios.interceptors.request.use(config => {
    // 为请求头对象,添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
```
### 修改用户信息
- 为用户列表中的修改按钮绑定点击事件
- 在页面中添加修改用户对话框，并修改对话框的属性
- 根据id查询需要修改的用户数据

```js
//展示编辑用户的对话框
async showEditDialog(id) {
    //发送请求根据id获取用户信息
    const { data: res } = await this.$http.get('users/' + id)
    //判断如果添加失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
    //将获取到的数据保存到数据editForm中
    this.editForm = res.data
    //显示弹出窗
    this.editDialogVisible = true
}
```

* 在弹出窗中添加修改用户信息的表单并做响应的数据绑定以及数据验证

```vue
<!-- 对话框主体区域 -->
<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
    <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
</el-form>
```

### 删除用户
> 在点击删除按钮的时候，我们应该跳出提示信息框，让用户确认要进行删除操作。
> 如果想要使用确认取消提示框，我们需要先将提示信息框挂载到vue中。

* 导入`MessageBox`组件，并将`MessageBox`组件挂载到实例。
  `Vue.prototype.$confirm = MessageBox.confirm`
* 给用户列表中的删除按钮添加事件，并在事件处理函数中弹出确定取消窗,最后再根据id发送删除用户的请求

```
async removeUserById(id){
    //弹出确定取消框，是否删除用户
    const confirmResult = await this.$confirm('请问是否要永久删除该用户','删除提示',{
    confirmButtonText:'确认删除',
    cancelButtonText:'取消',
    type:'warning'
    }).catch(err=>err)
    //如果用户点击确认，则confirmResult 为'confirm'
    //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
    if(confirmResult != "confirm"){
        return this.$message.info("已经取消删除")
    }
    //发送请求根据id完成删除操作
    const {data:res} = await this.$http.delete('users/'+id)
    //判断如果删除失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('删除用户失败')
    //修改成功的提示
    this.$message.success('删除用户成功')
    //重新请求最新的数据
    this.getUserList()
}
```



## 权限管理

#### 权限管理业务分析

> 通过权限管理模块控制不同的用户可以进行哪些操作,具体可以通过角色的方式进行控制,即每个用户分配一个特定的角色,角色包括不同的功能权限

### 权限列表

#### 添加权限列表路由

* 创建权限管理组件（Rights.vue），并在router.js添加对应的路由规则

```js
import Rights from './components/power/Rights.vue'
......
      path: '/home', component: Home, redirect: '/welcome', children: [
        { path: "/welcome", component: Welcome },
        { path: "/users", component: Users },
        { path: "/rights", component: Rights }
      ]
......
```

#### 生成权限列表
* 使用三重嵌套for循环生成权限下拉列表

```vue
<!-- 添加展开列 -->
<el-table-column type="expand">
    <template slot-scope="scope">
        <el-row :class="['bdbottom',i1===0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
                <el-tag>
                    {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二，三级权限 -->
            <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限  -->
                <el-row :class="[i2===0?'':'bdtop' ]" v-for="(item2,i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                        <el-tag type="success">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id">
                            {{item3.authName}}
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </template>
</el-table-column>
```

#### 完成权限分配功能

* 先给分配权限按钮添加事件
  `<el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog">分配权限</el-button>`
* 在showSetRightDialog函数中请求权限树数据并显示对话框

```js
async showSetRightDialog() {
    //当点击分配权限按钮时，展示对应的对话框
    this.setRightDialogVisible = true;
    //获取所有权限的数据
    const {data:res} = await this.$http.get('rights/tree')
    //如果返回状态为异常状态则报错并返回
    if (res.meta.status !== 200)
        return this.$message.error('获取权限树失败')
    //如果返回状态正常，将请求的数据保存在data中
    this.rightsList = res.data
}
```



#### 角色列表

* 添加角色列表路由
* 添加角色列表子组件`（power/Roles.vue）`，并添加对应的规则

```js
path: '/home', component: Home, redirect: '/welcome', children: [
        { path: "/welcome", component: Welcome },
        { path: "/users", component: Users },
        { path: "/rights", component: Rights },
        { path: "/roles", component: Roles  }
      ]
```



## 分类管理

### 商品分类概述

> 商品分类用于在购物时,快速找到需要购买的商品,进行直观显示

* 添加组件基本布局
  * 在`Cate.vue`组件中添加面包屑导航以及卡片视图中的添加分类按钮

```vue
<template>
    <div>
        <h3>商品分类</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类表格  -->

            <!-- 分页 -->
        </el-card>
    </div>
</template>
```

* 请求分类数据
  * 请求分类数据并将数据保存在`data`中

```js
<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      cateList: [],
      //查询分类数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //保存总数据条数
      total: 0
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      //获取商品分类数据
      const { data: res } = await this.$http.get('categories', {
        params: queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      //将数据列表赋值给cateList
      this.cateList = res.data.result
      //保存总数据条数
      this.total = res.data.total
      //   console.log(res.data);
    }
  }
}
</script>
```

* 使用插件展示数据
  * 使用第三方插件vue-table-with-tree-grid展示分类数据

    //全局注册组件
    Vue.component('tree-table', TreeTable)

```
<!-- 分类表格
:data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
:expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
<tree-table :data="cateList" :columns="columns" :selection-type="false"
:expand-type="false" show-index index-text="#" border :show-row-hover="false">

</tree-table>

在数据中添加columns:
columns: [
    {label:'分类名称',prop:'cat_name'}
]
```

* 自定义数据列
  * 使用vue-table-with-tree-grid定义模板列并添加自定义列

```
//先在columns中添加一个列
columns: [
    {label:'分类名称',prop:'cat_name'},
    //type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
    {label:'是否有效',prop:'',type:'template',template:'isok'},
    {label:'排序',prop:'',type:'template',template:'order'},
    {label:'操作',prop:'',type:'template',template:'opt'}
]

<!-- 是否有效区域， 设置对应的模板列： slot="isok"(与columns中设置的template一致) -->
<template slot="isok" slot-scope="scope">
  <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
  <i class="el-icon-error" v-else style="color:red"></i>
</template>
<!-- 排序 -->
<template slot="order" slot-scope="scope">
  <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
  <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
  <el-tag size="mini" type="warning" v-else>三级</el-tag>
</template>

<!-- 操作 -->
<template slot="opt" slot-scope="scope">
  <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
  <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button> 
</template>
```

* 完成分页功能

```vue
<!-- 分页 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>

//添加对应的事件函数
methods:{
  .......
  handleSizeChange(newSize){
    //当pagesize发生改变时触发
    this.queryInfo.pagesize = newSize;
    this.getCateList();
  },
  handleCurrentChange(newPage){
    //当pagenum发生改变时触发
    this.queryInfo.pagenum = newPage;
    this.getCateList();
  }
}
```



### 参数管理

#### 参数管理概述

> 商品参数用于显示商品的特征信息,可以通过电商平台详情页面直观的看到



### 项目优化

### 项目优化策略

- 通过vue.config.js修改webpack的默认配置

  > 通过vue-cli 3.0工具生成的项目,默认隐藏了所有webpack的配置项,目的是为了屏蔽项目的配置过程,让开发人员把工作的   重心,放在具体功能和业务逻辑的实现上

- 为开发模式与发布模式指定不同的打包入口

  > 默认情况下,vue项目的开发与发布模式,共用同一个打包的入口文件(即src/main.js),为了将项目的开发过程与发布过程分离,可以为两种模式,各自指定打包的入口文件,即:
  >
  > 1. 开发模式入口文件 src/main-dev.js
  > 2. 发布模式入口文件 src/main-prod.js
  >
  > 方案：configureWebpack(通过链式编程形式)和chainWebpack(通过操作对象形式)
  >
  > 在vue.config.js导出的配置文件中,新增configureWebpack或chainWebpack节点,来自定义webpack的打包配置

  ```js
  // 代码示例
  module.exports = {
      chainWebpack: config => {
          // 发布模式
          config.when(process.env.NODE_ENV === 'production', config => {
              config.entry('app').clear().add('./src/main-prod.js')
          })
          // 开发模式
          config.when(process.env.NODE_ENV === 'development', config => {
              config.entry('app').clear().add('./src/main-dev.js')
          })
      }
  }
  ```

- 第三方库启用CDN

  - 通过externals加载外部cdn资源

  > 默认情况下,通过import语法导入的第三方依赖包,最终会打包合并到同一个文件中,从而导致打包成功后,单文件体积过大的问题 => **chunk-vendors**体积过大
  >
  > 为了解决上述问题,可以通过webpack的externals节点,来配置加载外部的cdn资源,凡是声明在externals中的第三方依赖包,都不会被打包

  1. 步骤1

  ```js
  module.exports = {
      chainWebpack: config => {
          config.when(process.env.NODE_ENV === 'production', config => {
              config.entry('app').clear().add('./src/main-prod.js')
              // 在vue.config.js如下配置
              config.set('externals', {
                  vue: 'Vue',
                  'vue-router': 'VueRouter',
                  axios: 'axios',
                  lodash: '_',
                  echarts: 'echarts',
                  nporgress: 'NProgress',
                  'vue-quill-editor': 'VueQuillEditor'
              })
          })
          config.when(process.env.NODE_ENV === 'development', config => {
              config.entry('app').clear().add('./src/main-dev.js')
          })
      }
  }
  ```

  2. 步骤2

  > 在public/index.html文件头部,将main-prod中的已经进行配置的import(<code>样式表</code>)删除替换为cdn引入

```css
<link href="https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.bubble.min.css" rel="stylesheet">

​<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.core.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.snow.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css" rel="stylesheet">
```

    3. 步骤3

  > 在public/index.html文件头部,将main-prod中的已经进行配置的import(<code>js文件</code>)删除替换为cdn引入

```css
 <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
 
 <script src="https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js"></script>

<script src="https://cdn.bootcss.com/axios/0.19.0/axios.min.js"></script>

<script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js"></script>

<script src="https://cdn.bootcss.com/echarts/4.4.0-rc.1/echarts.min.js"></script>

<script src="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js"></script>

<script src="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>

<script src="https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.js"></script>

<script src="https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js"></script>
```

    4. cdn加速前后对比( **chunk-vendors**打包文件)

  > Parsed大小 2.6m=> **596.9kB**

  - 使用cdn优化elementui打包

    > 具体操作流程
    >
    > 1. 在main-prod.js中,注释掉element-ui按需加载的代码
    >
    > 2. 在index.html头部区域中,通过cdn加载element-ui的js和css样式
    >
    >        `<link href="https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css" rel="stylesheet">`
    >        
    >            `<script src="https://cdn.bootcss.com/element-ui/2.12.0/index.js"></script>`

- Element-UI组件按需加载

- 路由懒加载

  > 在打包构建项目时,javascript包会变得特别大,影响页面加载,如果我们能把不同路由对应的组件分隔成不同的代码块,然后当路由被访问的时候才加载对应组件,这样更加高效

  - 安装@babel/plugin-syntax-dynamic-import包
  - 在babel.config.js配置文件声明该插件
  - 将路由改为按需加载形式

  ```js
  // 示例:
  const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
  const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
  const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
  
  // import Login from '../components/Login.vue'
  const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
  // import Home from '../components/Home.vue'
  const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
  // import Welcome from '../components/Welcome.vue'
  const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
  ..
  ```


### 项目上线

