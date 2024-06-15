// tsdx.config.js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const url = require('rollup-plugin-url');
const postcssUrl = require('postcss-url');
const smartAsset = require('postcss-smart-asset').default;

module.exports = {
  rollup(config, options) {
    // 添加postcss插件
    config.plugins.push(
      postcss({
        // PostCSS配置，比如添加autoprefixer等
        plugins: [
          autoprefixer(/* autoprefixer配置 */),
          postcssUrl({
            url: 'inline', // 或者 'copy' 以复制资源到输出目录
            // 若要限制内联资源的大小，可以添加如下配置:
            // filter: ({ url }) => /\.(png|jpg|jpeg|gif|svg)$/.test(url) && url.startsWith('/'),
            // assetsPath: 'path/to/output/assets', // 当使用 'copy' 时指定输出目录
          }),
          // 其他PostCSS插件
        ],
        // 通常设置为false以提取CSS到单独的文件
        inject: true, // 如果你希望将CSS注入到JS中，则设置为true
        // 是否提取CSS到单独的文件
        //extract: false, // 设置为true以提取CSS
        // 其他PostCSS配置...
      })
    );

    return config;
  },
  // tsdx 的其他配置...
};
