// baseUrl 可以通过cross-env进行更改 或者脚本进行替换
const baseUrl = "//localhost";
const apps = [
  {
    name: "module-app1",
    // 上线的情况下更改为 可以指定模块对应的路由
    // `${baseURL}/app1`
    entry: `${baseUrl}:7081`,
    // 指定 子项目所在的容器
    container: "#root-view",
    activeRule: "/app1",
  },
];

export default apps