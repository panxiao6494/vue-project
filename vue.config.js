module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './'  // 解决打包上线白屏问题
}
