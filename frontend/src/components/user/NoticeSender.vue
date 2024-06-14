<template>
    <div class="main">
        <h1>发送通知</h1>
        <h3 class="warn">
            {{message}}
        </h3>
        <textarea class="noticereceiver" v-model="receiver" placeholder="请输入接收者的用户名"></textarea>
        <br>
        <textarea class="notice" v-model="text" placeholder="请输入通知内容"></textarea>
        <br>
        <button class="send" @click.prevent="SendNotice">发送消息</button>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NoticeSender',
  data () {
    return {
      username: '',
      receiver: '',
      text: '',
      message: ''
    }
  },
  created () {
    axios.get('http://localhost:3000/token', {
      headers: { Authorization: localStorage.getItem('token') }
    }).then(ret => {
      this.username = ret.data.username
    })
  },
  methods: {
    SendNotice () {
      console.log(this.text)
      axios.post('http://localhost:3000/notice_sender', {
        params: {
          sender: this.username,
          receiver: this.receiver,
          text: this.text
        }
      }).then(res => {
        if (res.data.status === 202) {
          this.message = '要发送的用户名不存在，请检查用户名输入是否正确'
        } else if (res.data.status === 200) {
          this.message = ''
          this.$router.push('/home/notice_sender')
          alert('通知发送成功')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.main {
  max-width: 80%;
  margin: 0 auto;
  margin-top: 5px;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.main-title, .admin-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
.notice {
    font-size:18px;
    border-radius: 5px 5px 5px 5px;
    width: 1000px;
    height: 500px;
    padding: 3px;
    margin: 10px;
    background-color: #fff;
}
.noticereceiver {
    font-size:18px;
    border-radius: 5px 5px 5px 5px;
    width: 1000px;
    height: 30px;
    padding: 3px;
    margin: 10px;
    background-color: #fff;
}
.warn {
    font-size:20px;
    color:#ff0d01;
    font-weight: bolder;
    text-align: center;
}
.send{
    display: inline-block;
    padding: 15px 25px;
    font-size: 24px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    outline: none;
    color:#fff;
    background-color: rgb(9, 168, 38);
    border: none;
    border-radius: 15px;
    box-shadow: 0 9px #60abf1;
}
.send:hover{
background-color: #1795bb;
}
.send:active{
    background-color: #1795bb;
    box-shadow: 0 5px #60abf1;
    transform:translateY(4px);
}
</style>
