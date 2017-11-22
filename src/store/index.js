
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './action'
import mutations from './mutations'

//在vue中引入Vuex
Vue.use(Vuex);

const state = {
    userInfo:null,//用户信息
}

//创建vue 状态管理器 并导出
export default new Vuex.Store({
    state,
    actions,
    mutations,
})