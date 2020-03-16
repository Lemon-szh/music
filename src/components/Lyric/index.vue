<template>
  <div class="lyric" v-html="text"></div>
</template>

<script>
import Lyric from "lyric-parser";
import { mapGetters } from "vuex";
import { getLryicByMid } from "api/api.js";
import { Base64 } from "js-base64";
export default {
  data() {
    return {
      text: "暂无歌词"
    };
  },
  props: ["play", "seekTime"],
  computed: {
    ...mapGetters(["currentSong"])
  },
  methods: {
    getLyric(songmid) {
      getLryicByMid(songmid).then(res => {
        let lyricString = Base64.decode(res.lyric);
        if (this.lyricObj) {
          this.lyricObj.stop();
        }
        this.lyricObj = new Lyric(lyricString, ({ txt }) => {
          //					console.log(txt)
          this.text = txt;
        });
        //解析完毕直接播放
        this.lyricObj.play();
      });
    }
  },
  mounted() {
    let { songmid } = this.currentSong;
    this.getLyric(songmid, 0);
  },
  watch: {
    seekTime(newTime, oldTime) {
      if (!this.lyricObj) return false;
      this.lyricObj.seek(newTime * 1000);
    },
    currentSong(newSong, oldSong) {
      let { songmid } = newSong;
      this.getLyric(songmid);
    },
    play(newPlay, oldPlay) {
      if (!this.lyricObj) return false;
      this.lyricObj.togglePlay();
    }
  }
};
</script>

<style lang="less" scoped="">
@import "../../style/index.less";
.lyric {
  font-size: @fs-s;
}
</style>