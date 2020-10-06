<template>
    <div>
          <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片区域 -->
    <el-card>
        <!-- 添加分类 -->
        <el-row>
            <el-col class="textAlign">
                <el-button type="primary"
                @click="showAddCate" 
                >添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <zk-table
        class="zktable"
        :data="cateList"
        :columns="columns"
        border
        :expand-type="false"
        :selection-type="false"
        show-index
        >
        <!-- 是否有效 -->
        <template slot-scope="scope" slot="isOk">
            <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
            <el-button type="danger" 
            size="mini" 
            icon="el-icon-delete"
            @click="deleteCate(scope.row)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-edit" size="mini"
            @click="showEdit(scope.row.cat_id)"
            >编辑</el-button>
        </template>
        </zk-table>

        <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="textAlign"
      >
    </el-pagination>
    </el-card>
<!-- 添加分类 -->
<el-dialog
  title="添加分类"
  class="textAlign"
  :visible.sync="addCatedialogVisible"
  width="40%"
  @close="addCateDialogClosed"
 >
 <!-- 表单数据 -->
  <el-form 
  ref="addCateFormRef" 
  :model="addCateForm" 
  label-width="80px"
 :rules="addCateFormRules"
  >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
    <!-- options：数据源 -->
   <!-- props：指定配置对象 -->
   <el-cascader 
   :options="parentCateList"
    v-model="selectedKeys"
    :props="cascaderProps"
    @click="parentCateChanged"
   clearable
   filterable
   >
   </el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑 -->
<el-dialog
  title="编辑"
  class="textAlign"
  :visible.sync="editCatedialogVisible"
  width="40%"
 >
 <!-- 表单数据 -->
  <el-form 
  ref="editCateFormRef" 
  :model="editCateForm" 
  label-width="80px"
 :rules="editCateFormRules"
  >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
// 验证添加表单
        addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateFormRules:{
       cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]   
      },
            // 表格数据
            cateList:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 表格数据总数
            total:0,
            // 表格
            columns:[
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                     label: '是否有效',
                    // 当前列 自定义模板
                    type: 'template',
                    template: 'isOk'
                },
                {
                label: '排序',
                // 当前列 自定义模板
                type: 'template',
                template: 'order'
                },
                 {
                    label: '操作',
                    // 当前列 自定义模板
                    type: 'template',
                    template: 'opt'
                    }
            ],
            // 天加分类
            addCatedialogVisible:false,
            addCateForm:{
                // 将要添加分类名称
            cat_name: '',
            // 分类父级id
            cat_pid: 0,
            // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
            cat_level: 0
            },
            // 父级分类列表
        parentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps: {
            // 配置触发选项 hover/click
            checkStrictly: true,
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
        },
      // 选中的父级Id数组
      selectedKeys: [],

    //   编辑
         editCateForm:{},
     // 编辑对话框 控制
      editCatedialogVisible: false,
        }
    },
    created(){
        this.getCateList()
    },
    methods: {
        // 获取全部分类列表
       async getCateList(){
           const { data: res } = await this.$http.get('categories',{
        params: this.queryInfo
      })
     if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
        this.cateList = res.data.result
        this.total = res.data.total
 },
// 分页数据改变
handleSizeChange(val){
    this.queryInfo.pagesize=val
    this.getCateList()
},
 // 监听 pagenum改变
handleCurrentChange (val) {
    this.queryInfo.pagenum = val
    this.getCateList()
},
// 显示添加分类对话框
showAddCate(){
    this.getParentCate()
this.addCatedialogVisible =true
},
// 获取联动框的值
 async getParentCate(){
  const {data : res} =await this.$http.get('categories',{params:{
        type:2
    }})
     if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      this.parentCateList = res.data
},
// 添加分类，选项发生变化
parentCateChanged(){
    // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return 0
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级
        this.addCateForm.cat_level = 0
      }
},
// 添加分类确定按钮
addCate(){
    this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.addCateDialogVisible = false
        this.$message.success('添加分类成功！')
        this.getCateList()
       
      })
},
// 删除一个分类
 async deleteCate(cate){
 const result=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果单击确定
        if(result!=='confirm'){
            return this.$message.info('已取消删除！')
        }
        console.log(cate.cat_id);
     const { data: res } = await this.$http.delete('categories/' + cate.cat_id)
      if (res.meta.status !== 200) { return this.$message.error('删除失败！') }
      this.$message.success('删除成功！')
      this.getCateList()    
},
// 显示编辑框
 async showEdit(id){
    const {data : res} = await this.$http.get('categories/'+id)

    if(res.meta.status!==200){
        return this.$message.error('失败')
    }
    this.editCateForm = res.data
    this.editCatedialogVisible= true
},
// 编辑
editCate(){
    this.$refs.editCateFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,{
            cat_name:this.editCateForm.cat_name
        })
         if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
         
        this.$message.success('更新分类名成功！')
        this.editCatedialogVisible = false
        this.getCateList()
        
    })
},
// 添加分类 重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

}
}
</script>

<style lang="less" scoped>

.textAlign{
  text-align: left;
}
.zktable{
    margin-top: 15px;
    margin-bottom: 10px;
}
</style>