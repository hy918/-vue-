<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
        <el-card class="my-card">
            <!-- 提示框 -->
            <el-alert title="添加商品信息" show-icon center type="info" :closable='false'> </el-alert>
            <!-- 步骤条 -->
            <el-steps :active="activeIndex - 0" align-center>
             <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
            </el-steps>
            <!-- table页 -->
         <el-form 
            :model="addGoodsForm" 
            :rules="addGoodsFormRules" 
            ref="addGoodsFormRef" 
            label-width="100px"
            class="demo-ruleForm"
            label-position='top'>
            <el-tabs 
            :tab-position="'left'"
            :before-leave="beforeTabLeave"
            v-model="activeIndex"
            @tab-click="tabClicked"
            >
                <el-tab-pane label="基本信息">
                    <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addGoodsForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                    <el-cascader
                        v-model="addGoodsForm.goods_cat"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="handleChange"
                    ></el-cascader>
                    </el-form-item>
                </el-tab-pane>

            <el-tab-pane label="商品参数">
                  <!-- 渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData
            "
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
                 <el-form-item 
                 v-for="(item,index) in onlyTableData"
                 :label="item.attr_name"
                 :key="index"
                 >
                <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
                <el-upload
                class="upload-demo"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture"
                :headers="headerConfig"
                :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
                <!-- 需要先下载编辑依赖 -->
                <quill-editor v-model="addGoodsForm.goods_introduce" >
                </quill-editor>
                <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>

         </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="picPreviewPath" alt="" class="previewImg">
    </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 步骤条状态
            activeIndex:'0',
            // 添加表单
            addGoodsForm:{
                goods_name:'',
                goods_cat:[],
                goods_price: 0,
                goods_number:0,
                goods_weight:0,
                goods_introduce:'',
                pics:[],
                attrs:[]
            },
            // 表单验证
    addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },{ type: 'number', message: "请输入大于0的数字", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
    //   商品分类数据
      cateList:[],
    //   连选课展示的
      cascaderProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
    //   图片
    fileList:[],
    // 图片上传的请求头,element ui 上传图片并没有使用我们自己配置的axios
    headerConfig:{
        Authorization: window.sessionStorage.getItem('token')
    },
    previewDialogVisible:false,
    // 图片预览
    picPreviewPath:'',
        }
    },
     created () {
     this.getCateList()
  },
  computed:{
      getCateId(){
          return this.addGoodsForm.goods_cat[2]
      }
  },
    methods:{
        // 获取分类参数
        async getCateList(){
            const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类失败！')
        }
            this.cateList = res.data
            
     },
        // 触发级联框
        handleChange(){
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
 },
//  控制表单切换
 beforeTabLeave(){
     if (this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择参数')
        return false
      }
 },
//  表单切换触发的事件
async tabClicked(){
 if(this.activeIndex==='1'){
     this.getManyData("many")
 }else if(this.activeIndex==='2'){
      const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        this.onlyTableData = res.data
 }
},
// 获取参数的属性
async getManyData(sel){
     const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: sel }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
        res.data.forEach(item =>{
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
       if(sel==='many'){
           this.manyTableData = res.data
       }else if(sel==='only'){
           this.onlyTableData = res.data
       }
      },
    //   上传图片相关的方法
    // 预览
    handlePreview(file, fileList){
        this.picPreviewPath = file.response.data.url
        this.previewDialogVisible = true 
    },
    // 移除
    handleRemove(file){
        const filePath = file.response.data.tmp_path
        var  i = this.addGoodsForm.pics.findIndex(item =>{
            return item.pic===filePath
        })
        this.addGoodsForm.pics.splice(i,1)
     
    },
    // 上传成功
    handleSuccess(response){
    //    将临时文件保存
        const path = { pic: response.data.tmp_path }
         this.addGoodsForm.pics.push(path)

    },
    // 验证表单数据并实现添加
    addGoods(){
        this.$refs.addGoodsFormRef.validate( async valid =>{
            if(!valid){
                return this.$message.error('检查是否将已填写的内容填写完毕')
            }
            //  先深拷贝一份表单数据
            const newForm = this.deepClone(this.addGoodsForm)
            // 将数组转换成字符串
           newForm.goods_cat = newForm.goods_cat.join(',');
            // 处理商品的参数（数组），包含 `动态参数` 和 `静态属性`
            this.manyTableData.forEach(item =>{
                const obj = {
                    attr_id: item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                }
                 this.addGoodsForm.attrs.push(obj)
            })
            this.onlyTableData.forEach(item =>{
                const obj = {
                    attr_id: item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addGoodsForm.attrs.push(obj)
            })
            newForm.attrs =  this.addGoodsForm.attrs
            console.log(newForm.goods_name);
            // 将值添加到数据库
            const { data: res } = await this.$http.post('goods', newForm)
            if (res.meta.status !== 201) 
            return this.$message.error('添加商品失败！')
            this.$message.success('添加商品成功!')
            // 跳到商品列表
             this.$router.push('/goods')
    
        })
    },
    // 实现对象的深拷贝
    deepClone(obj){
　　let objClone =  Array.isArray(obj) ? [] : {};
　　if (obj && typeof obj === 'object') {
　　　　for(let key in obj){
　　　　　　if (obj[key] && typeof obj[key] === 'object'){
　　　　　　　　objClone[key] = this.deepClone(obj[key]);
　　　　　　}else{
　　　　　　　　objClone[key] = obj[key]
　　　　　　}
　　　　}
　　}
　　return objClone;
}
    }
}
</script>

<style lang="less" scoped>
.el-steps {
    margin: 15px 0;
}
.my-card{
text-align:left;
}
.previewImg{
  width: 100%;
}
.btnAdd{
    margin-top:15px;
}

</style>