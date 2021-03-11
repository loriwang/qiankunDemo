import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./utils/router.js";

// 引入 element
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Element);
Vue.config.productionTip = false;
new Vue({
  el: '#app-master',
  router,
  render: (h) => h(App),
})