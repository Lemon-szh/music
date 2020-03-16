<template>
  <div class="search">
    <div class="content">
      <div class="searchItem">
        <i class="iconfont icon-sousuo5 sousuo"></i>
        <i class="iconfont icon-chacha chacha" v-if="inputVal" @click="clearInput"></i>
        <input
          type="text"
          ref="input"
          placeholder="搜索歌曲歌手"
          @input="getSearchData()"
          v-model="inputVal"
        />
      </div>
    </div>
    <div class="searchList" v-if="inputVal!=''" ref="searchWrapper">
      <div>
        <ul>
          <li v-for="(item,index) in searchList" :key="index">
            <p v-if="item.type==2" @click="goDetail(item.singermid)">
              <span class="iconfont icon-wode"></span>
              {{item.singername || item.singer}}
            </p>
            <p v-else-if="item.type==0" @click="openPlayer(index)">
              <span class="iconfont icon-yinyue"></span>
              {{item.songname}}-{{item.singer}}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="kw">
      <div class="searchHot">
        <h3>热门搜索</h3>
        <div class="item">
          <span v-for="(item,index) in hotMusic" :key="index" @click="setSearch(index,1)">{{item}}</span>
        </div>
      </div>
      <div class="searchHistory">
        <h3>
          搜索历史
          <i class="iconfont icon-chacha" @click="clearHistory()"></i>
        </h3>
        <div class="item">
          <span
            v-for="(item,index) in searchHistory"
            :key="index"
            @click="setSearch(index,0)"
          >{{item}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSearch, getHotMusic } from "api/api.js";
import { mapMutations, mapGetters } from "vuex";
import { getSongByMid, getSongUrlByMid } from "api/api.js";
import { filterData } from "./filter.js";
import Bs from "better-scroll";

export default {
  data() {
    return {
      searchList: [],
      inputVal: "",
      searchHistory: [],
      hotMusic: []
    };
  },
  computed: {
    ...mapGetters(["currentSong"])
  },
  methods: {
    ...mapMutations(["addSongList", "changeCurrentIndex", "changeScreen"]),
    initBs() {
      let wrapper = this.$refs.searchWrapper;
      this.Bs = new Bs(wrapper, { probeType: 3, click: true });
    },
    goDetail(mid) {
      this.$router.push(`/singer/${mid}`).catch(err => {});
    },
    openPlayer(index) {
      this.addSongList(this.searchList)
      this.changeCurrentIndex(index);
      this.changeScreen(true);
      this.setHistory();
    },
    clearInput() {
      this.inputVal = "";
    },
    async setSearch(index, state) {
      if (state) {
        this.inputVal = this.hotMusic[index];
      } else {
        this.inputVal = this.searchHistory[index];
      }
      this.getSearchData();
    },
    getHot() {
      getHotMusic().then(data => {
        //console.log(data)
        let arr = [];
        let dataList = data.data.hotkey;
        for (let i = 0; i < 10; i++) {
          arr.push(dataList[i].k);
        }
        this.hotMusic = arr;
      });
    },
    clearHistory() {
      localStorage.removeItem("historyMusic");
      this.updateHistory();
    },
    setHistory() {
      let historyMusic = JSON.parse(localStorage.getItem("historyMusic"));
      if (historyMusic && historyMusic.length > 0) {
        if (historyMusic.length > 10) {
          historyMusic.splice(10, history.length - 10);
        }
        historyMusic.map((item, index) => {
          if (item == this.currentSong.songname) {
            historyMusic.splice(index, 1);
          }
        });
        historyMusic.unshift(this.currentSong.songname);
        localStorage.setItem("historyMusic", JSON.stringify(historyMusic));
      } else {
        localStorage.setItem("historyMusic",JSON.stringify([this.currentSong.songname]));
      }
      this.updateHistory();
    },
    async getSearchData() {
      if (this.inputVal == "") return false;
      getSearch(this.inputVal).then(data => {
        // console.log(data)
        if (data.data.zhida.singername) {
          this.searchList = [data.data.zhida].concat(data.data.song.list);
        } else {
          this.searchList = data.data.song.list;
        }
        this.searchList = filterData(this.searchList);
        // console.log(this.searchList)
        this.getSongData();
        this.$nextTick(() => {
          this.initBs();
        });
      });
    },
    async getSongData() {
      let mids = [];
      for (let i = 0; i < this.searchList.length; i++) {
        if(this.searchList[i].songmid){
          mids.push(this.searchList[i].songmid);
        }
      }
      // console.log(mids);
      let { urls } = await getSongUrlByMid(mids)
      // console.log(urls);
      let finalData = [];
      let songer = null;
      if (this.searchList[0].singername) {
        songer = this.searchList.splice(0,1)
      }
      for (let index = 0; index < this.searchList.length; index++) {
        // console.log(index);
        if (this.searchList[index].songmid) {
          if (urls[index]) {
            this.searchList[index].audioUrl = urls[index];
          }else{
            this.searchList.splice(index,1)
            urls.splice(index,1)
            index--;
          }
        }
      }
      if (songer) {
        this.searchList.unshift(songer[0])
      }
      // console.log(this.searchList);
    },
    updateHistory() {
      let historyMusic = JSON.parse(localStorage.getItem("historyMusic"));
      this.searchHistory = historyMusic;
    }
  },
  created() {
    this.updateHistory();
    this.getHot();
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.content {
  position: fixed;
  top: 88px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  input {
    margin: 0 auto;
    display: block;
    width: 90%;
    color: rgba(255, 255, 255, 0.3);
    height: 40px;
    background: #333;
    box-sizing: border-box;
    padding: 0 0 0 40px;
    outline: none;
    border: 0;
    border-radius: 10px;
  }
}
.search {
  position: fixed;
  top: 88px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.searchItem {
  color: rgba(255, 255, 255, 0.3);
  position: relative;
  background: #222;
  z-index: 5;
  i {
    position: absolute;
  }
  .sousuo {
    left: 30px;
    top: 10px;
  }
  .chacha {
    right: 30px;
    top: 10px;
  }
}

.kw {
  position: fixed;
  top: 128px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 15px;
  h3 {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin: 10px 0;
  }
  div {
    overflow: hidden;
    span {
      float: left;
      color: rgba(255, 255, 255, 0.3);
      font-size: 12px;
      padding: 5px 10px;
      height: 24px;
      box-sizing: border-box;
      background: #333;
      border-radius: 6px;
      margin: 0 10px 10px 0;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.searchHistory {
  i {
    float: right;
    margin-right: 200px;
  }
}
.searchList {
  position: fixed;
  top: 128px;
  bottom: 60px;
  left: 0;
  right: 0;
  z-index: 1;
  overflow: hidden;
  background: #222;
  ul {
    background: #222;
    position: relative;
    li {
      height: 36px;
      padding: 0 30px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.3);
      p {
        line-height: 36px;
        padding: 0 10px 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        margin: 0 10px;
      }
    }
  }
}
</style>