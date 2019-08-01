<template xmlns="ro">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="elt">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <!--作用域插槽 {{props.row}}-->
            <el-row v-for="(item,i1) in props.row.children" :key="item.id"
                    :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag>{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item1,i2) in item.children" :key="item1.id"
                        :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success">{{item1.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <!--横排显示，遍历标签 ，竖排遍历row -->
                    <el-tag v-for="item2 in item1.children" :key="item2.id" type="warning">{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label=角色名称 prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { getR } from '../../api/api'

  export default {
    data () {
      return {
        tableData: []
      }
    },
    methods: {
      async getRoles () {
        const { data: res } = await getR()
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.tableData = res.data
        console.log(this.tableData)
      }
    },
    created () {
      this.getRoles()
    }
  }
</script>
<style lang="less">
  .elt {
    background-color: #fff;
    margin-top: 15px;
    padding: 18px;

  .el-table {
    margin-top: 15px;

  td, th {
    text-align: center;
  }

  }

  }
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
