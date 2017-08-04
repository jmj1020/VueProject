<!--App.vue是项目入口文件。-->
<style scoped>
.layout {
  border: 0px;
}

.layout-content {
  margin: 2px;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
</style>
<template>
  <div class="layout" id="app">
    <!--<transition name="slide-fade">-->
      <router-view></router-view>
    <!--</transition>-->
  </div>
</template>

<script>
import loginPage from './views/login'

export default {
  name: 'app',
  components: {
    loginPage
  }
}
</script>



