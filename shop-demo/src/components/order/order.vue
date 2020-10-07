<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="6">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getordersLists">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                </el-col>
            </el-row>
            <!-- 数据表格 -->
            <el-table :data='ordersLists' border stripe>
                <el-table-column type="index" label='#'></el-table-column>
                <el-table-column label='订单号' prop='order_number'></el-table-column>
                <el-table-column label='订单价格' prop='order_price'></el-table-column>
                <el-table-column label='是否付款'>
                    <template slot-scope="scope">
                    <el-tag type="danger" size="mini" v-if="scope.row.pay_status">未付款</el-tag>
                    <el-tag type="success" size="mini" v-else>已付款</el-tag>
                </template>
                </el-table-column>

                <el-table-column label='是否发货' prop='is_send'></el-table-column>
                <el-table-column label='下单时间' prop='create_time'>
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog"></el-button>
                        <el-button
                        type="success"
                        size="mini"
                        icon="el-icon-location"
                        @click="showProgressDialog"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
             <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
        </el-card>
        <!-- 编辑地址 -->
        <el-dialog
        title="编辑地址"
        :visible.sync="addressDialogVisible"
        width="50%"
        @close="addressDialogClosed"
        >
 <!-- 地址表单 -->
          <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addressDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 显示物流状态 -->
        <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
    <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
import progressJson from './wuliu.json'
export default {
    data(){
        return {
            // 订单列表
            ordersLists:[],
            queryInfo: {
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 总页数
            total:0,
            // 订单数据
            addressDialogVisible:false,
            //物流
            progressDialogVisible:false,
            // 地址表单数据
            addressForm:{
                address1:'',
                address2:''
            },
           addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
            // 级联选择框数据
            cityData,
            // 时间线
            progressInfo:[],
           

        }
    },
    created(){
        this.getordersLists()
    },
    methods: {
       async getordersLists(){
           const {data : res } = await this.$http.get('orders',{params:this.queryInfo})
           if(res.meta.status!==200){
               return this.$message.error('获取列表失败')
           }
           this.ordersLists = res.data.goods
           this.total = res.data.total
           console.log(this.ordersLists);
        },
        // 分页
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getordersLists()
        },
        handleCurrentChange(pagenum){
            this.queryInfo.pagenum = pagenum
            this.getordersLists()
        },

    // 显示编辑框
    showEditDialog(){
        this.addressDialogVisible = true
    },
     addressDialogClosed () {

      this.$refs.addressFormRef.resetFields()
    },
    // 显示物流筐
    async showProgressDialog () {
      // 自己写的json数据，模拟物流进度
      this.progressInfo = progressJson.data
      console.log(progressJson.data);
      this.progressDialogVisible = true
    }
    }
}
</script>
<style lang="less" scoped>
.el-dialog {
    text-align: left;
}
.el-pagination{
    margin-top: 10px;
}
</style>