<template>
  <div class="shop_container">
        <section class="change_show_type" ref="chooseType">
            <div>
                <span :class="{ activity_show : changeShowType == 'food' }" @click="changeShowType='food'">商品</span>
            </div>
            <div>
                <span :class="{ activity_show : changeShowType == 'rating' }" @click="changeShowType='rating'">评价</span>
            </div>
        </section>
        <!--展示商品列表-->
        <transition name="fade-choose">
            <!-- <section @click="hh" v-if="ok">
                333333
            </section> -->
            <section v-show="changeShowType == 'food'" class="food_container">
                <section class="menu_container">
                    <!--内容左侧-->
                     <section class="menu_left" id="wrapper_menu" ref="wrapperMenu" >
                         <ul>
                             <li v-for="(item,index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu : index == menuIndex}" @click="chooseMenu(index)">
                                 <img :src="getImgPath(item.icon_url)" v-if="item.icon_url" />
                                 <span>{{item.name}}</span>
                             </li>
                         </ul>
                     </section>

                     <!--内容右侧-->
                     <section class="menu_right" ref="menuFoodList">
                         <ul>
                             <li v-for="(item,index) in menuList" :key="index">
                                 <header class="menu_detail_header">
                                     <section class="menu_detail_header_left">
                                         <strong class="menu_item_title">{{item.name}}</strong>
                                         <span class="menu_item_description">{{item.description}}</span>
                                     </section>
                                 </header>
                                 <section class="menu_detail_list" v-for="(foods,foodIndex) in item.foods" :key="foodIndex">
                                     <router-link  :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">
                                        <section class="menu_food_img">
                                            <img :src="imgBaseUrl + foods.image_path" />
                                        </section>
                                        <section class="menu_food_description">
                                            <h3 class="food_description_head">
                                                <strong class="description_foodname">{{foods.name}}</strong>
                                                <ul v-if="foods.attributes.length" class="attributes_ul">
                                                    <li v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color,borderColor:'#' +attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">
                                                        <p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>
                                                    </li>
                                                </ul>
                                            </h3>
                                            <p class="food_description_content">{{foods.description}}</p>
                                                <p class="food_description_sale_rating">
                                                    <span>月售{{foods.month_sales}}份</span>
                                                    <span>好评率{{foods.satisfy_rate}}%</span>
                                                </p>
                                                <p v-if="foods.activity" class="food_activity">
                                                <span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                                            </p>
                                        </section>
                                     </router-link>
                                 </section>
                             </li>
                         </ul>
                     </section>
                </section>
            </section>
        </transition>
  </div>
</template>

<script>
    import { foodMenu } from '../../server/getData';
    import { getImgPath } from '../../page/common/mixin';
    import { imgBaseUrl } from '../../config/evn';
    import BScroll from 'better-scroll';
    export default {
        name:'Shop',
        data(){
            return {
                changeShowType:'food',//切换显示商品或者评价
                ok:true,//测试状态
                menuList:[],//食品列表
                shopId:null,//商铺id
                geohash:'',//位置信息
                menuIndex: 0,//已选菜单默认下标值
                shopListTop:[],//商品列表高度集合
                foodScroll:null,//食品列表scoll
                imgBaseUrl,//这个参数为什么要早这里写一遍  ？？？？？？？？？？？？？？？？？？？？？？？？？？？？？ this的问题？？？？？
                showLoading:true,//显示loading
                menuIndexChange:true,//解决选中index时，scroll监听事件重复设置index的bug
            }
        },
        mounted(){
            this.geohash = this.$route.query.geohash;
            this.shopId = this.$route.query.id;
            this.initData();
        },
        methods:{
            hh(){
                this.ok = !this.ok
            },
            //初始化数据
            async initData(){
                //获取商铺食品列表
                let res = await foodMenu(1148);
                this.menuList = res;
                this.showLoading = false;
            },
            //点击左侧食品列表标题，相应列表移动到最顶层
            chooseMenu(index){
                console.log(index)
                this.menuIndex = index;
                //menuIndexChange解决运动时 listenScroll依然监听的bug
                this.menuIndexChange = false;
                this.foodScroll.scrollTo( 0 , -this.shopListTop[index] , 400 )
                //运动结束 menuIndexChange 更新为true
                this.foodScroll.on('scrollEnd',()=>{
                    
                    this.menuIndexChange = true;
                })
            },
            //获取食品列表的高度，存入shopListTop
          getFoodListHeight(){
            const listContainer = this.$refs.menuFoodList;
            const listArr = Array.from(listContainer.children[0].children);//将获取的节点伪数组转换成真正的数组
            listArr.forEach( (item,index) => {
              this.shopListTop[index] = item.offsetTop;
            });

            //获取元素实时的高度
            this.listScroll(listContainer);//获取元素listContainer实时位置
          },
            //获取元素listContainer实时位置函数
            listScroll(element){
                this.foodScroll = new BScroll(element , {
                    probeType: 3,
                    bounce:false,
                    click:true
                });

                const wrapperMenu = new BScroll('#wrapper_menu',{
                    click:true,
                })

                const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;

                //手动滚动食品列表，左边品牌
                this.foodScroll.on('scroll',(pos)=> {
                    //wrapperMenu 是左侧菜单  如果左侧菜单不存在
                    if( !this.$refs.wrapperMenu ){
                        return;
                    }
                    //如果左侧菜单存在
                    this.shopListTop.forEach((item,index)=> {
                        if( this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item ){
                            this.menuIndex = index;
                            const menuList = this.$refs.wrapperMenu.querySelectorAll(".activity_menu");
                            const el = menuList[0];
                            wrapperMenu.scrollToElement(el,800,0,-(wrapMenuHeight/2-50));
                        }
                    })
                })
            }
        },
        watch:{
            //监听数据是否请求完毕，并已经装载
            showLoading:function(value){//value 就是showLoading的值
                if( !value ){
                    this.$nextTick( () => {//$nextTick 检测到DOM更新循环结束之后
                        this.getFoodListHeight();
                    })
                }
            }
        },
        //混入方法
        mixins:[getImgPath]
    }
