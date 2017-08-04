<style scoped>
Button.selecBtn {
  background: #2d8cf0;
  color: #fff;
}

.chart {
  width: 100%;
  height: 350px;
}

.ul {
  border-bottom: 1px solid #dddee1;
  font-size: 0px;
  padding: 0px 100px;
  margin-top: 20px;
  display: table;
  width: 100%;
}

.ul li {
  display: table-cell;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.ul li:hover {
  color: #2d8cf0;
}

li.selectLi {
  color: #2d8cf0;
  border-bottom: 1px solid #2d8cf0;
}

.errorMsg {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.chartPart {
  padding: 0px 20px 20px 20px;
  min-height: 450px;
}

.datePicker {
  width: 200px;
  display: inline-block;
}

.tabSpan {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
}

.tabSpan:hover {
  border: 1px solid #2d8cf0;
}

.selectSpan {
  background: #2d8cf0;
  color: #fff;
}
</style>

<template>
  <div class="vueContanier">
    <div class="title">
      <span style="font-size: 16px;">曲线数据</span>
      <span style="font-size: 16px;float:right;">当前时间：{{currentTime}}</span>
      <em>&#9670;</em>
      <span class="tra">&#9670;</span>
    </div>
  
    <div class="chartPart">
      <Row>
        <Col :xs="{ span: 0}" :sm="{ span: 24}" :md="{ span: 24}" :lg="{ span: 16}" style="margin-top:20px;">
        <Date-picker :options="optionsStart" @on-change="startChange" type="datetime" v-model="changeParam.startTime" :value="changeParam.startTime" placeholder="选择开始时间" class="datePicker"></Date-picker>
        <span style="margin:0px 5px;">至</span>
        <Date-picker :options="optionsEnd" @on-change="endChange" type="datetime" v-model="changeParam.endTime" :value="changeParam.endTime" placeholder="选择结束时间" class="datePicker"></Date-picker>
        <Button @click="getData()">查询</Button>
        </Col>
        <Col :xs="{ span: 0}" :sm="{ span: 24}" :md="{ span: 24}" :lg="{ span: 8}" style="margin-top:20px;">
        <Button :class="{'selecBtn': changeParam.timeType == 'real'}" @click="timeChange('real')">实时数据</Button>
        <Button :class="{'selecBtn': changeParam.timeType == 'hour'}" @click="timeChange('hour')">小时数据</Button>
        <Button :class="{'selecBtn': changeParam.timeType == 'day'}" @click="timeChange('day')">日均值</Button>
        </Col>
      </Row>
  
      <!--手机版-->
      <Row>
        <Col :xs="{ span: 24}" :sm="{ span: 0}" :md="{ span: 0}" :lg="{ span: 0}" style="margin-top:20px;">
        <span>开始时间:</span>
        <Date-picker :options="optionsStart" @on-change="startChange" type="datetime" v-model="changeParam.startTime" :value="changeParam.startTime" placeholder="选择开始时间" class="datePicker"></Date-picker>
        </Col>
        <Col :xs="{ span: 24}" :sm="{ span: 0}" :md="{ span: 0}" :lg="{ span: 0}" style="margin-top:20px;">
        <span>结束时间:</span>
        <Date-picker :options="optionsEnd" @on-change="endChange" type="datetime" v-model="changeParam.endTime" :value="changeParam.endTime" placeholder="选择结束时间" class="datePicker"></Date-picker>
        </Col>
        <Col :xs="{ span: 24}" :sm="{ span: 0}" :md="{ span: 0}" :lg="{ span: 0}" style="margin-top:20px;">
        <Button @click="getData()">按时间查询</Button>
        </Col>
        <Col :xs="{ span: 24}" :sm="{ span: 0}" :md="{ span: 0}" :lg="{ span: 0}" style="margin-top:20px;">
        <Button :class="{'selecBtn': changeParam.timeType == 'real'}" @click="timeChange('real')">实时数据</Button>
        <Button :class="{'selecBtn': changeParam.timeType == 'hour'}" @click="timeChange('hour')">小时数据</Button>
        <Button :class="{'selecBtn': changeParam.timeType == 'day'}" @click="timeChange('day')">日均值</Button>
        </Col>
      </Row>
  
      <Row>
        <Col :xs="{ span: 0}" :sm="{ span: 24}" :md="{ span: 24}" :lg="{ span: 24}">
        <ul class="ul" cellspacing="50%" cellpadding="80">
          <li v-for="item in typeItem" v-bind:key="item" :class="{selectLi: changeParam.param == item.ename}" @click="styleClick(item.ename)">{{item.cname}}</li>
        </ul>
        </Col>
      </Row>
  
      <!--手机版tab-->
      <Row>
        <Col :xs="{ span: 24}" :sm="{ span: 0}" :md="{ span: 0}" :lg="{ span: 0}">
        <div style="border-top:1px dashed #2d8cf0;margin-top:20px;">
          <span class="tabSpan" :class="{selectSpan: changeParam.param == item.ename}" v-for="item in typeItem" v-bind:key="item" @click="styleClick(item.ename)">{{item.cname}}</span>
        </div>
        </Col>
      </Row>
  
      <Row>
        <Col span="24">
        <div v-show="!errorInfo.flag" id="changeChart" class="chart"></div>
        <div v-show="errorInfo.flag" class="errorMsg">
          {{errorInfo.msg}}
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
var echarts = require('echarts');
import util from '../../utils/utils.js'
export default {
  name: 'datedChange',
  data() {
    return {
      typeItem: [],
      currentTime: util.getDateStr('hour', 0),
      changeChart: null,
      changeParam: {
        csiteId: '',
        startTime: util.getDateStr('hour', -1),
        endTime: util.getDateStr('hour', 0),
        param: 'airTemperature',
        timeType: 'real'
      },
      optionsStart: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      optionsEnd: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      errorInfo: {
        flag: false,
        msg: ""
      }
    }
  },
  methods: {
    initChart() {
      this.changeChart = echarts.init(document.getElementById('changeChart'));
    },
    getOption(datatype, typeIcon, valueArray, timeArray) {
      let defaultOption = {
        title: {
          text: null
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: timeArray
            // axisLabel: {
            //   interval: 0
            // }
          }
        ],
        grid: {
          x: 60,
          x1:20
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}' + typeIcon,
              // interval: 300
            }
            // splitNumber:5
          }
        ],
        series: [
          {
            name: datatype,
            type: 'line',
            data: valueArray,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      };
      return defaultOption;
    },
    getType() {
      this.$http.get('/static/json/map.json').then(response => {
        let items = response.data.typeMap;
        this.$set(this, 'typeItem', items);
      }).catch((response) => {
        console.error(response);
      });
    },
    getData() {
      this.$http.get('/api/history/curve', { params: this.changeParam }).then(response => {
        if (response.data.code == 0) {
          let items = response.data.data;
          if (items.length == 0) {
            this.$set(this.errorInfo, 'msg', '没有查询到数据');
            this.$set(this.errorInfo, 'flag', true);
          } else {
            let valueArray = [];
            let timeArray = [];
            for (let i = 0; i < items.length; i++) {
              valueArray.push(items[i].data);
              timeArray.push(util.localTime(items[i].receiveTime));
            }
            let dataType = "";
            let typeIcon = "";
            for (let k = 0; k < this.typeItem.length; k++) {
              if (this.changeParam.param == this.typeItem[k].ename) {
                dataType = this.typeItem[k].cname;
                typeIcon = this.typeItem[k].icno;
                break;
              }
            }
            this.changeChart.setOption(this.getOption(dataType, typeIcon, valueArray, timeArray));
            this.$set(this.errorInfo, 'msg', '');
            this.$set(this.errorInfo, 'flag', false);
          }
        }
      }).catch((response) => {
        console.error(response);
      });
    },
    timeChange(paramtype) {
      if (paramtype == 'real') {
        this.$set(this.changeParam, 'startTime', util.getDateStr('hour', -1));
        this.$set(this.changeParam, 'endTime', util.getDateStr('hour', 0));
      }
      if (paramtype == 'hour') {
        this.$set(this.changeParam, 'startTime', util.getDateStr('day', -1));
        this.$set(this.changeParam, 'endTime', util.getDateStr('day', 0));
      }
      if (paramtype == 'day') {
        this.$set(this.changeParam, 'startTime', util.getDateStr('day', -7));
        this.$set(this.changeParam, 'endTime', util.getDateStr('day', 0));
      }
      this.$set(this.changeParam, 'timeType', paramtype);
      this.getData();
    },
    styleClick(param) {
      this.$set(this.changeParam, 'param', param);
      this.getData();
    },
    startChange(data) {
      this.$set(this.changeParam, 'startTime', data)
    },
    endChange(data) {
      this.$set(this.changeParam, 'endTime', data)
    }
  },
  mounted() {
    this.$root.eventHub.$on('treeClicked', (csiteId) => {
      this.$set(this.changeParam, 'csiteId', csiteId);
      this.getData();
    });
    this.getType();
    this.initChart();
  }
}
</script>
