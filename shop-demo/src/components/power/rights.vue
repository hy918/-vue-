<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片 -->
        <el-card class="box-card">
            <el-table :data="powerList" style="width: 100%" stripe border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="authName" label="权限名称" ></el-table-column>
            <el-table-column prop="path" label="路径" ></el-table-column>
            <el-table-column prop="level" label="权限等级" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
                    <el-tag type="info" v-else>三级</el-tag>
                </template>
            </el-table-column>
            
        </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            powerList:[]
        }
    },
    created(){
        this.getAllpowerList()
    },
    methods:{
      async  getAllpowerList(){
            const {data:res}=await this.$http.get('rights/list')
            if(res.meta.status!=200){
                return this.$message("失败")
            }
            this.powerList = res.data
        }
    }
}
</script>

<style scoped>

</style>