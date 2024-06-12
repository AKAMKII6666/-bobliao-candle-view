const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js"); // 引用公共的配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 用于将组件的css打包成单独的文件输出到`lib`目录中

const prodConfig = {
	mode: "production", // 生产模式
	entry: path.join(__dirname, "../src/index.ts"),
	output: {
		path: path.join(__dirname, "../lib/"),
		filename: "index.js",
		libraryTarget: "umd", // 采用通用模块定义
		globalObject: "this", // 确保在各种环境（如Node.js和浏览器）中`this`的含义正确
		library: "candleView", // 导出的全局变量名称
		publicPath: "",
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/,
				exclude: /\.min\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: "css-loader",
						options: {
							modules: true,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{
											// 其他选项
										},
									],
								],
							},
						},
					},
					{ loader: "sass-loader" },
				],
			},
			{
				test: /\.min\.css$/,
				use: [{ loader: "style-loader" }, { loader: "css-loader" }],
			},
		],
	},
	externals: {
		// 定义外部依赖，避免把react和react-dom打包进去
		react: {
			root: "React",
			commonjs2: "react",
			commonjs: "react",
			amd: "react",
		},
		"react-dom": {
			root: "ReactDOM",
			commonjs2: "react-dom",
			commonjs: "react-dom",
			amd: "react-dom",
		},
	},
};

module.exports = merge(prodConfig, baseConfig); // 合并配置
