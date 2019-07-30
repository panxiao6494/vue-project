<template xmlns="b">
  <div>
    <el-row>
      <el-button type="info" @click="logout">退出</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    methods: {
      logout () {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
