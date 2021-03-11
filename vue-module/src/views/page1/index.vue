<template>
  <div>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="子页面使用elementui
  "
    ></el-input>
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
