<template>
    <div id="box">
        <div class="login_box">
            <!-- 图片 -->
            <div class="avater_box">
                <img src="../assets/logo.png"/>
            </div>
            <!-- 表单 -->
            <el-form 
            ref="loginFormRef"
           :model="loginForm"
           :rules="loginFormRules"
             label-width="0px" 
             class="input_box">
                <el-form-item prop="username" >
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input  prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                   <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="submitForm()" >重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm: {
                username:'admin',
                password:'123456'
            },

            // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }

    }
    },
    methods: {
        // 表单重置按钮
        submitForm(){
            this.$refs.loginFormRef.resetFields();
        },
        // 登录
        login(){
            this.$refs.loginFormRef.validate(async (valid) => {
          if (valid) {
            //   async await 将Promise 对象转换成普通对象，用res接收返回data值
          var {data:res} = await this.$http.post('login', this.loginForm)
           
             this.$message({
                message: '登录成功',
                type: 'success'
             });
               if (res.meta.status !== 200) return this.$message.error('登录失败')
              //  将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
             window.sessionStorage.setItem('token' ,res.data.token)
            //  跳转到成功的页面
            this.$router.push('/home')


          } else {
            this.$message.error('错了哦，这是一条错误消息');
            return false;
          }
        });
        }
    }
}
</script>

<style lang="less" scoped>
#box{
    background-color: blue;
    height:100%;
}
.login_box{
    background-color:#fff;
    width:450px;
    height:300px;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    
    .avater_box{
        width:138px;
        height:138px;
        border-radius: 50%;
        border:1px solid #eee;
        padding: 10px;
        position: absolute;
        left:50%;
        transform:translate(-50%,-50%);
        background-color: #eee;
       img{ width:100%;
        height:100%;
        border-radius: 50%;
        background-color: #eee;
        }
    }
}
.input_box{
    position: absolute;
    width:100%;
    padding:0 10px;
    
    box-sizing: border-box;
    bottom: 0;
}
.btn{
    display: flex;
    justify-content: flex-end;
    }


</style>