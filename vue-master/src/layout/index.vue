<template>
  <div class="panel" @click="doOnWeb" @keydown="doOnWeb">
    <top-header class="panel-heder"></top-header>
    <div class="panel-main">
      <!-- 根据当前路由地址判断是子项目页面，还是主项目页面进行选择 -->
      <!-- 如果是主项目的 走router-view -->
      <router-view class="root-view" v-if="showView" />
      <!--  -->
      <div v-else id="root-view"></div>
    </div>
    <main-menu ref="mainMenu" class="main-menu" v-show="showMenu"></main-menu>
    <!-- <main-login ref="mainLogin"></main-login> -->
  </div>
</template>

<script>
import { registerMicroApps, start, initGlobalState } from "qiankun";
import TopHeader from "@/layout/components/Header";
import MainMenu from "@/layout/components/Menu";
import Element from "element-ui";
import apps from "../../app.config";
export default {
  name: "Layout",
  components: {
    TopHeader,
    MainMenu,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    showView: function () {
      return this.$route.path === "/home";
    },
  },
  mounted() {
    let globalState = {
      userInfo: {
        name: "lori.wang",
      },
    };
    const actions = initGlobalState(globalState);
    console.log(actions);
    setTimeout(() => {
      actions.setGlobalState(globalState);
    }, 3000);
    // 更改全局状态
    // actions.setGlobalState(state);
    // 通过props 传值传递给子应用  共享实例 store router
    const commonProps = {
      state: globalState,
      library: {
        Element,
      },
    };
    let childApps = apps.map(app => {
      app.props = commonProps
      return app
    })
    console.log(childApps)
    registerMicroApps(
      childApps,
      {
        beforeLoad: [
          (app) => {
            console.log("before load", app);
          },
        ],
        beforeMount: [
          (app) => {
            console.log("before mount", app);
          },
        ],
        afterUnmount: [
          (app) => {
            console.log("after unload", app);
          },
        ],
      }
    );
    // 启动微服务
    start({ prefetch: true });
  },
  methods: {
    doOnWeb() {},
    toggleMenu() {
      this.showMenu = !this.showMenu;
      this.$refs["mainMenu"].showTwoMenu = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .panel-heder {
    height: 50px;
    line-height: 50px;
  }
  .panel-main {
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;
    display: flex;
    #root-view {
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
      ::v-deep > div {
        height: 100%;
      }
    }
    .root-view {
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
      ::v-deep > div {
        height: 100%;
      }
    }
  }
  .main-menu {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 51px;
    bottom: 0px;
  }
}
</style>