<template>
  <div>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="子页面使用elementui
  "
    ></el-input>
    <p class="color-red">测试子应用文字红色</p>
  </div>
</template>

<script>
export default {
  name: "Page1",
  methods: {
    test() {
      this.$axios.get("/demo");
    },
  },
};
</script>
