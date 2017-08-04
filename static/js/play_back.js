/**
 * Created by bailei on 2015-03-09.
 */
var deviceName;

$(function () {
    if (!pluginTest())
    	return;
    // deviceName = $("#cameraID").text();
    deviceName = "17050026";
    StartQueryRecord();
    // setToOneWnd();
});


function pluginTest() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
        // var OCXobj = document.getElementById("PlayBack_OCX");
        // if (OCXobj.Login_V11 == undefined) {
        // 	$(".content").hide();
        // 	$("#ocx_not_installed").show();
        // 	return false;
        // } else {
        // 	return true;
        // }
    } else {
        $(".content").hide();
        $("#browser_not_ie").show();
        return false;
    }
}

/**
 * 设置窗口数量并选中
 */
function setToOneWnd() {
    var OCXobj = document.getElementById("PlayBack_OCX");
    
    OCXobj.SetWndNum(1);
    OCXobj.SelWindow(1);
}

function loginCMS() {
    var userName = "admin";
    var pw = "landfun2012";
    var ipAdd = "222.73.120.190";
    var port = "8090";
    
    if (!validateAddress(ipAdd)) {
        return;
    }
    if ("" == port) {
        alert("端口号不能为空！");
        return;
    }
    if (!validateInteger(port, "端口")) {
        return;
    }
    if (!(parseInt(port) >= 0 && parseInt(port) <= 2147483647)) {
        alert("端口号介于0到2147483647之间！");
        return;
    }
    var OCXobj = document.getElementById("PlayBack_OCX");
    var ret = -1;
    
    try {
        ret = OCXobj.Login_V11(userName, pw, ipAdd, port, 0);
    } catch (err) {
        $(".content").hide();
        $("#ocx_not_installed").show();
        return;
    }
    
    switch (ret) {
        case 0:
            setCameraId(getCameraIdByDeviceName(deviceName));
            SetPlayBackParam(document.getElementById("TextCameraId").value, 1);
            // logoutCMS();
            //showMethodInvokedInfo("Login_V11,GetResourceInfo 接口调用成功！");
            break;
        case -1:
            //clearTree();
            alert("登录失败！");
            //showMethodInvokedInfo("Login_V11接口调用失败！错误码：" + OCXobj.GetLastError_V11());
            break;
        default:
            break;
    }
}

/*****登出CMS******/
function logoutCMS() {
    var OCXobj = document.getElementById("PlayBack_OCX");
    //var ret=OCXobj.LogoutCMS();
    var ret = OCXobj.Logout_V11();
    switch (ret) {
        case 0:
            OCXobj.StopAllPreview();
            //document.getElementById("TextPwd").value = "";
            //init();
            alert("退出成功！");
            //$("#TextInfo").html("Logout_V11,StopAllPreview接口调用成功！\r");
            break;
        case -1:
            alert("退出失败！");
            //showMethodInvokedInfo("Logout_V11接口调用失败！错误码：" + OCXobj.GetLastError_V11());
            break;
        default:
            break;
    }
}

function validateInteger(value, label) {
    if (value.length == 0 || isNaN(value)) {
        alert(label + "必须是一个整数.");
        return false;
    } else {
        var re = /^[0-9]+[0-9]*]*$/;   //判断正整数
        if (!re.test(value)) {
            alert(label + "必须是一个整数.");
            return false;
        }

        var isNumber = false;
        for (var count = 0; count < value.length; count++) {
            var code = value.charCodeAt(count);
            if ((48 > code && code > 57)) {
                alert(label + "必须是一个整数.");
                return false;
            }
        }
    }
    return true;
}


function validateAddress(ipAddress) {
    if (ipAddress.length == 0) {
        alert("IP地址不能为空！");
        return false;
    }
    var tokens = trim(ipAddress).split(".");
    if (tokens.length < 4 || tokens.length > 4) {
        alert("IP地址输入不正确！");
        return false;
    }
    if (tokens[0] == 0) {
        alert("IP地址输入不正确！");
        return false;
    }
    for (var k = 0; k < 4; k++) {
        if (isNaN(tokens[k]) || (tokens[k].length == 0) || (tokens[k].length > 3) || tokens[k] > 255 || tokens[k] < 0) {
            alert("IP地址输入不正确！");
            return false;
        }
        if (tokens[k].length > 1 && tokens[k].indexOf("0") == 0) {
            alert("IP地址输入不正确！");
            return false;
        }
        if ((tokens[k].indexOf(" ") > -1)) {
            alert("IP地址输入不正确！");
            return false;
        }
    }
    return true;
}

