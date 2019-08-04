<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDia">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateData"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <!--          {{scope.row}}-->
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options 下拉列表用来指定数据源 -->
            <!-- props 用来指定配置对象 v-model绑定为选中的分类cate_id -->
            <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys"
                         @change="parentCateChanged" clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addCateDialogVisible=false">取消</el-button>
          <el-button type="success" @click="addCate">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import { getC, getCa } from '../../api/api'

  export default {
    data () {
      return {
        querInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        cateData: [],
        // 为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'isok'
          },
          {
            label: '排序',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'order'
          },
          {
            label: '操作',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'opt'
          }
        ],
        addCateDialogVisible: false,
        // 指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedKeys: [],
        parentCateList: [],
        addCateForm: {
          cat_name: '',
          // 父级分类的Id
          cat_pid: 0,
          // 分类的等级，默认要添加的是1级分类
          cat_level: 0
        },
        addCateFormRules: {
          cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
        },
      }
    },
    methods: {
      async getCate () {
        const { data: res } = await getC(this.querInfo)
        if (res.meta.status !== 200) return this.$message.error('获取分类失败')
        this.cateData = res.data.result
        this.total = res.data.total
      },
      // 监听 pagesize 改变
      handleSizeChange (newSize) {
        this.querInfo.pagesize = newSize
        this.getCate()
      },
      // 监听 pagenum 改变
      handleCurrentChange (newPage) {
        this.querInfo.pagenum = newPage
        this.getCate()
      },
      showCateDia () {
        this.addCateDialogVisible = true
        this.getParentlist()
      },
      addCateDialogClosed () {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      async getParentlist () {
        const { data: res } = await getC()
        if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
        this.parentCateList = res.data
        console.log(this.parentCateList)
      },
      parentCateChanged () {
        console.log(this.selectedKeys) // 被选中的分类id 可以是一级二级或者三级
        if (this.selectedKeys.length > 0) {// 如果被选中的id长度大于0，则说明将添加的分类不是一级分类
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addCateForm.cat_level = this.selectedKeys.length
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      addCate () {
        this.$refs.addCateFormRef.validate(async valid => {// 预验证
          if (!valid) return this.$message.error('表单填写有误！')
          const { data: res } = await getCa(this.addCateForm)
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功！')
          this.getCate()
          this.addCateDialogVisible = false

        })
      }
    },
    created () {
      this.getCate()
    }
  }
</script>
<style lang="less" scoped>
  .el-button {
    margin-bottom: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
