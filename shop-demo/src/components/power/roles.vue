<template>
    <div>
        <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        
        <el-row>
            <el-col>
                <el-button type="primary" class="addBtn"
                @click="openAddrole"
                >添加角色</el-button>
            </el-col>
        </el-row>
        
        <el-table :data="rolesList" style="width: 100%" stripe border>
            <el-table-column type="expand" label="#">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
                    :gutter="24"
                    v-for="(item1,index) in scope.row.children"
                    :key="index">
                    <!-- 一级权限 -->
                        <el-col :span="5">
                            <el-tag   closable @close="handleClose(scope.row.id,item1.id)">
                                {{item1.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二级和三级权限 -->
                        <el-col :span="19">
                            <el-row 
                            :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item2,index) in item1.children" :key="index">
                                <el-col :span='6'>
                                    <el-tag closable type="success"
                                    @close="handleClose(scope.row.id,item2.id)">{{item2.authName}}  
                                    </el-tag>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag closable
                                    type="warning"
                                    @close="handleClose(scope.row.id,item3.id)"
                                    v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                                </el-col>

                            </el-row>
                        </el-col>
                        
                    </el-row>
                </template>
            </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" ></el-table-column>
        <el-table-column prop="roleDesc" label="角色权限" ></el-table-column>
        <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" 
            size="mini"
            @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
        </template>
        </el-table-column>
    </el-table>
    <!-- 分配权限得到对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog class="textAlign"
        title="编辑"
        :visible.sync="editDialogVisible"
        width="50%"
        >
        <el-form ref="editformRef" :model="Roleform" label-width="80px">
        <el-form-item label="角色名称">
            <el-input v-model="Roleform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
            <el-input v-model="Roleform.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
        </el-dialog>

<!-- 添加角色 -->
 <el-dialog class="textAlign"
  title="添加角色"
  :visible.sync="AddRoledialogVisible"
  width="40%"
  >
    <el-form ref="AddRoleformRef" :model="AddRoleform" label-width="80px">
    <el-form-item label="角色名称">
        <el-input v-model="AddRoleform.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述">
        <el-input v-model="AddRoleform.roleDesc"></el-input>
    </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="AddRoledialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            // 所有角色列表
      rolesList: [],
    // 分配权限框
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      //  树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //   默认选中节点ID值
      defKeys: [],
      //   添加用户对话框
      AddRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {},
      //   添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //   编辑角色信息
      editRoleForm: {},
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //   当前即将分配权限的Id
      roleId: 0,
    //   编辑
    editDialogVisible:false,
    // 编辑表单
    Roleform:{},
    // 添加角色
    AddRoledialogVisible:false,
    AddRoleform:{}
 }
    },
    created(){
        this.getRolesList()
    },
    methods: {
        async getRolesList(){
            const {data:res} =await this.$http.get('roles')
            if(res.meta.status!=200){
                return this.$message.error("失败")
            }
            this.rolesList = res.data
    },
    // 删除角色
    async deleteRole(id){

      const confirmResult = await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        if(confirmResult!=='confirm'){
            return this.$message.info('取消成功')
        }
        const {data:res} =await this.$http.delete('roles/'+id)
        if(res.meta.status!=200){
            return this.$message.error('删除失败')
        }
        this.$message.success("删除成功")
        this.getRolesList()
    },
    // 删除角色指定权限
    async handleClose(roleId,rightId){
        const confirmResult = await this.$confirm('此操作将删除该角色的权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        if(confirmResult!=='confirm'){
            return this.$message.info('取消成功')
        }
        const {data : res} = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)

         if(res.meta.status!=200){
            return this.$message.error('删除失败')
        }
        this.$message.success("删除成功")
         this.rolesList = res.data
     },
    // 分配权限
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取角色的所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      //   获取权限树
      this.rightsList = res.data
      //   console.log(res)
      //   递归获取三级节点的id
      this.getLeafkeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 权限对话框关闭事件
    setRightDialogClosed () {
      this.rightsList = []
    },

    // 分配权限
    async allotRights (roleId) {
      // 获得当前选中和半选中的Id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败！') }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 显示编辑的弹框
   async showEditDialog(role){
         const { data: res } = await this.$http.get('roles/' + role.id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.Roleform = res.data
      this.editDialogVisible=true
    },
// 点击确定提交按钮
    editRole(){
        // 验证表单
        this.$refs.editformRef.validate( async valid=>{
             if (!valid) return 
            //  验证通过则提交修改
            const { data :res} = await this.$http.put('roles/' + this.Roleform.roleId,{
               roleName: this.Roleform.roleName,
               roleDesc: this.Roleform.roleDesc
            })
            if (res.meta.status !== 200) {
         return this.$message.error('更新角色信息失败！')
        }
        // 隐藏编辑角色对话框
        this.editDialogVisible = false
        this.$message.success('更新角色信息成功！')
        this.getRolesList()
        })
    },
    // 显示添加角色对话框
    openAddrole(){
        this.AddRoledialogVisible = true
    },
    // 添加角色

    addRoles(){
        this.$refs.AddRoleformRef.validate( async valid=>{
        if (!valid) return  
        
        const { data :res} = await this.$http.post('roles',{
        roleName: this.AddRoleform.roleName,
        roleDesc: this.AddRoleform.roleDesc
        })
        if (res.meta.status !== 201) {
            return this.$message.error('添加角色信息失败！')
        }
        // 隐藏编辑角色对话框
        this.AddRoledialogVisible = false
        this.$message.success('添加角色信息成功！')
        this.getRolesList()
     })

    }



    }
    
   
}
</script>
<style lang="less" scoped>
.el-col{
    text-align: left;
}
.el-tag {
margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.textAlign{
  text-align: left;
}
</style>

