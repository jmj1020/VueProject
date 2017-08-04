<style scoped>
.layout-logo {
    border-radius: 3px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    text-indent: 20px;
}

.ivu-menu-horizontal {
    line-height: 50px;
    height: inherit;
}

.layout-nav {
    text-align: center;
}

.layout-nav li {
    padding: 0px;
}

.layout-nav a,
.layout-ceiling-main a {
    color: inherit;
    display: inline-block;
}

.layout-ceiling-main {
    float: right;
    margin-right: 15px;
}

.exit {
    cursor: pointer;
}

.exit:hover {
    font-size: 16px;
    color: #2d8cf0;
}

.phoneTab {
    text-align: right;
    padding-right: 20px;
    font-size: 26px;
    cursor: pointer;
}

.phone-nav {
    text-indent: 20px;
    border-bottom: 1px solid #dddee1;
}

.phone-nav li {
    padding: 0px;
    width: 100%;
}
</style>
<template>
    <Menu mode="horizontal" theme="light" :active-name="activeName">
        <!--xs<768px; sm≥768px; md≥992px; lg≥1200px -->
        <Row>
            <Col :xs="20" :sm="24" :md="5" :lg="4" class="layout-logo">vueproject</Col>
            <Col :xs="0" :sm="{ span: 2, offset: 1}" :md="{ span: 2, offset: 2 }" :lg="{ span: 2, offset: 2 }" class="layout-nav">
            <Menu-item name="/main">
                <router-link class="nav-item" to="/main">meun0</router-link>
            </Menu-item>
            </Col>
            <Col :xs="0" :sm="3" :md="2" :lg="2" class="layout-nav">
            <Menu-item name="/main/factory/timeData">
                <router-link class="nav-item" to="/main/factory/timeData">meun1</router-link>
            </Menu-item>
            </Col>
            <Col :xs="0" :sm="3" :md="2" :lg="2" class="layout-nav">
            <Menu-item name="/main/factory/historyData">
                <router-link class="nav-item" to="/main/factory/historyData">meun2</router-link>
            </Menu-item>
            </Col>
            <Col :xs="0" :sm="3" :md="2" :lg="2" class="layout-nav">
            <Menu-item name="/main/factory/curveData">
                <router-link class="nav-item" to="/main/factory/curveData">meun3</router-link>
            </Menu-item>
            </Col>
            <Col :xs="0" :sm="3" :md="2" :lg="2" class="layout-nav">
            <Menu-item name="/main/factory/timeVideo">
                <router-link class="nav-item" to="/main/factory/timeVideo">meun4</router-link>
            </Menu-item>
            </Col>
            <Col :xs="0" :sm="3" :md="2" :lg="2" class="layout-nav">
            <Menu-item name="/main/factory/historyVideo">
                <router-link class="nav-item" to="/main/factory/historyVideo">meun5</router-link>
            </Menu-item>
            </Col>
            <Col :xs="0" :sm="{ span: 4}" :md="{ span: 4, offset: 1 }" :lg="{ span: 3, offset: 3 }" class="layout-nav">
            <span>欢迎{{user}}登陆</span> |
            <span @click="exit()" class="exit">退出</span>
            </Col>
            <Col :xs="4" :sm="0" :md="0" :lg="0" class="phoneTab">
            <span @click="toggleMenu()">≡</span>
            </Col>
        </Row>
    </Menu>
</template>

<script>
export default {
    name: 'menuPhone',
    data() {
        return {
            user: '',
            phoneMenu: 0,
            activeName: '1'
        }
    },
    methods: {
        toggleMenu() {
            this.$set(this, 'phoneMenu', !this.phoneMenu)
        },
        exit() {
            this.$http.get('/api/user/exit').then((response) => {
                if (response.data.code == '0') {
                    sessionStorage.removeItem("user");
                    this.$router.push({ path: '/' });
                } else {
                    console.error('退出失败')
                }
            }).catch(function (response) {
                console.error('退出失败', '网络错误，请稍后重试')
            })
        }
    },
    mounted() {
        let user = sessionStorage.getItem("user");
        if (!user) {
            this.$router.push({ path: '/' })
        } else {
            this.$set(this, 'user', user);
            this.$set(this, 'activeName', this.$route.path);
        }
    }
}
</script>