function trim(str) {
    return (str || "").replace(/^\s+|\s+$/g, "");
}

function getCameraIdByDeviceName(deviceName) {
    var OCXobj = document.getElementById("PlayBack_OCX");
    xmlStr = OCXobj.GetResourceInfo(4);
    var xmldom = getXmlDomFromStr(xmlStr);
    var cameras = $(xmldom).find("Camera");
    var isFind = false;
    var cameraID = "";
    for (var i = 0; i < cameras.length; i++) {
        if ($(cameras[i]).find("DeviceName").text() == deviceName) {
            isFind = true;
            cameraID = $(cameras[i]).find("CameraId").text();
        }
    }
    if (!isFind)
        alert("服务器中没有此摄像设备");
    return cameraID;
}

function getXmlDomFromStr(xmlStr) {
    var xmldom = null;
    if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
        xmldom = new ActiveXObject("Microsoft.XMLDOM");
        xmldom.loadXML(xmlStr);
    } else {
        xmldom = new DOMParser().parseFromString(xmlStr, "text/xml");
    }
    return xmldom;
}

/*****************设置预览的cameraId**********************/
function setCameraId(cameraId) {
    document.getElementById("TextCameraId").value = cameraId;
}


function StartPlayBack() {
    var CameraID = document.getElementById("TextCameraId").value;
    SetPlayBackParam(CameraID, 1);

}

/** ***设置回放参数***** */
function SetPlayBackParam(CameraID, RecLocation) {
    var OCXobj = document.getElementById("PlayBack_OCX");
    var WndIndex = OCXobj.GetFocusWndIndex();// 获取当前选中窗口
    var ret = OCXobj.SetPlayBackParam_V11(CameraID, RecLocation, WndIndex);
    switch (ret) {
        case 0:
            // alert("设置成功！");
            // showMethodInvokedInfo("SetPlayBackParam_V11接口调用成功！");
            break;
        case -1:
            alert("设置失败！");
            // showMethodInvokedInfo("SetPlayBackParam_V11接口调用失败！错误码："
            // + OCXobj.GetLastError_V11());
            break;
        default:
            break;
    }
}

function strDateTime(str) {

}

/** ***搜索录像***** */
function StartQueryRecord() {
    loginCMS();
    var OCXobj = document.getElementById("PlayBack_OCX");
    var StartTime = document.getElementById("TextStartTime").value;
    var EndTime = document.getElementById("TextEndTime").value;
    var RecType = document.getElementsByName("TextRecType");
    var CheRecType = 0;
    for (var i = 0; i < RecType.length; i++) {
        if (RecType[i].checked == true) {
            CheRecType += parseInt(RecType[i].value);
        }
    }
    //if ("" == StartTime) {
    //	alert("开始时间不能为空！");
    //	return;
    //}
    if (!strDateTime(StartTime)) {
        alert("开始时间格式不正确，请重新输入！\n正确的格式如：2012-01-01 00:00");
        return;
    }
    //if ("" == EndTime) {
    //	alert("结束时间不能为空！");
    //	return;
    //}
    if (!strDateTime(EndTime)) {
        alert("结束时间格式不正确，请重新输入！\n正确的格式如：2012-01-01 00:00");
        return;
    }
    if (StartTime > EndTime) {
        alert("结束时间早于起始时间，请重新输入!");
        return;
    }
    if ("0" == CheRecType) {
        alert("录像类型不能为空！");
        return;
    }

    var ret = OCXobj.StartQueryRecord_V11(StartTime, EndTime, CheRecType);
    switch (ret) {
        case 0:
            //showMethodInvokedInfo("StartQueryRecord_V11接口调用成功！");
            break;
        case -1:
            alert("搜索失败！");
            showMethodInvokedInfo("StartQueryRecord_V11接口调用失败！错误码："
                + OCXobj.GetLastError_V11());
            break;
        default:
            break;
    }
}