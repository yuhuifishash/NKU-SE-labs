<template>
  <div id="data-center">
    <header>
      <h1>水质数据</h1>
    </header>
    <section class="mainbox">
      <!--地图能点-->
      <div class="column block-margin">
        <div v-if="state==0" style="width: 100%; height: 100%;margin:0 auto" key="chinamap">
          <div id="cnmap" class="block-border" style="width: 100%; height: 100%;margin:0 auto">
            <div style="vertical-align: center;">
              加载中：{{load.toFixed(4)}}%
            </div>
          </div>
        </div>
        <div v-else-if="state==1" style="display:flex; width: 100%; height: 100%;margin:0 auto" key="riverselect">
          <div style="height: 100%; flex: 20">
            <div style="height: 4%;">
              选择河流
            </div>
            <div style="height: 92%; overflow-y: scroll; transition: opacity 0.5s ease-in-out">
              <div v-for="(rivername, index) in riverlist" :key="index">
                <button @click="selectRiver(rivername)" class="border-button" style="width: 100%">{{rivername}}</button>
              </div>
            </div>
            <div style="height: 4%">
              <button @click="returnMap()">返回地图</button>
            </div>
          </div>
          <div style="height: 100%; flex: 80;margin-right: 0;">
            <div style="height: 4%; width: 100%; display: flex;">
              <div style="height: 100%; flex:1">
                选择指标
              </div>
              <select v-model="selectedIndex" @change="updateChart" style="height: 100%; flex:1">
                <option v-for="(aqidx, index) in aquaIndexes" :key="index">
                  {{ aqidx.name }}
                </option>
              </select>
              <div style="height: 100%; flex:1">
                开始日期
              </div>
              <input type="date" v-model="startDate" @change="updateChart" value="1987-01-01" style="flex: 1;" />
              <div style="height: 100%; flex:1">
                结束日期
              </div>
              <input type="date" v-model="endDate" @change="updateChart" value="2022-01-01" style="flex: 1;"/>
            </div>
            <div style="height: 94.9%; width: 100%; margin-left: 10px; margin-top: 1%;">
              <div id="aquachart" class="block-border" style="width: 100%; height: 100%;margin:0 auto">
                <div style="vertical-align: center;">
                  <!-- 加载中：{{load.toFixed(4)}}% -->
                  选择河流来查看数据变化趋势!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 传感器信息 数据库交互设计 -->
      <div class="column block">
        <div class="row3" style="width: 100%; padding: 0px 10px;margin:0 auto">
          水质数据查询
          <!-- 开始 -->
          <el-container style="height: 90%; width: 100%">
            <el-header style="text-align: center; font-size: 12px">
              <el-input placeholder="输入省份名称进行查询" v-model="queryProvince" clearable style="width: 70%;">
              </el-input>
              <!-- <button @click="searchData">查询</button> -->
              <el-button icon="el-icon-search" circle @click="searchData" type="primary"></el-button>
            </el-header>

            <el-main style="width: 100%">
              <el-table :data="results" v-if="results.length" style="width: 100%;">
                <el-table-column prop="time" label="时间" width="100">
                </el-table-column>
                <el-table-column prop="province" label="省份">
                </el-table-column>
                <el-table-column prop="river_section" label="河流" onclick="alert(hello)">
                </el-table-column>
                <el-table-column prop="quality_type" label="水质">
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
          <!-- 结束 -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
import china from '@/assets/china.json'

