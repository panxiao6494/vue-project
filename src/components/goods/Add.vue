<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--  为表单添加数据，label-position设置向上对齐    -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="indexChange">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat"
                           @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,i) in manyData" :key="i" calss="lab">
              <el-checkbox-group size="small" v-model="item.attr_vals" class="che">
                <el-checkbox :label="cb" border v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyData" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor" class="add">
            </quill-editor>
            <el-button type="primary" @click="addGoods">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" alt="" class="pre-img">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getC, getPar, addGo } from '../../api/api'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'
  import _ from 'lodash'

  export default {
    data () {
      return {
        activeIndex: '0',
        upload: 'http://127.0.0.1:8888/api/private/v1/upload',
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          // 商品所属的分类数组
          goods_cat: [],
          // 图片的数组
          pics: [],
          // 商品的详情描述
          goods_introduce: '',
          attrs: []
        },
        addFormRules: {
          goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
          goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
          goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
          goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        },
        catelist: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        manyData: [],
        onlyData: [],
        fileList: [],
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        previewVisible: false
      }
    },
    components: {
      quillEditor
    },
    methods: {
      async getCate () {
        const { data: res } = await getC()
        if (res.meta.status !== 200) return this.$message.error('获取分类失败')
        this.$message.success('获取分类成功')
        this.catelist = res.data
      },
      handleChange () {
        console.log(this.addForm.goods_cat)
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave (activeName, old) {// tab栏切换之前验证
        if (old === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      async indexChange () {
        console.log(this.activeIndex)
        if (this.activeIndex === '1') {
          const { data: res } = await getPar(this.cateId, {
            sel: 'many'
          })
          if (res.meta.status !== 200) return this.$message.error('获取失败')
          this.$message.success('获取成功')
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyData = res.data
          console.log(this.manyData, 111)
        } else if (this.activeIndex === '2') {
          const { data: res } = await getPar(this.cateId, {
            sel: 'only'
          })
          if (res.meta.status !== 200) return this.$message.error('获取失败')
          this.$message.success('获取成功')
          this.onlyData = res.data
          console.log(this.onlyData)
        }

      },
      handlePreview (file) {
        console.log(file)
        this.previewVisible = true
        this.previewPath = file.response.data.url
      },
      handleRemove (file) {
        console.log(file)
        const filePath = file.response.data.tmp_path
        const i = this.addForm.pics.findIndex(p => p.pic === filePath)
        this.addForm.pics.splice(i, 1)
        console.log(this.addForm)
      },
      handleSuccess (res) {
        console.log(res)
        const picInfo = { pic: res.data.tmp_path }
        this.addForm.pics.push(picInfo)
      },
      addGoods () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return this.$message.error('请填写完整信息你！')
          const form = _.cloneDeep(this.addForm) // 为了不影响addForm的数据，需要对addForm进行深拷贝，通过操作form
          form.goods_cat = form.goods_cat.join(',') // 将数组转换成字符串
          this.manyData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          console.log(form)
          const { data: res } = await addGo(form)
          if (res.meta.status !== 201) return this.$message.error('获取失败')
          this.$message.success('获取成功！')
          this.$router.push('/goods')
        })
      }
    },
    computed: {
      cateId () {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
      }
    },
    created () {
      this.getCate()
    }
  }
</script>
<style lang="less">
  .pre-img {
    width: 100%;
  }

  .add {
    margin-bottom: 20px;
  }
</style>
