// 引用模板
import Vue from 'vue';
import Router from 'vue-router';

import loginPage from './views/login.vue'
import mainPage from './views/main.vue'
import warnView from './views/warnView/main.vue'
import factoryView from './views/factoryView/factory.vue'
import timeData from './views/factoryData/timeData.vue'
import historyData from './views/factoryData/historyData.vue'
import curveData from './views/factoryData/curveData.vue'
import timeVideo from './views/factoryData/timeVideo.vue'
import historyVideo from './views/factoryData/historyVideo.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: loginPage,
            meta: { requiresAuth: false }
        },
        {
            path: '/login',
            component: loginPage,
            meta: { requiresAuth: false }
        },
        {
            path: '/main',
            component: mainPage,
            children: [
                {
                    path: '',
                    component: warnView,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'warn',
                    component: warnView,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'factory',
                    component: factoryView,
                    children: [
                        {
                            path: 'timeData',
                            component: timeData,
                            meta: { requiresAuth: true }
                        },
                        {
                            path: 'historyData',
                            component: historyData,
                            meta: { requiresAuth: true }
                        },
                        {
                            path: 'curveData',
                            component: curveData,
                            meta: { requiresAuth: true }
                        },
                        {
                            path: 'timeVideo',
                            component: timeVideo,
                            meta: { requiresAuth: true }
                        },
                        {
                            path: 'historyVideo',
                            component: historyVideo,
                            meta: { requiresAuth: true }
                        }
                    ]
                }
            ]
        }
    ]
})

