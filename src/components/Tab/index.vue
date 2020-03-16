<template>
	<div class="tab">
		<router-link to="/recommend" tag="div" active-class="sel">
			<span>推荐</span>
		</router-link>
		<router-link to="/singer" tag="div" active-class="sel">
			<span>歌手</span>
		</router-link>
		<router-link to="/rank" tag="div" active-class="sel">
			<span>排行</span>
		</router-link>
		<router-link to="/search" tag="div" active-class="sel">
			<span>搜索</span>
		</router-link>
	</div>
</template>

<script>
</script>

<style lang="less" scoped="">
@import "../../style/index.less";
.tab{
	.w(375);
	height:44px;
	display:flex;
	div{
		width: 25%;
		font-size: @fs-s;
		color:rgba(255,255,255,0.5);
		text-align:center;
		line-height:44px;
		span{
			display:inline-block;
			height:28px;
			padding-bottom:5px;
			border-bottom: 1px solid @color-black-2;
		}
	}
	.sel{
		color:@header-font;
		span{
			display:inline-block;
			height:28px;
			border-bottom: 1px solid @header-font;
		}	
	}
}
</style>