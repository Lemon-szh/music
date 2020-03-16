const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath:'./',
  lintOnSave: false, // 关闭eslint
  devServer: {
    proxy: { // 配置代理服务器
      '/songData': { // 接口暗号
        target: 'http://ustbhuangyi.com', // 目标网址
        changeOrigin: true,
        pathRewrite: {
          '^/songData': '' // 将路径中多余的暗号删除
        }
      },
      '/musicData': { // 接口暗号
        target: 'http://47.95.207.1:3000', // 目标网址
        changeOrigin: true,
        pathRewrite: {
          '^/musicData': '' // 将路径中多余的暗号删除
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('api', resolve('./src/api'))
      .set('style', resolve('./src/style'))
      .set('components', resolve('./src/components'))
  }
}
