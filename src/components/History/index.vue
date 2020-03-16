<template>
  <div class="history">
    <div class="historyList" ref="historyWrapper">
      <ul>
        <li v-for="(item,index) in playerHisory" :key="index" @click="openPlayer(index)">
          <h2>{{item.songname}}</h2>
          <p>{{item.singername||item.singer[0].name||item.singer}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Bs from "better-scroll";
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      playerHisory: []
    };
  },
  computed: {
    ...mapState(["showMyView", "myState"]),
    ...mapGetters(["currentSong"])
  },
  methods: {
    ...mapMutations(["addSongList", "changeCurrentIndex", "changeScreen"]),
    initBs() {
      let wrapper = this.$refs.historyWrapper;
      this.Bs = new Bs(wrapper, { probeType: 3, click: true });
    },
    openPlayer(index) {
      this.addSongList(this.playerHisory);
      this.changeCurrentIndex(index);
      this.changeScreen(true);
    },
    getHistoryList() {
      let historyList = JSON.parse(localStorage.getItem("playerHistory"));
      if (historyList && historyList.length > 0) {
        this.playerHisory = historyList;
      }
      this.$nextTick(() => {
        this.initBs();
      });
    }
  },
  created() {
    this.getHistoryList();
  },
  watch: {
    showMyView(newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.historyWrapper.style.display = "block";
          this.getHistoryList();
        }, 500);
      } else {
        this.$refs.historyWrapper.style.display = "none";
      }
    },
    myState(newVal, oldVal) {
      this.getHistoryList();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
@import "~style/icon/iconfont.css";
.historyList {
  position: fixed;
  top: 50px;
  z-index: 1;
  left: 0;
  right: 0;
  overflow: hidden;
  bottom: 70px;
}
.history ul li {
  width: 260px;
  height: 64px;
  margin: 0 auto;
  font-size: 14px;
  h2 {
    margin-top: 10px;
    line-height: 22px;
    color: #fff;
    font-size: 14px;
  }
  p {
    line-height: 22px;
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>