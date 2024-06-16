<template>
    <div class="main">
      <h2>数据管理中心</h2>
      <div class="btndiv">
        <button class="btn" @click.prevent="SendNotice">下载鱼群种类数据</button>
        <button class="btn" @click.prevent="SendNotice">下载鱼群数量数据</button>
        <button class="btn" @click.prevent="DownLoadAqua">下载水质数据</button>
      </div>

      <br><br><br><br>
      <div class="btndiv">
        <button class="btn" @click.prevent="SendNotice">以输入方式上传鱼群种类数据</button>
        <button class="btn" @click.prevent="SendNotice">以输入方式上传鱼群数量数据</button>
        <button class="btn" @click.prevent="SendNotice">以输入方式上传水质数据</button>
      </div>
      <br><br><br><br>
      <div class="btndiv">
        <button class="btn" @click.prevent="SendNotice">以文件方式上传鱼群种类数据</button>
        <button class="btn" @click.prevent="SendNotice">以文件方式上传鱼群数量数据</button>
        <button class="btn" @click.prevent="SendNotice">以文件方式上传水质数据</button>
      </div>
      <br><br>
      <div class="filereq">
        <h2>文件上传格式要求</h2>
        <p class="reqtext">1、必须以CSV文件格式上传</p>
        <p class="reqtext">2、鱼群种类数据的格式为:date,common_name,count,len_min,len_max,weigh_total</p>
        <p class="reqtext">3、鱼群数量数据的格式为:date,fish_type,quantity,size_cm</p>
        <p class="reqtext">4、水质数据的格式较为复杂,具体可以参考输入方式上传水质数据的页面</p>
        <p class="reqtext">5、CSV文件每列的具体含义可以参考输入方式上传数据的页面</p>
      </div>
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
          }
        })
      }).catch(error => {
        console.error('Error fetching token:', error)
      })
    },
    DownloadText (fileName, text) {
      const url = window.URL || window.webkitURL || window
      const blob = new Blob([text])
      const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = url.createObjectURL(blob)
      saveLink.download = fileName
      saveLink.click()
    },
    DownLoadFile (type, url) {
      axios.get('http://localhost:3000/data/download', {
        params: {
          url: url
        }
      }).then(res => {
        this.DownloadText(type + '.csv', res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    DownLoad (dtype) {
      axios.post('http://localhost:3000/data', {
        params: {
          type: dtype
        }
      }).then(res => {
        this.DownLoadFile(dtype, res.data.url)
      }).catch(err => {
        console.log(err)
      })
    },

    DownLoadAqua () {
      this.DownLoad('aquadata')
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
  .filereq {
    border-radius: 50px 50px 50px 50px;
    padding: 3px;
    margin: 10px;
    height: 300px;
    background-color: #fff;
  }
  .reqtext {
      font-size:20px
  }
  .btndiv {
    max-width: 80%;
    margin: 0 auto;
    margin-top: 5px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .btn{
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
.btn:hover{
background-color: #1795bb;
}
.btn:active{
    background-color: #1795bb;
    box-shadow: 0 5px #60abf1;
    transform:translateY(4px);
}
</style>
