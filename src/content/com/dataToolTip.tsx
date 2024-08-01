/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, FC, ReactElement, memo, LegacyRef, useMemo } from "react";
import { Stage, Graphics, Container, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import { DashedLine, Rectangle } from "../utils/basicShaps";
import { useCandleViewPixiContext } from "..";
import { getSpaceSize } from "../utils/consts";

/**
 * 传入参数
 */
export interface iprops {}

const DataTooltop: FC<iprops> = ({}, _ref): ReactElement => {
	//===============useHooks=================
	const CVData = useCandleViewPixiContext();

	//===============state====================
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [updateTemp, setupdateTemp] = useState<number>(0);
	//===============static===================
	const labelPadding: number = 10;

	//===============ref======================
	const lastDataTooltipTextRef = useRef<any>(null);
	const lastDataTooltipTextRef2 = useRef<any>(null);
	const lastDataTooltipTextRef3 = useRef<any>(null);
	const lastDataTooltipTextRef4 = useRef<any>(null);

	//===============function=================
	/* 创建最后一个candle的tooltip */
	const makeLastCandleTooltip = function () {
		if (
			CVData.hookObjs.candleObj.data.latestCandleItem === null ||
			!CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip!.enabled! ||
			CVData.hookObjs.candleObj.data.latestCandleToolTip === null ||
			!CVData.hookObjs.candleObj.data.latestCandleToolTip
		) {
			return null;
		}

		return (
			<>
				<DashedLine
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.data.latestCandleItem!.candleColor!)}
					size={CVData.hookObjs.candleObj.data.latestCandleToolTip.size}
					positionStart={CVData.hookObjs.candleObj.data.latestCandleToolTip.position}
					positionStop={{
						x: CVData.hookObjs.candleObj.data.latestCandleToolTip.length,
						y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y,
					}}
					dashLength={CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip!.dashLength!}
					spaceLength={CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip!.spaceLength!}
				></DashedLine>

				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.data.latestCandleItem!.candleColor!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.labelSpace,
						height: lastDataTooltipTextRef.current?.height + labelPadding,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y,
					}}
					alignX="left"
					alignY="center"
				></Rectangle>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip?.label?.color!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.tickLength,
						height: CVData.hookObjs.candleObj.data.latestCandleToolTip.size,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y,
					}}
					alignX="left"
					alignY="center"
				></Rectangle>
				<Text
					ref={lastDataTooltipTextRef}
					anchor={{ x: 0, y: 0.6 }}
					x={CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2}
					y={CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y}
					text={
						CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip?.label?.formatter!(
							CVData.hookObjs.candleObj.data.latestCandleToolTip
						) as string
					}
					resolution={2}
					style={
						new PIXI.TextStyle({
							fontSize: CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip?.label?.fontsize,
							fill: PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip?.label?.color!),
						})
					}
				/>
			</>
		);
	};

	/* 视图范围内最末尾的candle */
	const makeLatestCandleToolTip = function () {
		if (
			!CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip!.enabled! ||
			CVData.hookObjs.candleObj.data.latestdisplayLatestCandle === null ||
			!CVData.hookObjs.candleObj.data.latestdisplayLatestCandle
		) {
			return null;
		}

		return (
			<>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip?.label?.backGroundColor!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.labelSpace,
						height: lastDataTooltipTextRef2.current?.height + labelPadding,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.position.y,
					}}
					alignX="left"
					alignY="center"
					opacity={CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip?.label?.backGroundAlpha}
				></Rectangle>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip?.label?.color!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.tickLength,
						height: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.size,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.position.y,
					}}
					alignX="left"
					alignY="center"
				></Rectangle>
				<Text
					ref={lastDataTooltipTextRef2}
					anchor={{ x: 0, y: 0.6 }}
					x={CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2}
					y={CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.position.y}
					text={
						CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip?.label?.formatter!(
							CVData.hookObjs.candleObj.data.latestdisplayLatestCandle
						) as string
					}
					resolution={2}
					style={
						new PIXI.TextStyle({
							fontSize: CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip?.label?.fontsize,
							fill: PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip?.label?.color!),
						})
					}
				/>
			</>
		);
	};

	/* 创建最后一个candle的tooltip */
	const makeLastVolumeTooltip = function () {
		if (
			!CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip!.enabled! ||
			CVData.hookObjs.candleObj.data.latestVolumeToolTip === null ||
			!CVData.hookObjs.candleObj.data.latestVolumeToolTip
		) {
			return null;
		}

		return (
			<>
				<DashedLine
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip!.color!)}
					size={CVData.hookObjs.candleObj.data.latestVolumeToolTip.size}
					positionStart={CVData.hookObjs.candleObj.data.latestVolumeToolTip.position}
					positionStop={{
						x: CVData.hookObjs.candleObj.data.latestVolumeToolTip.length,
						y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y,
					}}
					dashLength={CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip!.dashLength!}
					spaceLength={CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip!.spaceLength!}
				></DashedLine>

				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip?.label?.backGroundColor!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.labelSpace,
						height: lastDataTooltipTextRef3.current?.height + labelPadding,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y,
					}}
					alignX="left"
					alignY="center"
				></Rectangle>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip?.label?.color!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.tickLength,
						height: CVData.hookObjs.candleObj.data.latestVolumeToolTip.size,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y,
					}}
					alignX="left"
					alignY="center"
				></Rectangle>
				<Text
					ref={lastDataTooltipTextRef3}
					anchor={{ x: 0, y: 0.6 }}
					x={CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2}
					y={CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y}
					text={
						CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip?.label?.formatter!(
							CVData.hookObjs.candleObj.data.latestVolumeToolTip,
							CVData.initArgs.language
						) as string
					}
					resolution={2}
					style={
						new PIXI.TextStyle({
							fontSize: CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip?.label?.fontsize,
							fill: PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip?.label?.color!),
						})
					}
				/>
			</>
		);
	};

	/* 视图范围内最末尾的candle */
	const makeLatestVolumeToolTip = function () {
		if (
			!CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip!.enabled! ||
			CVData.hookObjs.candleObj.data.latestdisplayLatestVolume === null ||
			!CVData.hookObjs.candleObj.data.latestdisplayLatestVolume
		) {
			return null;
		}

		return (
			<>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip?.label?.backGroundColor!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.labelSpace,
						height: lastDataTooltipTextRef4.current?.height + labelPadding,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.position.y,
					}}
					alignX="left"
					alignY="center"
					opacity={CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip?.label?.backGroundAlpha}
				></Rectangle>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip?.label?.color!)}
					size={{
						width: CVData.hookObjs.yAxisObj.data.tickLength,
						height: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.size,
					}}
					position={{
						x: CVData.hookObjs.yAxisObj.data.linePosition.x,
						y: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.position.y,
					}}
					alignX="left"
					alignY="center"
				></Rectangle>
				<Text
					ref={lastDataTooltipTextRef4}
					anchor={{ x: 0, y: 0.6 }}
					x={CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2}
					y={CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.position.y}
					text={
						CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip?.label?.formatter!(
							CVData.hookObjs.candleObj.data.latestdisplayLatestVolume,
							CVData.initArgs.language
						) as string
					}
					resolution={2}
					style={
						new PIXI.TextStyle({
							fontSize: CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip?.label?.fontsize,
							fill: PIXI.utils.string2hex(CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip?.label?.color!),
						})
					}
				/>
			</>
		);
	};

	//===============effects==================
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			if (isMounted === false) {
				setIsMounted(true);
				setTimeout(() => {
					setupdateTemp(+new Date());
				}, 500);
			}
		},
		[isMounted]
	);

	useEffect(function (): ReturnType<React.EffectCallback> {
		return function (): void {
			setIsMounted(false);
		};
	}, []);

	//
	useEffect(
		function (): ReturnType<React.EffectCallback> {
			return function (): void {
				setTimeout(() => {
					setupdateTemp(+new Date());
				}, 500);
			};
		},
		[CVData.initArgs.timeFormat]
	);

	let latestCandleToolTip = useMemo(
		function () {
			return makeLatestCandleToolTip();
		},
		[
			{ ...CVData.hookObjs.candleObj.data.latestdisplayLatestCandle },
			updateTemp,
			{ ...CVData.hookObjs.candleObj.initArgs.candleStyles?.viewLastPriceTooltip! },
		]
	);

	let lastCandleTooltip = useMemo(
		function () {
			return makeLastCandleTooltip();
		},
		[{ ...CVData.hookObjs.candleObj.data.latestCandleToolTip }, updateTemp, { ...CVData.hookObjs.candleObj.initArgs.candleStyles?.currentPriceTooltip! }]
	);

	let LastVolumeTooltip = useMemo(
		function () {
			return makeLastVolumeTooltip();
		},
		[
			{ ...CVData.hookObjs.candleObj.data.latestVolumeToolTip },
			updateTemp,
			{ ...CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.currentPriceTooltip! },
		]
	);

	//

	let LatestVolumeToolTip = useMemo(
		function () {
			return makeLatestVolumeToolTip();
		},
		[
			{ ...CVData.hookObjs.candleObj.data.latestdisplayLatestVolume },
			updateTemp,
			{ ...CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart!.viewLastPriceTooltip! },
		]
	);

	return (
		<>
			{LatestVolumeToolTip}
			{LastVolumeTooltip}
			{latestCandleToolTip}
			{lastCandleTooltip}
		</>
	);
};

//使用memo不让其因为上级节点的更新而频繁更新
export default memo(DataTooltop);
