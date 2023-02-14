const path = require('path');
function resolve(dir) {
  console.log("resolve", path.join(__dirname, '.', dir))
  return path.join(__dirname, '.', dir);
}

// ElementUI
// const AutoImport = require('unplugin-auto-import/webpack')
// const Components = require('unplugin-vue-components/webpack')
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')


module.exports = {


  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icon'))
      .end();

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


  }
}