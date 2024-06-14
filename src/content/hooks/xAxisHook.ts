import { createContext, useState, useContext, useRef, useCallback, useEffect, FC, ReactElement } from "react";

import { pointCoord } from "../interface/itemsInterFace";
import {
	anyTimeToGMT0000ToTarget,
	arrayToHash,
	findIntersection,
	getRangePosition,
	getSpaceSize,
	hasDuplicates,
	localTimeToGMT0000,
} from "../utils/consts";
import useThrottle from "./throttleHook";
import { IAxisobj, IuseCandleHook, TAxis } from "../interface/hooksInterFace";
import { Iaxis } from "../interface/configInterFaces";
import { DEFAULTAXISVALUES } from "../utils/defaultValues";
import {
	DAY,
	FIFMIN,
	FMIN,
	HALFHOUR,
	HOUR,
	MONTH,
	ONEMIN,
	TENMIN,
	THREE,
	TWO,
	WEEK,
	YEAR,
	findRoundTimeCountFromArray,
	timeTypeMap,
} from "../utils/timeFormatDefine";
import {
	IToolTipItem,
	findRoundTimeCountFromArrayDataItem,
	jsonObjectType,
	netLineItem,
	numberScope,
	tickItem,
} from "../interface/itemsInterFace";
import { ItimeFormat, TtimeType } from "../interface/timeDefineInterFace";
import lodash from "lodash";

/**
 * x轴钩子
 */
