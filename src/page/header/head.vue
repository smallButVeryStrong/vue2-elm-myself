<template>
  <header id="head_top">
    <slot name="logo"></slot>
    <slot name="search"></slot>
    <slot name="changecity"></slot>
    <!-- <section class="head_goback"  @click="$router.go(-1)">
        <svg width="100%" height="100%" xmlns="https://www.w3.org/2000/svg" version="1.1">
            <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255) stroke-width:2"/>
        </svg>
    </section> -->
    <router-link class="head_login" :to="'login'" v-if="signinUp">
        <span class="login_span">登录|注册</span>
    </router-link>
     <section class="title_head" v-if="headTitle">
        <span class="title_text">{{headTitle}}</span>
    </section> 
  </header>
</template>

<script>
//获取辅助函数
    import { mapState , mapActions } from 'vuex';
    export default {
        data(){
            return {

            }
        },
        mounted(){
            //获取用户信息
            this.getUserInfo();
        },
        props:['headTitle','signinUp'],//父组件传递过来的信息
        computed:{
            //将store里边的userInfo信息传递的到head里边
            ...mapState([
                'userInfo'
            ]),
        },
        methods:{
            //将store里边的获取userInfo action传递过来
            ...mapActions([
                'getUserInfo'
            ]),
        }
    }
</script>

<style lang="less" scoped>
    @import '../../style/mixin.less';
    #head_top {
        background-color:@blue;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        .mixinwh(100%,1.95rem);
    }
    .head_login {
        right:0.55rem;
        .mixinsc(0.65rem,#fff);
        .mixinct;
        .login_span {
            color:#fff;
        }
    }
    .title_head {
        .mixincenter;
        color:#fff;
        text-align:center;
        .title_text {
            .mixinsc(0.8rem,#fff);
            font-weight:bold;
        }
    }
</style>

