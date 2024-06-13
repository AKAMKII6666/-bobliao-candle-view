// tsdx.config.js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  rollup(config, options) {
    // 添加postcss插件
    config.plugins.push(
      postcss({
        // PostCSS配置，比如添加autoprefixer等
        plugins: [
          autoprefixer(/* autoprefixer配置 */),
          // 其他PostCSS插件
        ],
        // 通常设置为false以提取CSS到单独的文件
        inject: true, // 如果你希望将CSS注入到JS中，则设置为true
        // 是否提取CSS到单独的文件
        extract: false, // 设置为true以提取CSS
        // 其他PostCSS配置...
      })
    );

    return config;
  },
  // tsdx 的其他配置...
};
