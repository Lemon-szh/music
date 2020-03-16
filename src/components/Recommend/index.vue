<template>
  <div class="recommend">
    <!-- 滚动区域 -->
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <!-- 轮播图 -->
        <banner :banners="list"></banner>
        <!-- 歌曲列表 -->
        <div class="title">歌曲推荐列表</div>
        <ul class="list">
          <li v-for="(item,index) in recommendList" :key="index">
            <div class="left">
              <!-- v-lazy懒加载属性 -->
              <img v-lazy="item.imgurl" alt />
            </div>
            <div class="right">
              <p class="name">{{item.creator.name}}</p>
              <p class="album">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Banner from "../Banner";
import { getRecommendBanner, getRecommendList } from "../../api/api";

import BS from "better-scroll";
export default {
  name: "rec",
  components: { Banner },
  data() {
    return {
      list: [],
      recommendList: []
    };
  },
  methods: {
    initBs() {
      let wrapper = this.$refs.wrapper;
      this.bs = new BS(wrapper, {
        pullDownRefresh: { thresgold: 50, stop: 20 },
        pullUpLoad: { thresgold: 50 }
      });
      this.bs.on("pullingDown", () => {
        getRecommendList().then(res => {
          this.recommendList = res.data.list;
          // 下拉结束
          this.bs.finishPullDown();
        });
      });
      this.bs.on("pullingUp", () => {
        getRecommendList().then(res => {
          this.recommendList = res.data.list;
          // 上拉结束
          this.bs.finishPullUp();
        });
      });
    }
  },
  mounted() {
    getRecommendBanner().then(res => {
      this.list = res.data.slider;
    });
    getRecommendList().then(res => {
      this.recommendList = res.data.list;
    });
    this.initBs();
  },
  destroyed() {
    // console.log('推荐销毁')
  },
  activated() {
    // console.log('缓存组件激活')
  },
  deactivated() {
    // console.log('缓存组件失活')
  }
};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
.recommend {
  .wrapper {
    position: fixed;
    top: 88px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    .content {
      .w(375);
      .title {
        .w(375);
        height: 65px;
        text-align: center;
        line-height: 65px;
        font-size: @fs-s;
        color: @yellow;
      }
      .list {
        li {
          .w(375);
          height: 82px;
          box-sizing: border-box;
          padding: 0px 20px 20px 20px;
          display: flex;
          .left {
            width: 82px;
            height: 60px;
            img {
              width: 60px;
              height: 60px;
            }
          }
          .right {
            // vertical-align: baseline;
            color: #fff;
            font-size: @fs-s;
            padding-top: 10px;
            .name {
              margin-bottom: 10px;
            }
            .album {
              color: hsla(0, 0%, 100%, 0.3);
            }
          }
        }
      }
    }
  }
}
</style>