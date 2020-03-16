<template>
  <div class="my" ref="my">
    <div class="top">
      <span class="back iconfont icon-left" @click="changeMyView(false)"></span>
      <div>
        <span class="fl select" @click="toggleSelect(0)" ref="fl">我喜欢的</span>
        <span class="fr" @click="toggleSelect(1)" ref="fr">最近听的</span>
      </div>
    </div>
    <div class="content">
      <div class="like" v-if="!myState">
        <like></like>
      </div>
      <div class="history" v-else>
        <history></history>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import Like from "components/Like";
import History from "components/History";

export default {
  name: "my",
  components: { Like, History },
  data() {
    return {};
  },
  computed: {
    ...mapState(["showMyView", "myState"])
  },
  methods: {
    ...mapMutations(["changeMyView", "changeMyState"]),
    showView() {
      if (this.showMyView) {
        this.$refs.my.style.left = "0";
        this.$refs.my.style.zIndex = 10;
      } else {
        this.$refs.my.style.left = "100%";
        setTimeout(() => {
          this.$refs.my.style.zIndex = -10;
        }, 500);
      }
    },
    toggleSelect(num) {
      if (num) {
        this.$refs.fr.className = "fr select";
        this.$refs.fl.className = "fl";
        this.state = 1;
      } else {
        this.$refs.fl.className = "fl select";
        this.$refs.fr.className = "fr";
        this.state = 0;
      }
      this.changeMyState(num);
    }
  },
  watch: {
    showMyView() {
      this.showView();
    },
    myState() {
      this.showView();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/index.less";
@import "~style/icon/iconfont.css";
.my {
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
  left: 100%;
  background: #222;
  z-index: -10;
  transition: left 0.5s;
  .top {
    .back {
      position: absolute;
      color: #ffcd32;
      font-size: 18px;
      top: 16px;
      left: 14px;
    }
    div {
      width: 240px;
      height: 30px;
      border: 1px solid #333;
      margin: 10px auto;
      border-radius: 5px;
      overflow: hidden;
      span {
        width: 120px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.3);
      }
      .fl {
        box-sizing: border-box;
        border-right: 1px solid #333;
      }
      .select {
        color: #fff;
        background: #333;
      }
    }
  }
  .content {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>