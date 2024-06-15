<template>
  <div class="main">
    <h1 class="main-title">发送通知</h1>
    <h3 class="warn">{{ message }}</h3>
    <textarea class="noticereceiver" v-model="receiver" placeholder="请输入接收者的用户名"></textarea>
    <textarea class="notice" v-model="text" placeholder="请输入通知内容"></textarea>
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
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px;
}

.main-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.warn {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.notice,
.noticereceiver {
  font-size: 16px;
  border-radius: 5px;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.notice {
  height: 200px;
  resize: none;
}

.noticereceiver {
  resize: none;
}

.send {
  display: block;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #52c41a;
  border: none;
  border-radius: 5px;
  box-shadow: 0 4px #3da914;
  transition: background-color 0.3s ease;
}

.send:hover {
  background-color: #389e0d;
}

.send:active {
  background-color: #52c41a;
  box-shadow: 0 2px #3da914;
  transform: translateY(2px);
}
</style>
