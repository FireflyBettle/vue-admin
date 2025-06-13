/*
 * @Author: chenyourong
 * @Date: 2025-05-09 15:07:11
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-13 16:34:44
 * @Description: 
 * @FilePath: /vue-admin-template-master/babel.config.js
 */
module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: process.env.NODE_ENV  === 'production'
  ? ["transform-remove-console"] : [] ,
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      'plugins': ['dynamic-import-node']
    },
  }
}
