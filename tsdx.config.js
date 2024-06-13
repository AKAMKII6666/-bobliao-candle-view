// tsdx.config.js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const url = require('rollup-plugin-url');

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
    // 添加url插件来处理图片和其他文件
    config.plugins.push(
      url({
        include: ['**/*.png', '**/*.jpg', '**/*.gif', '**/*.svg'], // 需要处理的文件类型
        limit: 81920, // 小于这个大小的文件会被转换为base64
        // 其他url插件配置...
      })
    );
    return config;
  },
  // tsdx 的其他配置...
};
