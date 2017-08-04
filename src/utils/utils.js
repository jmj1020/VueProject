import Vue from 'vue'

export default new Vue({
    data() {
        return {
        }
    },
    methods: {
        // 时间戳转换24小时制
        formatTime(param) {
            if (param * 1 >= 0 && param * 1 <= 9) {
                param = "0" + param;
            }
            return param;
        },
        // 时间戳转换成日期
        localTime(ns) {
            let time = new Date(Math.round(parseInt(ns)));
            let year = time.getFullYear();
            let month = this.formatTime(time.getMonth() + 1);
            let day = this.formatTime(time.getDate());
            let hour = this.formatTime(time.getHours());
            let minute = this.formatTime(time.getMinutes());
            let second = this.formatTime(time.getSeconds());
            let result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return result;
        },
        // 获取指定日期
        getDateStr(type, count) {
            let time = new Date();
            if (type == 'day') {
                time.setDate(time.getDate() + count);
            }
            if (type == 'hour') {
                time.setHours(time.getHours() + count);
            }
            let year = time.getFullYear();
            let month = this.formatTime(time.getMonth() + 1);
            let day = this.formatTime(time.getDate());
            let hour = this.formatTime(time.getHours());
            let minute = this.formatTime(time.getMinutes());
            let second = this.formatTime(time.getSeconds());
            let result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return result;
        },
    }
})
