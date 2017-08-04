<style scoped>
.factory {
    background: #fafafa;
    border-right: 1px solid #dddee1;
    border-left: 1px solid #dddee1;
    max-height: 500px;
    overflow: auto;
    border-radius: 10px;
}

.csite {
    padding: 10px 20px;
    font-size: 14px;
    border-bottom: 1px solid #dddee1;
    cursor: pointer;
}

.csite:first-child {
    border-top: 1px solid #dddee1;
}

.csite:hover {
    background: #abe3fa;
}

.csite.menuSelect {
    background: #2d8cf0;
    color: #fff;
    font-size: 14px;
}
</style>

<template>
    <div class="factory" id="factory">
        <div class="csite" v-bind:class="{ 'menuSelect': menuSelect == item.id}" @click="treeClick(item.id)" v-for="(item,index) in factoryList" v-bind:key="item">
            {{item.csiteName}}
        </div>
    </div>
</template>

<script>
export default {
    name: "factory",
    data() {
        return {
            factoryList: [],
            menuSelect: '',
        }
    },
    methods: {
        getFactory() {
            this.$http.get('/api/csite/all').then(response => {
                var items = response.data.data;
                this.$set(this, 'factoryList', items);
                this.$set(this, 'menuSelect', items[0].id);
                this.treeClick(items[0].id);
            }).catch((response) => {
                console.error(response);
            });
        },
        //通过this.$root.eventHub获取此对象
        //调用$emit 方法
        treeClick(id) {
            this.$set(this, 'menuSelect', id);
            this.$root.eventHub.$emit('treeClicked', id);
        },
    },
    mounted() {
        this.getFactory();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": "getFactory"
    }
}
</script>