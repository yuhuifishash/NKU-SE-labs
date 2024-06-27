<template>
  <div class="main">
    <h2>数据管理中心</h2>
    <div class="btndiv">
      <button class="btn" @click.prevent="DownLoadFishKind">下载鱼群种类数据</button>
      <button class="btn" @click.prevent="DownLoadFish">下载鱼群数量数据</button>
      <button class="btn" @click.prevent="DownLoadAqua">下载水质数据</button>
    </div>

    <div class="btndiv">
      <button class="btn" @click.prevent="SubmitFishKind">上传鱼群种类数据</button>
      <button class="btn" @click.prevent="SubmitFish">上传鱼群数量数据</button>
      <button class="btn" @click.prevent="SubmitAqua">上传水质数据</button>
    </div>

    <div class="form-section">
      <h3>鱼群种类数据</h3>
      <input type='date' v-model="fishkind_date" placeholder="请输入日期"/>
      <input v-model="fishkind_type" placeholder="请输入鱼的种类"/>
      <input type='number' v-model="fishkind_quantity" placeholder="请输入该种类鱼的数量"/>
      <input type='number' v-model="fishkind_size" placeholder="请输入该种类鱼的平均长度"/>
    </div>

    <div class="form-section">
      <h3>鱼群数量数据</h3>
      <input type='date' v-model="fish_date" placeholder="请输入日期"/>
      <input v-model="fish_type" placeholder="请输入鱼的种类"/>
      <input type='number' v-model="fish_number" placeholder="请输入该种类鱼的数量"/>
      <input type='number' v-model="fish_lenmin" placeholder="请输入该种类鱼的长度最小值"/>
      <input type='number' v-model="fish_lenmax" placeholder="请输入该种类鱼的长度最大值"/>
      <input type='number' v-model="fish_weight" placeholder="请输入该种类鱼的重量"/>
    </div>

    <div class="form-section">
      <h3>水质数据</h3>
      <input v-model="aqua_province" placeholder="请输入省份"/>
      <input v-model="aqua_drain" placeholder="请输入流域"/>
      <input v-model="aqua_section" placeholder="请输入区域名"/>
      <input type="datetime-local" v-model="aqua_time" placeholder="请输入时间"/>
      <input v-model="aqua_type" placeholder="请输入水质等级"/>
      <input v-model="aqua_temp" placeholder="请输入河水温度"/>
      <input v-model="aqua_pH" placeholder="请输入河水pH值"/>
      <input v-model="aqua_oxygen" placeholder="请输入河水溶氧量(mg/L)"/>
      <input v-model="aqua_cond" placeholder="请输入河水电导率(μS/cm)"/>
      <input v-model="aqua_tur" placeholder="请输入河水浑浊度(NTU)"/>
      <input v-model="aqua_kmno" placeholder="请输入河水高锰酸盐指数(mg/L)"/>
      <input v-model="aqua_nh3" placeholder="请输入河水氨氮(mg/L)"/>
      <input v-model="aqua_k" placeholder="请输入河水总磷(mg/L)"/>
      <input v-model="aqua_n" placeholder="请输入河水总氮(mg/L)"/>
      <input v-model="aqua_chl" placeholder="请输入河水叶绿素(mg/L)"/>
      <input v-model="aqua_algae" placeholder="请输入河水藻密度(cells/L)"/>
      <input v-model="aqua_situation" placeholder="请输入站点情况"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DataAdminManagement',
  data () {
    return {
      username: '',
      fishkind_date: '',
      fishkind_type: '',
      fishkind_quantity: '',
      fishkind_size: '',
      fish_date: '',
      fish_type: '',
      fish_number: '',
      fish_lenmin: '',
      fish_lenmax: '',
      fish_weight: '',
      aqua_province: '',
      aqua_drain: '',
      aqua_section: '',
      aqua_time: '',
      aqua_type: '',
      aqua_temp: '',
      aqua_pH: '',
      aqua_oxygen: '',
      aqua_cond: '',
      aqua_tur: '',
      aqua_kmno: '',
      aqua_nh3: '',
      aqua_k: '',
      aqua_n: '',
      aqua_chl: '',
      aqua_algae: '',
      aqua_situation: ''
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
          this.username = ret.data.username
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
    },

    DownLoadFish () {
      this.DownLoad('fishdata')
    },

    DownLoadFishKind () {
      this.DownLoad('fishkinddata')
    },

    SubmitFishKind () {
      axios.post('http://localhost:3000/data/fishkind_upload', {
        params: {
          username: this.username,
          date: this.fishkind_date,
          type: this.fishkind_type,
          quantity: this.fishkind_quantity,
          size: this.fishkind_size
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.status === 200) {
          alert('上传成功，如果出现异常数据，系统会向您自动发送通知，请留意系统发送的通知。')
        } else if (res.data.status === 202) {
          alert('数据不完整，请重新输入')
        }
      }).catch(err => {
        console.log(err)
      })
    },

    SubmitFish () {
      axios.post('http://localhost:3000/data/fish_upload', {
        params: {
          username: this.username,
          date: this.fish_date,
          type: this.fish_type,
          number: this.fish_number,
          lenmin: this.fish_lenmin,
          lenmax: this.fish_lenmax,
          weight: this.fish_weight
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.status === 200) {
          alert('上传成功，如果出现异常数据，系统会向您自动发送通知，请留意系统发送的通知。')
        } else if (res.data.status === 202) {
          alert('数据不完整，请重新输入')
        }
      }).catch(err => {
        console.log(err)
      })
    },

    SubmitAqua () {
      axios.post('http://localhost:3000/data/aqua_upload', {
        params: {
          province: this.aqua_province,
          drain: this.aqua_drain,
          section: this.aqua_section,
          time: this.aqua_time,
          type: this.aqua_type,
          temp: this.aqua_temp,
          pH: this.aqua_pH,
          oxygen: this.aqua_oxygen,
          cond: this.aqua_cond,
          tur: this.aqua_tur,
          kmno: this.aqua_kmno,
          nh3: this.aqua_nh3,
          k: this.aqua_k,
          n: this.aqua_n,
          chl: this.aqua_chl,
          algae: this.aqua_algae,
          situation: this.aqua_situation
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.status === 200) {
          alert('上传成功，如果出现异常数据，系统会向您自动发送通知，请留意系统发送的通知。')
        } else if (res.data.status === 202) {
          alert('数据不完整，请重新输入')
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
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  border-radius: 10px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.btndiv {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #38a170;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 15px;
  color: #666;
}

input {
  display: block;
  width: calc(100% - 20px);
  margin: 10px auto;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input::placeholder {
  color: #bbb;
}
</style>
