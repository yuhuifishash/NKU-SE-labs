<template>
  <div id="main-data">
    <header>
      <h1>主要信息</h1>
    </header>
    <section class="mainbox">
      <!-- 监控视频 -->
      <div class="column block">
        <h2>监控视频</h2>
        <div class="video">
          <ul class="guidebar">
            <li><button class="round-button">&lt;</button></li>
            <li>视频1</li>
            <li>视频2</li>
            <li>视频3</li>
            <li>视频4</li>
            <li><button class="round-button">&gt;</button></li>
          </ul>
          <p>这里有一个视频！</p>
          <video width="100%" controls>
          <source src="../../../../maindata_show.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        </div>
        <div class="addfunc">
          <div class="addfuncEle">
            <span>摄像机&nbsp;</span>
            <input type="checkbox" class="checke">
            <br>
            <br>
            <img src="~@/assets/摄像机.jpg" alt="">
          </div>
          <div class="addfuncEle">
            <span>灯光&nbsp;&nbsp;</span>
            <input type="checkbox" class="checke">
            <br>
            <br>
            <img src="~@/assets/灯光.jpg" alt="">
          </div>
          <div class="addfuncEle">
            <span>清洁刷&nbsp;</span>
            <input type="checkbox" class="checke">
            <br>
            <br>
            <img src="~@/assets/清洁刷.jpg" alt="">
          </div>
          <div class="addfuncEle">
            <span>视频回放</span>
            <br>
            <br>
            <img src="~@/assets/视频回放.jpg" alt="">
          </div>
          <div class="addfuncEle">
            <span>视频同时播放</span>
            <br>
            <br>
            <img src="~@/assets/视频同时播放.jpg" alt="">
          </div>
          <div class="addfuncEle">
            <span>云台摄像机</span>
            <br>
            <br>
            <img src="~@/assets/云台摄像机.jpg" alt="">
          </div>
        </div>

      </div>

      <div class="column">
        <!-- <div class="row1 block">
          <h2>水文气象</h2>
          <div id="vol-chart"></div>
          <div id="salt-chart"></div>
          <div id="oxy-chart"></div>
          <div id="turb-chart"></div>
          <div id="ph-chart"></div>
          <div id="temp-chart"></div>
        </div>
        <div class="row2 block">
          <h2>定位</h2>
          <img src="../../../../maindata_location.png" alt="定位图" style="width: 100%; height: auto;">
        </div> -->

        <div class="form-container">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="startDate"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-if="results.length" class="highlighted-results">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>查询结果</span>
            </div>
            <el-table :data="results">
              <el-table-column prop="common_name" label="鱼种"></el-table-column>
              <el-table-column prop="count" label="数量"></el-table-column>
              <el-table-column prop="len_min" label="最小长度"></el-table-column>
              <el-table-column prop="len_max" label="最大长度"></el-table-column>
            </el-table>
          </el-card>
        </div>

      </div>
      <!-- 历史记录 设备状态 -->
      <div class="column">
        <div class="history block">
          <h2>历史记录</h2>
          <!-- <p>统计时间：
            <input type="date" name="date" id="date" value="" />
            <input type="time" name="date" id="time" value="" />
            至
            <input type="date" name="date" id="date" value="" />
            <input type="time" name="date" id="time" value="" />
            <button>查询</button>
          </p> -->
          <br>
          <ul class="guidebar">
            <li class="timescale">过去一天</li>
            <li class="timescale">过去一周</li>
            <li class="timescale">过去一月</li>
            <li class="timescale">过去一年</li>
            <li>
              <select id="mySelect">
                <option value="option1">电池电压</option>
                <option value="option1">盐度</option>
                <option value="option3">溶解度</option>
                <option value="option2">浊度</option>
                <option value="option2">ph</option>
                <option value="option2">水温</option>
              </select>
            </li>
          </ul>
          <div id="history-chart"></div>
        </div>
        <div class="dev-state block">
          <h2>设备状态</h2>
          <ul class="guidebar">
            <li class="timescale">主控</li>
            <li class="timescale">时间校准</li>
            <li class="timescale">通道</li>
            <li class="timescale">告警</li>
          </ul>
          <ul class="state">
            <li>设备ID：<span>8D19C331</span></li>
            <li>主控状态
              <ul>
                <li>版本：<span>V0.1.1</span></li>
                <li>温度：<span>39.64℃</span></li>
              </ul>
            </li>
            <li>次控状态
              <ul>
                <li>连接：<span>断开</span></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'MainData',
  data () {
    return {
      startDate: '', // 绑定输入框的数据
      endDate: '', // 绑定输入框的数据
      results: [], // 存储查询结果的数组
      Evaporation: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      Precipitation: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      Temperature: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  },
  methods: {
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min // 含min，含max
    },
    generateRandomValues () {
      this.Evaporation = this.Evaporation.map(() => this.getRandomInt(10, 200))
      this.Precipitation = this.Precipitation.map(() => this.getRandomInt(20, 150))
      this.Temperature = this.Temperature.map(() => this.getRandomInt(0, 20))
    },

    async searchData () {
      try {
        this.generateRandomValues()
        const response = await axios.post('http://localhost:3000/fishdata_get', {
          startDate: this.startDate,
          endDate: this.endDate
        })
        console.log('查询成功')
        console.log('查询响应:', response.data)
        this.results = response.data
      } catch (error) {
        console.log('reaching here')
        console.error('Error fetching data:', error)
        alert('查询出错，请查看控制台了解详情。')
      }
      this.updateCharts()
    },
    updateCharts () {
    // 更新图表配置项和数据
      const historyChart = echarts.getInstanceByDom(document.getElementById('history-chart'))
      historyChart.setOption({
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: this.Evaporation
          },
          {
            name: 'Precipitation',
            type: 'bar',
            data: this.Precipitation
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 1,
            data: this.Temperature
          }
        ]
      })
    }

  },
  // 组件的其他代码...
  mounted () {
    this.generateRandomValues()
    var historyChart = echarts.init(document.getElementById('history-chart'))

    // 指定图表的配置项和数据
    var optionHistoryChart = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '0%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['Evaporation', 'Precipitation', 'Temperature']
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Precipitation',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value} ml'
          }
        },
        {
          type: 'value',
          name: 'Temperature',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value} °C'
          }
        }
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ml'
            }
          },
          data: this.Evaporation
        },
        {
          name: 'Precipitation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ml'
            }
          },
          data: this.Precipitation
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' °C'
            }
          },
          data: this.Temperature
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    // volChart.setOption(optionVolChart)
    // saltChart.setOption(optionSaltChart)
    // oxyChart.setOption(optionOxyChart)
    // turbChart.setOption(optionTurbChart)
    // phChart.setOption(optionPhChart)
    // tempChart.setOption(optionTempChart)
    historyChart.setOption(optionHistoryChart)

    this.loadExternalScript('js/flexible.js')
  }
}
</script>

