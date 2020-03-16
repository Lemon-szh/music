<template>
  <div class="rank">
    <div ref="rankWrapper" class="wrapper">
      <ul class="list">
        <li v-for="(item,index) in rankData" :key="index" @click="showRank(item.id)">
          <img v-lazy="item.picUrl" alt />
          <ul>
            <li v-for="(rItem,rIndex) in item.songList" :key="rIndex">
              <span>{{rIndex+1}}</span>
              {{rItem.songname}}{{rItem.singername}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRankData } from "api/api.js";
import Bs from "better-scroll";

export default {
  name: "rank",
  data() {
    return {
      rankData: []
    };
  },
  methods: {
    initBs() {
      let wrapper = this.$refs.rankWrapper;
      this.Bs = new Bs(wrapper, { probeType: 3, click: true });
    },
    showRank(id) {
      this.$router.push(`/rank/${id}`);
    }
  },
  created() {
    getRankData().then(data => {
      this.rankData = data.data.topList;
      //console.log(this.rankData)
      this.$nextTick(() => {
        this.initBs();
      });
    });
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.rank {
  position: fixed;
  top: 88px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  .wrapper {
    height: 100%;
    overflow: hidden;
  }
}
.list {
  overflow: hidden;
  background: #222;
  li {
    height: 100px;
    margin: 20px 20px 0;
    background: #333;
    box-sizing: border-box;
    img {
      float: left;
      width: 100px;
      height: 100px;
    }
    ul {
      width: 220px;
      height: 100px;
      font-size: 12px;
      float: right;
      margin-top: 15px;
      li {
        margin: 0 20px 4px;
        height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.3);
        line-height: 22px;
        span {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>