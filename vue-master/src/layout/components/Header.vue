<template>
  <div class="header-panel">
    <div>
      <i class="el-icon-s-operation" @click="$parent.toggleMenu()"></i>
    </div>
    <div>
      <span class="color-red">测试主页面文字红色</span>
    </div>
    <div>
      <div>
        <i class="el-icon-bell" @click="toHome">home</i>
      </div>
      <div>
        <el-dropdown @command="handleCommand">
          <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="stie">设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    toHome() {
      window.history.pushState({}, "", "/home");
    },
    handleCommand(val) {
      if (val === "logout") {
        this.$store.dispatch("user/logout").then(() => {
          window.history.pushState({}, "", "/login");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-panel {
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 1px;
  z-index: 98;
  > div {
    margin: 0px 10px;
    &:last-child {
      margin-right: 10px;
      margin-left: auto;
      display: flex;
      > div {
        margin: 0px 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:last-child {
          margin-right: 20px;
          ::v-deep .el-dropdown {
            display: flex;
          }
        }
      }
    }
  }
}
</style>