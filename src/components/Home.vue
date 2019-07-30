<template xmlns="b">
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/156161519244546.jpg" alt="">
        <span> 电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle" @click="toggleCollapse">|||</div>
        <el-menu :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="skyblue"
                 unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id"
                          @click="save(item2.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { menu } from '../api/api'

  export default {
    data () {
      return {
        menuList: [],
        isCollapse: false,
        activePath: '',
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
      }

    },
    created () {
      this.getMenulist()
      this.activePath = window.sessionStorage.getItem('activePath')
      console.log(this.activePath)
    },
    methods: {
      logout () {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      },
      async getMenulist () {
        const { data: res } = await menu()
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.menuList = res.data
        console.log(this.menuList)
      },
      toggleCollapse () {
        this.isCollapse = !this.isCollapse
      },
      save (activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding-left: 0;
    background-color: #373D41;
    font-size: 20px;

  img {
    vertical-align: middle;
    width: 55px;
    border-radius: 5px;
    margin-right: 5px;
  }

  }

  .el-aside {
    background-color: #333744;

  .el-menu {
    border-right: none;
  }

  }

  .el-main {
    background-color: #EAEDF1;
  }

  .iconfont {
    margin-right: 20px;
  }

  .toggle {
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
</style>
