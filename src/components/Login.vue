<template>
	<div class="login_container">



		<div class="login_box">
			<!-- 头像区 -->
			<div class="avatar_box">
				<img src="../assets/logo.png" alt="avatar" />
			</div>
			<!-- 登录表单 -->
			<!-- 登录表单 -->
			<div>


				<!-- <div class="login_form">
					
					hahahaha
				</div> -->


				<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="60px" class="login_form"
				 status-icon>


					<el-form-item label="账号" prop="username">
						<el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
					</el-form-item>

					<el-form-item label="密码" prop="password">
						<el-input v-model="loginForm.password" prefix-icon="iconfont icon-password" autocomplete="off" @click.native="changeType"
						 :type="isOpen ? 'text' : 'password'" :suffix-icon="
					    isOpen ? 'iconfont icon-icon-test' : 'iconfont icon-biyan'
					  "></el-input>
					</el-form-item>

					<div class="btns">
						<el-button class="btn" type="primary" @click="login">登录</el-button>
						<el-button class="btn" type="warning" @click="resetLoginForm">重置</el-button>
					</div>





				</el-form>
			</div>
		</div>



	</div>
</template>

<script>
	export default {
		data() {
			return {
				isOpen: false,
				//登录用户名和密码设定
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				// 表单合法验证
				loginFormRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '长度在 2 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入用户密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 18,
							message: '长度在 6 到 18 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			//显示密码
			changeType(e) {
				// console.log(e);
				if (e.target.className.includes("iconfont")) {
					this.isOpen = !this.isOpen;
				}
			},

			// 表单重置按钮
			resetLoginForm() {
				this.$refs.loginFormRef.resetFields()
			},
			login() {
				this.$refs.loginFormRef.validate(async (valid) => {
					if (!valid) return false;
					const {
						data: res
					} = await this.$http.post('login', this.loginForm)
					console.log(res);

					if (res.meta.status !== 200) return this.$message.error('登录失败')
					this.$message.success('登录成功');
					window.sessionStorage.setItem('token', res.data.token)
					this.$router.push('/home')
				})



			}
		}
	}
</script>

<style lang="less" scoped>
	/* // lang="less" 支持less格式
// scoped vue的指令，只在当前组件生效 */
	.login_container {
		background-color: #1495e7;
		height: 100%;
	}

	.login_box {
		width: 450px;
		height: 360px;
		background-color: #fff;
		border-radius: 10px;
		position: absolute;
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%, -50%);
		background-color: #fff;

		.avatar_box {
			width: 130px;
			height: 130px;
			border-radius: 8px;
			padding: 10px;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -60%);
			background-color: #1495e7;

			&::after {
				content: '';
				width: 130px;
				height: 130px;
				// border-radius: 50%;
				padding: 10px;
				position: absolute;
				border-radius: 8px;
				top: 0px;
				left: 0px;
				transform: rotateZ(45deg);
				background-color: #1495e7;
				z-index: -1;
			}

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

	}

	.login_form {
		position: absolute;
		bottom: 60px;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
		// height: 100%;
	}

	.btns {
		width: 100%;
		display: flex;
		justify-content: center;

		.btn {
			margin: 0px 10px;

			&:hover {
				box-shadow: 0px 0px 5px 5px gold;
				color: gold;
			}
		}
	}

	.info {
		font-size: 13px;
		margin: 10px 15px;
	}
</style>
