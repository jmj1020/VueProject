<style scoped>
.warnContent {
    padding: 20px;
}

.warnheight {
    height: 400px;
}

.warnheight.left {
    padding-right: 10px;
}

.warnheight.right {
    padding-left: 10px;
}

@media screen and (max-width: 768px) {
    .warnheight.left {
        padding-right: 0px;
    }

    .warnheight.right {
        padding-left: 0px;
        margin-top: 20px;
    }
}
</style>

<template>
    <div class="warnContent">
        <Row>
            <!--xs<768px; sm≥768px; md≥992px; lg≥1200px -->
            <Col :xs="24" :sm="14" :md="16" :lg="16"  class="warnheight left">
            <div>
                <warn-map></warn-map>
            </div>
            </Col>
            <Col :xs="24" :sm="10" :md="8" :lg="8" class="warnheight right">
            <div>
                <warn-list></warn-list>
            </div>
            </Col>
        </Row>
        <Row>
            <Col span="24">
            <div class="warnheight" style="margin-top:20px;">
                <warn-chart></warn-chart>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import warnMap from './map.vue'
import warnList from './list.vue'
import warnChart from './chart.vue'
export default {
    components: {
        warnMap,
        warnList,
        warnChart
    }
}
</script>
