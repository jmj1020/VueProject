<style scoped>
.chart {
  width: 100%;
  height: 220px;
}
</style>

<template>
  <div class="vueContanier">
    <div class="title">
      <span style="font-size: 16px;">实时数据</span>
      <span style="font-size: 16px;float:right;">当前时间：{{currentTime}}</span>
      <em>&#9670;</em>
      <span class="tra">&#9670;</span>
    </div>
    <Row>
      <!--xs<768px; sm≥768px; md≥992px; lg≥1200px -->
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart1"></div>
      </Col>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart2"></div>
      </Col>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart3"></div>
      </Col>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart4"></div>
      </Col>
    </Row>
    <Row>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart5"></div>
      </Col>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart6"></div>
      </Col>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart7"></div>
      </Col>
      <Col :xs="24" :sm="8" :md="6" :lg="6">
      <div class="chart" id="chart8"></div>
      </Col>
    </Row>
  </div>
</template>

<script>
const echarts = require('echarts');
import util from '../../utils/utils.js'

export default {
  data() {
    return {
      typeItem: [],
      currentTime: util.getDateStr('hour', 0),
      mychart: {
        mychart1: null,
        mychart2: null,
        mychart3: null,
        mychart4: null,
        mychart5: null,
        mychart6: null,
        mychart7: null,
        mychart8: null
      }
    }
  },
  methods: {
    // 获取本地监测类型
    getType() {
      this.$http.get('/static/json/map.json').then(response => {
        let items = response.data.typeMap;
        this.$set(this, 'typeItem', items);
      }).catch((response) => {
        console.error(response);
      });
    },

    // 初始化图表
    initChart() {
      this.mychart.mychart1 = echarts.init(document.getElementById('chart1'))
      this.mychart.mychart2 = echarts.init(document.getElementById('chart2'))
      this.mychart.mychart3 = echarts.init(document.getElementById('chart3'))
      this.mychart.mychart4 = echarts.init(document.getElementById('chart4'))
      this.mychart.mychart5 = echarts.init(document.getElementById('chart5'))
      this.mychart.mychart6 = echarts.init(document.getElementById('chart6'))
      this.mychart.mychart7 = echarts.init(document.getElementById('chart7'))
      this.mychart.mychart8 = echarts.init(document.getElementById('chart8'))
    },

    // 获取图表数据
    getData(id) {
      this.$http.get('/api/recent/' + id).then(response => {
        let item = response.data.data;
        this.setChart(item);
      }).catch((response) => {
        console.error(response);
      });
    },

    // 设置图表
    setChart(data) {
      this.mychart.mychart1.setOption(this.getOption('airTemperature', data.airTemperature), true)
      this.mychart.mychart2.setOption(this.getOption('airHumidity', data.airHumidity), true)
      this.mychart.mychart3.setOption(this.getOption('soilTemperature', data.soilTemperature), true)
      this.mychart.mychart4.setOption(this.getOption('soilHumidity', data.soilHumidity), true)
      this.mychart.mychart5.setOption(this.getOption('illumination', data.illumination), true)
      this.mychart.mychart6.setOption(this.getOption('rainfall', data.rainfall), true)
      this.mychart.mychart7.setOption(this.getOption('windSpeed', data.windSpeed), true)
      this.mychart.mychart8.setOption(this.getOption('windDirection', data.windDirection), true)
    },

    // 获取图表配置
    getOption(type, value) {
      let chartData = [];
      for (let i = 0; i < this.typeItem.length; i++) {
        if (type == this.typeItem[i].ename) {
          chartData = [
            {
              value: value,
              name: this.typeItem[i].cname,
              logo: this.typeItem[i].icno
            }
          ];
          break;
        }
      }
      let defaultOption = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            min: parseInt(parseInt(chartData[0].value * 1) - parseInt(Math.random() * 50)),
            max: parseInt(parseInt(chartData[0].value * 1) + parseInt(Math.random() * 50)),
            splitNumber: 5,
            name: "实时数据",
            type: 'gauge',
            title: {
              show: true,
              offsetCenter: [0, '80%'],
              textStyle: {
                color: '#333',
                fontSize: 14
              }
            },
            detail: {
              show: true,
              backgroundColor: 'rgba(0,0,0,0)',
              borderWidth: 0,
              borderColor: '#ccc',
              width: 100,
              height: 40,
              offsetCenter: [0, '30%'],
              textStyle: {
                color: 'auto',
                fontSize: 14
              },
              formatter: '{value}' + chartData[0].logo
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [0.2, '#228b22'],
                  [0.8, '#48b'],
                  [1, '#ff4500']
                ],
                width: 10
              },
              textStyle: {
                fontSize: 12
              }
            },
            splitLine: {
              show: true,
              length: 10,
              lineStyle: {
                color: '#eee',
                width: 2,
                type: 'solid'
              },
              textStyle: {
                fontSize: 12
              }
            },
            pointer: {
              length: '80%',
              width: 2,
              color: 'auto'
            },
            data: chartData
          }
        ]
      };
      return defaultOption;
    }
  },
  mounted() {
    // 获取监测类型
    this.getType();

    // 初始化图表信息
    this.initChart();

    // 获取首个工厂id
    this.$root.eventHub.$on('treeClicked', (selectId) => {
      this.getData(selectId);
    });
  }
}
</script>