<style scoped>
.browser_not_ie,
.ocx_not_installed {
  display: none;
  height: 300px;
  line-height: 300px;
  text-align: center;
  font-size: 30px;
}
</style>

<template>
  <div class="vueContanier">
    <div class="content" id="content">
      <input id="TextCameraId" size="7" type="text" style="display:none;" />
      <object classid="clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7" id="PlayView_OCX" width="850px" height="500" name="ocx">
      </object>
    </div>
    <div id="browser_not_ie" class="browser_not_ie">
      <span>请使用IE浏览器查看视频</span>
    </div>
    <div id="ocx_not_installed" style="display:none;">
      <a href="http://test.hbjk.com.cn:8013/setup.exe">请点击下载OCX控件，安装后重启浏览器观看视频</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      OCXobj: document.getElementById("PlayView_OCX"),
      deviceName: "17050026",
      userName: "admin",
      pw: "landfun2012",
      ipAdd: "222.73.120.190",
      port: "8090",
      cameraId: null
    }
  },
  methods: {
    pluginTest() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.loginCMS();
      } else {
        document.getElementById("content").style.display = "none";
        document.getElementById("browser_not_ie").style.display = "block";
      }
    },
    loginCMS() {
      let ret = this.OCXobj.Login_V11(this.userName, this.pw, this.ipAdd, this.port, 0);
      alert(ret)
      switch (ret) {
        case 0:
          setTimeout(this.StartPlayView, 1000);
          break;
        default:
          document.getElementById("content").style.display = "none";
          document.getElementById("ocx_not_installed").style.display = "block";
          alert("登录失败！");
          break;
      }
    },

    StartPlayView() {
      // this.$set(this, 'cameraId', this.getCameraIdByDeviceName(this.deviceName));
      this.$set(this, 'cameraId', 129);
      if (!(parseInt(this.cameraId) >= 1 && parseInt(this.cameraId) <= 2147483647)) {
        return;
      }
      if ("" == this.cameraId) {
        alert("请选择一个监控点！");
        return;
      }
      if (this.cameraId.length == 0 || isNaN(this.cameraId) || "" == this.cameraId) {
        alert("必须是一个整数.");
        return;
      }
      let ret = this.OCXobj.StartTask_Preview_V11(this.cameraId);
      switch (ret) {
        case 0:
          this.setToOneWnd();
          break;
        default:
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
      alert(cameras.length);
      let isFind = false;
      let cameraID = "";
      for (let i = 0; i < cameras.length; i++) {
        if ($(cameras[i]).find("DeviceName").text() == deviceName) {
          isFind = true;
          cameraID = $(cameras[i]).find("CameraId").text();
        }
      }
      
      if (!isFind) {
        alert("服务器中没有此摄像设备");
      }
      alert(cameraID)
      
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
