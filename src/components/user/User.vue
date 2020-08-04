<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区域 -->
    <el-card>
      <!--搜索与添加区域 :gutter="20"列与列间距-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!--索引-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-swich v-model="scope.row.mg_state" @change="userStateChanged()"></el-swich>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
         <template slot-scope="scope">
            <!-- 修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮-->
            <el-button type="danger" icon="el-icon-delect" size="mini"></el-button>
            <!-- 分配角色按钮-->
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalt"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 :visible.sync="dialogVisible"属性绑定-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体 -->
      <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="100px" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
		  </el-form>
            <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
   
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
  </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则,value待检验的值，cbf回调函数
    var checkEmail = (rule,value,cb) =>{
      //验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ 
      if (regEmail.test(value)){
        //合法的邮箱
        return cb()
      }
        cb(new Error('请输入合法的邮箱'))
    }

    //验证手机号的规则
    var checkMobile = (rule,value,cb) => {}
      //验证手机号的正则
     const regMobie = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/
     if (regMobie.test(value)){
       return cb()
     }

      cb(new Error('请输入合法的手机号'))


    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页多少条数据
        pagesize: 2,
      },
      userlist: [],
      totalt: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单的验证规则对象
      addFormRules:{
        username:[
          { required : true, message: '请输入用户名', trigger: 'blur'},
          {
            min:3,
            max:10,
            message: '用户名的长度在3~10个字符之间',
            trigger:'blur'
          }
        ],
        password:[
          { required : true, message: '请输入密码', trigger: 'blur'},
          {
            min:3,
            max:10,
            message: '密码的长度在6~15个字符之间',
            trigger:'blur'
          }
        ],
        email:[
          { required : true, message: '请输入邮箱', trigger: 'blur'},{validator:checkEmail,trigger: 'blur'}
        ],
        mobile:[
          { required : true, message: '请输入手机号', trigger: 'blur'},{validator:checkMobile,trigger: 'blur'}
        ],
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      //查询到的用户信息对象
      editForm:{},
      //修改表单的验证规则对象
      editFormRules:{
        email:[
          { required: true, message: '请输入用户邮箱', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur'}
          ],
         email:[
          { required: true, message: '请输入用户手机', trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur'}
          ],
      }

    }
  },
  //生命周期
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.totle = res.data.totle
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize=newSize
      this.getUserList()
    },
    //监听页码值的改变事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听switch开关的改变
   async userStateChanged(userinfo) {
      console.log(userinfo)
      const {data: res } = await this.$http.put(`users/${userinfo.id}/state/$
      {userinfo.mg_state}`)
      if(res.meta.status !== 200){
        userinfo.mg_state = !userinfo.mg_state
        return this.$message,error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRes.resetFields()
    },
    //点击按钮，添加新用户
    addUser(){
      this.$refs.addFormRes.validate(async valid =>{
        if (!valid) return
        //可以发起添加用户的网络请求
        const {data:res} = await this.$http.post
        ('users',this.addForm)
        
        if(res.meta.status !==201){
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功!')
        //隐藏添加用户的对话框
        this.addDialogVisible = false
        //重新获取用户列表数据
        this.getUserList()
      })
    },
    //展示编辑用户的对话框
   async showEditDialog(id){
     const {data:res} = await this.$http.get('users/' + id)
     if (res.meta.status !== 200){
       return this.$$message.error('查询用户信息失败!')
     }
      this.editForm = res.data
      this.editDialogVisible = true
    }
  }
}
</script>

<style lang="stylus" scoped></style>