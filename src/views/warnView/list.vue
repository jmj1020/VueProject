<style scoped>
.list {
  width: calc(100% - 30px);
  height: 327px;
  margin: 10px;
}

.list tr {
  cursor: pointer;
}

.list td {
  padding: 5px 2px;
}

.list tr:hover {
  background: #e9eaec;
}

tr.abnormal {
  color: #ff9900;
}

tr.offline {
  color: #80848f;
}

.page {
  position: absolute;
  bottom: 15px;
  right: 30px;
}
</style>

<template>
  <div class="vueContanier">
    <div class="title">
      <span style="font-size: 16px;">预警</span>
      <div style="position:absolute;right:10px;top:0px;">
        <Select v-model="warnParam.property" style="width:200px" @on-change="propertyChange()">
          <Option value="all">所有数据</Option>
          <Option v-for="item in typeItem" :value="item.ename" :key="item">{{ item.cname }}</Option>
        </Select>
      </div>
      <em>&#9670;</em>
      <span class="tra">&#9670;</span>
    </div>
    <div class="list">
      <table style="width:100%;border-collapse:collapse;">
        <tr v-for="item in warnData" v-bind:key="item" v-bind:class="{ 'abnormal': item.flag == 'abnormal', 'offline': item.flag == 'offline'}">
          <td>
            <span v-if="item.flag == 'abnormal'">[异常]</span>
            <span v-if="item.flag == 'offline'">[离线]</span>
            {{ item.csiteName }}
          </td>
          <td>{{ item.propertyCname }}</td>
          <td style="text-align:center;">{{ item.value }}</td>
          <td style="text-align:right;">{{ item.receiveTime }}</td>
        </tr>
      </table>
      <div class="page">
        <Page :total="total" show-total size='small' :current="warnParam.pageNum" :page-size="warnParam.size" @on-change="pageChange"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../utils/utils.js'
export default {
  name: 'warnList',
  data() {
    return {
      typeItem: [],
      warnData: [],
      total: 1,
      warnParam: {
        property: 'all',
        size: 10,
        pageNum: 1
      }
    }
  },

  methods: {
    // 获取监测类型
    getType() {
      this.$http.get('/static/json/map.json').then(response => {
        let items = response.data.typeMap;
        this.$set(this, 'typeItem', items);
      }).catch((response) => {
        console.error(response);
      });
    },

    // 获取列表
    getList() {
      this.$http.get('/api', { params: this.warnParam })
        .then(response => {
          if (response.data.code == 0) {
            this.$set(this, 'total', response.data.data.count);
            var items = response.data.data.data;
            for (let i = 0; i < items.length; i++) {
              for (let k = 0; k < this.typeItem.length; k++) {
                if (items[i].key == this.typeItem[k].ename) {
                  items[i].propertyCname = this.typeItem[k].cname;
                  break;
                }
              }

              items[i].receiveTime = util.localTime(items[i].receiveTime);
            }
            this.$set(this, 'warnData', items);
          } else {
            console.error(response.message);
          }
        }).catch((response) => {
          console.error(response);
        });
    },

    // 监测类型值变化触发事件重新获取数据
    propertyChange() {
      this.$set(this.warnParam, 'pageNum', 1);
      this.getList();
    },

    // 当前页变化触发事件重新获取数据
    pageChange(pageNum) {
      this.$set(this.warnParam, 'pageNum', pageNum);
      this.getList();
    }
  },

  mounted() {
    // 获取监测类型
    this.getType();

    // 获取列表数据
    this.getList();
  }
}
</script>
