<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20"> <!--栅格之间的间隔为20px-->
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryOrders">
            <el-button slot="append" icon="el-icon-search" @click="queryOrders"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stipe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="230px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.pay_status===1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"
                       @click="queryLocation"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改地址" :visible.sync="updataDialogVisible" width="50%">
        <span slot="footer" class="dialog-footer">
          <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市/区/县" prop="address1">
              <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" v-model="addressForm.address2" prop="address2">
              <el-input></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="updataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updataDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="物流信息"
        :visible.sync="locaDialogVisible"
        width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,20,25]"
        :page-size='queryInfo.pagesize'
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import { getOr, queryL } from '../../api/api'
  import cityData from './citydata'

  export default {
    data () {
      return {
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            { required: true, message: '请选择省市区县', trigger: 'blur' }
          ],
          address2: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        cityData,
        updataDialogVisible: false,
        activities: [],
        locaDialogVisible: false,
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 10
        },
        orderList: [],
        total: 1
      }
    },
    methods: {
      async queryOrders () {
        const { data: res } = await getOr(this.queryInfo)
        if (res.meta.status !== 200) return this.$message.error('获取订单失败')
        this.$message.success('获取订单成功')
        this.orderList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.queryOrders()
      },
      handleCurrentChange (newNum) {
        this.queryInfo.pagenum = newNum
        this.queryOrders()
      },
      async queryLocation () {
        const { data: res } = await queryL(1106975712662)
        if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
        this.$message.success('获取物流成功')
        this.activities = res.data
        console.log(this.activities)
        this.locaDialogVisible = true
      },
      showBox () {
        this.updataDialogVisible = true
      }
    },
    created () {
      this.queryOrders()
    }
  }
</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 20px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
