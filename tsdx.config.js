// tsdx.config.js
const postcss = require('rollup-plugin-postcss');

module.exports = {
  rollup(config, options) {
    // 添加postcss插件
    config.plugins.push(
      postcss({
        // PostCSS配置，比如添加autoprefixer等
        plugins: [], // 可以在这里添加PostCSS插件
        // 是否将CSS注入到JavaScript中，通常设置为false以提取CSS到单独的文件
        inject: false,
        // 是否提取元数据，如果options.writeMeta为true，则提取
        extract: !!options.writeMeta,
      })
    );

    return config;
  },
  plugins: [
    require('autoprefixer')(/* autoprefixer配置 */),
    // 其他PostCSS插件
  ],
};
