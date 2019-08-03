<template xmlns="r">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRi } from '../../api/api'

export default {
  data() {
    return {
      rightlist: []
    }
  },
  methods: {
    async getRights() {
      const { data: res } = await getRi()
      if (res.meta.status !== 200) return this.$message.error('请求出错')
      this.$message.success('成功获取权限列表')
      this.rightlist = res.data
      console.log(this.rightlist)
    }
  },
  created() {
    this.getRights()
  }
}
</script>
<style lang="less">
.el-table {
  padding: 10px;
  margin-top: 15px;
}
</style>