export default {
  name: 'DataCenter',
  data () {
    return {
      queryProvince: '', // 用于绑定输入框的数据
      results: [], // 用于存储查询结果的数组
      mapshowdata: [],
      allresults: [],
      state: 0, // 0:Map, 1:ChooseRiver, 2:ShowGraph
      riverlist: [],
      rivername: '',
      aquachart: undefined,
      aquaIndexes: [
        {name: '温度', colName: 'temperature'},
        {name: 'pH', colName: 'pH'},
        {name: '溶解氧', colName: 'oxygen'},
        {name: '导电性', colName: 'conductivity'},
        {name: '浊度', colName: 'turbidity_ntu'},
        {name: '高锰酸盐指数', colName: 'permanganate_index'},
        {name: '氨氮', colName: 'ammonia_nitrogen'},
        {name: '总磷', colName: 'total_phosphate'},
        {name: '总氮', colName: 'total_nitrogen'},
        {name: '叶绿素a', colName: 'chl_a'},
        {name: '藻密度', colName: 'algae_density'},
        {name: '水质类别', colName: 'quality_type'}
      ],
      selectedIndex: '温度',
      startDate: '1987-01-01',
      endDate: '2022-01-01',
      load: 0
    }
  },
  methods: {
    setMap () {
      var option = {
        backgroundColor: '#0E2152', // 背景颜色
        title: {
          text: '中国水质数据'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            return params.name.concat('水质(众数):').concat(params.data.value[1])
          }
        },
        visualMap: {
          type: 'piecewise',
          categories: ['I', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', '劣Ⅴ'],
          dimension: 1,
          showlabel: true,
          text: ['I', '劣V'],
          realtime: false,
          calculable: true,
          hoverLink: true,
          inRange: {
            color: ['lightskyblue', 'green', 'yellow', 'orangered', 'red', 'purple']
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {
              readOnly: true,
              show: false,
              optionToContent: function (option) {
                console.log(option)
                var series = option.series
                var ret = '<table style="width:100%;text-align:center"><tbody><tr>' + '<td>时间</td>' + '<td>' + series[0].name + '</td>' + '</tr>'
                for (var i = 0; i < option.series[0].data.length; i++) {
                  ret = ret.concat(option.series[0].data[i].name).concat(option.series[0].data[i].value[1]).concat('\n')
                }
                ret += '</tbody></table>'
                console.log(ret)
                return ret
              }
            },
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '水质数据',
            type: 'map',
            map: 'china',
            roam: true,
            itemStyle: { // 地图区域的样式设置
              borderColor: '#5089EC',
              borderWidth: 1,
              areaColor: { // 地图区域的颜色
                type: 'radial', // 径向渐变
                x: 0.5, // 圆心
                y: 0.5, // 圆心
                r: 0.8, // 半径
                colorStops: [
                  { // 0% 处的颜色
                    offset: 0,
                    color: 'rgba(0, 102, 154, 0)'
                  },
                  { // 100% 处的颜色
                    offset: 1,
                    color: 'rgba(0, 102, 154, .4)'
                  }
                ]
              },
              // 鼠标放上去高亮的样式
              emphasis: {
                areaColor: '#2386AD',
                borderWidth: 0
              }
            },
            label: {
              show: true,
              normal: {// 通常状态下的样式
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              emphasis: {// 鼠标放上去高亮的样式
                textStyle: {
                  color: '#fff'
                }
              }
              // formatter: '{@[1]}'
            },
            data: this.mapshowdata
          }
        ]
      }
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      var charts = echarts.init(document.getElementById('cnmap'))
      echarts.registerMap('china', china)
      charts.setOption(option)
      charts.parent = this
      charts.on('click', async function (params) {
        // 选择河流
        this.parent.queryProvince = params.name
        await this.parent.searchData()
        this.parent.state = 1
        this.parent.riverlist = []
        for (var i = 0; i < this.parent.results.length; i++) {
          this.parent.riverlist.push(this.parent.results[i].river_section)
        }
        this.parent.riverlist = this.parent.riverlist.filter((item, index, arr) => arr.indexOf(item) === index)
        console.log(this.parent.riverlist)
      })
    },
    returnMap () {
      this.state = 0
      this.load = 0
      setTimeout(() => {
        this.setMap()
      }, 1000)
    },
    selectRiver (rivername) {
      this.rivername = rivername
      this.updateChart()
    },
    name2Index (name) {
      for (var i = 0; i < this.aquaIndexes.length; i++) {
        if (this.aquaIndexes[i].name === name) {
          return i
        }
      }
      return -1
    },
    updateChart () {
      var index = this.name2Index(this.selectedIndex)
      if (index === -1) {
        alert('请选择一个指标')
        return
      }
      if (this.startDate === '') {
        alert('请选择开始时间')
        return
      }
      if (this.endDate === '') {
        alert('请选择结束时间')
        return
      }
      if (this.rivername === '') {
        alert('请选择河流')
        return
      }
      var showdata = []
      for (var i = 0; i < this.results.length; i++) {
        if (this.results[i].river_section === this.rivername) {
          if (this.results[i].time >= this.startDate && this.results[i].time <= this.endDate) {
            let dataval = this.results[i][this.aquaIndexes[index].colName]
            if (this.aquaIndexes[index].colName === 'quality_type') {
              dataval = this.results[i].quality_type
              console.log(this.results[i].quality_type)
              console.log(dataval)
            }
            if (dataval === 'Ⅰ') {
              dataval = 6
            } else if (dataval === 'Ⅱ') {
              dataval = 5
            } else if (dataval === 'Ⅲ') {
              dataval = 4
            } else if (dataval === 'Ⅳ') {
              dataval = 3
            } else if (dataval === 'Ⅴ') {
              dataval = 2
            } else if (dataval === '劣Ⅴ') {
              dataval = 1
            }
            if ((!isNaN(dataval) && dataval !== '-' && !(dataval === null)) || (dataval === 'Ⅰ') || (dataval === 'Ⅱ') || (dataval === 'Ⅲ') || (dataval === 'Ⅳ') || (dataval === 'Ⅴ') || (dataval === '劣Ⅴ')) {
              showdata.push({time: this.results[i].time, data: dataval})
            }
          }
        }
      }
      console.log(showdata)
      this.aquachart = echarts.init(document.getElementById('aquachart'))
      if (showdata.length === 0) {
        alert('没有数据')
        this.aquachart.clear()
        return
      }
      var option = {
        title: {
          text: '水质数据变化图',
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br/>{a0}:{c0}'
        },
        grid: {
          left: '5%',
          right: '15%',
          bottom: '10%'
        },
        xAxis: {
          data: showdata.map(function (item) {
            return item.time
          })
        },
        yAxis: {
          type: 'value',
          min: null,
          max: null,
          axisLabel: {
            formatter: function (value) {
              return value
            }
          },
          axisPointer: {
            label: {
              formatter: function (value) {
                return value
              }
            }
          }
        },
        toolbox: {
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: {
          name: this.selectedIndex,
          type: 'line',
          data: showdata.map(function (item) {
            return item.data
          })
        },
        visualMap: {
          show: false,
          type: 'continuous'
        }
      }
      if (this.aquaIndexes[index].colName === 'quality_type') {
        option.yAxis = {
          // type: 'category',
          // data: [{value: '劣Ⅴ'}, {value: 'Ⅴ'}, {value: 'Ⅳ'}, {value: 'Ⅲ'}, {value: 'Ⅱ'}, {value: 'Ⅰ'}]
          // data: [1, 2, 3, 4, 5, 6],
          min: 1,
          max: 6,
          axisLabel: {
            formatter: function (value) {
              if (value === 1) {
                return '劣Ⅴ'
              } else if (value === 2) {
                return 'Ⅴ'
              } else if (value === 3) {
                return 'Ⅳ'
              } else if (value === 4) {
                return 'Ⅲ'
              } else if (value === 5) {
                return 'Ⅱ'
              } else if (value === 6) {
                return 'Ⅰ'
              }
            }
          }
        }
        option.tooltip = {
          formatter: function (params) {
            var value = params[0].value
            var ret = params[0].axisValue + '<br/>水质:'
            if (value === 1) {
              return ret + '劣Ⅴ'
            } else if (value === 2) {
              return ret + 'Ⅴ'
            } else if (value === 3) {
              return ret + 'Ⅳ'
            } else if (value === 4) {
              return ret + 'Ⅲ'
            } else if (value === 5) {
              return ret + 'Ⅱ'
            } else if (value === 6) {
              return ret + 'Ⅰ'
            }
          }
        }
      }
      this.aquachart.setOption(option)
    },
    async searchData () {
      try {
        const response = await axios.post('http://localhost:3000/aquadata_get', {
          province: this.queryProvince
        })
        this.results = response.data.sort(function (data1, data2) {
          return data1.time < data2.time
        })
        console.log('查询成功')
        console.log('查询响应:', response.data)
      } catch (error) {
        console.log('reaching here')
        console.error('Error fetching data:', error)
        alert('查询出错，请查看控制台了解详情。')
      }
    },
    async GetProvinceCnt () {
      try {
        this.mapshowdata = []
        for (var p = 0; p < china.features.length; p++) {
          var item = china.features[p]
          const response = await axios.post('http://localhost:3000/aquadata_get', {
            province: item.properties.name
          })
          var cnt = [0, 0, 0, 0, 0, 0]
          var typename = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', '劣Ⅴ']
          this.allresults.push({name: item.properties.name, data: response.data})
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].quality_type === 'Ⅰ') {
              cnt[0]++
            } else if (response.data[i].quality_type === 'Ⅱ') {
              cnt[1]++
            } else if (response.data[i].quality_type === 'Ⅲ') {
              cnt[2]++
            } else if (response.data[i].quality_type === 'Ⅳ') {
              cnt[3]++
            } else if (response.data[i].quality_type === 'Ⅴ') {
              cnt[4]++
            } else if (response.data[i].quality_type === '劣Ⅴ') {
              cnt[5]++
            }
          }
          var maxCnt = 0
          var maxType = 0
          for (i = 0; i < cnt.length; i++) {
            if (cnt[i] > maxCnt) {
              maxCnt = cnt[i]
              maxType = i
            }
          }
          if (maxCnt !== 0) {
            this.mapshowdata.push({name: item.properties.name, value: [maxType + 1, typename[maxType]]})
          } else {
            this.mapshowdata.push({name: item.properties.name, value: [0, '数据不足']})
          }
          this.load += 1 / china.features.length
        }
      } catch (error) {
        console.log('Error fetching data:', error)
        alert('查询出错，请查看控制台了解详情。')
      }
    }
  },
  // 组件的其他代码...
  async mounted () {
    this.state = 0
    this.load = 0
    setInterval(() => {
      if (this.load < 99) {
        this.load += 1 // 每次调用增加1
      }
    }, 10)
    await this.GetProvinceCnt()
    this.setMap()
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

#data-center {
  /* background: url(~@/assets/bg.jpg) no-repeat top center; */
  background-image: url('~@/assets/visual/bg3.png');
  /* 设置背景图片 */
  background-size: cover;
  /* 让背景图片铺满整个容器 */
  background-repeat: no-repeat;
  /* 不重复显示背景图片 */
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
  margin: 0.625rem;
  border: 3px solid rgba(12, 58, 224, 0.652);
}

