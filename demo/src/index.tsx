/*** examples/src/app.js ***/
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CandleView, candleViewContext, useCandleView } from "../../lib/index";

const App = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [streamData, setstreamData] = useState<any>(-1);
	const [socket, setSocket] = useState<any>(null);
	const [socketOpenTemp, setsocketOpenTemp] = useState<number>(-1);

	/* const candleViewHook = useCandleView({
		timeFormat: "15min",
		height: "auto",
		xAxis: { initTimePoint: "2024/5/16 23:45:00" },
		//xAxis: { initTimePoint: "2024/5/17 00:00:00" },
		data: {
			staticData: AllData,
		},
	}); */

	const candleViewHook = useCandleView({
		timeFormat: "1d",
		height: "auto",
		timeZone: {
			dataSourceTimeZone: 8,
			fetchConditionTimeZone: 8,
			displayTimeZone: 8,
		},
		data: {
			dynamicData: {
				enabled: true,
				dataFetchCallback: async function (timeFormat, startTime, endTime) {
					let time = "";
					if (timeFormat === "1d") {
						time = "1d";
					}
					if (timeFormat === "1h") {
						time = "1h";
					}
					if (timeFormat === "1min") {
						time = "1m";
					}
					let response = await fetch(`
						https://api.binance.com/api/v3/klines?symbol=BNBUSDT&interval=
						${time}
						&startTime=
						${startTime}
						&endTime=
						${endTime}
					`).then(function (d: any) {
						return d.json();
					});

					let bars: IcandleItem[] = [];

					for (var item of response) {
						bars.push({
							time: item[0],
							low: item[3],
							high: item[2],
							open: item[1],
							close: item[4],
							volume: Number(item[5]),
						});
					}
					return bars;
				},
			},
		},
	});

	const listenWebSocketStreamdata = function () {
		let timeType = candleViewHook.initArgs.timeFormat!;
		let time = "";
		if (timeType === "1d") {
			time = "1d";
		}
		if (timeType === "1h") {
			time = "1h";
		}
		if (timeType === "1min") {
			time = "1m";
		}
		// 创建WebSocket连接
		var socket = new WebSocket("wss://stream.binance.com:9443/ws/bnbusdt@kline_" + time);

		// 连接打开时的回调函数
		socket.addEventListener("open", function (event) {
			console.log("WebSocket连接已建立");
			// 可以在这里发送初始化消息给服务器，如果需要的话
			// socket.send('Hello Server!');
		});

		// 接收服务器消息的回调函数
		socket.addEventListener("message", function (event) {
			let data = JSON.parse(event.data);

			if (data.ping) {
				// 回复pong消息，使用message.ping的值作为pong消息的内容
				socket.send(JSON.stringify({ pong: data.ping }));
			} else {
				setstreamData(data);
			}
		});

		// 连接关闭时的回调函数
		socket.addEventListener("close", function (event) {
			console.log("WebSocket连接已关闭");
			setsocketOpenTemp(+new Date());
		});

		// 错误处理
		socket.addEventListener("error", function (error) {
			console.error("WebSocket发生错误:", error);
		});

		setSocket(socket);
	};

	const addData = function () {
		candleViewHook.funcs.appendData({
			open: Number(streamData.k.o),
			close: Number(streamData.k.c),
			high: Number(streamData.k.h),
			low: Number(streamData.k.l),
			volume: Number(streamData.k.v),
			time: Number(streamData.k.t),
		});
	};

	const changeStyle = function () {
		let config = { ...candleViewHook.initArgs };
		config.title = "这是标题，已经被改了！";
		config.backgroundColor = "#000";
		config.yAxis!.backgroundColor = "#000";
		config.yAxis!.tickColor = "#fff";
		config.yAxis!.lineColor = "#fff";
		config.yAxis!.tooltip!.lineSize = 2;
		config.yAxis!.tooltip!.color = "#fff";
		config.yAxis!.tooltip!.label!.backGroundColor! = "#fff";
		config.yAxis!.tooltip!.label!.fontsize = 20;
		config.yAxis!.tooltip!.label!.color = "#454545";

		config.xAxis!.backgroundColor = "#000";
		config.xAxis!.lineColor = "#fff";
		config.xAxis!.tickColor = "#fff";
		config.xAxis!.tooltip!.lineSize = 2;
		config.xAxis!.tooltip!.color = "#fff";
		config.xAxis!.tooltip!.label!.backGroundColor! = "#fff";
		config.xAxis!.tooltip!.label!.fontsize = 20;
		config.xAxis!.tooltip!.label!.color = "#454545";
		config.xAxis!.netLineColor = "#454545";
		config.yAxis!.netLineColor = "#454545";
		config.data!.candleStyles!.candleFallColor = "#fff";

		config.data!.candleStyles!.volumChart!.viewLastPriceTooltip!.color! = "#fff";
		config.data!.candleStyles!.volumChart!.viewLastPriceTooltip!.lineSize = 2;
		config.data!.candleStyles!.volumChart!.viewLastPriceTooltip!.label!.color! = "#454545";
		config.data!.candleStyles!.volumChart!.viewLastPriceTooltip!.label!.backGroundColor! = "#fff";
		config.data!.candleStyles!.volumChart!.viewLastPriceTooltip!.label!.backGroundAlpha! = 1;

		config.data!.candleStyles!.volumChart!.riseColor! = "#fff";
		config.data!.candleStyles!.volumChart!.alpha! = 0.9;
		candleViewHook.funcs.setInitArgs(config);
	};

	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (isMounted === false) {
				setIsMounted(true);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isMounted]
	);

	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (streamData !== -1) {
				addData();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[streamData]
	);

	//
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (socket !== null) {
				socket.close();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[candleViewHook.initArgs.timeFormat]
	);

	//
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			listenWebSocketStreamdata();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[socketOpenTemp]
	);
	return (
		<div>
			<div>k-line测试</div>
			<button
				onClick={function () {
					candleViewHook.funcs.setTimeFormat("1min");
				}}
			>
				切换成1分钟数据
			</button>
			<button
				onClick={function () {
					candleViewHook.funcs.setTimeFormat("1h");
				}}
			>
				切换成1小时数据
			</button>
			<button
				onClick={function () {
					candleViewHook.funcs.setTimeFormat("1d");
				}}
			>
				切换成1天数据
			</button>

			<button
				onClick={function () {
					changeStyle();
				}}
			>
				更改颜色
			</button>
			<div style={{ width: "100%", height: "500px" }}>
				{/* <CandleStick></CandleStick> */}
				<candleViewContext.Provider value={candleViewHook}>
					<CandleView></CandleView>
				</candleViewContext.Provider>
			</div>
		</div>
	);
};
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
