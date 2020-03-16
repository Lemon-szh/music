import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
//import My from '../components/My';
//import Rank from '../components/Rank';
//import Singer from '../components/Singer/index.vue';
//import Recommend from '../components/Recommend';
//import Detail from '../components/Detail'
const Recommend = () => import('../components/Recommend');
const Singer = () => import('../components/Singer');
const Detail = () => import('../components/Detail');
const My = () => import('../components/My');
const Rank = () => import('../components/Rank');
const SonRank = () => import('components/SonRank')
const Search = () => import('components/Search')

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [{
      name: 'rec',
      path: '/recommend',
      component: Recommend
    },
    {
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      name: 'rank',
      path: '/rank',
      component: Rank,
      children: [{
        path: ':rankid',
        component: SonRank
      }]
    },
    {
      name: 'singer',
      path: '/singer',
      component: Singer,
      children: [{
        path: ':singermid',
        component: Detail
      }]
    },
    {
      name: 'my',
      path: '/my',
      component: My
    },
    {
      path: "/",
      redirect: "/recommend"
    }
  ]
})

export default router