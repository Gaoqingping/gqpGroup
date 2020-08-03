<template>
  <div class="error">
    <div class="my-btn">
      <!-- <el-button @click="handerRef">刷新页面</el-button> -->
      <el-button @click="handerRef" >点击返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handerRef() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="less" scoped>
.error {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url("../../../public/img/404.gif") no-repeat center;
  background-size: cover;
  position: relative;
  .my-btn {
    position: absolute;
    top: 54%;
    left: 40%;
    transform: translate(-50%, -50%);
    // width: 300px;
    background: #d1e2f7;
    display: flex;
    justify-content: space-between;
    /deep/ .el-button {
      background: rgba(255, 85, 0, 0.3);
	  color: orangered;
    }
  }
}
</style>