<style scoped>
  /* 组件样式 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #main-data {
    /* background: url(~@/assets/bg.jpg) no-repeat top center; */
    background-image: url('~@/assets/visual/bg1.png'); /* 设置背景图片 */
    background-size: cover; /* 让背景图片铺满整个容器 */
    background-repeat: no-repeat; /* 不重复显示背景图片 */
    height: 100vh;
  }
  header {
    position: relative;
    height: 3.25rem;
    background: url(~@/assets/head_bg.png) no-repeat;
    background-size: 100% 100%;
  }
  header h1 {
    font-size: 1.25rem;
    color: white;
    text-align: center;
    line-height: 3.25rem;
  }

  .block {
    margin: 0.60rem;
    border: 3px solid rgba(12, 58, 224, 0.652);
    border-radius: 10px;
  }
  h2 {
    border-bottom: 3px solid rgba(12, 58, 224, 0.652);
    text-align: center;
    font-size: 20px;
    margin: 0;
  }

  .mainbox {
    display: flex;
    min-width: 1024px;
    max-width: 1920px;
    margin: 0 auto;
    padding: .125rem .125rem 0;
    height: 95%;
    color: white;
  }
  .mainbox .column {
    flex: 9;
    height: 95%;
  }
  .mainbox .column .video {
    height: 60%;
  }
  .mainbox .column .addfunc {
    height: 35%;
  }
  ul.guidebar{
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex; /* 使用 Flexbox 布局 */
    justify-content: center; /* 子元素水平居中 */
  }
  ul.guidebar>li {
      float: left;
      display: block;
      text-align: center;
      padding: 4px 16px;
      text-decoration: none;
      font-size:small;
      border-radius: 10px;
      height: 30px;
  }
  ul.guidebar>li:hover {
    background-color: #a4cdff;
  }
  .round-button {
    width: 20px; /* 设置按钮的宽度 */
    height: 20px; /* 设置按钮的高度 */
    border-radius: 50%; /* 设置圆形按钮的圆角半径为按钮宽度/2 */
    background-color: #007bff; /* 设置按钮的背景颜色 */
    color: white; /* 设置按钮的文本颜色 */
    border: none; /* 移除按钮的边框 */
    cursor: pointer; /* 设置鼠标悬停时的光标形状为手型 */
    font-size: 12px; /* 设置按钮的字体大小 */
  }
  /* 当鼠标悬停在按钮上时改变背景颜色 */
  .round-button:hover {
    background-color: #0056b3;
  }

  .checke{
    position: relative;
    bottom: 0;
    -webkit-appearance: none;
    width:40px;
    height:20px;
    line-height: 44px;
    background: #eeeeee98;
    border-radius: 30px;
    outline: none;
    margin: 0;
  }

  .checke:before{
    position: absolute;
    left: 0;
    content: '';
    width: 50%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
    box-shadow: 0px 0px 5px #ddd;
  }
  .checke:checked{
    background: rgb(5, 207, 5);
  }
  .checke:checked:before{
    left:50%;
  }
  .addfuncEle {
    border-radius: 10px;
    background-color: #234EB6;
    color: white;
    font-size: 15px;
    margin: 5px;
    height: 90%;
    padding: 1.775rem;
  }
  .addfunc {
    display: grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 33% 33% 33%;
    grid-gap: 0; /* 元素之间的间距为零 */
    justify-content: start; /* 元素从左上角开始布局 */
    align-content: start; /* 元素从左上角开始布局 */
  }

  .mainbox .column .row1 {
    height: 45%;
  }
  .mainbox .column .row2 {
    height: 53%;
  }
  .mainbox .column .history {
    height: 58%
  }
  .mainbox .column .dev-state {
    height: 40%
  }

  .row2 {
  position: relative; /* 根据需要调整位置 */
  width: 100%; /* 或根据具体布局调整宽度 */
  height: auto; /* 高度设置为自动，根据图片调整 */
}

