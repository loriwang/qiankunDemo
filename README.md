## 说明
目前 `vue-master`为主项目`vue-module`为子项目

## 乾坤框架主项目相关
### 1.路由的嵌套匹配
在嵌套的时候 主项目需要增加对子模块的匹配
```js
// vue-master/src/router/index.js
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
```
### 2.启动的位置
因为嵌套的位置不同,所以要在不同的地方进行启动,此demo因为子项目是内嵌在`layout`中,所以 在`vue-master/src/layout/index.vue`进行乾坤框架的启动,不能直接在`main.js中进行启动`,否则会导致子项目无法渲染



## 乾坤框架子项目相关

### 1.子项目devserver 开发的时候需要增加允许跨域的头
```js
// vue-module/vue-config.js
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
// vue-module/src/router.js
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

### 6.图片及字体文件图片加载404
[!](https://qiankun.umijs.org/zh/faq#%E5%BE%AE%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E4%B9%8B%E5%90%8E-css-%E4%B8%AD%E7%9A%84%E5%AD%97%E4%BD%93%E6%96%87%E4%BB%B6%E5%92%8C%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD-404)
原因是 `qiankun` 将外链样式改成了内联样式，但是字体文件和背景图片的加载路径是相对路径。

而 `css` 文件一旦打包完成，就无法通过动态修改 publicPath 来修正其中的字体文件和背景图片的路径。

### 7.子模块通信方式
```js
// vue-module/src/main.js
// 从生命周期 mount 中获取通信方法，使用方式和 master 一致
export function mount(props) {

  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });
    // 设置全局的方式,慎用
  props.setGlobalState(state);
}
```

### 8.样式隔离问题
参考
[!](https://qiankun.umijs.org/zh/api#startopts)
在主项目进行start的时候, 设置`experimentalStyleIsolation` 为true
`experimentalStyleIsolation` 被设置为 true 时，qiankun 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围，因此改写后的代码会表达类似为如下结构：

```css
// 假设应用名是 react16
.app-main {
  font-size: 14px;
}

div[data-qiankun-react16] .app-main {
  font-size: 14px;
}

```
针对于全局作用的样式会出现这个情况
不过目前想到的是方式是 主项目引用全局作用的css 比如 `reset.css`,`serlize.css`,`element.css`库的样式,子项目在开发的时候,增加`share-module`,引用`share-module`中开发需要的样式等,
主项目也引用`share-module`,用这样的方式解决通用的样式的问题

### 9.共享组件库的问题
目前在demo中进行了设置了共享`element-ui`组件库(主要是减少应用的体积),后续可能根据项目实际增加其他的组件库,在开发的时候目前的想法是增加一个`dev.js`的文件,该文件引用`element-ui`的js与css,引用`share-module`中开发必备的样式等,解决开发的问题