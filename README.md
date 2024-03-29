# handy-vue-cli

[TOC]

### 介绍

handy-vue-cli 是一款基于 Vue3 的中后台前端解决方案，用于快速搭建中后台项目。由项目脚手架，cli 工具和一系列插件组成，可以用插件的形式引入一部分功能，具体包括:

vue-cli 版本:4.5.0

- 项目脚手架，内置项目的全部功能，并默认配置基于 githook 的校验机制
- 项目 cli 工具，用于以命令行的方式拉取项目模版（cli 工具地址：https://github.com/ypf2021/handy-vue-cli  ）
- 配置式请求层插件，可以通过插件的形式接入任何 Vue 项目，可以通过配置实现取消重复请求，loading 动画等效果
- 自定义指令插件，可通过自定义指令的方式轻松实现图片懒加载，无限滚动，自动聚焦，备用图，防抖，水印等功能
- 增强式存储工具，实现 localstorage 的序列化，设置过期时间等功能
- 开发工具库，包括 scss 工具类和 JS 工具类，快速实现格式校验，省略号，日期校验等问题
- 封装常用业务功能，包括 切换页面时保存滚动条位置，虚拟列表，封装SVG 等

## 目录结构

- .husky:处理 githook 的文件夹
- public:ico,index.html 等网页配置相关文件的文件夹
- src：核心代码文件夹

  - api:axios 封装的文件夹，封装代码在 http.js,最后暴露出来的模块在 api.js,自己写对应的功能时要新建对应的 JS 文件并将接口函数暴露到 api.js 中
  - components:通用组件文件夹，一些整个项目中需要用到的组件放在此处
  - assets:静态文件文件夹，处理图片，iconfoot,svg 等文件，其中 icon 文件夹 只需要将 .svg 图片放入便可自动导入，方便修改
  - config：统一配置文件夹，用来配置项目的 baseurl，token 名称等
  - view:页面文件夹，在这个目录下建立自己对应页面的文件夹，在里面写 Vue 文件即可
  - directive：自定义指令文件夹，注册各种自定义指令，这些自定义指令会作为插件安装到 Vue 上
  - mixin：自定义混入生命周期，目前只有 keepScroll，用来配置保存滚动位置
  - Mock：Mock 模拟数据的文件夹，管理接口模拟数据的部分
  - plugins:通用插件文件夹，默认只有 element 的注册使用
  - router：路由文件夹，管理页面的跳转，其中有路由守卫的配置，和自动导入路径文件
  - store:vuex 文件夹，统一状态管理，其中 index.js 负责将所有模块暴露，使用时建立一个自己的模块，按 Vuex 的用法使用即可
  - themes:scss 通用配置文件夹，在此配置项目的主题色，通用字体大小，字体，通用类，混入等
  - App.vue:Vue 的主组件，进入项目后见到的第一个组件
  - main.js:Vue 的主文件，在此进行 Vue 的通用配置

- commitlint.config.js:配置 git commit 时对提交信息的检测
- vue.config.js；vue 配置文件

## axios 封装

axios 封装的代码在 src/api/http.js 中，

axios 的封装做了以下几个方面的处理：

- 设置了默认配置并区分开发生成环境
- 添加了请求，响应拦截器，直接返回响应信息的 data
- 对各种类型的错误进行了统一处理
- 自动取消短时间内发出的连续请求
- 传输文件自动配置 formData 参数
- 根据参数配置请求头并决定是否序列化
- 配置了 element-ui 中的 loading，可以通过配置决定是否在请求期间开启 loading 动画
- 配置化添加 auth 凭证

axois 进行了模块化划分和自动装配，每个模块开发时新建一个**以 Api.js 结尾的文件**（比如 homeApi.js）,先从 http.js 中引入封装好的 axios,然后将对应接口写成函数并暴露出来，在 api.js 中，会执行模块自动装配，将所有暴露出来的函数按模块放入一个对象并暴露出来

如果不想规定模块的名称，可以更改 api.js 中 context 函数的正则来修改

基本用法：

```js
import myAxios from './http';

function getList(params) {
  return myAxios({
    url: '/toLogin',
    method: 'post',
    data: params,
  });
}

export default {
  //在这里导出所有函数
  getList,
};
```