.row2 img {
  width: 100%; /* 图片宽度全宽 */
  height: auto; /* 图片高度自适应 */
}

  #vol-chart {
    width: 100%;
    height: 15%;
    padding: 0;
    margin: 0;
  }
  #salt-chart {
    width: 100%;
    height: 15%;
  }
  #oxy-chart {
    width: 100%;
    height: 15%;
  }
  #turb-chart {
    width: 100%;
    height: 15%;
  }
  #ph-chart {
    width: 100%;
    height: 15%;
  }
  #temp-chart {
    width: 100%;
    height: 15%;
  }
  #history-chart {
    width: 100%;
    height: 70%;
  }
  ul.state {
    text-align: left;
    list-style-type: none;
    padding-left: 20px; /* 调整父级列表的左侧内边距 */
  }

  ul.state > li {
    margin-bottom: 10px; /* 调整每个列表项之间的间距 */
  }

  ul.state ul {
    padding-left: 20px; /* 调整子级列表的左侧内边距 */
  }

.highlighted-results {
  max-height: 600px;
  overflow-y: auto;
  background-color: #001529;
  border: 2px solid #1890ff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: #fff;
  padding: 20px;
}

.form-container {
  margin-bottom: 50px;
  background-color: #001529;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-container input,
.form-container button {
  margin: 5px 0; /* 添加上下边距 */
  display: block; /* 使元素独占一行 */
  width: 100%; /* 使输入框和按钮宽度适应容器 */
}

.form-container input {
  padding: 5px; /* 增加内边距 */
  border-radius: 5px; /* 圆角边框 */
  border: 1px solid #1890ff; /* 蓝色边框 */
  background-color: #f0f0f0; /* 浅灰色背景 */
}

.form-container button {
  padding: 5px; /* 增加内边距 */
  border-radius: 5px; /* 圆角边框 */
  border: none; /* 移除边框 */
  background-color: #1890ff; /* 蓝色背景 */
  color: #fff; /* 白色文字 */
  cursor: pointer; /* 鼠标指针 */
}

</style>
