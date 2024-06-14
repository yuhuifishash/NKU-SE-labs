<template>
  <div class="guide">

    <div v-if="!isLoggedIn" class="auth-buttons">
      <el-button type="primary" @click="redirectTo('/login')">登录</el-button>
      <el-button type="success" @click="redirectTo('/register')">注册</el-button>
    </div>

    <el-menu
      mode="horizontal"
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      style="display: flex; justify-content: space-between;"
      v-if="isLoggedIn"
     >
      <div style="display: flex;">
        <el-menu-item @click.native="redirectTo('main-data')">主要数据</el-menu-item>
        <el-menu-item @click.native="redirectTo('underwater-system')">水下系统</el-menu-item>
        <el-menu-item @click.native="redirectTo('data-center')">数据中心</el-menu-item>
        <el-menu-item @click.native="redirectTo('intelligence-center')">智能中心</el-menu-item>
        <el-menu-item @click.native="redirectTo('notice')">查看通知</el-menu-item>
        <el-menu-item @click.native="redirectTo('notice_sender')">发送通知</el-menu-item>
        <el-menu-item v-if="isAdmin" @click.native="redirectTo('/home/datas')" type="warning">数据管理界面</el-menu-item>
        <el-menu-item v-if="isUserAdmin" @click.native="redirectTo('/home/admin')" type="warning">用户管理界面</el-menu-item>
      </div>

      <div style="display: flex; align-items: center; margin-left: auto;">

        <div>{{ msg }}</div> &ensp; &ensp;

        <div v-if="isLoggedIn" class="logged-in">
          <el-button type="danger" @click.prevent="LogoutHandler">注销</el-button>
        </div>

      </div>
    </el-menu>
    <div v-else>
      <p>请登录以访问系统</p>
    </div>
    <div class="contentbg">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Main',
  data () {
    return {
      msg: '',
      isLoggedIn: false,
      isAdmin: false,
      isUserAdmin: false
    }
  },
  created () {
    console.log(this.isAdmin)
    axios.get('http://localhost:3000/', {
      headers: { Authorization: localStorage.getItem('token') }
    }).then(res => {
      if (res.data.status === 223) {
        this.msg = '没有登录'
        this.isLoggedIn = false
      } else {
        this.msg = '已经登录'
        this.isLoggedIn = true
        // TODO : 假设isAdmin从后端返回
        axios.get('http://localhost:3000/token').then(ret => {
          this.msg = '欢迎，' + ret.data.username
          this.isAdmin = ret.data.level >= 1
          this.isUserAdmin = ret.data.level >= 2
        })
      }
    }).catch(error => console.error(error))
  },
  methods: {
    LogoutHandler () {
      localStorage.removeItem('token')
      location.reload()
    },
    redirectTo (route) {
      location.href = route
    }
  }
}
</script>

<style scoped>
.main {
  font-family: Arial, sans-serif;
  /* width: 100%; */
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
  margin-top: 60px;
  /* background-color :aqua; */
}
.contentbg{
  /* background-color: aqua; */
  padding-top: 150px;
  padding-bottom: 150px;
  background-image: url("../../assets/home_bg.png");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  padding:20px;
}
</style>
