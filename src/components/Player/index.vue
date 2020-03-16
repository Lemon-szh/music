<template>
  <div class="player" v-if="songList.length">
    <div class="small" ref="small" @click="toggleScreen(false)">
      <div class="img">
        <img :class="cd" :src="currentSong.albumUrl" />
      </div>
      <div class="message">
        <h2>{{currentSong.songname}}</h2>
        <p>{{currentSong.singer[0].name||currentSong.singer}}</p>
      </div>
      <div class="control">
        <button
          @click.stop="togglePlay()"
          :class="play?'iconfont icon-zanting':'iconfont icon-iconfont-edu03'"
        ></button>
      </div>
    </div>
    <div class="big" ref="big">
      <!--头部-->
      <div class="top">
        <span @click="toggleScreen(true)" class="iconfont icon-jiantou arrow"></span>
        <h2>{{currentSong.songname}}</h2>
      </div>
      <!--背景-->
      <div class="bg">
        <img
          :src="currentSong.albumUrl"
          οnerrοr="javascript:this.src='http://localhost:8080/favicon.ico'"
        />
      </div>
      <p class="name">{{currentSong.singer[0].name||currentSong.singer}}</p>
      <!--专辑图片-->
      <div class="img">
        <img :class="cd" :src="currentSong.albumUrl" @error="imgTrans()" />
      </div>
      <!--歌词-->
      <div class="lyricWrapper">
        <lyric :startTime="startTime" :play="play" :seekTime="seekTime" class="lyric"></lyric>
      </div>
      <!--进度条-->
      <myprogress @seek="seek" :startTime="startTime" :endTime="endTime"></myprogress>
      <!--播放器-->
      <audio
        ref="audio"
        @ended="ended()"
        @canplay="canplay"
        @timeupdate="timeupdate"
        :src="currentSong.audioUrl"
      ></audio>
      <!--播放控制器-->
      <div class="control">
        <button @click="changeLoop()" class="iconfont loop">{{loops[loop]}}</button>
        <button @click="prev()" class="iconfont icon-shangyiqu"></button>
        <button
          @click="togglePlay()"
          :class="play?'iconfont icon-zanting':'iconfont icon-iconfont-edu03'"
        ></button>
        <button @click="next()" class="iconfont icon-shangyiqu1"></button>
        <button @click="like(currentSong)" :class="isLike" ref="like"></button>
      </div>
    </div>
  </div>
</template>

