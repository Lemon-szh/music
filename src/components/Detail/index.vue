<template>
  <div class="detail">
    <div class="top">
      <span @click="back" class="iconfont icon-left arrow zw"></span>
      <span class="title">{{name}}</span>
      <span class="zw"></span>
    </div>
    <!--头像-->
    <div class="avator" :style="{'background-image':`url(${avator})`}" ref="img">
      <div class="shadow"></div>
    </div>

    <!--滚动-->
    <div class="songList" ref="wrapper">
      <div class="content">
        <ul>
          <li v-for="(item,index) in list" :key="index" @click="openPlayer(index)">
            <h2>{{item.songname}}</h2>
            <p>{{name}}{{item.albumname}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getSongByMid, getSongUrlByMid } from "api/api.js";
import Bs from "better-scroll";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      list: [],
      name: "暂无数据",
      avator: ""
    };
  },
  methods: {
    ...mapMutations(["addSongList", "changeCurrentIndex", "changeScreen"]),
    openPlayer(index) {
      //点击歌曲li 显示播放器
      this.addSongList(this.list);
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
        // 获取图片的元素和高度
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
    handleList(list) {
      let result = [];
      let mids = [];
      result = list.map((item, index) => {
        let {
          albummid,
          albumnname,
          singer,
          songmid,
          songname
        } = item.musicData;
        let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`;
        mids.push(songmid);
        return { albumUrl, albummid, albumnname, singer, songmid, songname };
      });
      return { result, mids };
    },
    // 请求封装
    async getSingerData(singermid) {
      let data = await getSongByMid(singermid);
      let { result, mids } = this.handleList(data.data.list);
      let { urls } = await getSongUrlByMid(mids);
      let finalData = [];
      for (let index = 0; index < result.length; index++) {
        result[index].audioUrl = urls[index];
        if (urls[index]) {
          //将不能播放的歌曲去除掉
          finalData.push(result[index]);
        }
      }
      this.list = finalData;
      //		console.log(this.list)
      this.name = data.data.singer_name;
      this.avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg?max_age=2592000`;
      this.$nextTick(() => {
        this.initBs();
      });
    }
  },
  async created() {
    //  console.log(this.$route)
    let { singermid } = this.$route.params;
    // 根据歌手mid 发起请求获取数据
    this.getSingerData(singermid);
  },
  watch: {
    $route() {
      let { singermid } = this.$route.params;
      // 根据歌手mid 发起请求获取数据
      this.getSingerData(singermid);
    }
  },
  beforeRouteEnter(to, from, next) {
    //组件进入之前
    next();
  },
  beforeRouteUpdate(to, from, next) {
    // console.log("组件复用");
    let { singermid } = to.params;
    this.getSingerData(singermid);
    next();
  },
  async beforeRouteLeave(to, from, next) {
    // 离开组件
    next();
  }
};
</script>
<style lang="less" scoped>
@import "~style/index.less";
@import "~style/icon/iconfont.css";
.detail {
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
  top: 0;
  width: 100%;
  z-index: 3;
  .zw {
    display: inline-block;
    width: 20px;
    padding: 5px 5px;
  }
  .title {
    display: inline-block;
    width: 315px;
    line-height: 40px;
    text-align: center;
  }
}
.avator {
  .w(375);
  padding-top: 70%;
  position: absolute;
  top: 0;
  z-index: -1;
  background-size: cover;
  .shadow {
    position: absolute;
    z-index: 7;
    top: 0;
    background: rgba(7, 17, 27, 0.3);
    width: 100%;
    height: 100%;
  }
}
//歌曲信息
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
      height: 61px;
      color: #fff;
      h2 {
        font-size: 14px;
        line-height: 30px;
      }
      p {
        margin-top: 3px;
        height: 20px;
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>