<template>
	<div class="header">
		<!--如果图片在public目录下直接用根路径/-->
		<img src="favicon.ico"/>
		<span>NZMUSIC</span>
		<i class="iconfont icon-wode" @click="changeMyView(true)"></i>
	</div>
</template>

<script>
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
	computed:{
		...mapState(['showMyView'])
	},
	methods:{
		...mapMutations(['changeMyView'])
	},
	watch:{
		showMyView(){
			//console.log(this.showMyView)
		}
	}
}
</script>

<style lang="less" scoped="">
@import "../../style/index.less";
@import "~style/icon/iconfont.css";
.header{
	color:@header-font;
	font-size:@fs-l;
	display: flex;
	justify-content: center;
	position: relative;
	align-items: center;
	.w(375);
	height: 44px;
	img{
		width: 18px;
		height: 18px;
	}
	i{
		position: absolute;
		right: 20px;
	}
}
</style>