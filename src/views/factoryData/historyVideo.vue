<style scoped>
.browser_not_ie,
.ocx_not_installed {
  display: none;
  height: 300px;
  line-height: 300px;
  text-align: center;
  font-size: 30px;
}

.time li {
  display: inline-block;
  margin: 20px;
}

.time input {
  padding: 10px;
  text-align: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
}
</style>

<template>
  <div class="vueContanier">
    <div class="content" id="content">
      <ul class="time">
        <li>
          <span>起始时间：</span>
          <input id="TextStartTime" v-model="TextStartTime" type="text" />
        </li>
        <li>
          <span>结束时间：</span>
          <input id="TextEndTime" v-model="TextEndTime" type="text" />
        </li>
      </ul>
      <object classid="clsid:61978326-6772-4595-9EC3-D23C5CD5E61F" id="PlayBack_OCX" width="850px" height="600" name="ocx">
      </object>
    </div>
    <div id="browser_not_ie" class="browser_not_ie">
      <span>请使用IE浏览器查看视频</span>
    </div>
    <div id="ocx_not_installed" class="ocx_not_installed">
      <a href="http://test.hbjk.com.cn:8013/setup.exe">请点击下载OCX控件，安装后重启浏览器观看视频</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      OCXobj: document.getElementById("PlayBack_OCX"),
      deviceName: "17050026",
      userName: "admin",
      pw: "landfun2012",
      ipAdd: "222.73.120.190",
      port: "8090",
      TextStartTime: "2015-04-22 00:00:00",
      TextEndTime: "2015-04-22 24:00:00"
    }
  },
  methods: {
    pluginTest() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.StartQueryRecord();
      } else {
        document.getElementById("content").style.display = "none";
        document.getElementById("browser_not_ie").style.display = "block";
      }
    },


    StartQueryRecord() {
      let StartTime = this.TextStartTime;
      let EndTime = this.TextEndTime;
      let ret = this.OCXobj.StartQueryRecord_V11(StartTime, EndTime, 1);
      switch (ret) {
        case 0:
          this.loginCMS();
          break;
        default:
          alert("搜索失败！");
          break;
      }
    },

    loginCMS() {
      let ret = this.OCXobj.Login_V11(this.userName, this.pw, this.ipAdd, this.port, 0);
      alert(ret);
      switch (ret) {
        case 0:
          setTimeout(this.SetPlayBackParam, 1000);
          break;
        default:
          document.getElementById("content").style.display = "none";
          document.getElementById("ocx_not_installed").style.display = "block";
          alert("登录失败！");
          break;
      }
    },



    SetPlayBackParam() {
      let CameraID = 129;
      // let CameraID = this.getCameraIdByDeviceName(this.deviceName);
      let RecLocation = 1;
      let WndIndex = this.OCXobj.GetFocusWndIndex();// 获取当前选中窗口
      let ret = this.OCXobj.SetPlayBackParam_V11(CameraID, RecLocation, WndIndex);
      switch (ret) {
        case 0:
          this.setToOneWnd();
          break;
        default:
          alert("设置失败！");
          break;
      }
    },

    setToOneWnd() {
      this.OCXobj.SetWndNum(1);
      this.OCXobj.SelWindow(1);
    },

    getCameraIdByDeviceName(deviceName) {
      let xmlStr = this.OCXobj.GetResourceInfo(4);
      let xmldom = this.getXmlDomFromStr(xmlStr);
      let cameras = $(xmldom).find("Camera");
      let isFind = false;
      let cameraID = "";
      for (let i = 0; i < cameras.length; i++) {
        if ($(cameras[i]).find("DeviceName").text() == deviceName) {
          isFind = true;
          cameraID = $(cameras[i]).find("CameraId").text();
        }
      }
      if (!isFind)
        alert("服务器中没有此摄像设备");
      return cameraID;
    },

    getXmlDomFromStr(xmlStr) {
      let xmldom = null;
      if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
        xmldom = new ActiveXObject("Microsoft.XMLDOM");
        xmldom.loadXML(xmlStr);
      } else {
        xmldom = new DOMParser().parseFromString(xmlStr, "text/xml");
      }
      return xmldom;
    }
  },
  mounted() {
    this.pluginTest();
  }
}
</script>
