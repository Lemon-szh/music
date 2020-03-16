<template>
  <div class='like'>
  	<div class="likeList" ref='likeWrapper'>
  		<ul>
  			<li v-for="(item,index) in likeList" @click="openPlayer(index)">
  				<h2>{{item.songname}}</h2>
  				<p>{{item.singername||item.singer[0].name||item.singer}}</p>
  			</li>
  		</ul>
  	</div>
  </div>
</template>
<script>
import Bs from 'better-scroll' 
import {mapMutations,mapGetters,mapState} from 'vuex'

export default {
  data(){
  	return {
  		likeList:[]
  	}
  },
  computed:{
  	...mapState(['showMyView','myState']),
		...mapGetters(['currentSong']),
  },
  methods:{
  	...mapMutations(['addSongList','changeCurrentIndex','changeScreen']),
		initBs(){
			let wrapper = this.$refs.likeWrapper;
			this.Bs = new Bs(wrapper,{probeType:3,click:true})
		},
		openPlayer(index){
			this.addSongList(this.likeList)
			this.changeCurrentIndex(index)
			this.changeScreen(true)
		},
  	getLikeList(){
  		let likeList = JSON.parse(localStorage.getItem('like'))
  		if(likeList && likeList.length>0){
  			this.likeList = likeList
  		}
  		this.$nextTick(()=>{
  			this.initBs()
  		})
  	}
  },
  created(){
  	this.getLikeList()
  },
  watch:{
  	showMyView(newVal,oldVal){
  		if(newVal){
  			setTimeout(()=>{
  				this.$refs.likeWrapper.style.display = 'block'
  				this.getLikeList()
  			},500)
  		}else{
  			this.$refs.likeWrapper.style.display = 'none'
  		}
  		
  	},
  	myState(){
  		console.log(22)
  		this.getLikeList()
  	}
  }
  	
}

</script>
<style lang="less" scoped>
@import '../../style/index.less';
@import "~style/icon/iconfont.css";
.likeList{
	position: fixed;
	top: 50px;
	z-index: 1;
	left: 0;
	right: 0;
	overflow: hidden;
	bottom: 70px;
}
.likeList ul li{
	width: 260px;
	height: 64px;
	margin: 0 auto;
	font-size: 14px;
	h2{
		margin-top: 10px;
		line-height: 22px;
		color:#FFF;
		font-size: 14px;
	}
	p{
		line-height: 22px;
		color: rgba(255,255,255,.3);
	}
}
</style>