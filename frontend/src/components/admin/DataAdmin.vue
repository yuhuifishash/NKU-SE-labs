<template>
    <div class="main">
      <h2>数据管理中心</h2>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DataAdminManagement',
  data () {
    return {
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      axios.get('http://localhost:3000/token', {
        headers: { Authorization: localStorage.getItem('token') }
      }).then(res => {
        axios.get('http://localhost:3000/token').then(ret => {
          this.isAdmin = ret.data.level
          if (this.isAdmin === 0) {
            alert('您的权限不足')
            this.$router.push('/')
          } else {

          }
        })
      }).catch(error => {
        console.error('Error fetching token:', error)
      })
    },

    GetNotice () {

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