const usexAxis: TAxis = function (args, igorn, config): IAxisobj {
	const moveThrettor = useThrottle();

	/**
	 *默认参数状态
	 */
	const [initArgs, setinitArgs] = useState<Iaxis>(Object.assign(true, DEFAULTAXISVALUES, args));
	const [initArgsChange, setinitArgsChange] = useState<number>(-1);

	//鼠标移动速度检测
	const [mousePosition, setmousePosition] = useState<number>(0);
	const [lastmousePosition, setlastmousePosition] = useState<number>(0);
	const [mouseSpeedSec, setmouseSpeedSec] = useState<number>(0);
	const [mouseSpeedTemp, setmouseSpeedTemp] = useState<number>(0);
	const [mouseSpeedTimmer, setmouseSpeedTimmer] = useState<NodeJS.Timeout>();

	/**
	 * ============================state===========================
	 */
	const [isMounted, setIsMounted] = useState<boolean>(false);

	//移动的运动方向
	const [moveDirection, setmoveDirection] = useState<"add" | "min">("add");
	/**
	 * 是否已完成初始化
	 */
	const [isFinishedInit, setisFinishedInit] = useState<boolean>(false);
	/**
	 * 普通的更新状态（位移，缩放）
	 */
	const [xAxisUpdateTimeStamp, setxAxisUpdateTimeStamp] = useState<number>(-1);
	const [InitStemp, setInitStemp] = useState<number>(-1);
	const [xAxisUpdateMoveMentTimeStamp, setxAxisUpdateMoveMentTimeStamp] = useState<number>(-1);
	const [xAxisUpdateScaleTimeStamp, setxAxisUpdateScaleTimeStamp] = useState<number>(-1);

	/**
	 * ============================tooltip state===========================
	 */

	/**
	 * tooltip状态
	 */
	const [tooltipState, setTooltipState] = useState<IToolTipItem | null>({} as IToolTipItem);
	/**
	 * tooltip显示状态
	 */
	const [tooltipIsShow, settooltipIsShow] = useState<boolean>(false);

	/**
	 * ============================缩放 state===========================
	 */

	//总位移量
	const [moveAmount, setmoveAmount] = useState<number>(0);
	const [x, setx] = useState<number>(0);

	//缩放量
	const [scaleValue, setscaleValue] = useState<number>(1);
	const [orgScope, setorgScope] = useState<numberScope>({ start: 0, end: 0 });

	/**
	 * 每次缩放的增减值
	 */
	const [scaleStep, setscaleStep] = useState<number>(0.1);

	/**
	 * 计算显示tick时跳过tick的数量
	 */
	const [tickStep, settickStep] = useState<number>(0);

	/**
	 * ============================时间 state===========================
	 */

	/**
	 * 当前时间类型
	 */
	const [currentTimeType, setcurrentTimeType] = useState<ItimeFormat | null>(null);

	/**
	 * 初始时间范围 (上次的时间范围 )
	 */
	const [lastTimeScope, setlastTimeScope] = useState<{
		/**
		 * 最左边的时间
		 */
		start: number;
		/**
		 * 最右边的时间
		 */
		end: number;
	}>({
		start: 0,
		end: 0,
	});

	/**
	 * 当前时间范围
	 */
	const [currentTimeScope, setcurrentTimeScope] = useState<numberScope>({
		/**
		 * 最左边的时间
		 */
		start: 0,
		/**
		 * 最右边的时间
		 */
		end: 0,
	});

	/**
	 * view的全量尺寸
	 */
	const [viewSize, setviewSize] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});

	/**
	 * ============================line 属性state===========================
	 */

	/**
	 * y轴的label空间
	 */
	const [yAxisSpace, setyAxisSpace] = useState<number>(0);

	/**
	 * line的位置（上左定位）
	 *内容区和label区的分割线的位置
	 */
	const [linePosition, setlinePosition] = useState<pointCoord>({ x: 0, y: 0 });
	const [labelSpace, setlabelSpace] = useState<number>(0);

	/**
	 * line的尺寸
	 */
	const [lineSize, setlineSize] = useState<{
		/**
		 * line的长度
		 */
		width: number;
		/**
		 * line的粗细
		 */
		size: number;
	}>({
		width: 0,
		size: 0,
	});

	/**
	 * line的颜色
	 */
	const [lineColor, setlineColor] = useState<string>("");

	/**
	 * ============================网格线 属性state===========================
	 */

	/**
	 * 网格线组
	 */
	const [netLineArr, setnetLineArr] = useState<Array<netLineItem>>([]);

	/**
	 * 网格线的最大数量
	 */
	const [netLineMaxCount, setnetLineMaxCount] = useState<number>(0);

	/**
	 * 轴网格线最小数量
	 */
	const [netLineMinCount, setnetLineMinCount] = useState<number>(0);

	/**
	 * ============================tick 属性state===========================
	 */
	/**
	 * 真实tick组（实际的tick组）
	 */
	const [tickArr, settickArr] = useState<Array<tickItem>>([]);

	/**
	 * 显示tick组（用于显示的tick）
	 */
	const [displayTickArr, setdisplayTickArr] = useState<Array<tickItem>>([]);
	/**
	 * tick的共有数据宽度
	 */
	const [displayTickCommonWidth, setdisplayTickCommonWidth] = useState<number>(0);
	/**
	 * tick的共有像素宽度
	 */
	const [displayTickCommonpixWidth, setdisplayTickCommonpixWidth] = useState<number>(0);

	/**
	 * ============================ref===========================
	 */
	const [candleObj, setcandleObj] = useState<IuseCandleHook | null>(null);

	/**
	 * ============================静态变量===========================
	 */

	/**
	 * ==========================函数==============================
	 */

	/**
	 * 初始化轴
	 *@param {TtimeType} timeType 时间类型
	 *@param  {number} viewWidth 界面的全量宽度
	 *@param  {number} viewHeight 界面的全量高度
	 *@param {number | string} yAxisLabelSpace y轴的label空间
	 *@returns {void}
	 */
	const initAxisSates = function (
		timeType: TtimeType,
		viewWidth: number,
		viewHeight: number,
		yAxisLabelSpace: number | string
	) {
		/* 设置各项属性 */
		setviewSize({
			width: viewWidth,
			height: viewHeight,
		});
		setyAxisSpace(getSpaceSize(yAxisLabelSpace, viewWidth));

		setlinePosition({
			x: 0,
			y: viewHeight - getSpaceSize(initArgs.labelSpace!, viewHeight),
		});
		setlineSize({
			width: viewWidth - getSpaceSize(yAxisLabelSpace, viewWidth),
			size: initArgs.lineSize!,
		});
		setlabelSpace(getSpaceSize(initArgs.labelSpace!, viewHeight));
		setlineColor(initArgs.lineColor!);
		setnetLineMaxCount(initArgs.netLineMaxCount!);
		setnetLineMinCount(initArgs.netLineMinCount!);

		/* 重置属性 */
		setorgScope({ start: 0, end: 0 });
		setdisplayTickCommonWidth(0);
		setdisplayTickCommonpixWidth(0);
		setlastTimeScope({ start: 0, end: 0 });
		setcurrentTimeScope({ start: 0, end: 0 });
		settickArr([]);
		setnetLineArr([]);
		setdisplayTickArr([]);
		setx(0);
		setmoveAmount(0);

		let tiemType = timeTypeMap[timeType];
		setcurrentTimeType(tiemType);
	};

	const update = function () {
		setlineColor(initArgs.lineColor!);
	};

	/**
	 * 往以前推测时间
	 */
	const timeSpeculation_backrward = function (timeInteger: number, initTimeScopeStart: number): Array<number> {
		var currentTime = timeInteger;
		let timeScopeArr = [timeInteger];
		while (true) {
			currentTime = currentTimeType!.backwardSingleUnit(currentTime, config!.timeZone!.displayTimeZone!);
			if (currentTime < initTimeScopeStart) {
				break;
			} else {
				//从顶端往里推入
				timeScopeArr.unshift(currentTime);
			}
		}
		return timeScopeArr;
	};

	/**
	 * 往未来推测时间
	 */
	const timeSpeculation_forward = function (timeInteger: number, initTimeScopeEnd: number): Array<number> {
		var currentTime = timeInteger;
		let timeScopeArr = [timeInteger];
		while (true) {
			currentTime = currentTimeType!.forwardSingleUnit(currentTime, config!.timeZone!.displayTimeZone!);
			if (currentTime > initTimeScopeEnd) {
				break;
			} else {
				//从后面里推入
				timeScopeArr.push(currentTime);
			}
		}
		return timeScopeArr;
	};

	/**
	 * 扩展tick组
	 */
	const updateTicks = function (
		targetTickArr: tickItem[],
		timeScope: numberScope,
		isComputCommonProp: boolean,
		_moveAmount: number,
		moveDir: "add" | "min" | "all"
	): tickItem[] {
		if (moveDir === "add" || moveDir === "all") {
			let forwardArr = timeSpeculation_forward(
				targetTickArr[targetTickArr.length - 1].value as number,
				timeScope.end
			);

			if (forwardArr.length > 1) {
				let arr = createTickers(forwardArr, timeScope, isComputCommonProp, _moveAmount);
				for (var i = 1; i < arr.length; i++) {
					targetTickArr.push(arr[i]);
				}
			}
		}

		if (moveDir === "min" || moveDir === "all") {
			let backwardArr = timeSpeculation_backrward(targetTickArr[0].value as number, timeScope.start);
			if (backwardArr.length > 1) {
				let arr = createTickers(backwardArr, timeScope, isComputCommonProp, _moveAmount);
				for (var i = arr.length - 2; i > -1; i--) {
					targetTickArr.unshift(arr[i]);
				}
			}
		}
		let commonPixProperties;
		if (isComputCommonProp) {
			commonPixProperties = computTickCommonProp(timeScope, lineSize.width, targetTickArr.length);
		} else {
			commonPixProperties = {
				dataWidth: displayTickCommonWidth,
				pixWidth: displayTickCommonpixWidth,
				incriseWidth: (function () {
					return lineSize.width * initArgs.displayPadding!;
				})(),
			};
		}

		if (isComputCommonProp) {
			//更新位置
			let index = 0;
			for (var item of targetTickArr) {
				let width = lineSize.width + commonPixProperties.incriseWidth * 2;
				//计算位置
				item.cPosition = {
					x:
						getRangePosition(Number(item.value), timeScope, width) -
						commonPixProperties.incriseWidth -
						_moveAmount,
					y: linePosition.y,
				};
				item.index = index;
				index++;

				item = computDataPixTick(
					item,
					timeScope,
					index,
					commonPixProperties.dataWidth,
					commonPixProperties.pixWidth
				);
			}
			targetTickArr = targetTickArr.sort(function (a: tickItem, b: tickItem) {
				return (a.value as number) - (b.value as number);
			});
		}

		return targetTickArr;
	};

	/**
	 * 扩展displaytick组
	 */
	const updateDisplayTicks = function (targetTickArr: tickItem[], newTickArr: tickItem[]): tickItem[] {
		//将tickArr转换成hash 方便查找
		let newTickHash = arrayToHash(newTickArr, "value");
		//往前扩展
		//取最早的值
		let correspondItem;
		let nextStep = 0;

		correspondItem = newTickHash[targetTickArr[0].value];
		nextStep = correspondItem.index;

		while (true) {
			//获得下一个 step
			nextStep = nextStep - 1 - tickStep;
			if (typeof newTickArr[nextStep] === "undefined") {
				break;
			} else {
				targetTickArr.unshift(newTickArr[nextStep]);
			}
		}
		//往未来扩展
		correspondItem = newTickHash[targetTickArr[targetTickArr.length - 1].value];
		nextStep = correspondItem.index;
		while (true) {
			//获得下一个 step
			nextStep = nextStep + 1 + tickStep;
			if (typeof newTickArr[nextStep] === "undefined") {
				break;
			} else {
				targetTickArr.unshift(newTickArr[nextStep]);
			}
		}

		//去重
		return Array.from(new Set(targetTickArr));
	};

	//计算tick的共有属性
	const computTickCommonProp = function (range: numberScope, width: number, totalArrLength: number) {
		//扩展宽度 增加数据显示边界 padding
		let incriseWidth = width * initArgs.displayPadding!;
		width = width + incriseWidth * 2;
		//计算数据宽度
		let dataWidth = (range.end - range.start) / totalArrLength;
		//计算像素宽度
		let pixWidth = width / totalArrLength;
		setdisplayTickCommonWidth(dataWidth);
		setdisplayTickCommonpixWidth(pixWidth);

		return { dataWidth, pixWidth, incriseWidth };
	};

	/**
	 * 计算tick的位置和数据关系数据
	 */
	const computDataPixTick = function (
		item: tickItem,
		range: numberScope,
		index: number,
		dataWidth: number,
		pixWidth: number
	): tickItem {
		item.dataSpace = {
			start: index * dataWidth + range.start,
			end: (index + 1) * dataWidth + range.start,
		};

		//计算占用像素范围
		item.pixSpace = {
			start: item.cPosition.x - pixWidth / 2,
			end: item.cPosition.x + pixWidth / 2,
		};

		return item;
	};

	/**
	 * 创建真实tick组
	 */
	const createTickers = function (
		arr: number[],
		range: numberScope,
		isComputCommonProp: boolean,
		moveAmount: number
	): Array<tickItem> {
		debugger;
		let result: Array<tickItem> = [];

		let commonPixProperties;

		if (isComputCommonProp) {
			commonPixProperties = computTickCommonProp(range, lineSize.width, arr.length);
		} else {
			commonPixProperties = {
				dataWidth: displayTickCommonWidth,
				pixWidth: displayTickCommonpixWidth,
				incriseWidth: (function () {
					return lineSize.width * initArgs.displayPadding!;
				})(),
			};
		}
		let index = 0;
		let width = lineSize.width + commonPixProperties.incriseWidth * 2;
		for (var item of arr) {
			let resultItem: tickItem = {
				color: initArgs.tickColor!,
				length: getSpaceSize(initArgs.tickLength!, viewSize.height),
				size: getSpaceSize(initArgs.tickSize!, viewSize.height),
				cPosition: { x: 0, y: linePosition.y },
				value: item,
			};

			//计算位置
			resultItem.cPosition = {
				x:
					getRangePosition(Number(resultItem.value), range, width) -
					commonPixProperties.incriseWidth -
					moveAmount,
				y: linePosition.y,
			};
			resultItem.index = index;

			result.push(
				computDataPixTick(resultItem, range, index, commonPixProperties.dataWidth, commonPixProperties.pixWidth)
			);
			index++;
		}
		return result;
	};

	/**
	 * 创建显示Ticker
	 * 大于netLineMaxCount就每隔一个项目减半,减半还是大于netLineMaxCount,就再减半，模拟递归
	 */
	const createDisplayTickers = function (arr: tickItem[]): tickItem[] {
		let result = arr;
		let _tickStep = 0;
		while (true) {
			if (result.length > netLineMaxCount) {
				let cArr: tickItem[] = [];
				let index = 0;
				for (var item of result) {
					if (index % 2) {
						cArr.push(item);
					}
					index++;
				}
				result = cArr;

				if (_tickStep < 1) {
					_tickStep = _tickStep + 1;
				} else {
					_tickStep = _tickStep * 2 + 1;
				}
			} else {
				break;
			}
		}
		settickStep(_tickStep);
		return result;
	};

	/**
	 * 通过像素位置查找目标tick
	 */
	//const findTick = function (position: number, key: "pixSpace" | "dataSpace"): tickItem | null {
	//	var _tickerArr = tickArr;
	//	var _findArr: tickItem[] = [];
	//	var centerPoint = 0;
	//	while (true) {
	//		centerPoint = Number(((_tickerArr.length - 1) / 2).toFixed(0));
	//		var isFind = false;
	//
	//		var find = function (start: number, end: number) {
	//			if (_tickerArr[start][key]!.start <= position && _tickerArr[end][key]!.end >= position) {
	//				isFind = true;
	//				_findArr = _tickerArr.slice(start, end + 1);
	//			}
	//		};
	//
	//		let start = 0;
	//		let end = centerPoint;
	//		if (_tickerArr.length === 2) {
	//			start = 0;
	//			end = 0;
	//		}
	//		//在第一组范围里查找
	//		find(start, end);
	//
	//		if (_findArr.length === 1) {
	//			return _findArr[0];
	//		}
	//		if (isFind) {
	//			_tickerArr = _findArr;
	//			continue;
	//		}
	//
	//		start = centerPoint;
	//		end = _tickerArr.length - 1;
	//		if (_tickerArr.length === 2) {
	//			start = 1;
	//			end = 1;
	//		}
	//		//在第二组范围里查找
	//		find(start, end);
	//
	//		if (_findArr.length === 1) {
	//			return _findArr[0];
	//		}
	//		if (isFind === false) {
	//			return null;
	//		} else {
	//			_tickerArr = _findArr;
	//		}
	//	}
	//};

	//ai 优化后的版本
	const findTick = function (position: number, key: "pixSpace" | "dataSpace"): tickItem | null {
		let tickerArr = tickArr.slice(); // 复制数组以避免修改原数组
		let centerIndex = 0;

		while (tickerArr.length > 1) {
			centerIndex = Math.floor(tickerArr.length / 2);
			const midTick = tickerArr[centerIndex];

			if (midTick[key]!.start <= position && midTick[key]!.end >= position) {
				// 直接找到目标，无需继续查找
				return midTick;
			} else if (midTick[key]!.end < position) {
				// 调整查找范围到右半部分
				tickerArr = tickerArr.slice(centerIndex + 1);
			} else {
				// 调整查找范围到左半部分
				tickerArr = tickerArr.slice(0, centerIndex);
			}
		}

		// 若数组只剩一个元素且未直接命中，则判断该元素是否符合条件
		return tickerArr.length === 1 && tickerArr[0][key]!.end >= position ? tickerArr[0] : null;
	};

	/**
	 * 创建x轴的网格 (纵向)
	 */
	const createNetLines = function (displaytickItems: tickItem[]): netLineItem[] {
		let results: netLineItem[] = [];
		for (var item of displaytickItems) {
			results.push({
				/**
				 * 网格线颜色
				 */
				color: initArgs.netLineColor!,
				/**
				 * 网格线长度
				 */
				length: linePosition.y,
				/**
				 * 网格线粗细
				 */
				size: initArgs.netLineSize!,
				/**
				 * 网格线位置
				 * （上中定位）
				 */
				cPosition: { x: item.cPosition.x, y: 0 },
				/**
				 * 值
				 */
				value: item.value,
			});
		}
		return results;
	};

	//从所有等差数列的参数里算出具体的数列
	//1.从数组里挑出合适数量的时间类型(最好两组一组时间稍多，一组稍少 )
	//2.按照挑选的两个等差数列的参数，从tickArr中挑选出具体的数组
	//2.合并两个数组
	//3.输出
	const createDisplayTickersByDate = function (
		tickArr: tickItem[],
		displayTickRoundValuesArray: findRoundTimeCountFromArrayDataItem[]
	) {
		tickArr = [...tickArr];
		let displayTickArr1: tickItem[] = [];
		let displayTickArr2: tickItem[] = [];
		let isFind = false;
		for (let item of displayTickRoundValuesArray) {
			if (isFind) {
				if (item.count !== 0) {
					displayTickArr2 = getTickWithFormated(tickArr, item);
				}
				break;
			}
			if (item.count > initArgs.netLineMinCount! && item.count < initArgs.netLineMaxCount!) {
				isFind = true;
				displayTickArr1 = getTickWithFormated(tickArr, item);
			}
		}

		let displayTickArr2Map = arrayToHash(displayTickArr2, "value");
		let result: tickItem[] = [];
		for (var item of displayTickArr1) {
			if (typeof displayTickArr2Map[item.value] !== "undefined") {
				result.push(displayTickArr2Map[item.value]);
			} else {
				result.push(item);
			}
		}
		return result;
	};

	const getTickWithFormated = function (
		tickArr: tickItem[],
		xCondition: findRoundTimeCountFromArrayDataItem
	): tickItem[] {
		let result: tickItem[] = [];
		//先取到第一个
		let currentIndex = xCondition.startIndex;
		let currentItem = tickArr[currentIndex];
		currentItem.displayValue = xCondition.type.formatter(
			Number(currentItem.value),
			config?.language!,
			config!.timeZone!.displayTimeZone
		);
		result.push(currentItem);
		//然后再依次取剩下的
		for (let i = xCondition.count; i > -1; i--) {
			currentIndex = currentIndex - 1 - xCondition.step;
			if (typeof tickArr[currentIndex] === "undefined") {
				break;
			}
			currentItem = tickArr[currentIndex];
			currentItem.displayValue = xCondition.type.formatter(
				Number(currentItem.value),
				config?.language!,
				config!.timeZone!.displayTimeZone
			);
			result.push(currentItem);
		}
		return result;
	};

	/**
	 * 初始化时
	 * 制造轴数据
	 */
	const createAxisData = function () {
		/* 
            1.获得初始的时间范围
            1.1 拟定时间范围，例如从当前时间往前推 24 小时，这是拟定的时间范围
            1.2 确定标准时间范围，根据设置的时间类型 以当前时间进行取整+1 获得最末尾时间（最右边的时间），然后将时间往前推，每次一个单位（例如小时），直到超出“拟定时间范围” 得到最开始时间｛最左边的时间｝ 输出【｛最左边的时间｝，｛最左边的时间｝】时间范围； 真实 tick 数数组；
            1.3 获得显示 tick 组 根据上面生成的 真实小时数数组；以及 最大 tick 显示数量，和最小显示 tick 数量；计算 显示 tick 组
        */

		/**
		 * 粗糙时间范围
		 */
		let _flexTimeScope = currentTimeType!.getInitTimeScope(initArgs.initTimePoint!);
		//如果设置了时间归零
		//就需要把起始的时区算成GMT +0000
		if (config!.timeZone!.displayTimeZone !== "local") {
			let date = new Date();
			let localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
			_flexTimeScope.start = anyTimeToGMT0000ToTarget(
				_flexTimeScope.start,
				localtimeZone,
				config!.timeZone!.displayTimeZone!
			);
			_flexTimeScope.end = anyTimeToGMT0000ToTarget(
				_flexTimeScope.end,
				localtimeZone,
				config!.timeZone!.displayTimeZone!
			);
		}

		/**
		 * 当前的整数时间
		 */
		let _timeInteger = currentTimeType!.roundingFunction(_flexTimeScope!.end!, config!.timeZone!.displayTimeZone!);
		/* 对齐整数的时间组 */
		let realTimeArr = timeSpeculation_backrward(_timeInteger, _flexTimeScope?.start!);

		/**
		 * 当前时间范围
		 */
		let _currentTimeScope = _flexTimeScope;
		/**
		 * 真实数据位置
		 */
		let _tickerArr = createTickers(realTimeArr, _flexTimeScope, true, 0);

		//挑选出所有按时间整数排列的等差数列的参数
		let displayTickRoundValuesArray = findRoundTimeCountFromArray(
			_tickerArr as unknown as jsonObjectType[],
			config!.timeZone!.displayTimeZone!,
			config!.timeFormat!,
			"value"
		);
		let _displayTickerArr;
		if (displayTickRoundValuesArray === null) {
			/**
			 * 用于显示的ticker
			 */
			_displayTickerArr = createDisplayTickers(_tickerArr);

			_displayTickerArr = _displayTickerArr.sort(function (a: tickItem, b: tickItem) {
				return (a.value as number) - (b.value as number);
			});
		} else {
			//从所有等差数列的参数里算出具体的数列
			_displayTickerArr = createDisplayTickersByDate(_tickerArr, displayTickRoundValuesArray);
		}

		/**
		 * 网格线组
		 */
		let _netLineArr = createNetLines(_displayTickerArr);

		setorgScope(_flexTimeScope);
		setlastTimeScope(_flexTimeScope);
		setcurrentTimeScope(() => _currentTimeScope);
		settickArr(_tickerArr);
		setnetLineArr(_netLineArr);
		setdisplayTickArr(_displayTickerArr);
		setisFinishedInit(true);
		setInitStemp(+new Date());
		//这里产生出来的指针会偏移一点，很正常 因为最末尾的时间是根据当前时间来的
		//倒数第一个指针是根据最末尾时间取整得来的
	};

	/**
	 * 移动轴(鼠标拖拽)
	 */
	const moveContainer = function (start: number, stop: number, isSaveScope: boolean) {
		if (isFinishedInit) {
			let pureLength = stop - start;
			let _moveAmount = pureLength + moveAmount;

			//设置鼠标位置用于计算鼠标速度
			setmousePosition(stop);

			//设置x用于更新画面
			setx(pureLength + moveAmount);
			if (isSaveScope) {
				setmoveAmount(_moveAmount);
			}

			//计算移动，并更新tick
			window.requestAnimationFrame(function () {
				moveAxis(start, stop, isSaveScope);
			});
		}
	};

	/**
	 * 移动轴(鼠标拖拽)
	 */
	const moveAxis = function (start: number, stop: number, isSaveScope: boolean) {
		if (candleObj?.data.isFetchingData && config?.data?.dynamicData?.stopUserOperateWhenLoading) {
			return;
		}
		if (isFinishedInit) {
			let width = lineSize.width;
			//扩展宽度 增加数据显示边界 padding
			let incriseWidth = width * initArgs.displayPadding!;
			width = width + incriseWidth * 2;
			//移动长度
			let length = stop - start;
			let pureLength = stop - start;
			let _moveAmount = pureLength + moveAmount;
			//加还是减
			let sign: "add" | "min" = "add";
			if (length > 0) {
				sign = "min";
			}
			setmoveDirection(sign);
			length = Math.abs(length);

			//计算这段线在整个宽度里占有百分之多少
			let prec = length / width;

			//按比例计算出时间变化量
			let changeScope = Number(((lastTimeScope.end - lastTimeScope.start) * prec).toFixed(0));
			if (sign === "min") {
				changeScope = 0 - changeScope;
			}

			//从新计算currentTimeScope
			let _currentTimeScope = {
				start: lastTimeScope.start + changeScope,
				end: lastTimeScope.end + changeScope,
			};

			//-----------------比例计算完成开始更新------------------
			/**
			 * 用真实数组位置 以及当前取到的时间范围取交集
			 * 取所有tick的交集
			 */
			let resultInterArr = findIntersection(tickArr, _currentTimeScope);

			/**
			 * 用剩下的tick去进行扩展
			 */
			let newTicks = updateTicks(
				resultInterArr,
				_currentTimeScope,
				false,
				_moveAmount,
				(function () {
					if (pureLength + moveAmount - x > 0) {
						return "min";
					}

					return "add";
				})()
			);

			/* let displayTickRoundValuesArray = findRoundTimeCountFromArray(
				newTicks as unknown as jsonObjectType[],
				"value"
			); */

			//挑选出所有按时间整数排列的等差数列的参数
			let displayTickRoundValuesArray = findRoundTimeCountFromArray(
				newTicks as unknown as jsonObjectType[],
				config!.timeZone!.displayTimeZone!,
				config!.timeFormat!,
				"value"
			);
			let _displayTickerArr;
			if (displayTickRoundValuesArray === null) {
				/**
				 * 求新时间范围和旧显示tick的交集
				 * 旧显示tick的交集
				 */
				let resultInterDisplayArr = findIntersection(displayTickArr, _currentTimeScope);

				if (resultInterDisplayArr.length === 0) {
					_displayTickerArr = createDisplayTickers(newTicks);
				} else {
					_displayTickerArr = updateDisplayTicks(resultInterDisplayArr, newTicks);
				}
				_displayTickerArr = _displayTickerArr.sort(function (a: tickItem, b: tickItem) {
					return (a.value as number) - (b.value as number);
				});
			} else {
				//从所有等差数列的参数里算出具体的数列
				_displayTickerArr = createDisplayTickersByDate(newTicks, displayTickRoundValuesArray);
			}

			/**
			 * 网格线组
			 */
			let _netLineArr = createNetLines(_displayTickerArr);
			setxAxisUpdateMoveMentTimeStamp(+new Date());
			setcurrentTimeScope(_currentTimeScope);
			settickArr(newTicks);
			setnetLineArr(_netLineArr);
			setdisplayTickArr(_displayTickerArr);
			if (isSaveScope) {
				setlastTimeScope(_currentTimeScope);
			}
			setxAxisUpdateTimeStamp(+new Date());
		}
	};

	/**
	 * 缩放
	 */
	const scale = function (point: number, precent: number, movement: "zoomIn" | "zoomOut" | "keep") {
		if (candleObj?.data.isFetchingData && config?.data?.dynamicData?.stopUserOperateWhenLoading) {
			return;
		}
		if (tickArr.length > 24 * 60 * 2 && movement === "zoomOut") {
			return;
		}

		//最小缩放
		if (tickArr.length <= netLineMinCount && movement === "zoomIn") {
			return;
		}

		if (isFinishedInit) {
			let leftPrecent = point / lineSize.width;
			let rightPrecent = 1 - leftPrecent;
			leftPrecent = (precent * 100 * leftPrecent) / 100;
			rightPrecent = (precent * 100 * rightPrecent) / 100;

			/**
			 * 粗糙时间范围
			 */
			let _currentTimeScope = lastTimeScope;
			let total = _currentTimeScope.end - _currentTimeScope.start;
			let q = {
				start: total * leftPrecent,
				end: total * rightPrecent,
			};

			if (movement === "zoomIn") {
				_currentTimeScope = {
					start: _currentTimeScope.start + q.start,
					end: _currentTimeScope.end - q.end,
				};
			}

			if (movement === "zoomOut") {
				_currentTimeScope = {
					start: _currentTimeScope.start - q.start,
					end: _currentTimeScope.end + q.end,
				};
			}

			let _tickArr = [...tickArr];

			/**
			 * 当前的整数时间
			 */
			/**
			 * 用真实数组位置 以及当前取到的时间范围取交集
			 * 取所有tick的交集
			 */
			let resultInterArr = findIntersection(_tickArr, _currentTimeScope);
			if (resultInterArr.length === 0) {
				return;
			}

			/**
			 * 用剩下的tick去进行扩展
			 */
			let newTicks = updateTicks(resultInterArr, _currentTimeScope, true, 0, "all");

			//挑选出所有按时间整数排列的等差数列的参数
			let displayTickRoundValuesArray = findRoundTimeCountFromArray(
				newTicks as unknown as jsonObjectType[],
				config!.timeZone!.displayTimeZone!,
				config!.timeFormat!,
				"value"
			);

			let _displayTickerArr;
			if (displayTickRoundValuesArray === null) {
				/**
				 * 用于显示的ticker
				 */
				_displayTickerArr = createDisplayTickers(newTicks);
				_displayTickerArr = _displayTickerArr.sort(function (a: tickItem, b: tickItem) {
					return (a.value as number) - (b.value as number);
				});
			} else {
				//从所有等差数列的参数里算出具体的数列
				_displayTickerArr = createDisplayTickersByDate(newTicks, displayTickRoundValuesArray);
			}

			/**
			 * 网格线组
			 */
			let _netLineArr = createNetLines(_displayTickerArr);

			//缩放量计算
			let scale = (_currentTimeScope.end - _currentTimeScope.start) / (orgScope.end - orgScope.start);

			setscaleValue(scale);
			setlastTimeScope(_currentTimeScope);
			setcurrentTimeScope(_currentTimeScope);
			settickArr(newTicks);
			setnetLineArr(_netLineArr);
			setdisplayTickArr(_displayTickerArr);
			setxAxisUpdateTimeStamp(+new Date());
			setxAxisUpdateScaleTimeStamp(+new Date());
			//setx(0);在数据钩子里设置这个，免得页面跳动
			setmoveAmount(0);
		}
	};

	/**
	 * tooltip更新
	 */
	const tooltipUpdate = function () {
		if (isFinishedInit && tooltipIsShow) {
			let _tooltipState: IToolTipItem | null = tooltipState;
			if (_tooltipState === null) {
				return;
			}
			_tooltipState.position.x = _tooltipState.relatedTickItem?.cPosition.x! + x;
			setTooltipState(_tooltipState);
		}
	};

	/**
	 * tooltip移动
	 */
	const tooltipMove = function (position: pointCoord, isShowTooltip: boolean) {
		if (isFinishedInit) {
			let tooltipX = position.x;
			if (tooltipX > lineSize.width) {
				isShowTooltip = false;
			}

			settooltipIsShow(isShowTooltip);
			if (isShowTooltip === false) {
				return;
			}

			//通过像素位置进行二分法查找目标tick
			let _tickItem: tickItem | null = findTick(tooltipX - moveAmount, "pixSpace");
			if (_tickItem === null) {
				setTooltipState(null);
				return;
			}
			let _tooltipState: IToolTipItem = {
				position: {
					x: _tickItem.cPosition.x + moveAmount,
					y: 0,
				},
				length: linePosition.y,
				value: _tickItem.value as number,
				relatedTickItem: _tickItem,
				size: getSpaceSize(initArgs.tooltip!.lineSize!, viewSize.width),
			};

			setTooltipState(_tooltipState);
		}
	};

	/**
	 * 更新轴
	 *@param  {number} viewWidth 界面的全量宽度
	 *@param  {number} viewHeight 界面的全量高度
	 *@param {number | string} yAxisLabelSpace y轴的label空间
	 *@returns {void}
	 */
	const updateAxisSates = function (viewWidth: number, viewHeight: number, yAxisLabelSpace: number | string) {
		setviewSize({
			width: viewWidth,
			height: viewHeight,
		});
		setyAxisSpace(getSpaceSize(yAxisLabelSpace, viewWidth));
		setlinePosition({
			x: 0,
			y: viewHeight - getSpaceSize(initArgs.labelSpace!, viewHeight),
		});
		setlineSize({
			width: viewWidth - getSpaceSize(yAxisLabelSpace, viewWidth),
			size: initArgs.lineSize!,
		});
	};

	/* 重新计算大小 */
	const resize = function () {
		if (isFinishedInit) {
			window.requestAnimationFrame(function () {
				scale(viewSize.width / 2, 0, "keep");
			});
		}
	};

	/* 重新生成x轴 */
	const reGenXAxis = function () {
		if (isFinishedInit) {
			window.requestAnimationFrame(function () {
				scale(viewSize.width / 2, 0, "keep");
			});
		}
	};

	/* 鼠标移动速度检测器 */
	const mouseSpeedDetecor = function () {
		let speed = mousePosition - lastmousePosition;
		setmouseSpeedSec(speed);
		setlastmousePosition(mousePosition);
		setUpMouseSpeedDetecor();
	};

	/* 打开鼠标移动速度检测器 */
	const setUpMouseSpeedDetecor = function () {
		let timeOut = setTimeout(() => {
			setmouseSpeedTemp(+new Date());
		}, 24);
		setmouseSpeedTimmer(timeOut);
	};

	/* 销毁速度检测器 */
	const destroyMouseSpeedDetecor = function () {
		if (typeof mouseSpeedTimmer !== undefined) {
			setmouseSpeedTemp(0);
			clearTimeout(mouseSpeedTimmer);
		}
	};

	/**
	 * ==================================Effects===============================
	 */
	useEffect(function (): ReturnType<React.EffectCallback> {
		if (isMounted === false) {
			setIsMounted(true);
			setUpMouseSpeedDetecor();
		}
		return function (): void {
			setIsMounted(false);
			destroyMouseSpeedDetecor();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//侧鼠标速度
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (mouseSpeedTemp !== 0) {
				mouseSpeedDetecor();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[mouseSpeedTemp]
	);

	//初始化状态以后初始化数轴
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (currentTimeType !== null && currentTimeScope.start === 0 && currentTimeScope.end === 0) {
				createAxisData();
			}

			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[currentTimeType, currentTimeScope]
	);

	//初始化状态以后初始化数轴
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			resize();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[viewSize]
	);

	//初始化状态以后初始化数轴
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			tooltipUpdate();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[x]
	);

	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (initArgsChange !== -1) {
				update();
			}
		},
		[initArgsChange]
	);

	return {
		data: {
			/**
			 * 当前时间类型
			 */
			currentTimeType,
			/**
			 * 初始时间范围
			 */
			lastTimeScope,
			/**
			 * 当前时间范围
			 */
			currentTimeScope,
			/**
			 * line的位置（上左定位）
			 *内容区和label区的分割线的位置
			 */
			linePosition,
			/**
			 * line的尺寸
			 */
			lineSize,
			/**
			 * line的颜色
			 */
			lineColor,
			/**
			 * 网格线的最大数量
			 */
			netLineMaxCount,
			/**
			 * 网格线组
			 */
			netLineArr,
			/**
			 * 轴网格线最小数量
			 */
			netLineMinCount,
			/**
			 * 真实tick组（实际的tick空间）
			 */
			tickArr,
			/**
			 * 显示tick组（用于显示的tick）
			 */
			displayTickArr,
			/**
			 * 是否已完成初始化
			 */
			isFinishedInit,
			/**
			 * 每次缩放的增减值
			 */
			scaleStep,
			/**
			 * tooltip
			 */
			tooltipState,
			/**
			 * tooltip是否显示
			 */
			tooltipIsShow,
			labelSpace,
			xAxisUpdateTimeStamp,
			viewSize,
			displayTickCommonWidth,
			displayTickCommonpixWidth,
			/* 移动量 */
			moveAmount,
			x,
			xAxisUpdateMoveMentTimeStamp,
			xAxisUpdateScaleTimeStamp,
			mouseSpeedSec,
			moveDirection,
			InitStemp,
		},
		funcs: {
			/**
			 * 设置初始时间范围
			 */
			setlastTimeScope,
			/**
			 * 设置当前时间范围
			 */
			setcurrentTimeScope,
			/**
			 * 设置line的位置（上左定位）
			 *内容区和label区的分割线的位置
			 */
			setlinePosition,
			/**
			 * 设置line的尺寸
			 */
			setlineSize,
			/**
			 * 设置line的颜色
			 */
			setlineColor,
			/**
			 * 设置网格线的最大数量
			 */
			setnetLineMaxCount,
			/**
			 * 设置网格线组
			 */
			setnetLineArr,
			/**
			 * 设置轴网格线最小数量
			 */
			setnetLineMinCount,
			/**
			 * 设置真实tick组（实际的tick空间）
			 */
			settickArr,
			/**
			 * 设置显示tick组（用于显示的tick）
			 */
			setdisplayTickArr,
			/**
			 * 初始化轴
			 *@param {TtimeType} timeType 时间类型
			 *@param  {number} viewWidth 界面的全量宽度
			 *@param  {number} viewHeight 界面的全量高度
			 *@param {number | string} yAxisLabelSpace y轴的label空间
			 *@returns {void}
			 */
			initAxisSates,
			/**
			 * 更新轴
			 *@param  {number} viewWidth 界面的全量宽度
			 *@param  {number} viewHeight 界面的全量高度
			 *@param {number | string} yAxisLabelSpace y轴的label空间
			 *@returns {void}
			 */
			updateAxisSates,
			/**
			 * 移动轴
			 */
			moveAxis,
			moveContainer,
			/**
			 * 缩放轴
			 */
			scale,
			/**
			 * tooltip移动
			 */
			tooltipMove,
			setx,
			setcandleObj,
			setinitArgs: function (arg: Iaxis) {
				setinitArgs(Object.assign(true, initArgs, arg));
				setinitArgsChange(+new Date());
			},
			reGenXAxis,
		},

		/**
		 *初始化时用到的参数
		 */
		initArgs,
	};
};

export default usexAxis;
