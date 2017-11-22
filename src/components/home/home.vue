<template>
  <div>
     <headTop signin-up="home">
      <span slot="logo" class="head_logo" @click="reload">ele.me</span>
    </headTop> 
    <nav class="city_nav">
      <div class="city_tip">
        <span>当前定位城市：</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/'+guessCityId" class="guess_city">
        <span>{{guessCity}}</span>
        <svg class="arrow_right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
    </nav>

    <!--热门城市列表-->
    <section id="hot_city_container">
      <h4 class="city_title">热门城市</h4>
      <ul class="citylistul clear">
        <router-link tag="li" v-for="item in hotcity" :key="item.id" :to="'/city/' + item.id">
          {{item.name}}
        </router-link>
      </ul>
    </section>

    <!--按字母排序列表-->
    <section class="group_city_container">
      <ul class="letter_classify">
        <li v-for="(value,key,index) in sortgroupcity" :key="key" class="letter_classify_li">
          <h4 class="city_title">
            {{key}}
            <span v-if="index==0">(按字母排序)</span>
          </h4>
          <ul class="citylistul clear">
            <router-link tag="li" v-for="item in value" :key="item.id" :to="'/city/' + item.id" class="ellipsis">
              {{item.name}}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import { hotcity , groupcity , cityGuess } from '../../server/getData';
  import headTop from '../../page/header/head'//组件引入之后要注册
  export default {
    name:'Home',
    data(){
      return {
        guessCity:'',//当前城市
        guessCityId:'',//当前城市id
        hotcity:[],//热门城市列表
        groupcity:{},//所有城市列表
      }
    },
    mounted:function(){
      //获取热门城市
      hotcity().then(res => {
        this.hotcity = res;
      })

      //获取所有城市列表
      groupcity().then(res => {
        this.groupcity = res;
      })

      //获取当前城市
      cityGuess().then(res => {
        this.guessCity = res.name;
        this.guessCityId = res.id;
      })
    },
    components:{
      headTop
    },
    computed:{
      //将获取的数据按照A-Z字母开头排序
      sortgroupcity:function(){
        let sortobj = {};
        for( let i = 65 ; i <= 90 ; i++ ){
          if( this.groupcity[String.fromCharCode(i)] ){
            sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)]
          }
        }
        return sortobj;
      }
    },
    methods:{
      //点击图标刷新页面
      reload(){
        window.location.reload();
      }
    }

  }


</script>

<style lang="less" scoped>
  @import '../../style/mixin';//mixin less混合形式的写法，传递参数，可以实现固定的样式
  //scoped 样式只应用于当前组件
  .city_nav {
    padding-top:2.35rem;
    border-top:1px solid #999;
    background-color:#fff;
    margin-bottom:0.4rem;

    .city_tip {
      line-height: 1.45em;
      padding:0 0.45rem;
      .mixinfj;

      span:nth-of-type(1){
        .mixinsc(0.475rem,#9f9f9f)
      }

      span:nth-of-type(2) {
        font-weight:900;
        .mixinsc(0.475rem,#9f9f9f)
      }
    }

    .guess_city {
      .mixinfj;
      align-items:center;
      height: 1.8rem;
      padding: 0 0.45rem;
      border-top: 1px solid @bc;
      border-bottom: 1px solid @bc;
      .mixinfont(0.7rem,1.8rem);
      span:nth-of-type(1){
        color:@blue;
      }
      .arrow_right{
        .mixinwh(0.6rem,0.6rem);
        fill:#999;
      }
    }
  }

  #hot_city_container {
    background-color:#fff;
    margin-bottom:0.4rem;
  }
  .city_title {
    color:#666;
    font-weight:400;
    text-align:left;
    text-indent:0.45rem;
    border-top:1px solid @bc;
    border-bottom: 1px solid @bc;
    .mixinfont(0.55rem,1.45rem)
  }
  .citylistul {
    li {
      float: left;
      text-align:center;
      color:@blue;
      border-bottom:1px solid @bc;
      border-right:0.025rem solid @bc;

      .mixinwh(25%,1.75rem);
      .mixinfont(0.6rem,1.75rem);
    }
    li:nth-of-type(4n){
      border-right:none;
    }
  }
  .ellipsis {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color:#666!important;
  }
  .head_logo {
    left: 0.4rem;
    font-weight:400;
    .mixinsc(0.7rem,#fff);
    .mixinwh(2.3rem,0.7rem);
    .mixinct;
  }
</style>


