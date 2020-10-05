<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
        <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getUserLists">
            <el-button slot="append" icon="el-icon-search" @click="getUserLists"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"  @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
<!-- 用户列表 -->
        <el-table :data="userlist" style="width: 100%" stripe border>
         <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色" ></el-table-column>
        <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" @change="changStatus(scope.row)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditdialog(scope.row)"></el-button>
                <el-button type="warning" icon="el-icon-setting" 
                size="mini"
                @click="openSetRole(scope.row)"
                ></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="openDel(scope.row.id)"></el-button>
            </template>
        </el-table-column>
        </el-table>
<!-- 分页 -->
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 3, 4]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totle">
            </el-pagination>
        </div>
<!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%"
 >
 <!-- 主体内容 -->
  <el-form 
  :model="addUserForm" 
  :rules="addUserFormRules" 
  ref="addUserFormRef" 
  label-width="100px"
    class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addUserForm.username"></el-input>
</el-form-item>
<el-form-item label="密码" prop="password">
    <el-input v-model="addUserForm.password" type="password"></el-input>
</el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addUserForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="电话号码" prop="mobile"> 
    <el-input v-model="addUserForm.mobile" ></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑用户信息 -->
<el-dialog
  title="编辑"
  :visible.sync="editVisible"
  width="50%"
 >
  <el-form 
  :model="editUserForm" 
  :rules="editUserFormRules" 
  ref="editUserFormRef" 
  label-width="100px"
    class="demo-ruleForm">
  <el-form-item label="用户名" >
    <el-input v-model="editUserForm.username" disabled></el-input>
</el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editUserForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="电话号码" prop="mobile">
    <el-input v-model="editUserForm.mobile" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配用户角色 -->
<el-dialog
class="textAlign"
  title="分配角色"
  :visible.sync="setRoledialogVisible"
  width="50%"
  >
  <div class="textAlign">
    <p>当前用户：{{userInfo.username}}</p>
    <p>当前角色：{{userInfo.role_name}}</p>
    <p>
      分配角色：
      <el-select
        v-model="selectRoleId"
        filterable
        allow-create
        default-first-option
        placeholder="请选择角色"
      >
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>
    </p>
  </div>
  <span slot="footer">
    <el-button @click="setRoledialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRole">确 定</el-button>
  </span>
</el-dialog>
</el-card>

</div>
</template>

<script>
export default {
    data(){
        // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
        return {
            // 获取用户列表查询参数对象
        queryInfo: {
            query: '',
            // 当前页数
            pagenum: 1,
            // 每页显示多少数据
            pagesize: 5
      },
      userlist: [],
      totle: 0,
    //   对话框
      dialogVisible:false,

      // 分配用户角色对话框
    setRoledialogVisible:false,
    // 用户信息
    userInfo:{},
    // 权限id
    selectRoleId:'',
    // 权限列表
    roleList:[],
    // 添加用户信息
    addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
    },
    editVisible:false,
    editUserForm:{},

    // 添加用户验证
    addUserFormRules:{
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名的长度在2～10个字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '用户密码的长度在6～18个字',
            trigger: 'blur'
          }
        ],
         email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {tvalidator: checkMobile, trigger: 'blur' }
        ]
    },
     // 编辑用户表单验证
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    
    }
    },
    created(){
        this.getUserLists()
    },
    methods: {
        // 获取全部用户列表
       async getUserLists(){
         const {data:res} =await this.$http.get('users',{params: this.queryInfo})
         this.userlist = res.data.users
         this.totle = res.data.total
        },
        // 分页状态的页数改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getUserLists()
        },
        // 当前页数的改变
        handleCurrentChange(newSize){
            this.queryInfo.pagenum = newSize
            this.getUserLists()
        },
        // 改变用户状态
       async changStatus(rowDtata){
         const {data:res} =await this.$http.put(`users/${rowDtata.id}/state/${rowDtata.mg_state}`)
         if (res.meta.status !== 200) {
            rowDtata.mg_state = !rowDtata.mg_state
            return this.$message.error('更新用户状态失败')
         }
            this.$message.success('更新用户状态成功！')
        },
        // 添加用户
        addUser(){
        // 提交前需要表单验证
        this.$refs.addUserFormRef.validate(async valid => {
        
        // 成功valid为true
        // 表单预校验失败
        if (!valid) return  

        const {data:res} = await this.$http.post('users',this.addUserForm)
        if(res.meta.status!=201){
            this.$message.error('添加用户失败')
        }
         this.$message.success('更新用户成功')
        this.dialogVisible = false
        this.getUserLists()
            
        })
        },
        // 显示编辑的对话框
       async showEditdialog(info){
            this.editVisible=true
            console.log(info.id)
           const {data:res} =await this.$http.get('users/'+info.id)
           if(res.meta.status!=200){
               this.$message.error('查询失败')
           }
           
           this.editUserForm = res.data
        },
        //编辑用户
        editUser(){
            this.$refs.editUserFormRef.validate(async valid => {
                if(!valid){
                    return 
                }
                 console.log(this.editUserForm.id)
               const {data:res} = await this.$http.put('users/'+this.editUserForm.id, {
                email: this.editUserForm.email,
                mobile: this.editUserForm.mobile
            })
               if(res.meta.status!=200){
               this.$message.error('编辑失败')
               
               }
               else
               this.$message.success('编辑用户成功')
            //    编辑成功后关闭对话框并刷新列表
               this.editVisible=false
               this.getUserLists()
            })
        },
        // <!-- 删除框 -->
      async  openDel(id){
          
        const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          console.log(res);
          if(res!=='confirm'){
            return  this.$message.info('已取消了删除')
          }
          
        const {data:result}=await this.$http.delete('users/'+id)
        if(result.meta.status!=200){
          return  this.$message.error("失败")
        }
        this.$message.success("删除成功")
        this.getUserLists()
  
        },
        // 设置用户角色
       async openSetRole(user){
        this.userInfo = user
        const {data :res} =await this.$http.get('roles')
        if(res.meta.status!=200){
          return this.$message.error('失败')
        }
        this.roleList = res.data
        this.setRoledialogVisible=true
        },
        // 点击分配角确定按钮
       async setRole(){
           if (!this.selectRoleId) {
          return this.$message.error('请选择要分配的角色')
        }
         const {data : res} =await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
         if(res.meta.status!=200){
           return this.$message.error('失败')
         }
         this.setRoledialogVisible = false
          this.$message.success('更新角色成功！')
          this.getUserLists()
          
        }
    }
}
</script>

<style lang="less" scoped>
 .textAlign{
  text-align: left;
}
</style>