其中参数 url 是必选的，method 不填默认为 get,data 是请求参数，已在内部做了处理，不论 get 方法还是 post 方法都只需要传递 data 即可，如果需要进行文件上传，只需要添加配置 type："formData",并将文件放在一个对象中传给 data 即可

```js
// homeApi.js
function uploadImg(params) {
  return myAxios({
    url: '/upload',
    method: 'post',
    data: params,
    type: 'formData',
  });
  // 调用方法
  let img = this.$refs.files.files[0];
  console.log(img);
  this.$api.homeApi.getImg({ file: img, name: '小明' }).then((res) => {
    console.log(res);
  });
}
```

在 axios 的封装中，会根据参数**type**来添加请求头并作出响应的处理,具体包括：

    * json(默认)： "Content-Type": "application/json",
    
    * "formData":"Content-Type": "multipart/form-data",
        如果配置了type:"formData",那么参数仍然只需要传递一个params对象即可，封装的内部会将这个对象的所有参数注入到一个FormData对象中并将这个formData对象作为参数发送到后端.
    * "urlencoded":"Content-Type": "application/x-www-form-urlencoded"
        如果配置了form-urlencoded，那么封装的内部会将其序列化

也可以直接在参数内部添加其他请求头，但如果这样做，那么封装的内部不会进行其他处理

myAxios 的参数会在处理后直接传给 axios，因此你可以在里面添加任何 axios 合法的配置

```js
return myAxios({
  url: '/api/login',
  method: 'post',
  data: paramsList,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [
    (data) => {
      // ...
    },
  ],
});
```

对 axios 的封装**默认会取消重复请求**，当浏览器连续发出多个相同的请求时，axios 会将那些相同，且还没有到达服务器的请求取消掉，这一行为可以避免服务器收到过多连续的请求，但并不意味着会完全屏蔽短时间内的相同请求，如果用户网络状况良好的话依然会发出连续请求。因此必要时依然要进行节流和防抖处理

如果在一些场合（比如根据用户的输入不断向服务器发出请求，返回提示信息），你需要进行连续重复请求，可以在参数中添加 repeat_request_cancel:false 来阻止取消重复请求的行为。

```js
return myAxios({
  url: '/toLogin',
  method: 'post',
  data: params,
  repeat_request_cancel: false,
});
```

axios 的封装中包含了对 element-ui 中 loading 的封装，可以通过添加 loading:true 来开启加载动画，在请求开始时渲染加载动画，在请求完成时结束动画

```js
function getList(params) {
  return myAxios({
    url: '/toLogin',
    method: 'post',
    data: params,
    loading: true,
  });
}
```

如果想对加载动画进行个性化处理，可以对 myAxios 传入第二个参数，这个参数是一个对象，里面可以添加所有 elemnet-ui 中 loading 组件的合法配置,具体可以参考 element-plus 的配置文档

https://element-plus.org/zh-CN/component/loading.html#%E9%85%8D%E7%BD%AE%E9%A1%B9

```js
return myAxios(
  {
    url: '/findByName',
    method: 'get',
    data: params,
  },
  {
    text: 'hello',
  }
);
```

api.js 这个文件会接收所有模块暴露出来的函数，并将他们统一暴露出去，在 main.js 中，会将 api.js 这个文件作为$api 这个变量引入并挂载到全局。在整个项目中的任意位置无需引入即可使用。

调用示例：

```js
this.$api.homeApi.getmsg({ hi: 'vue' }).then(function (res) {
  console.log(res);
});
```

基本格式：this.$api+模块名+接口函数名（传参）+.then 执行回调函数

添加 auth 凭证：只需在 src/myConfig.js 中配置好 auth 参数即可

```js
    auth: {
    username: "testeradmin",
    password: "testerpassword",
  }
```

## Vuex 的模块化处理

本脚手架对 Vuexj 进行了模块化封装，在 src/store/modules 下按照 modulesA.js 的格式建立 JS 文件即可，index.js 会自动解析这个目录下的所有文件并将他们作为模块挂载到 Vuex 上，模块名为 js 文件名。