</script>

<style lang="less" scoped>
    @import '../../style/mixin.less';
    .shop_container {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        left: 0;
        height: 100%;
    }
    .change_show_type {
        margin-top: 10rem;
        display: flex;
        background-color: #fff;
        padding: 0.3rem 0.6rem;
        border-bottom: 1px solid #ebebeb;
        div {
            flex: 1;
            text-align: center;
            span {
                .mixinsc( 0.65rem , #666 );
                padding: 0.2rem 0.1rem;
                border-bottom: 0.12rem solid #fff;
            }
            .activity_show {
                color: #3190e8;
                border-color: #3190e8;
            }
        }
    }

    .food_container {
        display: flex;
        flex: 1;
        padding-bottom: 2rem;
    }
    .menu_container {
        display: flex;
        flex: 1;
        overflow-y: hidden;
        position: relative;
        .menu_left {
            width: 3.8rem;
            .menu_left_li {
                height: 8rem;
                padding: 0.7rem 0.3rem;
                border-bottom: 0.025rem solid #ededed;
                box-sizing: border-box;
                border-left: 0.15rem solid #f8f8f8;
                position: relative;
                img {
                    .mixinwh( 0.5rem , 0.6rem );
                }
                span {
                    .mixinsc(0.6rem,#666);
                }
            }
            .activity_menu {
                border-left: 0.15rem solid #3190e8;
                background-color:#fff;
                span:nth-of-type(1) {
                    font-weight: bold;
                }
            }
        }
        .menu_right {
            flex:4;
            overflow-y: auto;
            .menu_detail_header {
                width: 100%;
                padding: 0.4rem;
                position: relative;
                .mixinfj;
                text-align: left;
                .menu_detail_header_left {
                    width: 11rem;
                    white-space: nowrap;
                    overflow: hidden;
                    .menu_item_title {
                        .mixinsc(0.7rem,#666);
                        font-weight: bold;
                    }
                    .menu_item_description {
                        .mixinsc(0.5rem,#999);
                        width: 30%;
                        overflow:hidden;
                    }
                }
            }
            .menu_detail_list{
                background-color: #fff;
                padding: 0.6rem 0.4rem;
                border-bottom: 1px solid #f8f8f8;
                position: relative;
                overflow: hidden;
                .menu_detail_link{
                    display:flex;
                    .menu_food_img{
                        margin-right: .4rem;
                        img{
                            .mixinwh(2rem, 2rem);
                            display: block;
                        }
                    }
                    .menu_food_description{
                        text-align: left;
                        width: 100%;
                        .food_description_head{
                            .mixinfj;
                            margin-bottom: .2rem;
                            .description_foodname{
                                .mixinsc(.7rem, #333);
                            }
                            .attributes_ul{
                                display: flex;
                                li{
                                    font-size: .3rem;
                                    height: .6rem;
                                    line-height: .35rem;
                                    padding: .1rem;
                                    border: 1px solid #666;
                                    border-radius: 0.3rem;
                                    margin-right: .1rem;
                                    transform: scale(.8);
                                    p{
                                        white-space: nowrap;
                                    }
                                }
                                .attribute_new{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    background-color: #4cd964;
                                    .mixinwh(2rem, 2rem);
                                    display: flex;
                                    align-items: flex-end;
                                    transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                                    border: none;
                                    border-radius: 0;
                                    p{
                                        .mixinsc(.4rem, #fff);
                                        text-align: center;
                                        flex: 1;
                                    }
                                }
                            }
                        }
                        .food_description_content{
                            .mixinsc(.5rem, #999);
                            line-height: .6rem;
                        }
                        .food_description_sale_rating{
                            line-height: .8rem;
                            span{
                                .mixinsc(.5rem, #333);
                            }
                        }
                        .food_activity{
                            line-height: .4rem;
                            span{
                                font-size: .3rem;
                                border: 1px solid currentColor;
                                border-radius: 0.3rem;
                                padding: .08rem;
                                display: inline-block;
                                transform: scale(.8);
                                margin-left: -0.35rem;

                            }
                        }
                    }
                }
            }
        }
    }




    // .fade-choose-enter-active, .fade-choose-leave-active {
    //     transition: opacity 3s;
    // }


</style>
