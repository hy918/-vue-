<template>
    <div>
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card  class="my-card">
        <!-- 提示框 -->
    <el-alert
        show-icon
        title="注意：只允许三级分类设置参数！"
        type="warning"
       >
    </el-alert>
        <!-- 商品分类和级联选择框 -->
    <el-row class="cat_opt">
    <el-col>
        <span>选择商品分类：</span>
        <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
    </el-col>
    </el-row>
        <!-- 切换的table页 -->
    <el-tabs 
    style="margin-top:15px"
    type="border-card"
    v-model="activeTabsName"
    @tab-click="handleClick"
    class="my-tab"
    >
    <el-tab-pane label="动态参数" name="many">
        <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addAttr"
          >添加参数</el-button>
          <!-- 动态参数列表 -->
          <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand">
                  <template slot-scope="scope">
                      <el-tag v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="removeAttr(scope.row,index)"
                      >{{item}}
                      </el-tag>
                      <!-- 可编辑的tag -->
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
              </el-table-column>
              <el-table-column type="index">

              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作" >
                <template slot-scope="scope">
                <el-button type="danger" 
                size="mini" 
                icon="el-icon-delete"
                @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
                <el-button type="warning" icon="el-icon-edit" size="mini"
                @click="showEdit(scope.row.attr_id)"
                >编辑</el-button>
            </template>
               </el-table-column>
          </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
        <el-button
           :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addAttr"
          >添加属性</el-button>
          <!-- 表格数据 -->
           <el-table :data="onlyTableData" border stripe>
               <el-table-column type="expand">
                  <template slot-scope="scope">
                      <el-tag v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="removeAttr(scope.row,index)"
                      >{{item}}
                      </el-tag>
                      <!-- 可编辑的tag -->
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
              </el-table-column>
              <el-table-column type="index">

              </el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button type="danger" 
                    size="mini" 
                    icon="el-icon-delete"
                    @click="deleteParams(scope.row.attr_id)"
                    >删除</el-button>
                    <el-button type="warning" icon="el-icon-edit" size="mini"
                    @click="showEdit(scope.row.attr_id)"
                    >编辑</el-button>
                </template>
               </el-table-column>
          </el-table>
    </el-tab-pane>
    </el-tabs>
    </el-card>
<!-- 添加属性对话框 -->
<el-dialog
@close="addDialogClosed"
  :title="addtitle"
  class="textAlign"
  :visible.sync="addDialogVisible"
  width="40%"
 >
 <!-- 表单数据 -->
  <el-form 
  ref="addFormRef" 
  :model="addFrom" 
  label-width="80px"
 :rules="addFromRules"
  >
  <el-form-item :label="getTitleText" prop="attr_name">
    <el-input v-model="addFrom.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑按钮的功能实现 -->

<el-dialog
@close="editDialogClosed"
  :title="editTitle"
  class="textAlign"
  :visible.sync="editDialogVisible"
  width="40%"
 >
 <!-- 表单数据 -->
  <el-form 
  ref="editFormRef" 
  :model="editFrom" 
  label-width="80px"
 :rules="editFromRules"
  >
  <el-form-item :label="getTitleText" prop="attr_name">
    <el-input v-model="editFrom.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
    // tab名字
    activeTabsName: 'many',
    // 级联选择框
    selectedCateKeys:[],
    // 选择框数据
    cateList:[],
    cateProps:{
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
    },
    // 动态数据
    manyTableData:[],
    // 静态数据
    onlyTableData:[],
    // 
    addtitle:'添加参数',
   // 框的显示与隐藏
      addDialogVisible: false,
      //   添加表单的数据对象
      addFrom: {
        attr_name: ''
      },
      //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
    // 编辑操作
     editTitle:'编辑参数',
   // 框的显示与隐藏
      editDialogVisible: false,
      //  编辑表单的数据对象
      editFrom: {
        attr_name: '',
        attr_id:'',
      },
      //   添加表单的验证规则
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

        }
    },
    created(){
        this.getCateList()
    },
