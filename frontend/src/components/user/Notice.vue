<template>
    <div class="main">
    <h1>通知列表</h1>

     <div v-for="item in Notices" :key='item' class="notice">
        <div class="photo">
            <el-avatar :size='50' :style="`background:${extractColorByName('{{item.Sender}}')}`"> {{item.Sender}} </el-avatar>
            <span class="notice_name">{{item.Sender}}</span>
        </div>

        <p class="notice_time">{{ item.Time }}</p>
        <h2 v-if="item.Type=='Warn'" class="warn">
            数据异常警告
        </h2>
        <p class="notice_content">{{ item.Content }}</p>
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
    border-radius: 50px 50px 50px 50px;
    padding: 3px;
    margin: 10px;
    background-color: #fff;
}
.photo {
    margin-left: 150px;
    width: 300px;
    height: 20px;
}
.notice_time {
    font-size:20px
}
.notice_name {
    font-size:20px;
    color:#292b30;
    text-shadow: 0 8px 10px #292b30;
    font-weight: bolder;
    text-align: center;
}
.notice_content {
    margin-left: 40px;
    margin-right: 40px;
}
.warn {
    font-size:25px;
    color:#ff0d01;
    text-shadow: 0 8px 10px #ff6a00;
    font-weight: bolder;
    text-align: center;
}
</style>