```js
export default {
  state: {
    num: 12,
  },
  mutations: {
    newNumber(state, val) {
      state.num = val;
    },
  },
  actions: {},
  namespaced: true,
};
```

使用时注意在变量前加上模块名，比如获取 moudlesA 中的 num 变量的值，可以使用：

```js
this.$store.state.moudlesA.num;
```

如果使用 mapState, mapActions 的话，写法为：

```js
    computed: {
    ...mapState({
      num:(state)=>state.moudlesA.num
    })
  },
```

修改值则需要在 commit 中函数名前加上/模块名，例如：

```js
this.$store.commit('moudlesA/newNumber', 5);
```

另外，由于大部分情况下，commit 的作用都是去更改对应 state 中的值，因此在模块化之前，脚手架会自动给每个模块的每个 state 中的每个变量都自动添加一个叫做"\_new+变量名"的 mutations 方法，因此我们可以在没有定义 mutations 的情况下通过这个变量名来修改它

```js
// 即使没有定义_newbol这个方法，也可以用这个方法去修改bol这个变量
this.$store.commit('moudlesA/_newbol', false);
```

## Vue-Router 的全局守卫

vue-router 的封装主要是针对路由守卫的封装，如果需要在到达某一路由时要修改 title 的名称，那么可以在对应的路由配置上配置 meta 属性来实现

```js
      {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "主页",
    },
    children: [],
  },
```

meta 属性还可以用来配置路由的权限,当配置了此权限后，只有登录的用户才能访问这一路由，否则会直接跳转到登录页

```js
  {
    path: "/UserInfo",
    name: "UserInfo",
    component: () => import("../view/UserInfo/UserInfo.vue"),
    // 利用元信息判别路由权限
    meta: {
      title: "用户信息",
      requiresAuth: true,
    },
    children: [],
  },
```

## 自定义指令的使用

脚手架中内置了一些实用的自定义指令（src/directive/\*），这些自定义指令可以大大简化开发。同时，也建议尽量把与 DOM，BOM 相关的操作都用自定义指令的方式来实现。保证模块单一功能

调用方法：在 directive 模块下的每个文件的名称都是自定义指令的名称，dom 上 **用 v-自定义指令名称** 即可调用，具体调用方法和每个自定义指令的功能可以参考具体文件的注释

```html
<div v-fix></div>
```

directive 文件夹下的 index.js 会**自动收集**模块中所有的自定义指令并作为插件挂载到 Vue 上，因此，如果要添加全局自定义指令，只需要在 src/directive 文件夹下创建自定义指令名命名的 JS 文件并暴露出去即可

## 全局组件注册

当涉及全局组件的注册时，要在 src/components/components.js 中引入组件并按照以下方法进行注册

```js
install(app) {
      app.component('VueIcon', icon);
  },
```

### 虚拟列表组件

目录：`@/components/VList`

```html 
    <vlist
      :listData="data"
      :estimatedItemSize="70"
      v-slot="slotProps"
    >
      <Item :item="slotProps.item"></Item>
    </vlist>
```

**参数**：`listData,estimatedItemSize,height,bufferScale`

分别为：数据列表，每一项数据预估高度，列表容器高度（默认父元素100%），缓冲区域和真实显示区域的比例（默认1）

**插槽**：列表项的组件，可自定义

**实现原理**：传入数据后，先根据预估高度和数据量初始化位置信息，根据预估高度和窗口大小预定可呈现数据量，并且通过 缓存数据比例 添加缓存数据的量。并将这些量的数据截取 listData 呈现到页面上。监听滑动事件，根据滚动条送高度，计算 start索引和end索引之间对应的元素，进行渲染。同时每次要渲染都会更新位位置信息。

**特点**：解决动态元素高度，有缓存数据防止白屏闪烁

### iconfont组件

目录：`@/components/icon`

iconfont 已经被封装成组件并挂载到全局，在任意组件中无需引入即可使用

```js
<vue-icon iconClass="bofang" color="red"></vue-icon>
```

iconClass 是一个必选项，要根据 iconfont 官网中项目的名字来写,名字前去掉 icon，其余可以传的属性还包括：

