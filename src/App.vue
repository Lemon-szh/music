<template>
  <div id="app">
    <Header></Header>
    <Tab></Tab>
    <player></player>
    <my></my>
    <keep-alive include="rec,rank,my,singer">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/javascript">
import Tab from "./components/Tab";
import Header from "./components/Header";
import Player from "./components/Player";
import My from "components/My";

export default {
  components: { Header, Tab, Player, My }
};
</script>
<style lang="less">
@import "./style/index.less";
#app {
  background: @color-black-2;
  .w(375);
  height: 100vh;
}
</style>
