import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

const home = r => require.ensure([], () => r(require('../components/home/home')), 'home')
const login = r => require.ensure([], () => r(require('../components/login/login.vue')), 'login')
const forget = r => require.ensure([], () => r(require('../components/forget/forget.vue')), 'forget')
const city = r => require.ensure([], () => r(require('../components/city/city.vue')), 'city')
const msite = r => require.ensure([], () => r(require('../components/msite/msite.vue')), 'msite')
const shop = r => require.ensure([], () => r(require('../components/shop/shop.vue')), 'shop')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component:App,//这个必须写
      children:[
        {
          path:'',
          redirect: '/home'
        },{
          path:'/home',
          name:'Home',
          component:home
        },{
          path:'/city/:cityid',
          name:'City',
          component:city
        },{
          path:'/msite',
          name:'Msite',
          component: msite
        },{
          path:'/shop',
          name:'Shop',
          component: shop
        }
      ]
    },{
      path:'/login',
      name:'Login',
      component:login
    },{
      path:'/forget',
      name:'Forget',
      component:forget
    }
  ]
})




