import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    songList: [],
    //  	show:true,//组件显示隐藏
    fullScreen: true, //是否撑满屏幕
    currentIndex: -1, //当前正在播放哪首歌
    loop: 2, //0不循环 1 单曲 2顺序 3 随机
    showMyView: false,
    myState: 0,
  },
  mutations: {
    changeMyState(state, myState) {
      state.myState = myState
    },
    changeMyView(state, viewState) {
      state.showMyView = viewState
    },
    //控制大小屏切换
    changeScreen(state, screenState) {
      state.fullScreen = screenState
    },
    //添加播放列表
    addSongList(state, params) {
      // params要播放的歌曲列表
      // console.log(params);
      state.songList = params
    },
    changeCurrentIndex(state, index) {
      //修改当前正在播放哪首歌
      state.currentIndex = index
    },
    //下一曲
    nextCurrentIndex(state) {
      if (state.loop == 3) {
        state.currentIndex = parseInt(Math.random() * state.songList.length)
      } else {
        let count = state.songList.length
        if (state.currentIndex < count - 1) {
          state.currentIndex++;
        } else {
          state.currentIndex = 0;
        }
      }
    },
    //上一曲
    prevCurrentIndex(state) {
      let count = state.songList.length
      if (state.currentIndex > 0) {
        state.currentIndex--;
      } else {
        state.currentIndex = count - 1;
      }
    },
    //修改循环模式
    changeLoop(state) {
      if (state.loop == 3) {
        state.loop = 0
      } else {
        state.loop++
      }
    }
  },
  getters: {
    currentSong(state) {
      // console.log(state.songList[state.currentIndex]);
      // 当前正在播放的那首歌
      return state.songList[state.currentIndex] || null
    }
  }
})

export default store