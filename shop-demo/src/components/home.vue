<template>
   <el-container class="home-container">
       <!-- 头部 -->
    <el-header>
        <div class="">
            <img src="#"/>
            <span>电商管理系统</span>
        </div>
        <el-button type="info" @click="longout" >退出</el-button>
    </el-header>
    <!-- 中间内容区 -->
    <el-container>
        <el-aside width="200px">
            <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            unique-opened
            active-text-color="#409FFF"
            router 
            >
            <el-submenu :index="item.id+'' " v-for="item in menuList" :key="item.id">
                <template slot="title">
                    <!-- 图标 -->
                <i class="el-icon el-icon-location"></i>
                <!-- 一级菜单 -->
                <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
               <el-menu-item :index="'/'+subItem.path"
               v-for="subItem in item.children" :key="subItem.id"
               @click="saveNavState('/' + subItem.path)">
               <i class="el-icon  el-icon-menu"></i>
               {{item.authName}}
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
export default {
    data(){
        return{
            menuList:[],
            activePath: ''
        }
    },
    created (){
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        longout(){
            window.sessionStorage.clear
            this.$router.push('/login')
        },
    async getMenuList(){
         
         const { data: res } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
       console.log(res);
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }

    }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color:#fff;
    font-size: 20px;
    
    > div {
        display: flex;
        align-items:center;
    }
  }
  
  .el-aside {
    background-color:#333744;
    .el-menu{
        border-right:none;
    }
  }
  
  .el-main {
    background-color: #caedf1;
  }
  .home-container{
      height:100%;
  }
.el-icon {
    margin-right:20px;
}
.el-submenu__title{
  margin-right: 10px;
}
</style>