<template>
  <div class="main">
    <h1 class="main-title">通知列表</h1>

    <div v-for="item in Notices" :key='item' class="notice">
      <div class="photo">
        <el-avatar :size='50' :style="`background:${extractColorByName(item.Sender)}`">{{ item.Sender }}</el-avatar>
        <div class="photo-details">
          <span class="notice_name">{{ item.Sender }}</span>
          <p class="notice_time">{{ item.Time }}</p>
        </div>
      </div>

      <div class="notice_details">
        <div class="notice_content_wrapper">
          <h2 v-if="item.Type=='Warn'" class="warn">数据异常警告</h2>
          <p class="notice_content">{{ item.Content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Avatar from 'vue-avatar'

export default {
  name: 'Notice',
  data () {
    return {
      username: '',
      Notices: []
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
      this.GetNotice()
    })
  },
  methods: {
    GetNotice () {
      axios.post('http://localhost:3000/notice_receiver', {
        params: {
          username: this.username
        }
      }).then(res => {
        this.Notices = res.data
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
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
  max-width: 60%;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #f9f9f9;
  border-radius: 10px;
}

.main-title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

.notice {
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.notice:hover {
  transform: translateY(-5px);
}

.photo {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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

.warn {
  font-size: 20px;
  color: #ff0000;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}
</style>
