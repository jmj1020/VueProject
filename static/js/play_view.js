/**
 * Created by bailei on 2015-03-09.
 */
const deviceName = "17050026";
$(function () {
    alert(1);
    pluginTest();
});

function pluginTest() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        loginCMS();
        // add256Option();
    } else {
        $(".content").hide();
        $("#browser_not_ie").show();
    }
}

function loginCMS() {
    let userName = "admin";
    let pw = "landfun2012";
    let ipAdd = "222.73.120.190";
    let port = "8090";

    let OCXobj = document.getElementById("PlayView_OCX");
    let ret = OCXobj.Login_V11(userName, pw, ipAdd, port, 0);
    switch (ret) {
        case 0:
            // setCameraId(getCameraIdByDeviceName(deviceName));
            setCameraId(129);
            setTimeout("StartPlayView()", 1000);
            break;
        default:
            $(".content").hide();
            $("#ocx_not_installed").show();
            alert("登录失败！");
            break;
    }
}

/*****************设置预览的cameraId**********************/
function setCameraId(cameraId) {
    document.getElementById("TextCameraId").value = cameraId;
}

function getCameraIdByDeviceName(deviceName) {
    let OCXobj = document.getElementById("PlayView_OCX");
    let xmlStr = OCXobj.GetResourceInfo(4);
    let xmldom = getXmlDomFromStr(xmlStr);
    let cameras = $(xmldom).find("Camera");
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
    return cameraID;
}

function getXmlDomFromStr(xmlStr) {
    let xmldom = null;
    if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
        xmldom = new ActiveXObject("Microsoft.XMLDOM");
        xmldom.loadXML(xmlStr);
    } else {
        xmldom = new DOMParser().parseFromString(xmlStr, "text/xml");
    }
    return xmldom;
}

/*****实时预览******/
function StartPlayView() {
    let OCXobj = document.getElementById("PlayView_OCX");
    let CameraID = document.getElementById("TextCameraId").value;
    if (!(parseInt(CameraID) >= 1 && parseInt(CameraID) <= 2147483647)) {
        return;
    }
    if ("" == CameraID) {
        alert("请选择一个监控点！");
        return;
    }
    if (CameraID.length == 0 || isNaN(CameraID) || "" == CameraID) {
        alert("必须是一个整数.");
        return;
    }
    let ret = OCXobj.StartTask_Preview_V11(CameraID);
    switch (ret) {
        case 0:
            setToOneWnd();
            break;
        default:
            break;
    }
}

// 设置窗口数量并选中
function setToOneWnd() {
    let OCXobj = document.getElementById("PlayView_OCX");
    OCXobj.SetWndNum(1);
    OCXobj.SelWindow(1);
}

function trim(str) {
    return (str || "").replace(/^\s+|\s+$/g, "");
}




/*****登出CMS******/
function logoutCMS() {
    var OCXobj = document.getElementById("PlayView_OCX");
    var ret = OCXobj.Logout_V11();
    switch (ret) {
        case 0:
            OCXobj.StopAllPreview();
            // alert("退出成功！");
            break;
        default:
            // alert("退出失败！");
            break;
    }
}

/*****停止所有预览******/
function StopPlayView() {
    var OCXobj = document.getElementById("PlayView_OCX");
    var ret = OCXobj.StopAllPreview();
    switch (ret) {
        case 0:
            break;
        default:
            alert("StopPlayView接口调用失败！错误码：" + OCXobj.GetLastError_V11());
            break;
    }
}

function add256Option() {
    $("#sel_call_preset option,#sel_set_preset option").remove();
    for (var i = 1; i <= 256; i++) {
        $("#sel_call_preset,#sel_set_preset").append("<option value='" + i + "'>" + i + "</option>");
    }
}

function PTZControl(funcName) {
    var OCXobj = $("#PlayView_OCX").get(0);
    if (OCXobj == null) {
        alert("控件未安装！");
    } else {
        var res = null;
        switch (funcName) {
            case "PTZLeftUp":
                res = OCXobj.StartTask_PTZ(25, 4);	//云台：左上
                break;
            case "PTZUp":
                res = OCXobj.StartTask_PTZ(21, 4);	//云台：上
                break;
            case "PTZRightUp":
                res = OCXobj.StartTask_PTZ(26, 4);	//云台：右上
                break;
            case "PTZLeft":
                res = OCXobj.StartTask_PTZ(23, 4);	//云台：左
                break;
            case "PTZAuto":
                res = OCXobj.StartTask_PTZ(29, 4);	//云台：自转
                break;
            case "PTZRight":
                res = OCXobj.StartTask_PTZ(24, 4);	//云台：右
                break;
            case "PTZLeftDown":
                res = OCXobj.StartTask_PTZ(27, 4);	//云台：左下
                break;
            case "PTZDown":
                res = OCXobj.StartTask_PTZ(22, 4);	//云台：下
                break;
            case "PTZRightDown":
                res = OCXobj.StartTask_PTZ(28, 4);	//云台：右下
                break;
            case "PTZStop":
                res = OCXobj.StartTask_PTZ(-21, 4);	//云台：停止
                break;
            case "PTZAddTimes":
                res = OCXobj.StartTask_PTZ(11, 4);	//云台：焦距+
                break;
            case "PTZMinusTimes":
                res = OCXobj.StartTask_PTZ(12, 4);	//云台：焦距-
                break;
            case "PTZFarFocus":
                res = OCXobj.StartTask_PTZ(13, 4);	//云台：焦点+
                break;
            case "PTZNearFocus":
                res = OCXobj.StartTask_PTZ(14, 4);	//云台：焦点-
                break;
            case "PTZLargeAperture":
                res = OCXobj.StartTask_PTZ(15, 4);	//云台：光圈+
                break;
            case "PTZSmallAperture":
                res = OCXobj.StartTask_PTZ(16, 4);	//云台：光圈-
                break;
        }

        if (res == 1) {
        } else {
            alert("StartTask_PTZ接口调用失败！错误码：" + OCXobj.GetLastError_V11());
        }
    }
}

/*****云台：调用预置点******/
function GetPt() {
    var OCXobj = document.getElementById("PlayView_OCX");
    var ptNum = $("#sel_call_preset").val();
    if (isNaN(ptNum)) {
        showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
        return;
    }
    var tempPtNum = parseInt(ptNum);
    if (!(tempPtNum >= 0 && tempPtNum <= 999)) {
        showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
        return;
    }
    var ret = OCXobj.PTZCtrlGotoPreset(ptNum);
    switch (ret) {
        case 0:
            break;
        case -1:
            alert("PTZCtrlGotoPreset接口调用失败！错误码：" + OCXobj.GetLastError_V11());
            break;
        default:
            break;
    }
}
/*****云台：设置预置点******/
function SetPt() {
    var OCXobj = document.getElementById("PlayView_OCX");
    var ptNum = $("#sel_set_preset").val();
    if (isNaN(ptNum)) {
        showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
        return;
    }
    var tempPtNum = parseInt(ptNum);
    if (!(tempPtNum >= 0 && tempPtNum <= 999)) {
        showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
        return;
    }
    var ret = OCXobj.PTZCtrlSetPreset(parseInt(ptNum));
    switch (ret) {
        case 0:
            alert("预置点设置成功！");
            break;
        case -1:
            alert("预置点设置失败！");
            alert("PTZCtrlSetPreset接口调用失败！错误码：" + OCXobj.GetLastError_V11());
            break;
        default:
            break;
    }
}