<script>
import Lyric from "components/Lyric";
import { mapState, mapMutations, mapGetters } from "vuex";
import myprogress from "../Progress";
export default {
  components: {
    myprogress,
    Lyric
  },
  data() {
    return {
      loops: ["\ue639", "\ue601", "\ue602", `\ue603`],
      play: true,
      startTime: 0,
      endTime: 0,
      seekTime: 0
    };
  },
  computed: {
    ...mapState(["songList", "fullScreen", "loop"]),
    ...mapGetters(["currentSong"]),
    cd() {
      return this.play ? "cd" : "cd paused";
    },
    isLike() {
      let like = JSON.parse(localStorage.getItem("like"));
      let cName = "iconfont icon-xihuan1 like";
      if (like && like.length > 0) {
        like.map((item, index) => {
          if (item.songmid == this.currentSong.songmid) {
            cName = "iconfont icon-xihuan like";
          }
        });
      }
      return cName;
    }
  },
  methods: {
    ...mapMutations([
      "changeScreen",
      "changeLoop",
      "nextCurrentIndex",
      "prevCurrentIndex",
      "changeCurrentIndex"
    ]),
    imgTrans() {
      this.currentSong.albumUrl =
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1944742345,2511093610&fm=26&gp=0.jpg";
    },
    toggleScreen(flag) {
      if (flag) {
        this.$refs.big.style.top = "110%";
      } else {
        this.$refs.big.style.top = 0;
      }
    },
    togglePlay() {
      this.play = !this.play;
    },
    timeupdate(e) {
      this.startTime = e.target.currentTime;
    },
    canplay() {
      //歌曲可以播放
      this.audio = this.$refs.audio;
      this.audio.play();
      // console.log(currentSong);
      this.play = true;
      //获取歌曲时长
      this.endTime = this.audio.duration;
      this.setPlayerHistory(this.currentSong);
    },
    seek(s) {
      if (!this.audio) return false;
      //更改时间
      this.audio.currentTime = s;
      this.seekTime = s;
    },
    ended() {
      console.log("播放完毕");
      this.play = false;
      switch (this.loop) {
        case 0:
          break;
        case 1:
          //单曲循环
          this.play = true;
          this.audio.play();
          break;
        case 2:
          //列表循环
          this.nextCurrentIndex();
          break;
        case 3:
          //随机播放
          let count = this.songList.length;
          let index = parseInt(Math.random() * count);
          this.changeCurrentIndex(index);
          break;
      }
    },
    next() {
      this.nextCurrentIndex();
    },
    prev() {
      this.prevCurrentIndex();
    },
    like(currentSong) {
      let likeSong = JSON.parse(localStorage.getItem("like"));
      let flag = false;
      if (likeSong && likeSong.length > 0) {
        likeSong.map((item, index) => {
          if (item.songmid == currentSong.songmid) {
            likeSong.splice(index, 1);
            localStorage.setItem("like", JSON.stringify(likeSong));
            this.$refs.like.className = "iconfont icon-xihuan1 like";
            flag = true;
          }
        });
        if (!flag) {
          this.$refs.like.className = "iconfont icon-xihuan like";
          likeSong.unshift(currentSong);
          localStorage.setItem("like", JSON.stringify(likeSong));
        }
      } else {
        this.$refs.like.className = "iconfont icon-xihuan like";
        localStorage.setItem("like", JSON.stringify([currentSong]));
      }
    },
    setPlayerHistory(newVal) {
      let playerHistory = JSON.parse(localStorage.getItem("playerHistory"));
      if (playerHistory && playerHistory.length > 0) {
        playerHistory.map((item, index) => {
          if (item.songmid == newVal.songmid) {
            playerHistory.splice(index, 1);
          }
        });
        playerHistory.unshift(newVal);
        localStorage.setItem("playerHistory", JSON.stringify(playerHistory));
      } else {
        localStorage.setItem("playerHistory", JSON.stringify([newVal]));
      }
    }
  },
  watch: {
    play(newVal, oldVal) {
      if (!this.audio) return false;
      //点击按钮还是循环
      if (newVal) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    currentSong(newVal, oldVal) {
      //歌曲改变自动播放
      //console.log('歌曲改变')
      //控制爱心点亮
      let like = JSON.parse(localStorage.getItem("like"));
      let cName = "iconfont icon-xihuan1 like";
      if (like && like.length > 0) {
        like.map((item, index) => {
          if (item.songmid == newVal.songmid) {
            cName = "iconfont icon-xihuan like";
          }
        });
      }
      if (this.$refs.like) {
        this.$refs.like.className = cName;
      }
      this.setPlayerHistory(newVal);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
@import "~style/icon/iconfont.css";
.arrow {
  position: absolute;
  left: 20px;
  top: 18px;
  font-size: 12px;
}
.control {
  display: flex;
  justify-content: space-around;
  margin: 20px 0 10px;
  button {
    border: 0;
    background: none;
    color: #ff9900;
    font-size: 30px;
    outline: none;
    line-height: 40px;
    color: #fff;
  }
  & .icon-ai06 {
    font-size: 50px;
  }
  & .icon-bofang {
    font-size: 40px;
    width: 62px;
  }
  .loop {
    color: rgb(255, 120, 50);
    font-size: 32px;
    line-height: 40px;
    width: 50px;
    text-align: center;
  }
  .like {
    color: rgb(255, 120, 50);
    width: 50px;
    font-size: 28px;
  }
}
.lyricWrapper {
  margin: 20px 0 10px 0;
  height: 80px;
  overflow: hidden;
  .lyric {
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    height: 80px;
    color: rgba(255, 255, 255);
    text-shadow: 2px 1px 2px #222;
  }
}

.player {
  color: #fff;
  .big {
    position: fixed;
    top: 0;
    height: 100%;
    left: 0;
    right: 0;
    z-index: 20;
    background: #222;
    border: 1px #fff solid;
    transition: top 0.5s;
    .top {
      margin: 10px 0 0 0;
      font-size: @fs-l;
      h2 {
        width: 220px;
        margin: 0 auto;
        text-align: center;
        text-shadow: 2px 1px 2px #222;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 18px;
        line-height: 30px;
      }
    }
    .name {
      font-size: @fs-s;
      text-align: center;
      margin: 20px 0;
    }
    .bg {
      position: absolute;
      z-index: -9;
      top: 0;
      width: 100%;
      height: 100%;
      filter: blur(15px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .img {
      .w(375);
      .h(300);
      overflow: hidden;
      img {
        margin: 10px auto;
        width: 256px;
        height: 256px;
        border-radius: 50%;
        border: 10px solid;
      }
      & .cd {
        animation: rotate 10s linear infinite;
      }
      & .paused {
        animation-play-state: paused;
      }
    }
  }
  .small {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #333;
    z-index: 15;
    .img {
      float: left;
      height: 60px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 10px;
      }
      & .cd {
        animation: rotate 10s linear infinite;
      }
      & .paused {
        animation-play-state: paused;
      }
    }
    .message {
      float: left;
      width: 150px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      height: 40px;
      margin: 10px 0;
      h2 {
        color: #fff;
        font-size: 14px;
        line-height: 20px;
      }
      p {
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
        line-height: 20px;
      }
    }
    .control {
      float: right;
      display: block;
      height: 60px;
      button {
        position: absolute;
        right: 22px;
        top: 8px;
        font-size: 36px;
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>