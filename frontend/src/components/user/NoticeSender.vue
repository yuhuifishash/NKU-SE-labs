<template>
  <div class="main">
    <h1 class="main-title">发送通知</h1>
    <h3 class="warn">{{ message }}</h3>
    <textarea class="noticereceiver" v-model="receiver" placeholder="请输入接收者的用户名" :style="{ resize: 'none' }"></textarea>
    <textarea class="notice" v-model="text" placeholder="请输入通知内容" :style="{ resize: 'none' }"></textarea>
    <button class="send" @click.prevent="SendNotice">发送消息</button>

    <h2 class="history-title">历史消息发送记录</h2>
    <button class="toggle-history-button" @click="toggleHistory">
      {{ showHistory ? '隐藏历史消息' : '显示历史消息' }}
    </button>
    <div v-if="showHistory">
      <div class="history-item" v-for="(item) in NoticeHistory" :key='item.id'>
        <div class="photo">
          <span class="receiver-label">接收方:</span>
          <el-avatar :size='50' :style="`background:${extractColorByName(item.Receiver)}`">{{ item.Receiver }}</el-avatar>
          <div class="photo-details">
            <span class="notice_name">{{ item.Receiver }}</span>
            <p class="notice_time">{{ item.Time }}</p>
          </div>
        </div>

        <div class="notice_details">
          <div class="notice_content_wrapper">
            <p class="notice_content">{{ item.Content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Avatar from 'vue-avatar'

export default {
  name: 'NoticeSender',
  data () {
    return {
      username: '',
      receiver: '',
      text: '',
      message: '',
      NoticeHistory: [],
      showHistory: false // 新增布尔值控制历史消息的显示与隐藏
    }
  },
  components: {
    Avatar
  },
  created () {
    axios.get('http://localhost:3000/token', {
      headers: { Authorization: localStorage.getItem('token') }
    }).then(ret => {
      this.username = ret.data.username
      this.GetNoticeHistory()
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
          this.GetNoticeHistory()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    GetNoticeHistory () {
      axios.post('http://localhost:3000/notice_history', {
        params: {
          username: this.username
        }
      }).then(res => {
        this.NoticeHistory = res.data.map(item => ({ ...item, expanded: false }))
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    toggleDetails (index) {
      this.$set(this.NoticeHistory, index, {
        ...this.NoticeHistory[index],
        expanded: !this.NoticeHistory[index].expanded
      })
    },
    toggleHistory () {
      this.showHistory = !this.showHistory
    },
    extractColorByName (name) {
      var temp = []
      temp.push('#')
      for (let index = 0; index < name.length; index++) {
        temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16))
      }
      return temp.slice(0, 5).join('').slice(0, 4)
    }
  }
}
</script>

<style scoped>
.main {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background-color: #f7f7f7;
  border-radius: 12px;
  font-family: 'Arial', sans-serif;
}

.main-title {
  font-size: 36px;
  text-align: center;
  margin-bottom: 25px;
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
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.notice:focus,
.noticereceiver:focus {
  border-color: #52c41a;
  outline: none;
}

.notice {
  height: 150px;
  resize: vertical;
}

.noticereceiver {
  resize: none; /* 禁止拖动调整大小 */
}

.send {
  display: block;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  background-color: #52c41a;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px #3da914;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.send:hover {
  background-color: #389e0d;
}

.send:active {
  background-color: #52c41a;
  box-shadow: 0 2px #3da914;
  transform: translateY(2px);
}

.history-title {
  font-size: 28px;
  margin-top: 30px;
  text-align: center;
  color: #333;
}

.toggle-history-button {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #1890ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-history-button:hover {
  background-color: #40a9ff;
}

.history-item {
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.history-item:hover {
  transform: translateY(-5px);
}

.photo {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.receiver-label {
  font-size: 16px;
  color: #333;
  margin-right: 10px;
}

.el-avatar {
  margin-right: 10px;
}

.photo-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.notice_name {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin-bottom: 2px;
  text-align: left;
}

.notice_time {
  font-size: 14px;
  color: #999;
  margin-top: 2px;
  text-align: left;
}

.toggle-button {
  margin-left: auto;
  padding: 5px 10px;
  font-size: 14px;
  color: #fff;
  background-color: #1890ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #40a9ff;
}

.notice_details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.notice_content_wrapper {
  width: 100%;
}

.notice_content {
  font-size: 16px;
  line-height: 1.5;
  color: #555;
}
</style>
