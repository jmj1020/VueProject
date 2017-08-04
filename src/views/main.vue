<style scoped>
</style>
<template>
    <div class="layout" id="main">
        <header-tab></header-tab>
        <div class="layout-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import HeaderTab from './../components/header.vue';
export default {
  name: 'main',
  data() {
    return {
    }
  },
  components: {
    HeaderTab
  },
  mounted(){
  }
}
</script>

