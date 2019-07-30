<template xmlns="user">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="status">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stipe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}}-->
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size='queryInfo.pagesize'
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getUser } from '../../api/api'

  export default {
    data () {
      return {
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 1
        },
        userList: [],
        total: 0,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
      }
    },
    methods: {
      async queryUsers () {
        const { data: res } = await getUser({
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('请求错误！')
        this.userList = res.data.users
        this.total = res.data.total
        console.log(res)
      },
      handleSizeChange (val) {
        this.queryInfo.pagenum = val
        this.queryUsers()
      },
      handleCurrentChange (val) {
        this.queryInfo.pagenum = val
        this.queryUsers()
      }
    },
    created () {
      this.queryUsers()
    },
  }

</script>

<style lang="less" scoped="">
  .el-breadcrumb {
    font-size: 10px !important;
    margin-bottom: 15px;
  }

  .status {
    background-color: #fff;
    padding: 18px;
  }

  .el-table {
    margin-top: 15px;

  .el-button {
    width: 46px;
  }

  }
</style>
