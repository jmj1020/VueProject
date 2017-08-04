//main.js这是项目的核心文件。全局的配置都在这个文件里面配置
import Vue from 'vue'
import iView from 'iview'
import App from './App.vue'
import router from './routes.js'
import VueResource from 'vue-resource'

import 'iview/dist/styles/iview.css';

// global.VIDEO_FLAG = 0;

// import '/assets/styles/base.css'
Vue.config.debug = true;//开启错误提示
Vue.use(iView);
Vue.use(VueResource);

// Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

new Vue({
        router,
        el: '#appIndex',
        render: h => h(App),
        data: {
                eventHub: new Vue()
        }
})
