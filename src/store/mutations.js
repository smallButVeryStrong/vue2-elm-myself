

import {
    GET_USERINFO
} from './mutation-types.js'

export default {
    //获取用户信息，存入vuex
    [GET_USERINFO](state,info){
        //如果userInfo存在 并且是同一个人 return
       if( state.userInfo && (state.userInfo.username == info.username) ){
           return;
       }
       if( !info.message ){
           state.userInfo = { ...info };
       }else{
           state.userInfo = null;
       }
    }
}