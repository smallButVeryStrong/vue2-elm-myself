<template>
    <div class="city_container">
        <headerTop :head-title="cityname" go-back="true">
             <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link> 
        </headerTop>
        <form class="city_form" v-on:submit.prevent>
            <div>
                <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model="inputValue"/>
            </div>
            <div>
                <input type="submit" name="submit" class="city_submit input_style" @click="postpois" value="提交" />
            </div>
        </form>

        <header class="pois_search_history" v-if="historytitle" >搜索历史</header>

        <ul class="getpois_ul">
            <li v-for="( item , index ) in placeList " :key="index" @click="nextpage(index,item.geohash)">
                <h4 class="pois_name ellipsis">{{item.name}}</h4>
                <p class=" pois_address ellipsis">{{item.address}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    import headerTop from '../../page/header/head.vue';
    import { currentcity , searchplace } from '../../server/getData';
    export default {
        name:'City',
        data(){
            return {
                cityid:'',//当前城市id
                cityname:'',//城市名称
                inputValue:null,//搜索的地标名称
                placeList:[],//搜索城市列表
                historytitle:true,//默认显示搜索历史头部
            }
        },
        mounted(){
            this.cityid = this.$route.params.cityid;
            //获取当前城市名字
            currentcity(this.cityid).then( (res)=> {
                this.cityname = res.name
            })
            
        },
        methods:{
            //搜索地理位置 提交事件处理
            postpois(){
                if( this.inputValue ){
                    searchplace( this.cityid , this.inputValue ).then( (res) => {
                        this.placeList = res;
                        this.historytitle = false;
                    })
                }
            },
            //点击地理位置 跳转到对应商店页面
            nextpage(index,geohash){
                //先写一个简单的跳转
                this.$router.push({path:'/msite',query:{geohash}})
            }
        },
        components:{
            headerTop
        }
    }
</script>

<style lang="less" scoped>
    @import '../../style/mixin.less';
    .city_container {
        padding-top: 2.35rem;
    }
    .change_city {
        right: 0.4rem;
        .mixinsc(0.6rem,#fff);
        .mixinct;
    }
    .city_form {
        background-color: #fff;
        border-top: 1px solid @bc;
        border-bottom: 1px solid @bc;
        padding-top: 0.4rem;
        div {
            width:90%;
            margin: 0 auto;
            text-align: center;
            .input_style {
                border-radius: 0.1rem;
                margin-bottom: 0.4rem;
                .mixinwh(100%,1.4rem);
            }
            .city_input {
                border: 1px solid @bc;
                padding: 0 0.3rem;
                .mixinsc(0.65rem,#333);
            }
            .city_submit {
                background-color: @blue;
                .mixinsc(0.65rem,#fff);
            }
        }
    }
    .pois_search_history {
        border-top: 1px solid @bc;
        border-bottom: 1px solid @bc;
        padding-left: 0.5rem;
        .mixinfont( 0.475rem,0.8rem );
        text-align: left;
    }
    .getpois_ul {
        backgrund-color: #fff;
        border-top: 1px solid @bc;
        text-align: left;
        li {
            margin: 0 auto;
            padding-top: 0.65rem;
            border-bottom: 1px solid @bc;
            .pois_name {
                margin: 0 auto 0.35rem;
                width: 90%;
                .mixinsc( 0.65rem , #333 );
            }
            .pois_address {
                width: 90%;
                margin: 0 auto 0.55rem;
                .mixinsc( 0.45rem , #999 );
            }
        }
    }
</style>

