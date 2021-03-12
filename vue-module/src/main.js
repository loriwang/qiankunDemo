import Vue from 'vue'
import App from './App.vue'
import './public-path'
import router from './router'
Vue.config.productionTip = false

// 引入样式
import './style/index.css'

let instance = null
function render(props) {
  console.log(props);
  let {library} = props;
  if (library.Element) {
    Vue.use(library.Element)
  }
  instance = new Vue({
    render: h => h(App),
    router
  }).$mount('#app-module')
}
// 如果不是在微应用中嵌套的情况下 实例该对象,可以单独运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
//测试全局变量污染
window.a = 1;

export async function bootstrap() {
  console.log('vue app bootstraped');
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log('props from main framework', props);
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });
  render(props);
  // 测试一下 body 的事件，不会被沙箱移除
  // document.body.addEventListener('click', e => console.log('document.body.addEventListener'))
  // document.body.onclick = e => console.log('document.body.addEventListener')
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}