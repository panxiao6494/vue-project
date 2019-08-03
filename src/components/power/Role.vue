<template xmlns="ro">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="elt">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="tableData" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              v-for="(item,i1) in props.row.children"
              :key="item.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag closable @close="handleClose(props.row,item.id)">{{item.authName}}</el-tag>
                <!--箭头-->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item1,i2) in item.children"
                  :key="item1.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="handleClose(props.row,item1.id)"
                    >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--横排显示，遍历标签 ，竖排遍历row -->
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      type="warning"
                      closable
                      @close="handleClose(props.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" style="width:500px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="mini"
                @click="showTree(scope.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 树形控件 -->
      <el-dialog :visible.sync="setRdialogVisible" title="权限树状图">
        <el-tree
          :data="treeData"
          default-expand-all
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="dekeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialogfot">
          <el-button @click="setRdialogVisible=false">取消</el-button>
          <el-button type="success" @click="allRights">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getR, delR, getRit, allR } from '../../api/api'

export default {
  data() {
    return {
      tableData: [],
      roleId: '',
      setRdialogVisible: false,
      treeData: [],
      dekeys: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  methods: {
    async getRoles() {
      const { data: res } = await getR()
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.tableData = res.data
      console.log(this.tableData, 11)
    },
    async handleClose(role, rightId) {
      const confirm = await this.$confirm(
        '此操作将永久用户权限，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirm !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await delR(role, rightId)
      if (res.meta.status !== 200) return this.$message.error('请求出错')
      this.$message.success('删除权限成功')
      role.children = res.data
    },
    async showTree(rights) {
      this.roleId = rights.id
      const { data: res } = await getRit()
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取树状列表成功')
      this.treeData = res.data
      console.log(res)
      this.getLefkeys(rights, this.dekeys)
      this.setRdialogVisible = true
    },
    //递归方式找到所有该角色拥有的权限,把所有权限id保存到默认选中的数组id
    getLefkeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLefkeys(item, arr))
    },
    //分配权限
    async allRights() {
      //将已有的权限和修改的权限进行合并
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',') // 将数组转换成字符串，以参数的形式请求数据
      const { data: res } = await allR(this.roleId, {
        rids: idStr
      })
      if (res.meta.status !== 200) return this.$message.error('分配失败')
      this.getRoles()
      this.setRdialogVisible = false
    }
  },
  created() {
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

    td,
    th {
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
