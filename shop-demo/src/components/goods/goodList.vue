<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
    <el-card class="box-card">
            <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getGoodsLists">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsLists"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"  @click="toAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe
      style="text-align:center">
          <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名字"></el-table-column>
        <el-table-column width="86px" prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column width="86px" prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column width="152px" prop="add_time" label="创建时间">
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
             <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
      </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totle">
            </el-pagination>
        </div>
    </el-card>
    
    </div>
</template>

<script>
export default {
    data(){
      return {
        //   商品列表
      goodsList: [],
        // 请求数据
         queryInfo: {
            query: '',
            // 当前页数
            pagenum: 1,
            // 每页显示多少数据
            pagesize: 10
         },
         totle:0,
      }  
    },
    created(){
        this.getGoodsLists()
    },
    methods: {
// getGoodsLists
   async getGoodsLists(){
        const {data : res } = await this.$http.get('goods',{params: this.queryInfo})
        if(res.meta.status !==200){
            this.$message.error('失败')
        }
        
        this.goodsList = res.data.goods
        this.totle = res.data.total

        console.log(this.goodsList);
    },
    // 分页状态的页数改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsLists()
        },
        // 当前页数的改变
        handleCurrentChange(newSize){
            this.queryInfo.pagenum = newSize
            this.getGoodsLists()
        },
        // 删除商品
        async deleteGoods(id){
            const resconfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
        // r如果取消删除
          if(resconfirm!=='confirm'){
            return  this.$message.info('已取消了删除')
          }
          const {data : res} = await this.$http.delete(`goods/${id}`)
          if(res.meta.status!==200){
             return this.$message.error('删除失败')
          }
          this.$message.success('成功')

          this.getGoodsLists()
        },
        toAddGoods(){
          this.$router.push('/goods/add')
        }
    }
}
</script>
<style lang="less" scoped>

</style>