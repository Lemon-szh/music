(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-734eccf0"],{"31ab":function(n,t,a){},"7d74":function(n,t,a){"use strict";a.r(t);var e=function(){var n=this,t=n.$createElement,a=n._self._c||t;return a("div",{staticClass:"rank"},[a("div",{ref:"rankWrapper",staticClass:"wrapper"},[a("ul",{staticClass:"list"},n._l(n.rankData,(function(t,e){return a("li",{key:e,on:{click:function(a){return n.showRank(t.id)}}},[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.picUrl,expression:"item.picUrl"}],attrs:{alt:""}}),a("ul",n._l(t.songList,(function(t,e){return a("li",{key:e},[a("span",[n._v(n._s(e+1))]),n._v(" "+n._s(t.songname)+n._s(t.singername)+" ")])})),0)])})),0)]),a("router-view")],1)},i=[],r=a("4ec3"),s=a("1fba"),c={name:"rank",data:function(){return{rankData:[]}},methods:{initBs:function(){var n=this.$refs.rankWrapper;this.Bs=new s["a"](n,{probeType:3,click:!0})},showRank:function(n){this.$router.push("/rank/".concat(n))}},created:function(){var n=this;Object(r["c"])().then((function(t){n.rankData=t.data.topList,n.$nextTick((function(){n.initBs()}))}))}},u=c,o=(a("c313"),a("2877")),l=Object(o["a"])(u,e,i,!1,null,"7ef10398",null);t["default"]=l.exports},c313:function(n,t,a){"use strict";var e=a("31ab"),i=a.n(e);i.a}}]);
//# sourceMappingURL=chunk-734eccf0.41b2efe2.js.map