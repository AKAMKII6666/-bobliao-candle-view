/**
 * 廖力编写
 * 模块名称：交易图表
 * 模块说明：用于模仿tradingView做的交易实时图表
 * 编写时间：2024年5月25日 00:30:05
 */
import React, {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
	FC,
	ReactElement,
	createContext,
	useContext,
	MouseEventHandler,
	MouseEvent,
	WheelEvent,
	memo,
	TouchEvent,
} from "react";
import { Stage, Container, Sprite, PixiComponent } from "@pixi/react";
import * as PIXI from "pixi.js";
import useJquery, { jQueryObject, isRunningInServer } from "@bobliao/use-jquery-hook";
import styles from "./index.module.scss";
import { IuseCandleViewContext, useCandleViewContext } from "./context/candleViewContext";
import ResizeObserver from "resize-observer-polyfill";
import useDebounce from "./hooks/debounceHook";
import { getLength, getSpaceSize } from "./utils/consts";
import XAxis from "./com/xAxis";
import { IcandleViewContext } from "./interface/contextInterFace";
import { pointCoord } from "./interface/itemsInterFace";
import YAxis from "./com/yAxis";
import Data from "./com/data";
import NetLines from "./com/netLines";
import DataToolTip from "./com/dataToolTip";
import VolumChart from "./com/volumChart";
import Info from "./com/info";
import Loading from "./com/loadingLay";

/**
 * 传入参数
 */
export interface iprops {}

/**
 * 创建一个需要全局使用的钱包context
 **/
export const candleViewPixiContext = createContext<IcandleViewContext>({} as IcandleViewContext);
export const useCandleViewPixiContext: IuseCandleViewContext = function (): IcandleViewContext {
	var r: IcandleViewContext = useContext(candleViewPixiContext);
	return r;
};

