## 乾坤框架需要更改的点

### 1.子项目devserver 开发的时候需要增加允许跨域的头
```js
    devServer: {
      port: 7081,
      disableHostCheck: true,
      overlay: {
        warnings: false,
        errors: true
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
```

### 2.router 需要进行更改
子项目被嵌套的时候 需要增加自己的`baseurl`

```js
// router.js
const createRouter = () => 
  new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/app1': '/',
    // base: '/app1',
    mode: 'history',
    routes: routers
  })

const router = createRouter()
```
### 3.更改每个 app 启动对应的 id,子应用增加 public-path 文件
  在 子项目中的`main.js`文件中引用 `public-path.js文件`
  ```js
    // public-path.js
    // 如果是乾坤
    if (window.__POWERED_BY_QIANKUN__) {
        // eslint-disable-next-line no-undef
        __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  ```
  ```js
  //mainjs
  import './public-path'
  ```
### 4.子应用更改打包的输出方式

  ```javascript
  // vue.config.js
  {
  configureWebpack: {
    resolve: {
        alias: {
        '@': resolve('src')
        }
    },
    output: {
        library: `${name}-[name]`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${name}`
    }
    }
  }

  ```
### 5.子应用增加 乾坤相对应的代码
```js
// main.js
// 如果不是在微应用中嵌套的情况下 实例该对象,可以单独运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
function render(props) {
  let {library} = props;
  // 这里是当父子引用公用一套element实例,
  // 不过本地开发需要额外的引用
  // 需要额外进行本地开发的设置
  if (library.Element) {
    Vue.use(library.Element)
  }
  instance = new Vue({
    render: h => h(App),
    router
  }).$mount('#app-module')
}

/* 需要配置qiankun的代码 */
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
```