.block-margin {
  margin: 0.625rem;
}

.block-border {
  border: 3px solid rgba(12, 58, 224, 0.652);
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
  flex: 8;
  height: 95%;
}

.total-data-b {
  display: flex;
  padding: 10px
}

.total-data-b1 {
  flex: 6;
  font-size: 40px;
  border: solid skyblue 2px;
  margin-left: 50px;
  margin-right: 50px;
}

.total-data-b2 {
  padding: 5px;
  flex: 2;
}

.total-data-b3 {
  padding: 5px;
  flex: 2;
}

.total-process-num {
  padding: 20px;
  font-size: 4rem;
}

.mainbox .column:nth-child(2) {
  flex: 4;
}

.mainbox .column .inline-row {
  display: flex;
  height: 55%;
}

.mainbox .column .inline-row:nth-child(2) {
  display: flex;
  height: 45%;
}

.mainbox .column .inline-row .inline-column {
  flex: 4;
}

.mainbox .column .inline-row .center-distri {
  flex: 5;
}

.mainbox .column .inline-row .inline-column .total-data {
  height: 25%;
}

.mainbox .column .inline-row .inline-column .hw-info {
  height: 69%;
}

.mainbox .column .inline-row .inline-column .hw-info .hw-info-row1 {
  display: flex;
  height: 50%;
}

