const webWorker = self; // self代表子线程自身，即子线程的全局对象
webWorker.addEventListener("message", (event) => {
	var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o;
	//webWorker.postMessage(sum);
	let inputData = event.data;
	let _xAxisdatatickArr = [...inputData._xAxisdatatickArr];
	let _viewSize = Object.assign({}, inputData._viewSize);
	let _org_displayCandleMaxMin = Object.assign({}, inputData._org_displayCandleMaxMin);
	let isEscapeItems_current = inputData.isEscapeItems_current;
	let isQuickUpdateing_current = inputData.isQuickUpdateing_current;
	let allComputedCandleData_current = inputData.allComputedCandleData_current;
	let xAxis_initArgs_labelSpace = inputData.xAxis_initArgs_labelSpace;
	let initArgs_candleStyles_wickFallColor = inputData.initArgs_candleStyles_wickFallColor;
	let initArgs_candleStyles_candleFallColor = inputData.initArgs_candleStyles_candleFallColor;
	let initArgs_candleStyles_wickRiseColor = inputData.initArgs_candleStyles_wickRiseColor;
	let initArgs_candleStyles_candleRiseColor = inputData.initArgs_candleStyles_candleRiseColor;
	let initArgs_candleStyles_candleWidth = inputData.initArgs_candleStyles_candleWidth;
	let initArgs_candleStyles_wickWidth = inputData.initArgs_candleStyles_wickWidth;
	let xAxis_data_displayTickCommonpixWidth = inputData.xAxis_data_displayTickCommonpixWidth;
	let xAxis_data_lineSize_width = inputData.xAxis_data_lineSize_width;
	let xAxis_data_x = inputData.xAxis_data_x;
	/**
	 * 获得长度
	 *@param  {number | string} arg 输入值
	 *@param  {number} length 相对的长度
	 *@returns {number}
	 */
	const getSpaceSize = function (arg, length) {
		if (typeof arg === "string" && arg === "auto") {
			return length;
		}
		if (typeof arg === "string" && arg.indexOf("%") !== -1) {
			let value = Number(arg.replace("%", "")) / 100;
			return length * value;
		}
		if (typeof arg === "string" && arg.indexOf("px") !== -1) {
			return Number(arg.replace("px", ""));
		}
		if (typeof arg === "number" || !isNaN(Number(arg))) {
			return Number(arg);
		}
		console.log("no useful length !");
		return 0;
	};
	const getCandleColor = function (start, end, type) {
		if (Number(start) > Number(end)) {
			if (type === "wick") return initArgs_candleStyles_wickFallColor;
			if (type === "candle") return initArgs_candleStyles_candleFallColor;
		}
		if (type === "wick") return initArgs_candleStyles_wickRiseColor;
		if (type === "candle") return initArgs_candleStyles_candleRiseColor;
		return "#fff";
	};
	const getDataSpaceFromNumberScope = function (dataScope, start, end) {
		let space = Number(dataScope.end) - Number(dataScope.start);
		let cspace = end - start;
		let precent = Number((cspace / space).toFixed(5));
		let yHeight = _viewSize.height - getSpaceSize(xAxis_initArgs_labelSpace, _viewSize.height);
		return yHeight * precent;
	};
	const getDataY = function (dataScope, dataPoint) {
		let space = Number(dataScope.end) - Number(dataScope.start);
		let precent = Number(((Number(dataPoint) - Number(dataScope.start)) / space).toFixed(5));
		let yHeight = _viewSize.height - getSpaceSize(xAxis_initArgs_labelSpace, _viewSize.height);
		return yHeight - yHeight * precent;
	};
	//用y轴数据计算单个指标的各种属性
	const computSingalCandledataMini = function (
		//candle项目
		dataitem,
		//未扩展的范围（数据）
		orgScope
	) {
		try {
			//顺便计算单个tick的数据空间是否在最左边边缘
			//记录视图范围内最末尾的candle
			if (
				xAxis_data_lineSize_width - xAxis_data_x - dataitem.currentTick.pixSpace.start >= 0 &&
				dataitem.currentTick.pixSpace.end - (xAxis_data_lineSize_width - xAxis_data_x) <=
					dataitem.currentTick.pixSpace.end - dataitem.currentTick.pixSpace.start
			) {
				webWorker.postMessage({ state: true, message: "setdisplayLatestCandle", data: dataitem });
			}
		} catch (_e) {}
	};
	//用y轴数据计算单个指标的各种属性
	const computSingalCandledata = function (
		//进行计算的项目
		dataitem,
		//扩展后的范围（数据）
		dataScope,
		//未扩展的范围（数据）
		orgScope
	) {
		dataitem.candleColor = getCandleColor(dataitem.open, dataitem.close, "candle");
		dataitem.wickColor = getCandleColor(dataitem.open, dataitem.close, "wick");
		//快速渲染
		if (isQuickUpdateing_current == true) {
			dataitem.wickWidth = 1.2;
			dataitem.candlePixPosition = {
				x: 0,
				y: getDataY(dataScope, Math.max(Number(dataitem.close), Number(dataitem.open)).toString()),
			};
			dataitem.wickPixPosition = {
				x: 0, //x在渲染时直接取currentTick这里就不用计算了
				y: getDataY(dataScope, dataitem.high.toString()),
			};
			dataitem.wickLength = getDataSpaceFromNumberScope(dataScope, Number(dataitem.low), Number(dataitem.high));
			//全量渲染
		} else {
			try {
				dataitem.candleWidth = getSpaceSize(
					initArgs_candleStyles_candleWidth,
					xAxis_data_displayTickCommonpixWidth
				);
				dataitem.wickWidth = getSpaceSize(
					initArgs_candleStyles_wickWidth,
					xAxis_data_displayTickCommonpixWidth
				);
			} catch (_e) {}
			dataitem.candlePixPosition = {
				x: 0, //x在渲染时直接取currentTick这里就不用计算了
				y: getDataY(dataScope, Math.max(Number(dataitem.close), Number(dataitem.open)).toString()),
			};
			dataitem.wickPixPosition = {
				x: 0, //x在渲染时直接取currentTick这里就不用计算了
				y: getDataY(dataScope, dataitem.high.toString()),
			};
			dataitem.candleLength = getDataSpaceFromNumberScope(
				dataScope,
				Math.min(Number(dataitem.open), Number(dataitem.close)),
				Math.max(Number(dataitem.open), Number(dataitem.close))
			);
			if (dataitem.candleLength < 1) {
				dataitem.candleLength = 1;
			}
			dataitem.wickLength = getDataSpaceFromNumberScope(dataScope, Number(dataitem.low), Number(dataitem.high));
		}
		try {
			//顺便计算单个tick的数据空间是否在最左边边缘
			//记录视图范围内最末尾的candle
			if (
				xAxis_data_lineSize_width - xAxis_data_x - dataitem.currentTick.pixSpace.start >= 0 &&
				dataitem.currentTick.pixSpace.end - (xAxis_data_lineSize_width - xAxis_data_x) <=
					dataitem.currentTick.pixSpace.end - dataitem.currentTick.pixSpace.start
			) {
				webWorker.postMessage({ state: true, message: "setdisplayLatestCandle", data: dataitem });
			}
		} catch (_e) {}
		dataitem.updateTag = orgScope.start + orgScope.end;
		return dataitem;
	};
	const getMin = function (item, start) {
		let result = start;
		if (result > Number(item.open)) {
			result = Number(item.open);
		}
		if (result > Number(item.close)) {
			result = Number(item.close);
		}
		if (result > Number(item.high)) {
			result = Number(item.high);
		}
		if (result > Number(item.low)) {
			result = Number(item.low);
		}
		return result;
	};
	const getMax = function (item, end) {
		let result = end;
		if (result < Number(item.open)) {
			result = Number(item.open);
		}
		if (result < Number(item.close)) {
			result = Number(item.close);
		}
		if (result < Number(item.high)) {
			result = Number(item.high);
		}
		if (result < Number(item.low)) {
			result = Number(item.low);
		}
		return result;
	};
	/**
	 * 从x轴指针里查找数据
	 * @param tickArr x轴指针
	 * @param dataScope 范围
	 * @returns
	 */
	const findDataByTicks = function (tickArr) {
		let result = [];
		let _displayCandleMaxMin = {
			/**
			 * 最低点
			 * */
			start: "9999999999999999999999",
			/**
			 * 最高点
			 * */
			end: "-9999999999999999999999",
		};
		let maxVolume = -99999999999999;
		for (let inde_i = 0; inde_i < tickArr.length; inde_i++) {
			let item = tickArr[inde_i];
			if (typeof allComputedCandleData_current[item.value] !== "undefined") {
				let dataitem = allComputedCandleData_current[item.value];
				dataitem.currentTick = item;
				_displayCandleMaxMin.start = getMin(dataitem, Number(_displayCandleMaxMin.start)).toString();
				_displayCandleMaxMin.end = getMax(dataitem, Number(_displayCandleMaxMin.end)).toString();
				if (maxVolume < Number(dataitem.volume)) {
					maxVolume = Number(dataitem.volume);
				}
				result.push(dataitem);
			}
		}
		return { data: result, scope: _displayCandleMaxMin, maxVolume };
	};
	//用于显示的数据
	let result = findDataByTicks(_xAxisdatatickArr);
	//result.data 为 和目前x轴tick的交集displaycandles
	//result.scope 为扩展之前的数据范围 真实的数据范围
	if (result.data.length === 0) {
		//没找到
		webWorker.postMessage({ state: false, message: "not found" });
		return;
	}
	//先通知y轴更新了
	webWorker.postMessage({ state: true, message: "updateYaxis", data: result.scope });
	//上次缩放或重置后使用的最大值最小值(数据范围，不是像素 )
	//而且是未经扩展过的数据范围（素）的
	let currentTag = _org_displayCandleMaxMin.start + _org_displayCandleMaxMin.end;
	let orgMaxMiny = {
		//start 找 y+length 最大的
		start: -9999999999999999,
		//end找y最小的
		end: 99999999999999,
	};
	//进行数据计算
	let index = 0;
	for (var item of result.data) {
		//如果已经打开了省略模式
		//如果已经打开了省略模式
		if (isEscapeItems_current) {
			if (Number(index) % 2) {
				//全部进行全量计算
				//如果上次更新的tag和现在当前的值不一致，说明是上次缩放后还没来得及计算的元素
				//这样的元素就需要重新进行计算，
				//否则就不需要进行计算
				if (typeof item.updateTag === "undefined" || item.updateTag !== currentTag) {
					item = computSingalCandledata(item, _org_displayCandleMaxMin, _org_displayCandleMaxMin);
				} else {
					computSingalCandledataMini(item, _org_displayCandleMaxMin);
				}
				item.isEscaped = false;
			} else {
				//省略过的只收集数据
				computSingalCandledataMini(item, result.scope);
				item.isEscaped = true;
			}
		} else {
			//全部进行全量计算
			//如果上次更新的tag和现在当前的值不一致，说明是上次缩放后还没来得及计算的元素
			//这样的元素就需要重新进行计算，
			//否则就不需要进行计算
			if (typeof item.updateTag === "undefined" || item.updateTag !== currentTag) {
				item = computSingalCandledata(item, _org_displayCandleMaxMin, _org_displayCandleMaxMin);
			} else {
				computSingalCandledataMini(item, _org_displayCandleMaxMin);
			}
			item.isEscaped = false;
		}
		if (isQuickUpdateing_current) {
			if (
				Number((_a = item.wickPixPosition) === null || _a === void 0 ? void 0 : _a.y) +
					Number(item.wickLength) >
				orgMaxMiny.start
			) {
				//求（像素）y最大值
				orgMaxMiny.start =
					Number((_b = item.wickPixPosition) === null || _b === void 0 ? void 0 : _b.y) +
					Number(item.wickLength);
			}
			//求（像素）y最小值
			if (Number((_c = item.wickPixPosition) === null || _c === void 0 ? void 0 : _c.y) < orgMaxMiny.end) {
				orgMaxMiny.end = Number((_d = item.wickPixPosition) === null || _d === void 0 ? void 0 : _d.y);
			}
		} else {
			if (
				Math.max(
					Number((_f = item.candlePixPosition) === null || _f === void 0 ? void 0 : _f.y) +
						Number(item.candleLength),
					Number((_g = item.wickPixPosition) === null || _g === void 0 ? void 0 : _g.y) +
						Number(item.wickLength)
				) > orgMaxMiny.start
			) {
				//求（像素）y最大值
				orgMaxMiny.start = Math.max(
					Number((_h = item.candlePixPosition) === null || _h === void 0 ? void 0 : _h.y) +
						Number(item.candleLength),
					Number((_j = item.wickPixPosition) === null || _j === void 0 ? void 0 : _j.y) +
						Number(item.wickLength)
				);
			}
			//求（像素）y最小值
			if (
				Math.min(
					Number((_k = item.candlePixPosition) === null || _k === void 0 ? void 0 : _k.y),
					Number((_l = item.wickPixPosition) === null || _l === void 0 ? void 0 : _l.y)
				) < orgMaxMiny.end
			) {
				orgMaxMiny.end = Math.min(
					Number((_m = item.candlePixPosition) === null || _m === void 0 ? void 0 : _m.y),
					Number((_o = item.wickPixPosition) === null || _o === void 0 ? void 0 : _o.y)
				);
			}
		}
		index++;
	}
	webWorker.postMessage({
		state: true,
		message: "finishWork",
		data: {
			orgMaxMiny,
			result,
		},
	});
});
export {};
