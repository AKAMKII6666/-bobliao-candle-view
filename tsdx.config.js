// tsdx.config.js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const sass = require('sass');
const presetEnv = require('postcss-preset-env');
const postcssModules = require('postcss-modules');

module.exports = {
  rollup(config, options) {
    // 添加postcss插件
    config.plugins.push(
      postcss({
        extensions: ['.css', '.scss'],
        // PostCSS配置，比如添加autoprefixer等
        plugins: [
          /*           postcssImport(),
          presetEnv({ stage: 3 }),
          postcssModules({
            generateScopedName: '[name]__[local]___[hash:base64:5]',
            getJSON: (cssFileName, json) => {
              // 如果需要将 CSS Modules 的映射输出到单独文件，可以在这里处理
              // 默认情况下，映射会内联到 JS 文件中
            },
          }), */
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
