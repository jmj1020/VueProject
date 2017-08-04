<style scoped>
@import '/static/css/login.css';
</style>
<template>
    <div class="loginPage">
        <div class="loginBg"></div>
        <div class="logotxt">
            <img src="static/img/logotxt.png">
        </div>
        <div class="panelBorder">
            <div class="panel">
                <div class="title">用户登录</div>
                <form class="form">
                    <div class="info">
                        <input type="text" placeholder="用户名" v-model="loginForm.username">
                        <input type="text" placeholder="密码" style="margin-top:30px;" v-model="loginForm.password">
                        <div class="btn" style="margin-top:30px;">
                            <span @click="onSubmit()">登&nbsp;&nbsp;&nbsp;&nbsp;录</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        onSubmit() {
            window.sessionStorage.setItem("user", 'root');
            this.$router.push({ path: '/main' })
        }
    }
}
</script>
