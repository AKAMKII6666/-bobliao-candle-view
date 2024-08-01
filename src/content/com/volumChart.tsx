/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, FC, ReactElement, memo, LegacyRef, useMemo } from "react";
import { Stage, Graphics, Container, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import { DashedLine, Rectangle, VolumeBatching } from "../utils/basicShaps";
import { useCandleViewPixiContext } from "..";
import { getSpaceSize } from "../utils/consts";

/**
 * 传入参数
 */
export interface iprops {}

const VolumChat: FC<iprops> = ({}, _ref): ReactElement => {
	//===============useHooks=================
	const CVData = useCandleViewPixiContext();

	//===============state====================
	const [isMounted, setIsMounted] = useState<boolean>(false);
	//===============static====================
	const staticMax = 1;

	//===============function=================
	/* 创建volume */
	const makeChat = function () {
		if (!CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.enabled) {
			return [];
		}
		let result: React.JSX.Element[] = [];
		let index = 0;

		for (var item of CVData.hookObjs.candleObj.data.displayCandleData) {
			let alpha = CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart?.alpha;
			let currentHeight = CVData.hookObjs.candleObj.data.volumChartPixHeight * (Number(item.volume) / staticMax);

			if (!item.isEscaped!) {
				result.push(
					<Rectangle
						key={item.time + "_volume"}
						color={PIXI.utils.string2hex(
							(function () {
								if (item.candleStateus === "rise") {
									return CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.riseColor!;
								}
								return CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.fallColor!;
							})()
						)}
						opacity={(function () {
							if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
								return alpha;
							}
							return 1;
						})()}
						size={{
							width: (function () {
								if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
									return item.candleWidth!;
								}
								return 1;
							})(),
							height: currentHeight,
						}}
						position={{
							x: item.currentTick!.cPosition.x!,
							y: CVData.hookObjs.xAxisObj.data.linePosition.y,
						}}
						alignX="center"
						alignY="bottom"
					></Rectangle>
				);
			} else {
				result.push(<React.Fragment key={item.time + "_volume"}></React.Fragment>);
			}

			index++;
		}

		return result;
	};

	/* 批量创建volume */
	const makeChatBatching = function () {
		if (!CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.enabled) {
			return [];
		}
		return (
			<>
				<VolumeBatching
					{...{
						alpha: CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart?.alpha!,
						staticMax: staticMax,
						volumChartPixHeight: CVData.hookObjs.candleObj.data.volumChartPixHeight,
						riseColor: CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.riseColor!,
						fallColor: CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.fallColor!,
						isDQuickUpdateing: CVData.hookObjs.candleObj.data.isDQuickUpdateing,
						linePositionY: CVData.hookObjs.xAxisObj.data.linePosition.y,
						data: CVData.hookObjs.candleObj.data.displayCandleData,
					}}
				></VolumeBatching>
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

	let chat = useMemo(
		function () {
			if (CVData.hookObjs.xAxisObj.data.tickArr.length > 120) {
				return makeChatBatching();
			} else {
				return makeChat();
			}
		},
		[
			CVData.hookObjs.candleObj.data.displayCandleData,
			CVData.hookObjs.candleObj.data.isDQuickUpdateing,
			CVData.hookObjs.candleObj.data.volumChartViewMax,
			CVData.hookObjs.candleObj.data.volumChartPixHeight,
			CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.riseColor,
			CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.fallColor,
			CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.alpha,
			CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.enabled,
		]
	);

	let scale = //用允许的最大高度 / 当前图像里的最大高度 = 需要缩放的值
		CVData.hookObjs.candleObj.data.volumChartPixHeight /
		(CVData.hookObjs.candleObj.data.volumChartPixHeight * (Number(CVData.hookObjs.candleObj.data.volumChartViewMax) / staticMax));

	//y轴位置也要减去刚刚计算的缩放
	let containerY = CVData.hookObjs.xAxisObj.data.linePosition.y - CVData.hookObjs.xAxisObj.data.linePosition.y * scale;
	return (
		<>
			<Container
				x={CVData.hookObjs.xAxisObj.data.x}
				y={containerY}
				scale={{
					x: 1,
					y: scale,
				}}
			>
				{chat}
			</Container>
		</>
	);
};

//使用memo不让其因为上级节点的更新而频繁更新
export default memo(VolumChat);
