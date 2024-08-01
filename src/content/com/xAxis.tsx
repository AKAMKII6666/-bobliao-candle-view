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

const XAxis: FC<iprops> = ({}, _ref): ReactElement => {
	//===============useHooks=================
	const CVData = useCandleViewPixiContext();

	//===============state====================
	const [isMounted, setIsMounted] = useState<boolean>(false);

	//===============static===================
	const labelPadding: number = 25;

	//===============ref======================
	const tooltipTextRef = useRef<any>(null);

	//===============function=================
	/* 创建tick */
	const makeTicks = function () {
		let result: React.JSX.Element[] = [];
		let index = 0;
		for (var item of CVData.hookObjs.xAxisObj.data.displayTickArr) {
			result.push(
				<React.Fragment key={index + "_d"}>
					<Rectangle
						color={PIXI.utils.string2hex(item.color)}
						size={{
							width: item.size,
							height: item.length,
						}}
						position={item.cPosition}
						alignX="center"
						alignY="top"
					></Rectangle>
				</React.Fragment>
			);
			index++;
		}

		return result;
	};

	/* 创建label */
	const makeLabels = function () {
		let result: React.JSX.Element[] = [];
		let index = 0;
		for (var item of CVData.hookObjs.xAxisObj.data.displayTickArr) {
			result.push(
				<React.Fragment key={index + "_a"}>
					<Text
						anchor={0.5}
						x={item.cPosition.x}
						y={item.cPosition.y + CVData.hookObjs.xAxisObj.data.labelSpace / 2}
						text={(function () {
							if (typeof CVData.hookObjs.xAxisObj.initArgs.formatter !== "undefined") {
								return CVData.hookObjs.xAxisObj.initArgs.formatter!(item);
							}
							return item.displayValue?.toString()!;
						})()}
						resolution={2}
						style={
							new PIXI.TextStyle({
								align: "center",
								fontSize: CVData.hookObjs.xAxisObj.initArgs.fontSize,
								fill: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tickColor!),
							})
						}
					/>
				</React.Fragment>
			);
			index++;
		}

		return result;
	};

	/* 创建tooltip */
	const makeTooltip = function () {
		if (
			!CVData.hookObjs.xAxisObj.initArgs.tooltip!.enabled! ||
			CVData.hookObjs.xAxisObj.data.tooltipState === null ||
			!CVData.hookObjs.xAxisObj.data.tooltipIsShow
		) {
			return null;
		}

		return (
			<>
				<DashedLine
					color={PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tooltip!.color!)}
					size={CVData.hookObjs.xAxisObj.data.tooltipState.size}
					positionStart={CVData.hookObjs.xAxisObj.data.tooltipState.position}
					positionStop={{
						x: CVData.hookObjs.xAxisObj.data.tooltipState.position.x,
						y: CVData.hookObjs.xAxisObj.data.tooltipState.length,
					}}
					dashLength={CVData.hookObjs.xAxisObj.initArgs.tooltip!.dashLength!}
					spaceLength={CVData.hookObjs.xAxisObj.initArgs.tooltip!.spaceLength!}
				></DashedLine>

				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.backGroundColor!)}
					size={{
						width: tooltipTextRef.current?.width + labelPadding,
						height: CVData.hookObjs.xAxisObj.data.labelSpace,
					}}
					position={(function () {
						if (CVData.hookObjs.xAxisObj.data.tooltipState.position.x - tooltipTextRef.current?.width / 2 - labelPadding / 2 < 0) {
							return {
								x: tooltipTextRef.current?.width / 2 + labelPadding / 2,
								y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!.cPosition.y,
							};
						}

						if (
							CVData.hookObjs.xAxisObj.data.tooltipState.position.x + tooltipTextRef.current?.width / 2 + labelPadding / 2 >
							CVData.hookObjs.xAxisObj.data.lineSize.width
						) {
							return {
								x: CVData.hookObjs.xAxisObj.data.lineSize.width - tooltipTextRef.current?.width / 2 - labelPadding / 2,
								y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!.cPosition.y,
							};
						}
						return {
							x: CVData.hookObjs.xAxisObj.data.tooltipState.position.x,
							y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!.cPosition.y,
						};
					})()}
					alignX="center"
					alignY="top"
				></Rectangle>
				<Rectangle
					color={PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.color!)}
					size={{
						width: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!.size,
						height: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!.length,
					}}
					position={{
						x: CVData.hookObjs.xAxisObj.data.tooltipState.position.x,
						y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!.cPosition.y,
					}}
					alignX="center"
					alignY="top"
				></Rectangle>
				<Text
					ref={tooltipTextRef}
					anchor={0.5}
					x={(function () {
						if (CVData.hookObjs.xAxisObj.data.tooltipState.position.x - tooltipTextRef.current?.width / 2 - labelPadding / 2 < 0) {
							return tooltipTextRef.current?.width / 2 + labelPadding / 2;
						}

						if (
							CVData.hookObjs.xAxisObj.data.tooltipState.position.x + tooltipTextRef.current?.width / 2 + labelPadding / 2 >
							CVData.hookObjs.xAxisObj.data.lineSize.width
						) {
							return CVData.hookObjs.xAxisObj.data.lineSize.width - tooltipTextRef.current?.width / 2 - labelPadding / 2;
						}
						return CVData.hookObjs.xAxisObj.data.tooltipState.position.x;
					})()}
					y={CVData.hookObjs.xAxisObj.data.tooltipState.length + CVData.hookObjs.xAxisObj.data.labelSpace / 2}
					text={CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.formatter!(CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem!) as string}
					resolution={2}
					style={
						new PIXI.TextStyle({
							align: "center",
							fontSize: CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.fontsize,
							fill: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.color!),
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
			}
		},
		[isMounted]
	);

	useEffect(function (): ReturnType<React.EffectCallback> {
		return function (): void {
			setIsMounted(false);
		};
	}, []);

	/* x轴背景 */
	let xBackground = useMemo(
		function () {
			return (
				<>
					{/* y轴背景 */}
					<Rectangle
						color={PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.backgroundColor!)}
						size={{
							width: CVData.hookObjs.xAxisObj.data.viewSize.width,
							height: CVData.hookObjs.xAxisObj.data.labelSpace,
						}}
						position={CVData.hookObjs.xAxisObj.data.linePosition}
						alignX="left"
						alignY="top"
					></Rectangle>
				</>
			);
		},
		[
			CVData.hookObjs.yAxisObj.data.labelSpace,
			CVData.hookObjs.yAxisObj.data.viewSize,
			CVData.hookObjs.yAxisObj.data.linePosition,
			CVData.hookObjs.yAxisObj.data.lineColor,
			CVData.hookObjs.yAxisObj.initArgs.backgroundColor,
		]
	);

	let xAsixElem = useMemo(
		function () {
			return (
				<>
					{/*  x轴 */}
					<Rectangle
						color={PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.lineColor!)}
						size={{
							width: CVData.hookObjs.xAxisObj.data.lineSize.width,
							height: CVData.hookObjs.xAxisObj.data.lineSize.size,
						}}
						position={CVData.hookObjs.xAxisObj.data.linePosition}
						alignX="left"
						alignY="top"
					></Rectangle>
				</>
			);
		},
		[
			CVData.hookObjs.xAxisObj.data.lineSize.width,
			CVData.hookObjs.xAxisObj.data.lineSize.size,
			CVData.hookObjs.xAxisObj.data.linePosition,
			CVData.hookObjs.xAxisObj.initArgs.lineColor,
		]
	);

	let ticks = useMemo(
		function () {
			return makeTicks();
		},
		[CVData.hookObjs.xAxisObj.data.displayTickArr]
	);

	let labels = useMemo(
		function () {
			return makeLabels();
		},
		[CVData.hookObjs.xAxisObj.data.displayTickArr, CVData.hookObjs.xAxisObj.initArgs]
	);

	let tooltip = useMemo(
		function () {
			return makeTooltip();
		},
		[
			CVData.hookObjs.xAxisObj.data.tooltipState,
			CVData.hookObjs.xAxisObj.data.tooltipIsShow,
			CVData.hookObjs.xAxisObj.data.x,
			CVData.hookObjs.xAxisObj.initArgs.tooltip,
		]
	);

	return (
		<>
			{/* x轴背景 */}
			{xBackground}
			{xAsixElem}
			{/* 创建x轴标 */}
			<Container x={CVData.hookObjs.xAxisObj.data.x}>
				{ticks}
				{/* 创建label */}
				{labels}
			</Container>
			{/* 创建ToolTip */}
			{tooltip}
		</>
	);
};

//使用memo不让其因为上级节点的更新而频繁更新
export default memo(XAxis);