`color,width,height,cursor`

对于 icon 这个组件封装的思路是 通过识别文件夹下的 .svg 文件，自动导入再根据 svg-sprite-loader，生成雪碧图，最后导入到全局。如果想增删图片只需要对文件夹下的 svg 文件做操作即可，不需要重复下更新 symbol.js

**特点：**不需要每次重新导入下载包，只需要添加相应的svg文件即可

## Mock 的封装

Mock 的封装在 Mock 文件夹中，其中封装部分在 MockServe.js 文件夹中，包括对参数的配置和暴露出的处理函数，这个函数会完成对 url 配置和对请求报文配置的简化工作，同时在最后执行 Mock.mock()函数，需要 Mock 操作的模块只需引入这个函数即可。

每个使用 Mock 的模块在 modules 文件夹下，每个模块引入 MockServe,并进行配置即可，配置项中第一项是 url，可以直接写接口名，无需写出完整请求路径；第二项是请求报文配置项，默认只需配置 data 中返回的内容即可，MockServe 会自动添加 code:200,message:"成功"的配置项，如果需要更改请求状态码或 message，那么在参数中添加这些配置可以覆盖默认配置；第三项是请求方式，默认是 post,如果需要改为其他请求方式在参数上写请求方式名即可

```js
const tologin = MockServe(
  '/toLogin',
  {
    data: {
      // 生成十个如下格式的数据
      'list|10': [
        {
          'id|+1': 1, // 数字从当前数开始依次 +1
          'age|18-40': 20, // 年龄为18-40之间的随机数字
          'sex|1': ['男', '女'], // 性别是数组中随机的一个
          name: '@cname', // 名字为随机中文名字
          email: '@email', // 随机邮箱
          isShow: '@boolean', // 随机获取boolean值
        },
      ],
    },
  },
  'get'
);
```

或者如果第二个配置参数仅有 data 一个配置项，可以简写为：

```js
const tologin = MockServe(
  '/toLogin',
  {
    // 生成十个如下格式的数据
    'list|10': [
      {
        'id|+1': 1, // 数字从当前数开始依次 +1
        'age|18-40': 20, // 年龄为18-40之间的随机数字
        'sex|1': ['男', '女'], // 性别是数组中随机的一个
        name: '@cname', // 名字为随机中文名字
        email: '@email', // 随机邮箱
        isShow: '@boolean', // 随机获取boolean值
      },
    ],
  },
  'get'
);
```

最后 Mock/index.js 会自动收集所有模块，并引入到主函数 main.js

## localStorage的封装

localStorage封装在 utils/storage.js下，  在setItem 时有三个参数 key，value，expires(过期时间)，设置了过期时间之后就会自动记录当前时间，并存起来， 获取值时判断是否过期，过期的化 get返回fasle，并把浏览器中存的内容删除，如果没有第三个参数的化，就和普通的 api操作方式一样

![image-20230216120014651](https://gitee.com/yan-running-potato/typora-diagram/raw/master/image-20230216120014651.png)

## gitHooks 与 commitlint

本脚手架的 gitHooks 会在代码提交前，格式化所有代码并使用 commitlint 对提交信息进行检验,如果提交信息非法会拒绝提交代码

commitlint.config.js 这个文件中配置了提交规范，提交信息必须包含配置的内容

为了确保提交信息规范，更建议用 npm run commit 代替 git commit,在 git add .后，使用 npm run commit 命令会自动出现选项界面，选择对应的修改类型并填写信息，commitlint 就可以自动生成符合规范的提交信息
![在这里插入图片描述](https://img-blog.csdnimg.cn/cb79acf8933640c0b6461a87e4d6bde4.png)

选项的含义看不懂可以参考 commitlint.config.js 中的注释

## 本地代理

框架默认开启 vue 脚手架中自带的 proxy 代理，代理会将后端的请求代理到本地来解决跨域的问题，如果需要开启跨域，请将 config/myConfig.js 配置中的 baseurl 设置为/api，将 vue.config.js 中的 devServe 中的接口改为后端提供的接口

代理会自动将/api 的请求用本地代理来解决跨域问题，仅本地生效，进入生产环境注意关闭


