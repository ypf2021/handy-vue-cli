const path = require('path');
const { merge } = require('webpack-merge')

function resolve(dir) {
  console.log("resolve", path.join(__dirname, '.', dir))
  return path.join(__dirname, '.', dir);
}

module.exports = {
  publicPath: './',
  assetsDir: 'static',

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/theme/scss/index.scss";`,
      },
    },
  },

  chainWebpack: config => {
    // 没写后缀时 只匹配 js 和 vue
    config.resolve.extensions
      .clear()
      .add('.js')
      .add('.vue')

    // 去掉原本的svg处理
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icon'))
      .end();
    // 加上 svg封装组件的loader
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });

    // 添加小图片转为base64(不设置时默认会将小于8kb进行base64转换)
    config.module
      .rule('images')
      .parser({
        dataUrlCondition: { maxSize: 10 * 1024 }
      })

    // 避免重复引入，去除node_modules
    config.module
      .rule('js')
      .exclude
      .add(/node_modules/)
      .end()
      .use('babel-loader')
      .tap(options => merge(options, {
        plugins: ["@babel/plugin-transform-runtime"]
      }))

    config
      .plugin('html')
      .tap(args => {
        args[0].cache = true
        args[0].cacheLoaction = resolve('/node_modules/.cache/eslintcache')
        return args
      })

  },
  devServer: {
    proxy: {
      //配置跨域
      '/api': {
        target: 'http://localhost:8888', //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true, //允许跨域
        pathRewrite: {
          /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
            实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
           */
          '^/api': '',
        },
      },
    },
  },
}