const CandleView: FC<iprops> = ({}, _ref): ReactElement => {
	//===============useHooks=================
	const CVData = useCandleViewContext();
	const $ = useJquery();
	const resizeDebounce = useDebounce();

	//===============state====================
	const [isMounted, setIsMounted] = useState<boolean>(false);

	/**
	 *组件当前位置
	 */
	const [offset, setoffset] = useState<pointCoord>({ x: 0, y: 0 });

	/* 鼠标在组件中的位置 */
	const [relativePosition, setrelativePosition] = useState<pointCoord>({ x: 0, y: 0 });

	/**
	 *鼠标是否按下
	 */
	const [isMouseDown, setisMouseDown] = useState<boolean>(false);

	/**
	 *鼠标按下时的位置
	 */
	const [mouseDownPosition, setmouseDownPosition] = useState<pointCoord>({ x: 0, y: 0 });

	/**
	 *鼠标实时位置
	 */
	const [mousePosition, setmousePosition] = useState<pointCoord>({ x: 0, y: 0 });
	const [touchScaleStartLength, settouchScaleStartLength] = useState<number>(0);

	/**
	 *是否触摸缩放
	 */
	const [isTouchScale, setisTouchScale] = useState<boolean>(false);

	//===============static===================

	//===============ref======================
	const canvasConatiner = useRef<HTMLDivElement>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	//===============function=================

	/**
	 *初始化CandleView
	 */
	const initCandleView = async function (): Promise<void> {
		//获得画布尺寸
		getCanvasSize();

		//创建resize
		createResizeObserver();

		//初始化背景颜色
		CVData.funcs.setcanvasBackgroundColor(CVData.initArgs.backgroundColor!);
	};

	/**
	 *获得画布尺寸
	 */
	const getCanvasSize = function () {
		if (CVData.initArgs.height! === "auto") {
			$(canvasConatiner.current).parent().css("overflow", "hidden");
			$(canvasConatiner.current).parent().css("position", "relative");
		}

		//如果放在容器里但是没指定容器高度
		if ($(canvasConatiner.current).parent().height() === 0 && CVData.initArgs.height! === "auto") {
			$(canvasConatiner.current).parent().height(500);
		}

		//如果没有放在特定容器里
		if (
			$(canvasConatiner.current).parent() !== 0 &&
			CVData.initArgs.height! === "auto" &&
			($(canvasConatiner.current).next().length !== 0 || $(canvasConatiner.current).prev().length !== 0)
		) {
			CVData.initArgs.height = 500;
		}

		//设置宽度
		CVData.funcs.setcanvasWidth(
			//
			getSpaceSize(
				//
				CVData.initArgs.width!,
				$(canvasConatiner.current).parent().width()
			)
		);

		//设置高度
		CVData.funcs.setcanvasHeight(
			//
			getSpaceSize(
				//
				CVData.initArgs.height!,
				$(canvasConatiner.current).parent().height()
			)
		);

		let offset: any = $(canvasConatiner.current).offset();
		//获得组件当前位置
		setoffset({ x: offset.left, y: offset.top });
	};

	/**
	 *创建reasize
	 */
	const createResizeObserver = function () {
		if (canvasConatiner.current !== null) {
			resizeObserverRef.current = new ResizeObserver((entries) => {
				if (entries.length > 0) {
					if (CVData.initArgs.resizeDebounceTime !== 0) {
						resizeDebounce(function () {
							getCanvasSize();
						}, CVData.initArgs.resizeDebounceTime!);
					} else {
						getCanvasSize();
					}
				}
			});
			//监听它的上级的大小变化
			resizeObserverRef.current.observe($(canvasConatiner.current).parent()[0]);
		}
	};

	/**
	 *清除resize
	 */
	const clearObserver = function () {
		if (resizeObserverRef.current !== null) {
			resizeObserverRef.current.disconnect();
			resizeObserverRef.current = null;
		}
	};
	/* 触摸 */
	const onTouchStartContainer = function (event: TouchEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}

		if (typeof event.targetTouches[0] !== "undefined" && typeof event.targetTouches[1] !== "undefined") {
			setisTouchScale(true);
			settouchScaleStartLength(
				getLength(
					{ x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY },
					{ x: event.targetTouches[1].pageX, y: event.targetTouches[1].pageY }
				)
			);
			return;
		}
		setisMouseDown(true);
		setmouseDownPosition({
			x: event.targetTouches[0].pageX,
			y: event.targetTouches[0].pageY,
		});
		setmousePosition({
			x: event.targetTouches[0].pageX,
			y: event.targetTouches[0].pageY,
		});
		setrelativePosition({
			x: event.targetTouches[0].pageX - offset.x,
			y: event.targetTouches[0].pageY - offset.y,
		});
	};
	const onTouchMoveContainer = function (event: TouchEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}

		if (typeof event.targetTouches[0] !== "undefined" && typeof event.targetTouches[1] !== "undefined") {
			let left = Math.min(event.targetTouches[0].pageX, event.targetTouches[1].pageX);
			let right = Math.max(event.targetTouches[0].pageX, event.targetTouches[1].pageX);
			let point = (right - left) / 2 + left;

			let length = getLength(
				{ x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY },
				{ x: event.targetTouches[1].pageX, y: event.targetTouches[1].pageY }
			);

			if (Math.abs(length - touchScaleStartLength) > 3) {
				settouchScaleStartLength(
					getLength(
						{ x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY },
						{ x: event.targetTouches[1].pageX, y: event.targetTouches[1].pageY }
					)
				);
				let movement: "zoomIn" | "zoomOut" = "zoomIn";
				if (length - touchScaleStartLength < 0) {
					movement = "zoomOut";
				}
				CVData.hookObjs.xAxisObj.funcs.scale(point, CVData.hookObjs.xAxisObj.data.scaleStep, movement);
			}
			return;
		}

		if (isMouseDown) {
			CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, event.targetTouches[0].pageX, false);
		} else {
			CVData.hookObjs.xAxisObj.funcs.tooltipMove(
				{
					x: event.targetTouches[0].pageX - offset.x,
					y: event.targetTouches[0].pageY - offset.y,
				},
				true
			);
		}
		CVData.hookObjs.yAxisObj.funcs.tooltipMove(
			{
				x: event.targetTouches[0].pageX - offset.x,
				y: event.targetTouches[0].pageY - offset.y,
			},
			true
		);
		setrelativePosition({
			x: event.targetTouches[0].pageX - offset.x,
			y: event.targetTouches[0].pageY - offset.y,
		});
		setmousePosition({
			x: event.targetTouches[0].pageX,
			y: event.targetTouches[0].pageY,
		});
		event.cancelable = true;
		event.stopPropagation();
	};
	const onTouchEndtContainer = function (event: TouchEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		if (isTouchScale) {
			setisTouchScale(false);
			return;
		}
		CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, mousePosition.x, true);
		setisMouseDown(false);
		setmouseDownPosition({
			x: 0,
			y: 0,
		});

		setrelativePosition({
			x: mousePosition.x - offset.x,
			y: mousePosition.y - offset.y,
		});
	};

	/* 鼠标进入 */
	const onMouseEnterContainer = function (event: MouseEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		setrelativePosition({
			x: event.pageX - offset.x,
			y: event.pageY - offset.y,
		});
		CVData.hookObjs.xAxisObj.funcs.tooltipMove(
			{
				x: event.pageX - offset.x,
				y: event.pageY - offset.y,
			},
			true
		);
		CVData.hookObjs.yAxisObj.funcs.tooltipMove(
			{
				x: event.pageX - offset.x,
				y: event.pageY - offset.y,
			},
			true
		);
	};

	/* 鼠标按下 */
	const onMouseDownContainer = function (event: MouseEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		setisMouseDown(true);
		setmouseDownPosition({
			x: event.pageX,
			y: event.pageY,
		});
		setrelativePosition({
			x: event.pageX - offset.x,
			y: event.pageY - offset.y,
		});
	};

	/* 鼠标移动 */
	const onMouseMoveContainer = function (event: MouseEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		if (isMouseDown) {
			CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, event.pageX, false);
		} else {
			CVData.hookObjs.xAxisObj.funcs.tooltipMove(
				{
					x: event.pageX - offset.x,
					y: event.pageY - offset.y,
				},
				true
			);
		}
		CVData.hookObjs.yAxisObj.funcs.tooltipMove(
			{
				x: event.pageX - offset.x,
				y: event.pageY - offset.y,
			},
			true
		);
		setrelativePosition({
			x: event.pageX - offset.x,
			y: event.pageY - offset.y,
		});
	};

	/* 鼠标弹起 */
	const onMouseUpContainer = function (event: MouseEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, event.pageX, true);
		setisMouseDown(false);
		setmouseDownPosition({
			x: 0,
			y: 0,
		});

		setrelativePosition({
			x: event.pageX - offset.x,
			y: event.pageY - offset.y,
		});
	};

	/* 鼠标离开 */
	const onMouseLeaveContainer = function (event: MouseEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		setrelativePosition({
			x: event.pageX - offset.x,
			y: event.pageY - offset.y,
		});
		CVData.hookObjs.xAxisObj.funcs.tooltipMove(
			{
				x: event.pageX - offset.x,
				y: event.pageY - offset.y,
			},
			false
		);
		CVData.hookObjs.yAxisObj.funcs.tooltipMove(
			{
				x: event.pageX - offset.x,
				y: event.pageY - offset.y,
			},
			false
		);
	};

	/* 鼠标滚动 */
	const onWheelContainer = function (e: WheelEvent<HTMLDivElement>) {
		//开启了正在加载时阻止用户操作
		if (
			CVData.initArgs.data?.dynamicData?.stopUserOperateWhenLoading === true &&
			CVData.hookObjs.candleObj.data.isFetchingData
		) {
			return;
		}
		let movement: "zoomIn" | "zoomOut" = "zoomIn";
		if (e.deltaY > 0) {
			movement = "zoomOut";
		}
		CVData.hookObjs.xAxisObj.funcs.scale(e.pageX, CVData.hookObjs.xAxisObj.data.scaleStep, movement);
		e.nativeEvent.stopPropagation();
		return false;
	};
	const preventDefault = (e: any) => e.preventDefault();

	//===============effects==================
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (isMounted === false) {
				setIsMounted(true);
				initCandleView();
				canvasConatiner.current!.addEventListener("wheel", preventDefault);
			}
		},
		[isMounted]
	);

	useEffect(function (): ReturnType<React.EffectCallback> {
		return function (): void {
			setIsMounted(false);
			clearObserver();
			canvasConatiner.current!.removeEventListener("wheel", preventDefault);
		};
	}, []);

	return (
		<>
			<div
				className={styles.container}
				ref={canvasConatiner}
				style={{
					width: CVData.data.canvasWidth + "px",
					height: CVData.data.canvasHeight + "px",
					backgroundColor: CVData.initArgs.backgroundColor,
				}}
				onMouseDown={onMouseDownContainer}
				onMouseMove={onMouseMoveContainer}
				onMouseUp={onMouseUpContainer}
				onWheel={onWheelContainer}
				onMouseEnter={onMouseEnterContainer}
				onMouseLeave={onMouseLeaveContainer}
				onTouchStart={onTouchStartContainer}
				onTouchMove={onTouchMoveContainer}
				onTouchEnd={onTouchEndtContainer}
			>
				<Loading color="white"></Loading>
				<Info></Info>
				<Stage
					options={{
						backgroundAlpha: 0,
						width: CVData.data.canvasWidth,
						height: CVData.data.canvasHeight,
						resolution: 2,
					}}
					style={{
						width: CVData.data.canvasWidth,
						height: CVData.data.canvasHeight,
						backgroundColor: CVData.initArgs.backgroundColor,
					}}
					width={CVData.data.canvasWidth}
					height={CVData.data.canvasHeight}
					raf={false}
					renderOnComponentChange={true}
				>
					{/* 桥接context */}
					<candleViewPixiContext.Provider value={CVData}>
						<NetLines></NetLines>
						<VolumChart></VolumChart>
						<Data></Data>
						<XAxis></XAxis>
						<YAxis></YAxis>
					</candleViewPixiContext.Provider>
				</Stage>
			</div>
		</>
	);
};
export default memo(CandleView);
