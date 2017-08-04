<style scoped>
Button.selecBtn {
  background: #2d8cf0;
  color: #fff;
}

.changePart {
  padding: 0px 20px 20px 20px;
  min-height: 400px;
}

.datePicker {
  width: 200px;
  display: inline-block;
}

.dataedTable,
.phoneTable {
  width: 100%;
  border-collapse: collapse
}

.dataedTable thead {
  background: #f8f8f9;
}

.dataedTable th,
.dataedTable td {
  border: 1px solid #dddee1;
  text-align: center;
  padding: 5px;
}

.page {
  float: right;
  margin-top: 30px;
}

.phoneTable td {
  padding: 5px;
  text-align: left;
  border: 1px solid #dddee1;
}

.phoneTable {
  margin: 10px;
}

.phoneTable.odd {
  background: #fafafa;
}

.phoneTable.even {
  background: #fbfbea;
}
</style>
<template>
  <div class="vueContanier">
    <div class="title">
      <span style="font-size: 16px;">历史数据</span>
      <span style="font-size: 16px;float:right;">当前时间：{{currentTime}}</span>
      <em>&#9670;</em>
      <span class="tra">&#9670;</span>
    </div>
    <div class="changePart">
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
        <Button @click="getData()">时间查询</Button>
        </Col>
        <Col :xs="{ span: 24}" :sm="{ span: 0}" :md="{ span: 0}" :lg="{ span: 0}" style="margin-top:20px;">
        <Button :class="{'selecBtn': changeParam.timeType == 'real'}" @click="timeChange('real')">实时数据</Button>
        <Button :class="{'selecBtn': changeParam.timeType == 'hour'}" @click="timeChange('hour')">小时数据</Button>
        <Button :class="{'selecBtn': changeParam.timeType == 'day'}" @click="timeChange('day')">日均值</Button>
        </Col>
      </Row>
  
      <Row style="margin-top:30px;">
        <Col :xs="{ span: 0}" :sm="{ span: 0}" :md="{ span: 24}" :lg="{ span: 24}">
        <table class="dataedTable">
          <thead>
            <tr>
              <th>序号</th>
              <th>空气温度</th>
              <th>空气湿度</th>
              <th>土壤温度</th>
              <th>土壤湿度</th>
              <th>光照度</th>
              <th>降雨量</th>
              <th>风速</th>
              <th>风向</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody v-if="datedData.length != 0">
            <tr v-for="item in datedData" v-bind:key="item">
              <td>{{item.csiteId}}</td>
              <td>{{item.airTemperature}}</td>
              <td>{{item.airHumidity}}</td>
              <td>{{item.soilTemperature}}</td>
              <td>{{item.soilHumidity}}</td>
              <td>{{item.illumination}}</td>
              <td>{{item.rainfall}}</td>
              <td>{{item.windSpeed}}</td>
              <td>{{item.windDirection}}</td>
              <td>{{item.receiveTime}}</td>
            </tr>
          </tbody>
          <tbody v-if="datedData.length == 0">
            <tr>
              <td colspan="10" style="font-weight:bold;">没有查询到数据</td>
            </tr>
          </tbody>
        </table>
  
        <div class="page" v-if="datedData.length != 0">
          <Page :total="total" size="small" show-total :current="changeParam.pageNum" :page-size="changeParam.size" @on-change="pageChange"></Page>
        </div>
        </Col>
  
        <!--手机数据-->
        <Col :xs="{ span: 24}" :sm="{ span: 24}" :md="{ span: 0}" :lg="{ span: 0}">
        <div v-if="datedData.length != 0">
          <table class="phoneTable" :class="{odd: index % 2 == 0,even: index % 2 != 0}" v-for="(item,index) in datedData" v-bind:key="item">
            <tbody>
              <tr>
                <td>序号</td>
                <td>{{item.csiteId}}</td>
              </tr>
              <tr>
                <td>空气温度</td>
                <td>{{item.airTemperature}}</td>
              </tr>
              <tr>
                <td>空气湿度</td>
                <td>{{item.airHumidity}}</td>
              </tr>
              <tr>
                <td>土壤温度</td>
                <td>{{item.soilTemperature}}</td>
              </tr>
              <tr>
                <td>土壤湿度</td>
                <td>{{item.soilHumidity}}</td>
              </tr>
              <tr>
                <td>光照度</td>
                <td>{{item.illumination}}</td>
              </tr>
              <tr>
                <td>降雨量</td>
                <td>{{item.rainfall}}</td>
              </tr>
              <tr>
                <td>风速</td>
                <td>{{item.windSpeed}}</td>
              </tr>
              <tr>
                <td>风向</td>
                <td>{{item.windDirection}}</td>
              </tr>
              <tr>
                <td>时间</td>
                <td>{{item.receiveTime}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table class="phoneTable">
          <tbody v-if="datedData.length == 0">
            <tr>
              <td colspan="8" style="font-weight:bold;">没有查询到数据</td>
            </tr>
          </tbody>
        </table>
        <div class="page" v-if="datedData.length != 0">
          <Page :total="total" size="small" show-total :current="changeParam.pageNum" :page-size="changeParam.size" @on-change="pageChange"></Page>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import util from '../../utils/utils.js'
export default {
  name: 'datedChart',
  data() {
    return {
      total: 0,
      currentTime: util.getDateStr('hour', 0),
      changeParam: {
        csiteId: '',
        startTime: util.getDateStr('hour', -1),
        endTime: util.getDateStr('hour', 0),
        pageNum: 1,
        size: 10,
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
      datedData: []
    }
  },
  methods: {
    getData() {
      this.$http.get('/api/history/type', { params: this.changeParam }).then(response => {
        if (response.data.code == 0) {
          this.$set(this, 'total', response.data.data.count);
          let items = response.data.data.data;
          for (let i = 0; i < items.length; i++) {
            items[i].receiveTime = util.localTime(items[i].receiveTime);
          }
          this.$set(this, 'datedData', items);
        }
      }).catch((response) => {
        console.error(response.data.message);
      });
    },
    timeChange(paramtype) {
      this.$set(this.changeParam, 'pageNum', 1);
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
    startChange(data) {
      this.$set(this.changeParam, 'startTime', data)
    },
    endChange(data) {
      this.$set(this.changeParam, 'endTime', data)
    },
    pageChange(pageNum) {
      this.$set(this.changeParam, 'pageNum', pageNum);
      this.getData();
    }
  },
  mounted() {
    this.$root.eventHub.$on('treeClicked', (csiteId) => {
      this.$set(this.changeParam, 'csiteId', csiteId);
      this.getData();
    });
  }
}
</script>