computed: {
    //   按钮需要被禁用返回true, 否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类Id
    getCateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    getTitleText () {
      if (this.activeTabsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
    methods:{
     handleClick(tab, event) {
        this.getParamsData()
      },
    //   监听选择框的变化
    handleChange(){
        this.getParamsData()
    },
    // 获取分类数据
   async getCateList(){
        const {data : res} =await this.$http.get('categories')
     if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.cateList = res.data
},
// 获取表格数据
 async getParamsData(){
      if(!this.ischoose()){
           //   根据所选分类的Id,和当前面板的参数, 获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeTabsName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
        res.data.forEach(item =>{
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制文本框的显示与隐藏
            item.inputVisible = false
            // 文本框的输入值
            item.inputValue = ''
        })
        // 将值父给表格
         if (this.activeTabsName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
     
      }
 },
//  判断是否选择三级分类
ischoose(){
    // 只允许选择三级分类：
      // 通过数组的长度判断
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
},
// 显示对话框
addAttr(){
    if(this.activeTabsName==='only')
    this.addtitle='添加属性';
    this.addDialogVisible = true
},
// 添加参数和属性
 addCate(){
     this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null
    const {data : res} = await this.$http.post(`categories/${this.getCateId}/attributes`, {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeTabsName
          })
          if(res.meta.status!==201){
              return this.$message.error('添加参数失败！')
          }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
     })
},
// 监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 删除参数
   async deleteParams(attrid){
       console.log(this.getCateId+"  "+attrid);
      const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result!=='confirm'){
            return this.$message.info('已取消删除！')
        }
        const {data : res} = await this.$http.delete(`categories/${this.getCateId}/attributes/${attrid}`)
        if(res.meta.status!==200){
            return this.$message.error('失败')
        }
        this.$message.success('删除成功')
        this.getParamsData()
    },
    // 
     handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput(row) {
        row.inputVisible = true;
        // 自动获得焦点
        //$nextTic 页面被重新渲染后，才会执行回调函数的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
//可编辑tag 失去焦点和按下回车键触发的函数
     async handleInputConfirm(row) {
        let inputValue = row.inputValue;
        if (inputValue) {
          row.attr_vals.push(inputValue);
        }
        row.inputVisible = false;
        row.inputValue = '';
        // 将编辑的参数传到服务器
        this.editTag(row)

      },
    //   移除
      removeAttr(row,i){
          row.attr_vals.splice(i,1)
          this.editTag(row)
      },
    //   编辑tag后保存到数据库
   async editTag(row){
        const {data : res} = await this.$http.put(`categories/${this.getCateId}/attributes/${row.attr_id}`,{
            attr_name : row.attr_name,
            attr_sel : this.activeTabsName,
            attr_vals : row.attr_vals.join(' ')
        })
        if(res.meta.status!==200){
            return this.$message.error('失败')
        }
        this.$message.success('操作成功')
    },
// 编辑
   async showEdit(id)
    {
        if(this.activeTabsName==='only'){
            this.editTitle='编辑属性'
        }
        // 根据获取数据
        const {data : res} = await this.$http.get(`categories/${this.getCateId}/attributes/${id}`)
       
       if(res.meta.status!==200){
            return this.$message.error('失败')
       }
       this.editFrom = res.data

       this.editDialogVisible = true
    },
    //提交编辑到数据库
    editCate(){
        console.log(this.editFrom.attr_id);
        this.$refs.editFormRef.validate(async valid =>{
            if(!valid) return
            const {data : res} = await this.$http.put(`categories/${this.getCateId}/attributes/${this.editFrom.attr_id}`,{
                 attr_name : this.editFrom.attr_name,
                 attr_sel : this.activeTabsName,
            })

            if(res.meta.status!==200){
            return this.$message.error('失败')
            console.log(res.meta.message);
        }
         this.editDialogClosed = false
        this.$message.success('操作成功')
        this.getParamsData()
       
        })
    },
    // 编辑对话框关闭
    editDialogClosed(){
        this.$refs.editFormRef.resetFields()
    }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.my-tab{
    margin-top: 15px;
}
.el-tag {
  margin: 8px;
}
.el-dialog{
    text-align:left;
}
.input-new-tag{
    width:100px;
}
</style>