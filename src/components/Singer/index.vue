<template>
  <div class="singers">
    <div class="wrapper" ref="singerWrapper">
      <div class="content">
        <ul>
          <li v-for="(item,index) in singers" :key="index" :ref="item.Findex">
            <!--每一组的首字母 -->
            <h3 v-if="item.Findex==='hot'">热门</h3>
            <h3 v-else>{{item.Findex}}</h3>
            <!-- <h3>{{item.Findex}}</h3> -->
            <!--首字母下的歌手信息 -->
            <ol>
              <li
                v-for="(sItem,sIndex) in item.list"
                :key="sIndex"
                @click="goDetail(sItem.Fsinger_mid)"
              >
                <img v-lazy="sItem.avator" alt />
                <span>{{sItem.Fsinger_name}}</span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    </div>
    <!-- 快速列表 -->
    <div class="quicklist">
      <ul @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <li
          v-for="(item,index) in quickData"
          :key="index"
          @click="quickJump(item)"
          :class="selFindex==item?'sel':' '"
        >
          <span v-if="item==='hot'">热</span>
          <span v-else>{{item}}</span>
        </li>
      </ul>
    </div>
    <!-- 嵌套路由 -->
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>
  
<script>
import BS from "better-scroll";
import { getSingersData } from "api/api.js"; // 获取歌手页数据
import { nomalData } from "./data";
export default {
  name: "singer",
  data() {
    return {
      singers: [],
      selFindex: "hot" // 选中的下标是什么 默认为hot
    };
  },
  methods: {
    initBs() {
      let wrapper = this.$refs.singerWrapper;
      this.Bs = new BS(wrapper, { probeType: 3, click: true });
      // 获取距离数组
      let distance = [];
      for (const key in this.$refs) {
        if (key !== "singerWrapper") {
          distance.push(this.$refs[key][0].offsetTop);
        }
        // console.log(distance);
      }
      // 监听滚动
      this.Bs.on("scroll", pos => {
        let y = Math.abs(pos.y);
        // console.log('滚动')
        // 判断每一次滚动的距离在什么范围内
        let scrollIndex = 0; //滚动所在区域的下标
        for (let index = 0; index < distance.length; index++) {
          // 判断滚动到哪个区域了
          if (y >= distance[index] && y < distance[index + 1]) {
            scrollIndex = index;
          } else if (y >= distance[distance.length - 1]) {
            //  最后的边界判断
            scrollIndex = distance.length - 1;
          }
        }
        // 根据滚动距离的下标更换变颜色的字母下标
        let scrollFindex = this.quickData[scrollIndex];
        // console.log(scrollFindex)
        this.selFindex = scrollFindex;
      });
    },
    quickJump(item) {
      // 点击每一项之后 触发事件需要知道点到谁了
      // 根据字母获取到固定的元素
      let dom = this.$refs[item][0];
      // 用bs 内部的方法直接跳转到固定元素scrollToElement()
      this.Bs.scrollToElement(dom);
    },
    // 手指的触摸移动事件
    touchStart(e) {
      let y = e.touches[0].clientY;
      this.touch.y = y - 148; // 得到按下时鼠标在快速入口上的距离
      // console.log('按下',this.touch.y )
      this.downIndex = Math.floor(this.touch.y / 18); // 计算按下时的下标
      let downFindex = this.quickData[this.downIndex]; // 设置按下的对应颜色
      this.quickJump(downFindex);
    },
    touchMove(e) {
      let moveY = e.touches[0].pageY - 148;
      // console.log(moveY);
      let moveDis = moveY - this.touch.y; // 计算出移动过的距离
      let count = parseInt(moveDis / 18); // 获取移动过的格子数
      // console.log('移动',moveDis,count)
      let moveIndex = this.downIndex + count; // 获取下标
      let moveFindex = this.quickData[moveIndex];
      if (moveFindex < 0 || moveFindex > this.quickData.length - 1) {
        return false;
      }
      this.quickJump(moveFindex);
    },
    touchEnd() {
      // 鼠标抬起监听
      // console.log('抬起')
    },
    goDetail(Fsinger_mid) {
      this.$router.push(`/singer/${Fsinger_mid}`);
    }
  },
  computed: {
    quickData() {
      // 快速入口数据和歌手数据做关联
      let result = this.singers.map(item => {
        return item.Findex;
      });
      // console.log(result)
      return result;
    }
  },
  created() {
    // 初始化数据 把移动距离挂载到this对象下
    this.touch = { y: 0 };
    getSingersData().then(res => {
      //  处理数据
      let data = nomalData(res.data.list);
      // console.log(data);
      this.singers = data;
      // 请求到数据 并更新页面之后再初始化
      this.$nextTick(() => {
        this.initBs();
      });
    });
  }
};
</script>
  
<style lang="less" scoped>
// 只有在样式中使用别名需要加~
@import "~style/index.less";
.singers {
  position: fixed;
  top: 88px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .quicklist {
    position: absolute;
    right: 10px;
    top: 40px;
    width: 20px;
    background: rgba(0, 0, 0, 0.3);
    font-size: @fs-xs;
    padding: 20px 0 20px;
    color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    text-align: center;
    ul {
      li {
        width: 20px;
        height: 18px;
      }
      .sel {
        color: @yellow;
      }
    }
  }
  .wrapper {
    height: 100%;
    // background: red;
    overflow: hidden;
    .content {
      .w(375);
      h3 {
        height: 30px;
        line-height: 30px;
        background: #333;
        color: rgba(255, 255, 255, 0.5);
        font-size: @fs-s;
        padding-left: 20px;
        margin-top: 20px;
      }
      ol {
        li {
          .w(375);
          height: 70px;
          // background: pink;
          box-sizing: border-box;
          padding: 20px 0px 0px 30px;
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 25px;
          }
          span {
            padding-left: 20px;
            display: inline-block;
            height: 50px;
            line-height: 50px;
            font-size: @fs-s;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
}
</style>
  