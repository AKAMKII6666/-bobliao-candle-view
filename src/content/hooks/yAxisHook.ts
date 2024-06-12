import { createContext, useState, useContext, useRef, useCallback, useEffect, FC, ReactElement } from "react";

import {} from "../interface/contextInterFace";
import { pointCoord } from "../interface/itemsInterFace";
import {
	getDecimalOfLength,
	getIntOfLength,
	getSpaceSize,
	roundToNearestTenBigNumber,
	shiftNumber,
} from "../utils/consts";
import _bigNumber from "bignumber.js";
import { Iaxis } from "../interface/configInterFaces";
import { IAxisobj, IyAxisobj } from "../interface/hooksInterFace";
import { DEFAULTAXISVALUES } from "../utils/defaultValues";
import { IToolTipItem, netLineItem, numberScope, numberScopeString, tickItem } from "../interface/itemsInterFace";

/**
 * y轴钩子
 */
const useyAxis = function (args: Iaxis, xAxis?: IAxisobj): IyAxisobj {
	xAxis = xAxis!;
	/**
	 *默认参数状态
	 */
	const [initArgs, setinitArgs] = useState<Iaxis>(Object.assign(true, DEFAULTAXISVALUES, args));
	const [initArgsChange, setinitArgsChange] = useState<number>(-1);
	/**
	 * ============================state===========================
	 */
	const [isMounted, setIsMounted] = useState<boolean>(false);
	/**
	 * 是否已完成初始化
	 */
	const [isFinishedInit, setisFinishedInit] = useState<boolean>(false);
	/**
	 * y轴的更新
	 */
	const [yAxisUpdateTimeStamp, setyAxisUpdateTimeStamp] = useState<number>(-1);

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
	 * ============================数据 state===========================
	 */

	/**
	 * 当前数据范围
	 */
	const [currentDataScope, setcurrentDataScope] = useState<numberScopeString>({
		/**
		 * 最下面的值
		 */
		start: "0",
		/**
		 * 最上面的值
		 */
		end: "0",
	});

	/**
	 * 当前数据整体长度（从0开始）
	 */
	const [currentDataSpace, setcurrentDataSpace] = useState<string>("0");

	/**
	 * 当前数据相对0的位置(以start为基准 )
	 */
	const [currentDataPositionOfStart, setcurrentDataPositionofStart] = useState<string>("0");

	/**
	 * ============================line 属性state===========================
	 */

	/**
	 * view的全量尺寸
	 */
	const [viewSize, setviewSize] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});

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
		height: number;
		/**
		 * line的粗细
		 */
		size: number;
	}>({
		height: 0,
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
	 * 显示tick组（用于显示的tick）
	 */
	const [displayTickArr, setdisplayTickArr] = useState<Array<tickItem>>([]);
	const [tickLength, settickLength] = useState<number>(0);

	/**
	 * ==========================静态常量==============================
	 */

	//计算用的缩进
	const _shiftLength = 18;
	//显示时取小数点后几位
	const displayFix = 7;
	/**
	 * ==========================函数==============================
	 */

	/**
	 * 更新轴 (所有数字都依据_shiftLength转换成大数字用BigNumber.js进行计算 )
	 *@param  {number} viewWidth 界面的全量宽度
	 *@param  {number} viewHeight 界面的全量高度
	 *@param {numberScope} dataScope 数据范围
	 *@returns {void}
	 */
	const updateAxisSates = function (viewWidth: number, viewHeight: number, dataScope: numberScope) {
		console.log(dataScope);
		let _dataScope: numberScopeString = {
			start: new _bigNumber(dataScope.start)
				.times(new _bigNumber(10).exponentiatedBy(_shiftLength).toFixed())
				.toFixed(0),
			end: new _bigNumber(dataScope.end)
				.times(new _bigNumber(10).exponentiatedBy(_shiftLength).toFixed())
				.toFixed(0),
		};
		let scopeResult = expandDataSpanceEdge(_dataScope);

		if (
			viewWidth === viewSize.width &&
			viewHeight === viewSize.height &&
			scopeResult.dataScope === currentDataScope
		) {
			return;
		}
		/* 设置各项属性 */
		setviewSize({
			width: viewWidth,
			height: viewHeight,
		});

		setlinePosition({
			x: viewWidth - getSpaceSize(initArgs.labelSpace!, viewWidth),
			y: 0,
		});
		setlineSize({
			height: viewHeight - getSpaceSize(xAxis.initArgs.labelSpace!, viewHeight) + 1,
			size: initArgs.lineSize!,
		});
		setlabelSpace(getSpaceSize(initArgs.labelSpace!, viewHeight));

		//计算数据边距
		//let _currentDataSpace = new _bigNumber(shiftNumber(dataScope.end - dataScope.start, _shiftLength)).toString();

		////
		// dataScope.start - _currentDataSpace * initArgs.displayPadding!,
		setcurrentDataScope(scopeResult.dataScope);
		setcurrentDataSpace(scopeResult.currentDataSpace);
		setcurrentDataPositionofStart(new _bigNumber(dataScope.start).minus("0").toString());
		settickLength(getSpaceSize(initArgs.tickLength!, viewWidth));
		setlineColor(initArgs.lineColor!);
		setnetLineMaxCount(initArgs.netLineMaxCount!);
		setnetLineMinCount(initArgs.netLineMinCount!);
	};

	const update = function (viewWidth: number, viewHeight: number) {
		/* 设置各项属性 */
		setviewSize({
			width: viewWidth,
			height: viewHeight,
		});
		setlinePosition({
			x: viewWidth - getSpaceSize(initArgs.labelSpace!, viewWidth),
			y: 0,
		});
		setlineSize({
			height: viewHeight - getSpaceSize(xAxis.initArgs.labelSpace!, viewHeight) + 1,
			size: initArgs.lineSize!,
		});
		setlabelSpace(getSpaceSize(initArgs.labelSpace!, viewHeight));
		settickLength(getSpaceSize(initArgs.tickLength!, viewWidth));
		setlineColor(initArgs.lineColor!);
		setnetLineMaxCount(initArgs.netLineMaxCount!);
		setnetLineMinCount(initArgs.netLineMinCount!);
	};

	//扩展数据范围边界（使得显示范围不显得局促）
	const expandDataSpanceEdge = function <T extends numberScopeString>(
		input: T
	): {
		dataScope: T;
		currentDataSpace: string;
	} {
		let result = { ...input };
		let currentDataSpace = new _bigNumber(input.end).minus(input.start).toString();

		let _expandAmount = new _bigNumber(currentDataSpace).times(initArgs.displayPadding!);

		currentDataSpace = new _bigNumber(currentDataSpace).plus(_expandAmount).toString();

		result.start = new _bigNumber(input.start).minus(new _bigNumber(_expandAmount).div(2)).toString();
		result.end = new _bigNumber(input.end).plus(new _bigNumber(_expandAmount).div(2)).toString();
		return { dataScope: result, currentDataSpace };
	};

	//扩展像素范围边界（使得显示范围不显得局促）
	const expandDataSpanceEdgePIX = function <T extends numberScope>(
		input: T
	): {
		dataScope: T;
		currentDataSpace: string;
	} {
		let result = { ...input };
		let currentDataSpace = new _bigNumber(input.start).minus(input.end).toString();

		let _expandAmount = new _bigNumber(currentDataSpace).times(initArgs.displayPadding!);

		currentDataSpace = new _bigNumber(currentDataSpace).plus(_expandAmount).toString();

		result.start = Number(new _bigNumber(input.start).plus(new _bigNumber(_expandAmount).div(2)).toString());
		result.end = Number(new _bigNumber(input.end).minus(new _bigNumber(_expandAmount).div(2)).toString());
		return { dataScope: result, currentDataSpace };
	};

	/**
	 * tick种子计算
	 * 给定一个区间【开始，结束】，这是一段范围，需要在这个范围里找到8~4个tick
	 * 这个tick需要满足以下条件
	 * 1.显示tick的空间只能显示7位数字加一个小数点
	 * 2.需要考虑到大于7位数字显示的情况
	 * 3.需要考虑1位数字+6位小数的情况
	 * (所有数字都依据_shiftLength转换成大数字用BigNumber.js进行计算 )
	 *
	 *
	 * 解决思路：
	 * 1.【开始，结束】【1.123456，4.215463】里的数字都*1000000 就算碰到1.123456遮掩的数字，也能进行整除处理 =》 【1123456，4215463】
	 * 2.给“开始”数字例如 1123456 进行取整，从10位开始，先取成1123460,先计算跨度 4215463 - 1123460 =3092003 然后计算3092003/10 得到309200.3 我们的目标是<8，所以继续以此类推...
	 * 3.上一个数字继续取整 1123460 进行取整，但是这次 10*2=20，那么先取成 1123480 ,先计算跨度 4215463 - 1123480 =3091983,然后计算3091983/20 得到154599.15 我们的目标是<8，所以继续以此类推...
	 * 4.上一个数字继续取整 1123480 进行取整，但是这次 20*2=40，那么先取成 1123520 ,先计算跨度 4215463 - 1123520 =3091943,然后计算3091943/40 得到77298.575 我们的目标是<8，所以继续以此类推...
	 * 5.上一个数字继续取整 1123520 进行取整，但是这次 40*2=80，那么先取成 1123600 ,先计算跨度 4215463 - 1123600 =3091863,然后计算3091863/80 得到38648.2875 我们的目标是<8，所以继续以此类推...
	 * 6.上一个数字继续取整 1123600 进行取整，但是这次 80*2=160，那么先取成 1123760 ,先计算跨度 4215463 - 1123760 =3091703,然后计算3091703/160 得到19323.14375 我们的目标是<8，所以继续以此类推...
	 * 7.上一个数字继续取整 1123760 进行取整，但是这次 160*2=380，那么先取成 1121140 ,先计算跨度 4215463 - 1121140 =3094323,然后计算 3094323/380 得到8142.9552631578945 我们的目标是<8，所以继续以此类推...
	 * 8.上一个数字继续取整 1121140 进行取整，但是这次 380*2=760，那么先取成 1121800 ,先计算跨度 4215463 - 1121800 =3093663,然后计算 3093663/760 得到4070.6092105263156 我们的目标是<8，所以继续以此类推...
	 * 9.上一个数字继续取整 1121800 进行取整，但是这次 760*2=1520，那么先取成 1123300 ,先计算跨度 4215463 - 1123300 =3092163,然后计算 3092163/1520 得到2034.3177631578947 我们的目标是<8，所以继续以此类推...
	 * 10.上一个数字继续取整 1123300 进行取整，但是这次 1520*2=3040，那么先取成 1126340 ,先计算跨度 4215463 - 1126340 =3089123,然后计算 3089123/3040 得到1016.1588815789473 我们的目标是<8，所以继续以此类推...
	 * 11.上一个数字继续取整 1126340 进行取整，但是这次 3040*2=6080，那么先取成 1132420 ,先计算跨度 4215463 - 1132420 =3083043,然后计算 3083043/6080 得到507.07944078947367 我们的目标是<8，所以继续以此类推...
	 * 12.上一个数字继续取整 1132420 进行取整，但是这次 6080*2=12160，那么先取成 1144580 ,先计算跨度 4215463 - 1144580 =3070883,然后计算 3070883/12160 得到252.53972039473683 我们的目标是<8，所以继续以此类推...
	 * 13.上一个数字继续取整 1144580 进行取整，但是这次 12160*2=24320，那么先取成 1168900 ,先计算跨度 4215463 - 1168900 =3046563,然后计算 3046563/24320 得到125.26986019736842 我们的目标是<8，所以继续以此类推...
	 * 14.上一个数字继续取整 1168900 进行取整，但是这次 24320*2=48640，那么先取成 1217540 ,先计算跨度 4215463 - 1217540 =2997923,然后计算 2997923/48640 得到61.63493009868421 我们的目标是<8，所以继续以此类推...
	 * 15.上一个数字继续取整 1217540 进行取整，但是这次 48640*2=97280，那么先取成 1217540 ,先计算跨度 4215463 - 1314820 =2900643,然后计算 2900643/97280 得到61.63493009868421 我们的目标是<8，所以继续以此类推...
	 * 16.上一个数字继续取整 1217540 进行取整，但是这次 97280*2=194560 ，那么先取成 1412100 ,先计算跨度 4215463 - 1412100 =2803363,然后计算 2803363/194560 得到14.408732524671052 我们的目标是<8，所以继续以此类推...
	 * 17.上一个数字继续取整 1412100 进行取整，但是这次 194560*2=389120 ，那么先取成 1801220 ,先计算跨度 4215463 - 1801220 =2414243,然后计算 2414243/389120 得到6.204366262335526 我们的目标是<8，任务完成；
	 * 1801220 / 6.204366262335526 得到每步
	 * 然后再用 【每步的数字】 / 1000000
	 *
	 * 实际计算和上面写的算法有一点点不太一样，每次计算完成后不再是step * 2  而是 step + “0” 也就是加一位数
	 *
	 */
	const getTickSeed = function (): string[] {
		let dataScope = { ...currentDataScope };

		let resultTickArr: string[] = [];

		//范围的计算数值(直接加权7位数进行运算，算完再换算回来 )
		let scope = {
			start: dataScope.start,
			end: dataScope.end,
		};

		//步数
		let step = "10";
		let stepAdd = "10";
		//取整范围
		let intGetPar = "10";
		var tickCount = "8";
		var startInteger: string = roundToNearestTenBigNumber(scope.start, Number(intGetPar));
		var integerTimes = 0;
		while (true) {
			//算跨度
			//scope.end - startInteger
			let scDf = new _bigNumber(scope.end).minus(startInteger).toString();
			//算数量
			//scDf / step
			tickCount = new _bigNumber(scDf).div(step).toFixed().toString();

			//看算出来的数量是否大于最大数量，大于的话就继续算
			if (new _bigNumber(tickCount).gt(initArgs.netLineMaxCount!)) {
				//把step 加一个0
				let postStep = (Number(step) + Number(stepAdd)).toString();
				/**
				 * 这里的思路较原思路有所改变
				 * 当step每多一个位 就将每个step的步进多加一位 例如原来的步进是10 如果现在step是100 那么步进就要来到100
				 * 取整范围也是，比如之前是个位数取整，步进多了一位就要变成十位取整，以此类推
				 */
				if (postStep.length > step.length) {
					stepAdd = stepAdd + "0";
					intGetPar = intGetPar + "0";
					startInteger = roundToNearestTenBigNumber(scope.start, Number(intGetPar));
					integerTimes = integerTimes + 1;
				}
				step = postStep;
			} else {
				break;
			}
		}

		//算出每个tick的数据
		for (var i = 0; i < Number(tickCount); i++) {
			//startInteger + (step * i)
			resultTickArr.push(new _bigNumber(startInteger).plus(new _bigNumber(step).times(i)).toString());
		}

		return resultTickArr;
	};

	/**
	 * 取得显示tick
	 */
	const computDisplayTicks = function (tickSeed: string[]): tickItem[] {
		let result: tickItem[] = [];
		let index = 0;
		for (var item of tickSeed) {
			result.push({
				index: index,
				color: initArgs.tickColor!,
				length: getSpaceSize(initArgs.tickLength!, viewSize.width),
				size: initArgs.tickSize!,
				cPosition: {
					x: linePosition.x,
					y: (function () {
						let pre = Number(
							new _bigNumber(item)
								.minus(currentDataScope.start)
								.div(currentDataSpace)
								.toFixed(_shiftLength)
						);
						return lineSize.height - lineSize.height * pre;
					})(),
				},
				value: item,
				displayValue: new _bigNumber(shiftNumber(item, -_shiftLength)).toFixed(displayFix),
			});
			index++;
		}
		return result;
	};

	/**
	 * 取得显示line
	 */
	const computDisplayLines = function (tickSeed: string[]): netLineItem[] {
		let result: netLineItem[] = [];
		let index = 0;
		for (var item of tickSeed) {
			result.push({
				color: initArgs.netLineColor!,
				length: linePosition.x,
				size: initArgs.netLineSize!,
				cPosition: {
					x: 0,
					y: (function () {
						let pre = Number(
							new _bigNumber(item)
								.minus(currentDataScope.start)
								.div(currentDataSpace)
								.toFixed(_shiftLength)
						);
						return lineSize.height - lineSize.height * pre;
					})(),
				},
				value: item,
			});
			index++;
		}
		return result;
	};

	/**
	 * 计算tick
	 */
	const computTicks = function () {
		//获得当前轴的整数列（种子）
		let tickSeed: string[] = getTickSeed();
		let _displayTickArr = computDisplayTicks(tickSeed);
		let _netLineArr = computDisplayLines(tickSeed);

		setdisplayTickArr(_displayTickArr);
		setnetLineArr(_netLineArr);
		setisFinishedInit(true);
		setyAxisUpdateTimeStamp(+new Date());
	};

	/**
	 * 计算tooltip
	 */
	const tooltipMove = function (position: pointCoord, isShowTooltip: boolean) {
		let tooltipY = position.y;
		if (tooltipY > lineSize.height) {
			isShowTooltip = false;
		}

		settooltipIsShow(isShowTooltip);
		if (isShowTooltip === false) {
			return;
		}

		let pre = 1 - tooltipY / lineSize.height;
		let value = new _bigNumber(currentDataScope.start).plus(new _bigNumber(currentDataSpace).times(pre)).toString();

		let _tooltipState: IToolTipItem = {
			position: {
				x: 0,
				y: tooltipY,
			},
			length: linePosition.x,
			value: value,
			displayValue: new _bigNumber(shiftNumber(value, -_shiftLength)).toFixed(displayFix),
			relatedTickItem: null,
			size: getSpaceSize(initArgs.tooltip!.lineSize!, viewSize.width),
		};
		setTooltipState(_tooltipState);
	};

	/**
	 * ==================================Effects===============================
	 */
	useEffect(function (): ReturnType<React.EffectCallback> {
		if (isMounted === false) {
			setIsMounted(true);
		}
		return function (): void {
			setIsMounted(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (currentDataSpace !== "0") {
				computTicks();
			}
		},
		[currentDataScope]
	);

	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (initArgsChange !== -1) {
				update(viewSize.width, viewSize.height);
			}
		},
		[initArgsChange]
	);

	return {
		data: {
			isFinishedInit,
			tooltipState,
			tooltipIsShow,
			currentDataScope,
			currentDataSpace,
			currentDataPositionOfStart,
			viewSize,
			linePosition,
			labelSpace,
			lineColor,
			netLineArr,
			netLineMaxCount,
			netLineMinCount,
			displayTickArr,
			lineSize,
			tickLength,
			yAxisUpdateTimeStamp,
		},
		funcs: {
			updateAxisSates,
			tooltipMove,
			expandDataSpanceEdge,
			expandDataSpanceEdgePIX,
			setinitArgs: function (arg: Iaxis) {
				setinitArgs(Object.assign(true, initArgs, arg));
				setinitArgsChange(+new Date());
			},
		},
		initArgs,
	};
};

export default useyAxis;
