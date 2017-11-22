<template>
    <div class="loginContainer">
        <headerTop :head-title="loginWay?'登录':'密码登录'"></headerTop>
        <form class="loginForm" v-if="loginWay"></form>
        <form class="loginForm" v-else>
            <section class="input_container">
                <input type="text" placeholder="账号" v-model.lazy="userAccount">
            </section>
            <section class="input_container">
                <input type="password" placeholder="密码" v-model="passWord" v-if="!showPassword"/>
                <input type="text" placeholder="密码" v-model="passWord" v-else/>
                <div class="button_switch" @click="changePassWordType" :class="{change_to_text : showPassword}" >
                    <div class="circel_button" :class="{ trans_to_right : showPassword }"></div>
                    <span>abc</span>
                    <span>...</span>
                </div>
            </section>
            <section class="input_container captcha_code_container">
                <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
                <div class="img_change_img">
                    <img v-show="captchaCodeImg" :src="captchaCodeImg"/>
                    <div class="change_img" @click="getCaptchaCode">
                        <p>看不清</p>
                        <p>换一张</p>
                    </div>
                </div>
            </section> 
        </form>

        <p class="login_tips">温馨提示：未注册过的账号，登录时将自动注册</p>

        <p class="login_tips"> 注册过的用户可凭借账号密码登录 </p>

        <div class="login_container" @click="mobileLogin">登录</div>

        <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码？</router-link>

        <alertTip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alertTip>

    </div>
</template>

<script>
    import headerTop from '../../page/header/head.vue';
    import alertTip from '../../page/common/alertTip.vue'
    import { getcaptchas , accountLogin } from '../../server/getData';
    export default {
        name:'Login',
        data(){
            return{
                loginWay:false,//登录方式，默认短信登录  本页面只写了一种方式，因此这个参数不需要切换
                userAccount:null,//用户名
                showPassword:false,//是否明文显示密码
                passWord:null,//密码
                codeNumber:null,//验证码
                captchaCodeImg:null,//验证码地址
                showAlert:false,//是否显示alert
                alertText:null,//弹框文字
                userInfo:null,//用户信息
            }
        },
        mounted(){
            this.getCaptchaCode();
        },
        components:{
            headerTop,
            alertTip
        },
        methods:{
            //显示密码明文切换
            changePassWordType(){
                this.showPassword = !this.showPassword;
            },
            //刷新验证码
            async getCaptchaCode(){
                let res = await getcaptchas();
                console.log(res)
                this.captchaCodeImg = res.code;
            },
            //登录
            async mobileLogin(){
                if( this.loginWay ){//手机号码登录

                }else{//账户密码登录
                    if( !this.userAccount ){
                        this.showAlert = true;
                        this.alertText = '请输入手机号/邮箱/用户名';
                        return;
                    }else if( !this.passWord ){
                        this.showAlert = true;
                        this.alertText = '请输入密码';
                        return;
                    }else if( !this.codeNumber ){
                        this.showAlert = true;
                        this.alertText = '请输入验证码';
                        return;
                    }
                    //用户名登录
                    this.userInfo = await accountLogin(this.userAccount , this.passWord , this.codeNumber );
                } 
                if( !this.userInfo.user_id ){//如果登录不正确

                }else{//如果登录成功
                    this.$router.go(-1);
                }
            },
            //关闭alert方法
            closeTip(){
                this.showAlert = false;
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../../style/mixin.less';
    .loginContainer {
        padding-top:1.95rem;
        p,span,input {
            font-family: Arial, Helvetica, sans-serif;
        }
    }
    .loginForm {
        background-color:#fff;
        margin-top:0.6rem;
        .input_container {
            display: flex;
            justify-content: space-between;
            padding:0.6rem 0.8rem;
            border-bottom:1px solid #f1f1f1;
            input {
                .mixinsc(0.7rem,#666)
            }
        }
    }
    .button_switch {
        background-color: #ccc;
        display: flex;
        justify-content: center;
        .mixinwh(2rem,0.7rem);
        padding: 0 0.2rem;
        border:1px;
        border-radius:0.5rem;
        position: relative;
        .circel_button {
            transition: all 0.3s;
            position: absolute;
            top:-0.2rem;
            left: -0.3rem;
            .mixinwh(1.2rem,1.2rem);
            box-shadow: 0 0.026667rem 0.0533333rem 0 rgba(0,0,0,0.1);
            background-color:#f1f1f1;
            border-radius:50%;
        }
        .trans_to_right {
            transform: translateX(1.3rem);
        }
        span {
            .mixinsc(0.45rem,#fff);
            transform:translateY(0.05rem);
            line-height:0.6rem;
        }
        span:nth-of-type(2){
            transform: translateY(-0.08rem);
        }
    }
    .change_to_text {
        background-color:#4cd964;
    }
    .to_forget {
        float: right;
        .mixinsc(0.6rem,#3b95e9);
        margin-right:0.3rem;
    }
    .captcha_code_container {
        height: 2.2rem;
        .img_change_img {
            display: flex;
            align-items:center;
            img {
                .mixinwh(3.5rem, 1.5rem);
                margin-right:0.2rem;
            }
            .change_img {
                display: flex;
                flex-direction: 'column';
                flex-wrap:wrap;
                width:2rem;
                justify-content: center;
                p {
                    .mixinsc(0.55rem,#666);
                }
                p:nth-of-type(2){
                    color:#3b95e9;
                    margin-top:0.2rem;
                }
            }
        }
    }
    .login_tips {
        .mixinsc(0.5rem,red);
        padding:0.4rem 0.6rem;
        line-height:0.5rem;
        a {
            color: #3b95e9;
        }
    }
    .login_container {
        margin: 0 0.5rem 1rem;
        .mixinsc(0.7rem,#fff);
        background-color:#4cd964;
        padding:0.5rem 0;
        border:1px;
        border-radius: 0.15rem;
        text-align: center;
    }
</style>

