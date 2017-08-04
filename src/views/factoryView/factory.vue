<style scoped>
.factoryContent{
    padding: 20px;
}
</style>
<template>
    <div class="factoryContent">
        <Row>
            <Col :xs="0" :sm="6" :md="6" :lg="5" style="padding-right:20px;">
            <cpmponent-tree></cpmponent-tree>
            </Col>
    
            <Col :xs="24" :sm="0" :md="0" :lg="0" style="margin-bottom:10px;">
            <phone-tree></phone-tree>
            </Col>
    
            <Col :xs="24" :sm="18" :md="18" :lg="19">
            <router-view></router-view>
            </Col>
        </Row>
    </div>
</template>

<script>
import cpmponentTree from '../../components/tree.vue'
export default {
    components: {
        cpmponentTree
    }
}
</script>

