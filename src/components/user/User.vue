<template xmlns="user">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="status">
      <el-row :gutter="20"> <!--栅格之间的间隔为20px-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryUsers">
            <el-button slot="append" icon="el-icon-search" @click="queryUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stipe>
        <el-table-column label="管理员id" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} 作用域插槽-->
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5]"
        :page-size='queryInfo.pagesize'
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
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
        <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
      </el-dialog>
      <!-- 分配角色的对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaInfo">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getUser,
    changeStae,
    addU,
    showU,
    editU,
    deletU,
    setR,
    saveI
  }
    from '../../api/api'

  export default {
    data () {
      // 验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb()
        }

        cb(new Error('请输入合法的邮箱'))
      }
      // 验证手机号的规则
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的手机号'))
      }
      return {
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 2
        },
        userList: [],
        total: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editForm: {
          username: '',
          mobile: '',
          email: ''
        },
        rolesList: [],
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: '用户名的长度在6~15个字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        setRoleDialogVisible: false,
        selectedRoleId: '',
        userInfo: ''
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
      //监听pagesize改变的事件
      handleSizeChange (val) {
        console.log(val)
        this.queryInfo.pagesize = val
        this.queryUsers()
      },
      //监听页码值改变的事件
      handleCurrentChange (val) {
        this.queryInfo.pagenum = val
        this.queryUsers()
      },
      async changeState (info) {
        const { data: res } = await changeStae(info)
        if (res.meta.status !== 200) {
          info.mg_state = !info.mg_state
          this.$message.error('更改状态失败')
          return
        }
        this.$message.success('更改状态成功！')
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },
      addUser () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await addU(this.addForm)
          console.log(res, 11)
          if (res.meta.status !== 201) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.queryUsers()
        })
      },
      async showEdit (id) {
        const { data: res } = await showU(id)
        if (res.meta.status !== 200) return this.$message.error('数据获取失败')
        this.editForm = res.data
        console.log(this.editForm, 22)
        this.editDialogVisible = true
      },
      editUser () {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return console.log(valid) // 预验证，验证通过才会发送请求
          const { data: res } = await editU(this.editForm)
          if (res.meta.status !== 200) return this.$message.error('编辑用户失败')
          this.$message.success('编辑用户成功')
          this.editDialogVisible = false
          this.queryUsers()
        })
      },
      //删除用户
      async deleteUser (id) {
        const confirm = await this.$confirm('此操作将永久删除用户数据，是否继续？', '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (confirm !== 'confirm') return this.$massage.info('取消删除')
        const { data: res } = await deletU(id)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        this.queryUsers()
      },
      //分配角色
      async setRole (info) {
        this.userInfo = info
        const { data: res } = await setR()
        if (res.meta.status !== 200) return this.$message.error('获取角色用户失败')
        this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      setRoleDialogClosed () {
        this.selectedRoleId = ''
        this.userInfo = {}
      },
      async savaInfo () {
        if (!this.selectedRoleId) return this.$message.error('请选择角色！') // 没有选择角色就户提示
        const { data: res } = await saveI(this.userInfo.id, this.selectedRoleId)
        if (res.meta.status !== 200) return this.$message.error('分配失败')
        this.queryUsers()
        this.setRoleDialogVisible = false
      }
    },
    created () {
      this.queryUsers()
    }
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
