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
				test: /(\.js(x?))$|(\.ts(x?))$/,
				exclude: /node_modules/,
				loader: "babel-loader",
			},
			{
				test: /\.(jpg|jpeg|gif|png)$/,
				loader: "url-loader",
				options: {
					name: "[path][name].[ext]?_v=" + Version,
					limit: 10240,
					esModule: false,
				},
			},
			{
				test: /\.svg$/,
				type: "asset/inline",
				// Inline assets with the "inline" query parameter.
				//resourceQuery: /inline/,
			},
		],
	},
};
