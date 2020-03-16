<template>
  <div class="progress">
    <span>{{startTime|handleTime}}</span>
    <div class="wrapper" ref="wrapper" @click="clickProgress">
      <div class="content" ref="content"></div>
      <div
        class="dot"
        ref="dot"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
      >
        <div class="red"></div>
      </div>
    </div>
    <span>{{endTime|handleTime}}</span>
    <!--<button @click="jump">跳转</button>-->
  </div>
</template>

<script>
export default {
  methods: {
    touchstart(e) {
      // console.log('按下')
      this.touch = true;
      this.distance = 0;
    },
    touchmove(e) {
      // console.log('移动',e.touches[0].pageX)
      let left = this.$refs.wrapper.getBoundingClientRect().left;
      let width = this.$refs.wrapper.clientWidth;
      this.distance = e.touches[0].pageX - left;
      // console.log(distance)
      if (this.distance >= 0 && this.distance <= width) {
        this.offsetMove(this.distance);
      }
    },
    touchend(e) {
      // console.log('抬起')
      this.touch = false;
      this.offsetMove(this.distance);
    },
    jump(precent) {
      //调用父组件的方法
      let time = (precent * this.endTime) / 100;
      this.$emit("seek", time);
    },
    clickProgress(e) {
      let x = e.pageX;
      let left = this.$refs.wrapper.getBoundingClientRect().left;
      let distance = x - left;
      // console.log(distance);
      this.offsetMove(distance);
    },
    offsetMove(distance) {
      //进度条移动
      let precent = (distance / this.$refs.wrapper.clientWidth) * 100;
      this.$refs.content.style.width = precent + "%";
      this.$refs.dot.style.transform = `translateX(${distance}px)`;
      //控制歌曲移动
      //按下状态不控制歌曲移动
      if (this.touch) return false;
      this.jump(precent);
    }
  },
  props: {
    startTime: { type: Number, default: () => 0 },
    endTime: { type: Number, default: () => 0 }
  },
  filters: {
    handleTime(data) {
      let time = parseInt(data);
      let m = parseInt(time / 60);
      let s = time % 60;
      s = s <= 9 ? `0${s}` : s;

      return m + ":" + s;
    }
  },
  watch: {
    startTime(newVal, oldVal) {
      // 当前播放时间所占的百分比
      if (this.touch) return false;
      let precent = (this.startTime / this.endTime) * 100;
      //控制进度条长度变化
      // console.log(precent)
      this.$refs.content.style.width = precent + "%";
      //控制dot
      let width = (this.$refs.wrapper.clientWidth * precent) / 100;
      this.$refs.dot.style.transform = `translateX(${width}px)`;
    }
  },
  created() {
    this.touch = false; //没有按下
  }
};
</script>

<style lang="less" scoped="">
@import "../../style/index.less";
.progress {
  height: 30px;
  display: flex;
  font-size: @fs-s;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  .wrapper {
    .w(270);
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    position: relative;
    margin: 0 10px;
    .content {
      height: 4px;
      width: 0%;
      background: rgb(255, 120, 50);
    }
    .dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      position: relative;
      background: #fff;
      top: -10px;
      left: -6px;
      .red {
        height: 12px;
        position: absolute;
        top: 2px;
        left: 2px;
        width: 12px;
        border-radius: 50%;
        background: rgb(255, 120, 50);
      }
    }
  }
}
</style>