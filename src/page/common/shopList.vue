<template>
  <div class="shopList_container">
        <ul type="1">
            <router-link tag="li" :to="{path:'shop',query:{geohash,id:item.id}}" v-for="item in shopListArr" :key="item.id" class="shop_li">
                <!--预留图片位置-->
                <!--列表文字项-->
                <div class="shop_right">
                    <header class="shop_detail_header">
                        <h4 class="shop_title ellipsis">{{item.name}}</h4>
                        <ul class="shop_detail_ul">
                            <li for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
                        </ul>
                    </header>
                </div>
            </router-link>
            
        </ul>
  </div>
</template>

<script>
    import { shopList } from '../../server/getData'
    export default {
        name:'ShopList',
        data(){
            return {
                shopListArr:[],//店铺列表数据
            }
        },
        mounted(){
            this.initData();
        },
        props:['geohash'],
        methods:{
            async initData (){
                //获取数据 传递参数先写死 
                let res = await shopList(39.99287,116.31025,0)
                this.shopListArr = [ ...res ];
            }
        }
    }

</script>

<style lang="less" scoped>
    @import '../../style/mixin.less';
    .shopList_container {
        background-color: #fff;
        margin-bottom: 2rem;
    }
    .shop_li {
        display: flex;
        border-bottom: 0.025rem solid #f1f1f1;
        padding: 0.7rem 0.4rem;
    }
    .shop_right {
        flex: auto;
        .shop_detail_header {
            .mixinfj;
            align-items: center;
            .shop_title {
                width: 8.5rem;
                color: #333;
                padding-top: 0.01rem;
                .mixinfont(0.65rem,0.65rem,'PingFangSC-Regular');
                font-weight: 700;
            }
        }
    }

</style>

