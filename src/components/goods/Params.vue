<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <span>请选择商品分类：</span>
      <el-cascader
        v-model="valueKeys"
        :options="catelist"
        expand-trigger="hover"
        :props="cateProps"
        @change="handleChange"></el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <el-table :data="manytableData" border style="width: 100%" stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="delTag(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParam(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--   静态属性     -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlytableData" border style="width: 100%" stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="delTag(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParam(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--   添加属性的对话框   -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
        </span>
      </el-dialog>
      <!--  编辑属性的对话框    -->
      <el-dialog
        :title="'编辑'+titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getC, getPar, getEt, getPar2, delp, editPa } from '../../api/api'

  export default {
    data () {
      return {
        addForm: {},
        addFormRules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' }
          ]
        },
        editDialogVisible: false,
        editForm: { attr_name: '' },
        editFormRules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' }
          ]
        },
        addDialogVisible: false,
        manytableData: [],
        onlytableData: [],
        activeName: 'many',
        catelist: [],
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        valueKeys: []
      }
    },
    methods: {
      async getCatelist () {
        const { data: res } = await getC()
        if (res.meta.status !== 200) return this.$message.error('获取分类失败')
        this.$message.success('获取分类成功')
        this.catelist = res.data
        console.log(this.catelist)
      },
      handleChange () {
        this.getParamData()
      },
      async getParamData () {
        if (this.valueKeys.length !== 3) {
          this.valueKeys = []
          this.manytableData = []
          return
        }
        console.log(this.valueKeys)
        const { data: res } = await getPar(this.cateId, {
          sel: this.activeName
        })
        console.log(res, 1)
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.$message.success('获取数据成功')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manytableData = res.data
        } else {
          this.onlytableData = res.data
        }
        console.log(res.data, 1)
      },
      handleClick () {
        this.getParamData()
      },
      showInput (row) {
        row.inputVisible = true
      },
      handleInputConfirm (row) {// input失去焦点或者回车都会保存数据
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue.trim()) // 没有return则会把变淡中数据添加到动态数据中
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttr(row)
      },
      addParam () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await getPar2(this.cateId, this.addForm.attr_name, this.activeName)
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getParamData()
        })
      },
      async delParam (id) {
        const confirm = await this.$confirm(
          '此操作将永久删除参数，是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
        if (confirm !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await delp(this.cateId, id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParamData()
      },
      async saveAttr (row) {
        const { data: res } = await getEt(this.cateId, row)
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
      },
      showEdit (row) {
        this.editDialogVisible = true
        this.editForm.attr_name = row.attr_name
        this.editForm.attr_id = row.attr_id
      },
      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },
      async editParam () {
        console.log(this.editForm)
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await editPa(this.cateId, this.editForm, this.activeName)
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('更新失败')
          this.$message.success('更新成功')
          this.editDialogVisible = false
          this.getParamData()
        })
      },
      delTag (i, row) {
        row.attr_vals.splice(i, 1)
        this.saveAttr(row)
      }
    },
    created () {
      this.getCatelist()
    },
    computed: {
      cateId () {
        if (this.valueKeys.length === 3) {
          return this.valueKeys[2]
        } else {
          return null
        }
      },
      isDisabled () {
        if (this.valueKeys.length !== 3) {
          return true
        } else {
          return false
        }
      },
      titleText () {
        if (this.activeName === 'many') {
          return '动态参数'
        } else {
          return '静态属性'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-cascader {
    margin: 20px 0 15px;
  }

  .input-new-tag {
    width: 100px;
  }

  .el-tag {
    margin: 10px;
  }
</style>
