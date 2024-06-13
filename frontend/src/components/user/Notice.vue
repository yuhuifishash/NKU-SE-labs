<template>
    <div class="notice">
    <h2>通知列表</h2>
     <p>{{username}}</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DataAdminManagement',
  data () {
    return {
      username: ''
    }
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
        console.log(res)
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
  margin-top: 30px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.main-title, .admin-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
