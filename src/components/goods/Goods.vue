<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="25">
        <el-col :span="12">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getGood">
            <el-button slot="append" icon="el-icon-search" @click="getGood"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsData" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="580"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="delGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,5,10]"
        :page-size='queryInfo.pagesize'
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import { getGood, delG } from '../../api/api'

  export default {
    data () {
      return {
        goodsData: [],
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 10
        },
        total: 0
      }
    },
    methods: {
      async getGood () {
        const { data: res } = await getGood({
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.$message.success('获取商品成功')
        this.goodsData = res.data.goods
        this.total = res.data.total
        console.log(res, 55)
      },
      handleSizeChange (newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getGood()
      },
      handleCurrentChange (newNum) {
        console.log(newNum)
        this.queryInfo.pagenum = newNum
        this.getGood()
      },
      async delGoods (id) {
        const confirm = await this.$confirm('将会永久删除该商品数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirm !== 'confirm') return this.$message.info('取消删除')
        const { data: res } = await delG(id)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('请求删除出错')
        this.$message.success('删除成功')
        this.getGood()
      },
      goAdd () {
        this.$router.push('/goods/add')
      }

    },
    created () {
      this.getGood()
    }
  }
</script>
<style lang="less" scoped>
  .el-table {
    padding: 0;
  }

  .el-table {
    font-size: 12px;
  }
</style>
