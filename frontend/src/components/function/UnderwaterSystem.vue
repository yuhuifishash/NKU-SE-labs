<template>
  <div id="underwater-system">
    <header>
      <h1>水下系统</h1>
    </header>
    <section class="mainbox">
      <!-- 鱼群数量 环境得分 历史数据 -->
      <div class="column">
        <div class="block">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-date-picker
                v-model="startDate"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchData(startDate, endDate)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="envir-score block">
          <h2>海洋牧场环境感知得分</h2>
          <div id="score-chart"></div>
        </div>
        <div class="history block">
          <h2>鱼群个体数量历史曲线</h2>
          <div id="history-chart"></div>
        </div>
      </div>
      <!-- 总信息 鱼群属性分布 -->
      <div class="column">
        <div class="total-data">
          <div class="total-data-show">
            <div class="total-data-show1">
              <div class="show1-up">
                <div class="data-block">
                  <p>鱼种</p>
                  <p>{{ fishSpeciesCount }}+</p>
                </div>
              </div>
              <div class="show1-down">
                <div class="show1-down1">
                  <div class="data-block">
                    <p>鱼苗</p>
                    <p>{{ fishFryCount }}尾</p>
                  </div>
                </div>
                <div class="show1-down2">
                  <div class="data-block">
                    <p>生长</p>
                    <p>{{ growingFishCount }}尾</p>
                  </div>
                </div>
              </div>
            </div>
            <img class="total-data-show2" src="~@/assets/sea.jpeg">
            <img class="total-data-show3" src="~@/assets/fish.jpeg">
          </div>
          <div class="total-data-number">
            <div class="data-block">
              <p>已保障养殖鱼群</p>
              <p>{{ securedFishCount }}尾</p>
            </div>
          </div>
        </div>
        <div class="attr-distri block">
          <h2>鱼群属性分布曲线</h2>
          <div class="attr-distri-up">
            <div class="attr-distri-chart">
              <div id="attr-distri-chart"></div>
            </div>
            <!-- <div class="attr-distri-chose">
              <ul class="guidebar">
                <li>鱼重量</li>
                <li>鱼尺寸</li>
                <li>鱼生命</li>
              </ul>
            </div> -->
          </div>
          <!-- <div class="attr-distri-down">
            <ul class="guidebar2">
              <li>鱼类A</li>
              <li>鱼类B</li>
              <li>鱼类C</li>
              <li>鱼类D</li>
              <li>鱼类E</li>
              <li>鱼类F</li>
            </ul>
          </div> -->
        </div>
      </div>
      <!-- 网箱信息 水底传感器 鱼群种类占比 -->
      <div class="column">
        <div class="net-data block">
          <div class="total-data-show2" id="total-data-show2"></div>
        </div>
        <div class="sensor block">
          <div class="total-data-show3">
            <div>
              <div class="data-block">
                <p>鱼种</p>
                <p>{{ fishSpeciesCount }}+</p>
              </div>
            </div>
            <div>
              <div class="show3-down1">
                <div class="data-block">
                  <p>鱼苗</p>
                  <p>{{ fishFryCount }}尾</p>
                </div>
              </div>
              <div>
                <div class="data-block">
                  <p>生长</p>
                  <p>{{ growingFishCount }}尾</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="type block">
          <h2>鱼群种类占比</h2>
          <div id="type-chart"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'UnderwaterSystem',
  data () {
    return {
      fishTotal: this.getRandomInt(1000, 2000),
      fishAddedToday: this.getRandomInt(0, 100),
      fishDiedToday: this.getRandomInt(0, 100),
      fishSpeciesCount: this.getRandomInt(30, 60),
      fishFryCount: this.getRandomInt(300, 700),
      growingFishCount: this.getRandomInt(500, 1000),
      securedFishCount: this.getRandomInt(30000, 40000),
      netLength: this.getRandomInt(50, 150),
      netWidth: this.getRandomInt(50, 150),
      netDepth: this.getRandomInt(50, 150),
      netLongitude: this.getRandomInt(50, 150),
      netLatitude: this.getRandomInt(50, 150),
      sensorRuntime: this.getRandomInt(50, 150),
      sensorNextCheck: this.getRandomInt(10, 50),
      sensorWarrantyExpired: this.getRandomInt(0, 365),
      fishcntResults: [],
      startDate: '',
      endDate: ''
    }
  },
  methods: {
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min // 含min，含max
    },
    async searchData (startDateI, endDateI) {
      console.log(startDateI, endDateI)

      this.fishTotal = this.getRandomInt(1000, 2000)
      this.fishAddedToday = this.getRandomInt(0, 100)
      this.fishDiedToday = this.getRandomInt(0, 100)
      this.fishSpeciesCount = this.getRandomInt(30, 60)
      this.fishFryCount = this.getRandomInt(300, 700)
      this.growingFishCount = this.getRandomInt(500, 1000)
      this.securedFishCount = this.getRandomInt(30000, 40000)
      this.netLength = this.getRandomInt(50, 150)
      this.netWidth = this.getRandomInt(50, 150)
      this.netDepth = this.getRandomInt(50, 150)
      this.netLongitude = this.getRandomInt(50, 150)
      this.netLatitude = this.getRandomInt(50, 150)
      this.sensorRuntime = this.getRandomInt(50, 150)
      this.sensorNextCheck = this.getRandomInt(10, 50)
      this.sensorWarrantyExpired = this.getRandomInt(0, 365)

      this.loadChart('score-chart', {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '75%'],
            radius: '90%',
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 4,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 10,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 1
              }
            },
            splitLine: {
              length: 10,
              lineStyle: {
                color: 'auto',
                width: 3
              }
            },
            axisLabel: {
              color: '#fff',
              fontSize: 12,
              distance: -40,
              rotate: 'tangential',
              formatter: function (value) {
                if (value === 0.875) {
                  return '舒适'
                } else if (value === 0.625) {
                  return '正常'
                } else if (value === 0.375) {
                  return '隐患'
                } else if (value === 0.125) {
                  return '危险'
                }
                return ''
              }
            },
            title: {
              offsetCenter: [0, '-10%'],
              fontSize: 20
            },
            detail: {
              fontSize: 20,
              offsetCenter: [0, '-15%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + ''
              },
              color: 'inherit'
            },
            data: [
              {
                value: Math.random()
              }
            ]
          }
        ]
      })

      this.loadChart('history-chart', {
        grid: {
          left: '0%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.generateRandomData(7, 800, 1400),
            type: 'line',
            smooth: true
          }
        ]
      })

      this.loadChart('total-data-show2', {
        series: [
          {
            type: 'gauge',
            max: 100000000,
            splitNumber: 6,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -0,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -0,
              length: 10,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 10,
              fontSize: 0
            },
            detail: {
              valueAnimation: true,
              fontSize: 20,
              offsetCenter: [0, '65%'],
              formatter: '{value}',
              color: 'inherit'
            },
            data: [
              {
                value: this.getRandomInt(5000000, 15000000)
              }
            ]
          }
        ]
      })

      this.loadChart('attr-distri-chart', {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.generateRandomData(7, 800, 1400),
            type: 'bar',
            smooth: true
          }
        ]
      })

      this.loadChart('type-chart', {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c}'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 10,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { value: this.getRandomInt(500, 1500), name: '鲤鱼' },
              { value: this.getRandomInt(500, 1500), name: '鲫鱼' },
              { value: this.getRandomInt(500, 1500), name: '巴沙鱼' },
              { value: this.getRandomInt(500, 1500), name: '草鱼' },
              { value: this.getRandomInt(500, 1500), name: '其他' }
            ]
          }
        ]
      })

      try {
        const response = await axios.post('http://localhost:3000/fishcountdata_get', {
          startDate: startDateI,
          endDate: endDateI
        })
        console.log('查询成功')
        console.log('查询响应:', response.data)
        this.fishcntResults = response.data
      } catch (error) {
        console.log('Error fetching data:', error)
        alert('查询出错，请查看控制台了解详情')
      }
    },
    loadChart (id, option) {
      const chart = echarts.init(document.getElementById(id))
      chart.setOption(option)
    },
    generateRandomData (length, min, max) {
      return Array.from({ length }, () => this.getRandomInt(min, max))
    }
  },
  mounted () {
    this.searchData(new Date(2020, 1, 1), new Date(2020, 3, 1))

    this.loadChart('score-chart', {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 4,
              color: [
                [0.25, '#FF6E76'],
                [0.5, '#FDDD60'],
                [0.75, '#58D9F9'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 10,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 1
            }
          },
          splitLine: {
            length: 10,
            lineStyle: {
              color: 'auto',
              width: 3
            }
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
            distance: -40,
            rotate: 'tangential',
            formatter: function (value) {
              if (value === 0.875) {
                return '舒适'
              } else if (value === 0.625) {
                return '正常'
              } else if (value === 0.375) {
                return '隐患'
              } else if (value === 0.125) {
                return '危险'
              }
              return ''
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 20
          },
          detail: {
            fontSize: 20,
            offsetCenter: [0, '-15%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 100) + ''
            },
            color: 'inherit'
          },
          data: [
            {
              value: Math.random()
            }
          ]
        }
      ]
    })

    this.loadChart('history-chart', {
      grid: {
        left: '0%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.generateRandomData(7, 800, 1400),
          type: 'line',
          smooth: true
        }
      ]
    })

    this.loadChart('total-data-show2', {
      series: [
        {
          type: 'gauge',
          max: 100000000,
          splitNumber: 6,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -0,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -0,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'inherit',
            distance: 10,
            fontSize: 0
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '65%'],
            formatter: '{value}',
            color: 'inherit'
          },
          data: [
            {
              value: this.getRandomInt(5000000, 15000000)
            }
          ]
        }
      ]
    })

    this.loadChart('attr-distri-chart', {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.generateRandomData(7, 800, 1400),
          type: 'bar',
          smooth: true
        }
      ]
    })

    this.loadChart('type-chart', {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 10,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: this.getRandomInt(500, 1500), name: '鲤鱼' },
            { value: this.getRandomInt(500, 1500), name: '鲫鱼' },
            { value: this.getRandomInt(500, 1500), name: '巴沙鱼' },
            { value: this.getRandomInt(500, 1500), name: '草鱼' },
            { value: this.getRandomInt(500, 1500), name: '其他' }
          ]
        }
      ]
    })

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
  #underwater-system {
    /* background: url(~@/assets/bg.jpg) no-repeat top center; */
    background-image: url('~@/assets/visual/bg2.png'); /* 设置背景图片 */
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
  .data-block {
    border: 2px solid rgba(12, 58, 224, 0.652);
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
    flex: 3;
    height: 95%;
  }
  .mainbox .column:nth-child(2) {
    flex: 9;
  }
  .envir-score {
    height: 40%;
  }
  .history {
    height: 39%;
  }
  .date-inputs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  .date-inputs label {
    margin-right: 5px;
  }
  .date-inputs input {
    margin-right: 10px;
  }

  .total-data {
    height: 50%;
  }
  .total-data-show {
    display: flex;
    height: 80%;
  }
  .total-data-show div {
    flex: 3;
  }
  .total-data-show1 {
    padding-left: 20px; /* 左侧 padding */
    padding-right: 20px; /* 右侧 padding */
  }
  .total-data-show3 {
    padding-left: 20px; /* 左侧 padding */
    padding-right: 20px; /* 右侧 padding */
  }

  .show1-up {
    height: 50%;
    width: 100%;
    padding: 80px;
  }
  .show1-down {
    height: 50%;
    width: 100%;
    display: flex;
  }
  .show1-down1 {
    flex: 3;
    margin: 5px;
  }
  .show1-down2 {
    flex: 3;
    margin: 5px;
  }

  .show3-up {
    height: 50%;
    width: 100%;
    padding: 80px;
  }
  .show3-down {
    height: 50%;
    width: 100%;
    display: flex;
  }
  .show3-down1 {
    flex: 3;
    margin: 5px;
  }
  .show3-down2 {
    flex: 3;
    margin: 5px;
  }
  .total-data-number {
    padding-left: 40px; /* 左侧 padding */
    padding-right: 40px; /* 右侧 padding */
  }

  .attr-distri {
    height: 51%;
  }
  .attr-distri-up {
    display: flex;
    height: 80%;
  }
  .attr-distri-chart {
    flex: 10;
  }
  .attr-distri-chose {
    flex: 1;
  }
  ul.guidebar{
    list-style-type:none;
    margin:0;
    padding:0;
    width: 100%;
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
      margin-top: 5px;
  }
  ul.guidebar>li:hover {
    background-color: #a4cdff;
  }
  ul.guidebar2{
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex; /* 使用 Flexbox 布局 */
    justify-content: center; /* 子元素水平居中 */
  }
  ul.guidebar2>li {
      float: left;
      display: block;
      text-align: center;
      padding: 4px 16px;
      text-decoration: none;
      font-size:small;
      border-radius: 10px;
      height: 30px;
  }
  ul.guidebar2>li:hover {
    background-color: #a4cdff;
  }

  .net-data {
    height: 29%;
  }
  .sensor {
    height: 29%;
  }
  .type {
    height: 40%;
  }

  #score-chart {
    height: 80%;
    width: 100%;
  }

  #history-chart {
    height: 80%;
    width: 100%;
  }
  #total-data-show2 {
    height: 100%;
    width: 100%;
  }
  #attr-distri-chart {
    height: 100%;
    width: 100%;
  }
  #type-chart {
    height: 100%;
    width: 100%;
  }

  .fish-num {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .demo-form-inline .el-form-item {
    margin-right: 10px;
  }
</style>
