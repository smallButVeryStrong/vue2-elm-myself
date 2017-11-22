<template>
    <div class="msite_container">
        <div class="shop_list_container">
            <header class="shop_header">
                <span class="shop_header_title">附近商家</span>
            </header>
            <shopList :geohash="geohash"></shopList>
        </div>
    </div>
</template>

<script>
    import shopList from '../../page/common/shopList.vue';
    export default {
        name: 'Msite',
        data(){
            return {
                geohash:'',//url中地理位置参数
            }
        },
        beforeMount(){
            //取 geohash 值  暂时只做取值处理
            this.geohash = this.$route.query.geohash;
        },
        mounted(){

        },
        components:{
            shopList
        }
    }
</script>

<style lang="less" scoped>
    @import '../../style/mixin.less';
    .shop_list_container {
        margin-top: 0.4rem;
        border-top: 0.025rem;
        .shop_header {
            text-align: left;
            .shop_header_title {
                color: #999;
                .mixinfont( 0.55rem , 1.6rem );
            }
        }
    }

</style>
