var webpack = require("webpack");
const Version = +new Date();

module.exports = {
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
	},
	plugins: [
		// Work around for Buffer is undefined:
		// https://github.com/webpack/changelog-v5/issues/10
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
		}),
		new webpack.ProvidePlugin({
			process: "process/browser",
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader",
			},
			// 如果你的项目中也直接使用了.jsx文件，且希望用Babel处理它们，可以加如下规则
			{
				test: /\.jsx?$/, // 匹配.js和.jsx文件
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"], // 添加React preset
					},
				},
			},
		],
	},
};
