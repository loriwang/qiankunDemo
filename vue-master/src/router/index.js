import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login/index.vue";
import Layout from "@/layout/index.vue";
import Home from '@/views/home/index.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "home",
        component: Home,
      },
      // 每个模块都要加上该匹配规则,否则会被重定向到主页
      {
        path: 'app1*'
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];
const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
