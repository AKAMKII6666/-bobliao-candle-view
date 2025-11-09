import { useState, useEffect } from "react";

import { pointCoord } from "../interface/itemsInterFace";
import { anyTimeToGMT0000ToTarget, arrayToHash, findIntersection, getRangePosition, getSpaceSize } from "../utils/consts";
import { IAxisobj, IuseCandleHook, TAxis } from "../interface/hooksInterFace";
import { Iaxis } from "../interface/configInterFaces";
import { DEFAULTAXISVALUES } from "../utils/defaultValues";
import { findRoundTimeCountFromArray, timeTypeMap } from "../utils/timeFormatDefine";
import { IToolTipItem, findRoundTimeCountFromArrayDataItem, jsonObjectType, netLineItem, numberScope, tickItem } from "../interface/itemsInterFace";
import { ItimeFormat, TtimeType } from "../interface/timeDefineInterFace";

/**
 * x轴钩子
 */
const usexAxis: TAxis = function (args, igorn, config): IAxisobj {
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
	const initAxisSates = function (timeType: TtimeType, viewWidth: number, viewHeight: number, yAxisLabelSpace: number | string) {
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
	 * 扩展tick组（动态更新X轴刻度）
	 * 这是X轴数据更新的核心函数，负责根据移动方向动态扩展tick数组
	 * 支持向前、向后或双向扩展，并重新计算所有tick的位置和属性
	 *
	 * @param targetTickArr 目标tick数组，将被扩展和更新
	 * @param timeScope 当前时间范围，用于计算tick位置
	 * @param isComputCommonProp 是否重新计算公共属性（位置、宽度等）
	 * @param _moveAmount 当前移动偏移量，用于位置计算
	 * @param moveDir 移动方向："add"向前扩展，"min"向后扩展，"all"双向扩展
	 * @returns 更新后的tick数组
	 */
	const updateTicks = function (
		targetTickArr: tickItem[],
		timeScope: numberScope,
		isComputCommonProp: boolean,
		_moveAmount: number,
		moveDir: "add" | "min" | "all"
	): tickItem[] {
		/**
		 * 第一部分：向前扩展tick数组
		 * 当用户向右拖拽或需要显示更多未来时间时触发
		 */
		if (moveDir === "add" || moveDir === "all") {
			/**
			 * 从当前tick数组的最后一个时间点开始，向前推测到时间范围结束
			 * 生成需要添加的未来时间点数组
			 */
			let forwardArr = timeSpeculation_forward(targetTickArr[targetTickArr.length - 1].value as number, timeScope.end);

			/**
			 * 如果推测出新的时间点，则创建对应的tick对象并添加到数组末尾
			 * 注意：跳过第一个元素（index=0），因为它是当前数组的最后一个元素
			 */
			if (forwardArr.length > 1) {
				// 创建新的tick对象数组
				let arr = createTickers(forwardArr, timeScope, isComputCommonProp, _moveAmount);
				// 将新tick添加到目标数组末尾（跳过第一个重复元素）
				for (var i = 1; i < arr.length; i++) {
					targetTickArr.push(arr[i]);
				}
			}
		}

		/**
		 * 第二部分：向后扩展tick数组
		 * 当用户向左拖拽或需要显示更多历史时间时触发
		 */
		if (moveDir === "min" || moveDir === "all") {
			/**
			 * 从当前tick数组的第一个时间点开始，向后推测到时间范围开始
			 * 生成需要添加的历史时间点数组
			 */
			let backwardArr = timeSpeculation_backrward(targetTickArr[0].value as number, timeScope.start);

			/**
			 * 如果推测出新的时间点，则创建对应的tick对象并添加到数组开头
			 * 注意：跳过最后一个元素，因为它是当前数组的第一个元素
			 */
			if (backwardArr.length > 1) {
				// 创建新的tick对象数组
				let arr = createTickers(backwardArr, timeScope, isComputCommonProp, _moveAmount);
				// 将新tick添加到目标数组开头（跳过最后一个重复元素）
				for (var i = arr.length - 2; i > -1; i--) {
					targetTickArr.unshift(arr[i]);
				}
			}
		}

		/**
		 * 第三部分：计算公共像素属性
		 * 这些属性用于计算每个tick的位置、宽度等显示属性
		 */
		let commonPixProperties;
		if (isComputCommonProp) {
			/**
			 * 情况A：重新计算公共属性
			 * 当时间范围或tick数量发生变化时，需要重新计算所有公共属性
			 */
			commonPixProperties = computTickCommonProp(timeScope, lineSize.width, targetTickArr.length);
		} else {
			/**
			 * 情况B：使用现有公共属性
			 * 当只是移动位置而不改变范围时，复用现有的公共属性以提高性能
			 */
			commonPixProperties = {
				dataWidth: displayTickCommonWidth, // 每个tick的数据宽度
				pixWidth: displayTickCommonpixWidth, // 每个tick的像素宽度
				incriseWidth: (function () {
					// 扩展宽度（用于padding）
					return lineSize.width * initArgs.displayPadding!;
				})(),
			};
		}

		/**
		 * 第四部分：更新tick位置和属性
		 * 只有在需要重新计算公共属性时才执行，避免不必要的计算
		 */
		if (isComputCommonProp) {
			/**
			 * 更新每个tick的位置和索引
			 * 重新计算所有tick的像素位置、数据空间等属性
			 */
			let index = 0;
			for (var item of targetTickArr) {
				/**
				 * 计算总宽度（包含扩展宽度）
				 * 总宽度 = 轴宽度 + 左右扩展宽度
				 */
				let width = lineSize.width + commonPixProperties.incriseWidth * 2;

				/**
				 * 计算tick的像素位置
				 * x坐标 = 时间在范围中的相对位置 - 扩展宽度 - 移动偏移量
				 * y坐标 = 轴线的y位置
				 */
				item.cPosition = {
					x: getRangePosition(Number(item.value), timeScope, width) - commonPixProperties.incriseWidth - _moveAmount,
					y: linePosition.y,
				};

				// 设置tick在数组中的索引
				item.index = index;
				index++;

				/**
				 * 计算tick的数据空间和像素空间
				 * 包括数据范围、像素范围等详细属性
				 */
				item = computDataPixTick(item, timeScope, index, commonPixProperties.dataWidth, commonPixProperties.pixWidth);
			}

			/**
			 * 按时间顺序排序tick数组
			 * 确保tick数组始终按时间顺序排列，便于后续处理
			 */
			targetTickArr = targetTickArr.sort(function (a: tickItem, b: tickItem) {
				return (a.value as number) - (b.value as number);
			});
		}

		/**
		 * 返回更新后的tick数组
		 * 包含所有扩展的tick和更新后的位置信息
		 */
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
	const computDataPixTick = function (item: tickItem, range: numberScope, index: number, dataWidth: number, pixWidth: number): tickItem {
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
	const createTickers = function (arr: number[], range: numberScope, isComputCommonProp: boolean, moveAmount: number): Array<tickItem> {
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
				x: getRangePosition(Number(resultItem.value), range, width) - commonPixProperties.incriseWidth - moveAmount,
				y: linePosition.y,
			};
			resultItem.index = index;

			result.push(computDataPixTick(resultItem, range, index, commonPixProperties.dataWidth, commonPixProperties.pixWidth));
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
	const createDisplayTickersByDate = function (tickArr: tickItem[], displayTickRoundValuesArray: findRoundTimeCountFromArrayDataItem[]) {
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

	/**
	 * getTickWithFormated函数的作用是：根据给定的等差数列参数（xCondition），从tickArr（tick数组）中挑选出需要显示的tick（刻度）项，并格式化它们的显示值（displayValue）。
	 *
	 * 参数说明：
	 * - tickArr: tick项的数组，每一项包含其value等信息
	 * - xCondition: 一个对象，包含刻度的挑选规则，包括startIndex（起始下标）、step（步长，每隔几个取一个）、count（总共取多少个），以及type（时间类型及其formatter格式化函数）
	 *
	 * 实现方式：
	 * 1. 首先根据startIndex取得第一个需要显示的tick，将其displayValue通过xCondition.type.formatter格式化。
	 * 2. 然后继续按照步长step, 从当前下标往前，依次挑选后续需要显示的tick（共count+1个，因为包含起点），每一个tick都同样格式化displayValue。
	 * 3. 最终返回格式化后的tick数组。
	 *
	 * 返回值：格式化好的tick数组
	 */
	const getTickWithFormated = function (tickArr: tickItem[], xCondition: findRoundTimeCountFromArrayDataItem): tickItem[] {
		let result: tickItem[] = [];
		//先取到第一个
		let currentIndex = xCondition.startIndex;
		let currentItem = tickArr[currentIndex];
		currentItem.displayValue = xCondition.type.formatter(Number(currentItem.value), config?.language!, config!.timeZone!.displayTimeZone);
		result.push(currentItem);
		//然后再依次取剩下的
		for (let i = xCondition.count; i > -1; i--) {
			currentIndex = currentIndex - 1 - xCondition.step;
			if (typeof tickArr[currentIndex] === "undefined") {
				break;
			}
			currentItem = tickArr[currentIndex];
			currentItem.displayValue = xCondition.type.formatter(Number(currentItem.value), config?.language!, config!.timeZone!.displayTimeZone);
			result.push(currentItem);
		}
		return result;
	};

	/**
	 * 初始化时制造轴数据
	 * 这是X轴数据生成的核心函数，负责创建时间轴的所有显示元素
	 *
	 * 算法流程：
	 * 1. 获得初始的时间范围
	 *    1.1 拟定时间范围，例如从当前时间往前推 24 小时，这是拟定的时间范围
	 *    1.2 确定标准时间范围，根据设置的时间类型 以当前时间进行取整+1 获得最末尾时间（最右边的时间），然后将时间往前推，每次一个单位（例如小时），直到超出"拟定时间范围" 得到最开始时间｛最左边的时间｝ 输出【｛最左边的时间｝，｛最左边的时间｝】时间范围； 真实 tick 数数组；
	 *    1.3 获得显示 tick 组 根据上面生成的 真实小时数数组；以及 最大 tick 显示数量，和最小显示 tick 数量；计算 显示 tick 组
	 */
	const createAxisData = function () {
		/**
		 * 第一步：获取初始时间范围
		 * 根据当前时间类型和初始时间点，计算X轴应该显示的时间范围
		 * 例如：1分钟图可能显示最近24小时，1小时图可能显示最近30天
		 */
		let _flexTimeScope = currentTimeType!.getInitTimeScope(initArgs.initTimePoint!);

		/**
		 * 第二步：处理时区转换
		 * 如果用户设置了非本地时区的显示时区，需要将时间范围转换为目标时区
		 * 这样可以确保在不同时区的用户看到一致的时间显示
		 */
		if (config!.timeZone!.displayTimeZone !== "local") {
			// 获取当前本地时区偏移量（小时）
			let date = new Date();
			let localtimeZone = Math.abs(date.getTimezoneOffset() / 60);

			// 将时间范围的开始时间转换为目标时区
			_flexTimeScope.start = anyTimeToGMT0000ToTarget(_flexTimeScope.start, localtimeZone, config!.timeZone!.displayTimeZone!);
			// 将时间范围的结束时间转换为目标时区
			_flexTimeScope.end = anyTimeToGMT0000ToTarget(_flexTimeScope.end, localtimeZone, config!.timeZone!.displayTimeZone!);
		}

		/**
		 * 第三步：计算整数时间点
		 * 将时间范围的结束时间向下取整到最近的整数时间点
		 * 例如：如果结束时间是14:23，1小时图的整数时间点就是14:00
		 */
		let _timeInteger = currentTimeType!.roundingFunction(_flexTimeScope!.end!, config!.timeZone!.displayTimeZone!);

		/**
		 * 第四步：生成完整的时间序列
		 * 从整数时间点开始，向前推算所有需要显示的时间点
		 * 例如：从14:00开始，向前推算到时间范围开始，生成[10:00, 11:00, 12:00, 13:00, 14:00]
		 */
		let realTimeArr = timeSpeculation_backrward(_timeInteger, _flexTimeScope?.start!);

		/**
		 * 第五步：设置当前时间范围
		 * 将计算出的时间范围保存为当前显示的时间范围
		 */
		let _currentTimeScope = _flexTimeScope;

		/**
		 * 第六步：创建基础tick数组
		 * 根据时间序列创建所有tick对象，包含位置、样式等属性
		 * 这是X轴的基础数据结构，包含所有可能显示的时间点
		 */
		let _tickerArr = createTickers(realTimeArr, _flexTimeScope, true, 0);

		/**
		 * 第七步：智能选择显示格式
		 * 分析时间数据，寻找最适合的整数时间点显示格式
		 * 例如：如果数据跨度是1天，可能选择每4小时显示一个刻度
		 * 如果数据跨度是1小时，可能选择每15分钟显示一个刻度
		 */
		let displayTickRoundValuesArray = findRoundTimeCountFromArray(
			_tickerArr as unknown as jsonObjectType[],
			config!.timeZone!.displayTimeZone!,
			config!.timeFormat!,
			"value"
		);

		/**
		 * 第八步：生成显示用的tick数组
		 * 根据智能分析的结果，决定如何显示tick
		 */
		let _displayTickerArr;
		if (displayTickRoundValuesArray === null) {
			/**
			 * 情况A：没有找到合适的时间格式
			 * 使用简单的等间隔显示方式，通过减半算法控制显示数量
			 */
			_displayTickerArr = createDisplayTickers(_tickerArr);

			// 按时间顺序排序显示tick
			_displayTickerArr = _displayTickerArr.sort(function (a: tickItem, b: tickItem) {
				return (a.value as number) - (b.value as number);
			});
		} else {
			/**
			 * 情况B：找到了合适的时间格式
			 * 使用智能的整数时间点显示方式，显示更美观的时间刻度
			 * 例如：显示整点时间而不是随机时间点
			 */
			_displayTickerArr = createDisplayTickersByDate(_tickerArr, displayTickRoundValuesArray);
		}

		/**
		 * 第九步：创建网格线数组
		 * 根据显示tick创建对应的垂直网格线，用于辅助阅读
		 */
		let _netLineArr = createNetLines(_displayTickerArr);

		/**
		 * 第十步：更新所有状态
		 * 将计算出的所有数据保存到React状态中，触发界面重新渲染
		 */
		// 保存原始时间范围，用于缩放计算
		setorgScope(_flexTimeScope);
		// 保存上次的时间范围，用于移动计算
		setlastTimeScope(_flexTimeScope);
		// 保存当前时间范围
		setcurrentTimeScope(() => _currentTimeScope);
		// 保存所有tick数据
		settickArr(_tickerArr);
		// 保存网格线数据
		setnetLineArr(_netLineArr);
		// 保存显示用的tick数据
		setdisplayTickArr(_displayTickerArr);
		// 标记初始化完成
		setisFinishedInit(true);
		// 记录初始化时间戳
		setInitStemp(+new Date());

		/**
		 * 注意：这里产生出来的指针会偏移一点，这是正常现象
		 * 因为最末尾的时间是根据当前时间来的，倒数第一个指针是根据最末尾时间取整得来的
		 * 这种偏移确保了时间轴与当前时间的对齐
		 */
	};

	/**
	 * 移动轴容器（鼠标拖拽处理）
	 * 这是用户拖拽X轴时的入口函数，负责处理鼠标移动事件并触发轴数据更新
	 *
	 * @param start 拖拽开始时的鼠标X坐标位置
	 * @param stop 拖拽结束时的鼠标X坐标位置
	 * @param isSaveScope 是否保存移动范围，true表示确认移动，false表示临时移动
	 */
	const moveContainer = function (start: number, stop: number, isSaveScope: boolean) {
		/**
		 * 前置检查：确保轴已经完成初始化
		 * 只有在轴数据完全初始化后才能进行移动操作
		 */
		if (isFinishedInit) {
			/**
			 * 第一步：计算本次移动的距离
			 * pureLength = 当前拖拽的距离（像素）
			 * 正值表示向右拖拽，负值表示向左拖拽
			 */
			let pureLength = stop - start;

			/**
			 * 第二步：计算累计移动距离
			 * _moveAmount = 本次移动距离 + 历史累计移动距离
			 * 这样可以实现连续的拖拽效果
			 */
			let _moveAmount = pureLength + moveAmount;

			/**
			 * 第三步：更新鼠标位置状态
			 * 记录当前鼠标位置，用于计算鼠标移动速度
			 * 鼠标速度会影响拖拽的流畅度和响应性
			 */
			setmousePosition(stop);

			/**
			 * 第四步：更新X轴偏移量
			 * 设置X轴的当前偏移量，用于立即更新画面显示
			 * 这确保了拖拽时的实时视觉反馈
			 */
			setx(pureLength + moveAmount);

			/**
			 * 第五步：条件性保存移动状态
			 * 只有在用户确认移动时才保存移动量
			 * 这样可以区分临时拖拽和确认的移动操作
			 */
			if (isSaveScope) {
				// 保存累计移动量，用于后续的移动计算
				setmoveAmount(_moveAmount);
			}

			/**
			 * 第六步：异步更新轴数据
			 * 使用requestAnimationFrame确保在下一帧更新轴数据
			 * 这样可以避免阻塞UI渲染，提供流畅的用户体验
			 */
			window.requestAnimationFrame(function () {
				// 调用核心移动算法，更新所有tick数据和显示
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
			//完成x轴更新，通知其他组件例如数据组件和y轴组件更新内容
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
