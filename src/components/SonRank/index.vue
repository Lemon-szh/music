<template>
  <div class="rankson">
    <div class="top">
      <span @click="back()" class="iconfont icon-left arrow"></span>
      <p>{{topData.ListName}}</p>
    </div>
    <!--头像-->
    <div class="avator" :style="{'background-image':`url(${topData.img})`}" ref="img">
      <div class="shadow"></div>
    </div>

    <!--滚动-->
    <div class="songList" ref="wrapper">
      <div class="content">
        <ul>
          <li v-for="(item,index) in rankList" :key="index" @click="openPlayer(index)">
            <span>{{index+1}}</span>
            <div>
              <h3>{{item.songname}}</h3>
              <p>{{item.singer}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getRankSon } from "api/api.js";
import Bs from "better-scroll";
import { mapMutations, mapGetters } from "vuex";
import { filterData } from "./filter.js";
import { getSongByMid, getSongUrlByMid } from "api/api.js";

export default {
  data() {
    return {
      rankList: [],
      topData: {}
    };
  },
  methods: {
    ...mapMutations(["addSongList", "changeCurrentIndex", "changeScreen"]),
    openPlayer(index) {
      // console.log(this.rankList);
      this.addSongList(this.rankList);
      this.changeCurrentIndex(index);
      this.changeScreen(true);
    },
    back() {
      this.$router.go(-1);
    },
    initBs() {
      let img = this.$refs.img;
      let imgH = img.clientHeight;
      let wrapper = this.$refs.wrapper;
      this.Bs = new Bs(wrapper, { probeType: 3, click: true });
      this.Bs.on("scroll", ({ y }) => {
        // console.log(imgH)
        if (y >= 0) {
          //向下拉动
          let precent = 1 + y / imgH;
          img.style.transform = `scale(${precent})`;
        } else {
          //向上滚动
          //没有滚动到顶部，滚动层级高
          //滚到顶部，图片层级高
          if (Math.abs(y) >= imgH - 40) {
            img.style.zIndex = 1;
            img.style.padding = "0px";
            img.style.height = "40px";
          } else {
            img.style.zIndex = 0;
            img.style.paddingTop = "70%";
            img.style.height = "40px";
          }
        }
      });
    },
    async getSingerData() {
      let mids = [];
      for (let i = 0; i < this.rankList.length; i++) {
        mids.push(this.rankList[i].songmid);
      }
      let { urls } = await getSongUrlByMid(mids);
      let finalData = [];
      for (let index = 0; index < this.rankList.length; index++) {
        this.rankList[index].audioUrl = urls[index];
        if (urls[index]) {
          // 将不能播放的歌曲去除
          finalData.push(this.rankList[index]);
        }
      }
      this.rankList = finalData;
      this.topData.img = this.rankList[0].albumUrl;
    }
  },
  async created() {
    let { rankid } = this.$route.params;
    getRankSon(rankid).then(data => {
      // console.log(data);
      this.topData.ListName = data.topinfo.ListName;
      this.rankList = filterData(data);
      this.getSingerData();
      // console.log(this.rankList);
      this.initBs();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
@import "~style/icon/iconfont.css";
.rankson {
  position: fixed;
  top: 0px;
  bottom: 0px;
  background: #222;
  left: 0px;
  right: 0px;
}
.top {
  height: 40px;
  color: #fff;
  position: absolute;
  line-height: 40px;
  top: 0;
  z-index: 3;
  font-size: 20px;
  width: 100%;
  span {
    position: absolute;
    left: 14px;
  }
  p {
    text-align: center;
    width: 100%;
  }
}
.avator {
  .w(375);
  padding-top: 70%;
  position: absolute;
  top: 0;
  z-index: -1;
  .shadow {
    position: absolute;
    z-index: 7;
    top: 0;
    background: rgba(7, 17, 27, 0.3);
    width: 100%;
    height: 100%;
  }
}
.songList {
  position: fixed;
  background: #222;
  top: 270px;
  bottom: 0;
  left: 0;
  right: 0;
  .content {
    padding: 10px 30px;
    background: #222;
    li {
      font-size: @fs-s;
      height: 60px;
      color: #fff;
      display: flex;
      span {
        float: left;
        line-height: 60px;
        width: 32px;
      }
      div {
        margin: 5px;
        float: left;
        flex: 1;
        overflow: hidden;
        h3 {
          padding-top: 10px;
          white-space: nowrap;
        }
        p {
          margin-top: 3px;
          height: 20px;
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}
</style>