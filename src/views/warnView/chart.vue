<style scoped>
.chart {
  width: calc(100% - 30px);
  height: 200px;
  margin: 15px;
  overflow: hidden;
}
</style>

<template>
  <div class="vueContanier">
    <div class="title">
      <span style="font-size: 16px;">预警百分比</span>
      <em style="top:46px;">&#9670;</em>
      <span class="tra" style="top:44px;">&#9670;</span>
    </div>
    <Row>
      <!--xs<768px; sm≥768px; md≥992px; lg≥1200px -->
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart1"></div>
      </Col>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart2"></div>
      </Col>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart3"></div>
      </Col>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart4"></div>
      </Col>
    </Row>
    <Row>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart5"></div>
      </Col>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart6"></div>
      </Col>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart7"></div>
      </Col>
      <Col :xs="24" :sm="24" :md="6" :lg="6">
      <div class="chart" id="chart8"></div>
      </Col>
    </Row>
  </div>
</template>

<script>
var echarts = require('echarts');
export default {
  data() {
    return {
      typeItem: [],
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
    getData() {
      this.$http.get('/api/warn/num').then(response => {
        let items = response.data.data;
        this.setChart(items);
      }).catch((response) => {
        console.error(response);
      });
    },

    // 设置图表
    setChart(data) {
      this.mychart.mychart1.setOption(this.getOption('airTemperature', data), true)
      this.mychart.mychart2.setOption(this.getOption('airHumidity', data), true)
      this.mychart.mychart3.setOption(this.getOption('soilTemperature', data), true)
      this.mychart.mychart4.setOption(this.getOption('soilHumidity', data), true)
      this.mychart.mychart5.setOption(this.getOption('illumination', data), true)
      this.mychart.mychart6.setOption(this.getOption('rainfall', data), true)
      this.mychart.mychart7.setOption(this.getOption('windSpeed', data), true)
      this.mychart.mychart8.setOption(this.getOption('windDirection', data), true)
    },

    // 获取图表配置
    getOption(type, data) {
      let chartData = [];
      for (let i = 0; i < this.typeItem.length; i++) {
        if (type == this.typeItem[i].ename) {
          chartData = {
            title: this.typeItem[i].cname,
            data: [
              {
                value: data[type].abnormal,
                name: '异常值'
              },
              {
                value: data[type].normal,
                name: '正常值'
              },
              {
                value: data[type].offline,
                name: '离线值'
              }
            ]
          };
          break;
        }
      }

      let defaultOption = {
        title: {
          text: chartData.title,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: chartData.title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: chartData.data,
            color: ['#ff9900', '#19be6b', '#80848f'],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              },
              mphasis: {//强调样式（悬浮时样式
                label: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              }
            }
          }
        ]
      }
      return defaultOption;
    }
  },
  mounted() {
    // 初始化监测类型
    this.getType();

    // 初始化图表
    this.initChart();

    // 获取图表数据
    this.getData();
  }
}
</script>

