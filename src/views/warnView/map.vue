<style scoped>
.title .fullscreen {
  float: right;
  margin-top: 9px;
  vertical-align: middle;
}

.allmap {
  width: calc(100% - 30px);
  height: 317px;
  margin: 15px;
}

.screenmapDiv {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 8;
}

.screenMask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: #000;
  opacity: 0.5;
}

.screenmap {
  position: absolute;
  width: 80%;
  height: 400px;
  z-index: 11;
  top: calc(50% - 200px);
  left: 10%;
}

.exitFull {
  position: absolute;
  z-index: 11;
  padding: 5px 10px;
  top: 20px;
  right: 50px;
}

.screenType {
  position: absolute;
  z-index: 11;
  width: 556px;
  top: 20px;
  left: calc(50% - 278px);
}

.typeSpan {
  font-size: 14px;
  padding: 1px 6px;
  background: #fafafa;
  border: 1px solid #cacaca;
  border-radius: 10px;
  margin: 0px 5px;
  cursor: pointer;
}

.typeSpan:hover {
  background: #eee;
  color: #2d8cf0;
}

.typeSpan.active {
  background: #2d8cf0;
  color: #fff;
  padding: 4px 6px;
}
</style>

<template>
  <div class="vueContanier">
    <Row>
      <Col :xs="0" :sm="0" :md="24" :lg="24">
      <div class="title">
        <span style="font-size: 16px;margin-right:5px;">地图</span>
        <span class="typeSpan" v-bind:class="{ active: typeItemSelect ==  item.cname}" @click="webTypeChange(item)" v-for="item in typeItem" v-bind:key="item">{{ item.cname }}</span>
        <Button type="info" class="fullscreen" @click="screenMap()">全屏</Button>
        <em>&#9670;</em>
        <span class="tra">&#9670;</span>
      </div>
      </Col>
      <Col :xs="24" :sm="24" :md="0" :lg="0">
      <div class="title">
        <span style="font-size: 16px;margin-right:5px;">地图</span>
        <div style="position:absolute;right:10px;top:0px;">
          <Select style="width:200px;" @on-change="phoneTypeChange">
            <Option v-for="item in typeItem" :value="item.ename" :key="item">{{ item.cname }}</Option>
          </Select>
        </div>
        <em>&#9670;</em>
        <span class="tra">&#9670;</span>
      </div>
      </Col>
    </Row>
  
    <div class="allmap" id="allmap">
    </div>
  
    <div class="screenmapDiv" v-bind:style="styleScreen">
      <div class="screenMask"></div>
      <Button class="exitFull" type="info" @click="exitFull()">退出全屏</Button>
      <div class="screenType">
        <span class="typeSpan" v-bind:class="{ active: typeItemSelect ==  item.cname}" @click="webTypeChange(item)" v-for="item in typeItem" v-bind:key="item">{{ item.cname }}</span>
      </div>
      <div class="screenmap" id="screenmap"></div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      styleScreen: {
        visibility: "hidden"
      },
      typeItem: [],
      typeItemSelect: "",
      warnParam: ''
    }
  },
  methods: {
    // 获取监测类型
    getType() {
      this.$http.get('/static/json/map.json').then(response => {
        let items = response.data.typeMap;
        this.$set(this, 'typeItemSelect', items[0].cname);
        this.$set(this, 'typeItem', items);
      }).catch((response) => {
        console.error(response);
      });
    },

    // 获取地图数据
    getMapData(param) {
      this.$http.get('/api', { params: { property: param } }).then(response => {
      }).catch((response) => {
        console.error(response);
      });

      this.setMap("allmap");
      this.setMap("screenmap");
    },

    // 缩设置地图
    setMap(id) {
      let map = new BMap.Map(id);
      let point = new BMap.Point(114.392468, 30.457716);
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true);

      function openInfo(content, e) {
        let opts = {
          width: 200,     // 信息窗口宽度
          height: 50,     // 信息窗口高度
          title: null, // 信息窗口标题
          enableMessage: true//设置允许信息窗发送短息
        };
        let p = e.target;
        let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        let infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
        map.openInfoWindow(infoWindow, point); //开启信息窗口
      }
      function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
          openInfo(content, e)
        }
        );
      }
      function addMarker(point, imgUrl, content) {
        let myIcon = new BMap.Icon(imgUrl, new BMap.Size(30, 30));
        let marker = new BMap.Marker(point, { icon: myIcon });
        map.addOverlay(marker);
        addClickHandler(content, marker);
      }

      let imgUrl = '../static/img/' + 'normal.png';
      addMarker(point, imgUrl, "content")
    },

    // web端类型切换，获取新数据
    webTypeChange(el) {
      this.$set(this, 'typeItemSelect', el.cname);
      this.getMapData(el.ename);
    },

    // 手机版地图类型切换，获取新数据
    phoneTypeChange(data) {
      this.getMapData(data);
    },

    // 全屏地图隐藏与显示
    screenMap() {
      this.$set(this, "styleScreen", {
        visibility: "visible"
      });
      document.getElementsByTagName("body")[0].setAttribute("style", "overflow:hidden")
    },

    // 退出全屏
    exitFull() {
      this.$set(this, "styleScreen", {
        visibility: "hidden"
      });
      document.getElementsByTagName("body")[0].setAttribute("style", "overflow:auto")
    }
  },

  mounted() {
    // 获取监测类型
    this.getType();

    // 初始化地图数据，默认温度
    this.getMapData('airTemperature');
  }
}
</script>