.mainbox .column .inline-row .inline-column .hw-info div {
  flex: 3;
}

.mainbox .column .inline-row .inline-column .hw-info .hw-info-row2 {
  height: 45%;
}

.mainbox .column .inline-row .col1 {
  flex: 3;
}

.mainbox .column .inline-row .col2 {
  flex: 3;
}

.mainbox .column .inline-row .col3 {
  flex: 3;
}

.mainbox .column:nth-child(2) .row1 {
  height: 20%;
  display: flex;
}

.mainbox .column:nth-child(2) .row1 .trans-time {
  flex: 3;
}

.mainbox .column:nth-child(2) .row1 .proce-time {
  flex: 3;
}

.mainbox .column:nth-child(2) .row2 {
  height: 50%;
}

.mainbox .column:nth-child(2) .row3 {
  height: 100%;
}

#disk-chart {
  height: 80%;
  width: 100%;
}

#cpu-chart {
  height: 30%;
  width: 100%;
}

#mem-chart {
  height: 30%;
  width: 100%;
}

#gpu-chart {
  height: 30%;
  width: 100%;
}

.el-table .el-table__header,
.el-table .el-table__body {
  background-color: transparent;
}

.border-button {
  border: 2px solid #000;
  border-radius: 10px;
  padding: 5px 10px;
  /* background: linear-gradient(to right, #3498db, #055065); */
  background-color: #3498db;
  margin-bottom: 10px;
  color: #fff;
  transition: background-color 0.3s ease;
}

.border-button:hover {
  background-color: #e50906;
}

.border-button:focus {
  background-color: #e50906; /* 选中时的背景颜色 */
  color: white; /* 选中时的文本颜色 */
  outline: none; /* 去除默认的轮廓线 */
}
</style>
