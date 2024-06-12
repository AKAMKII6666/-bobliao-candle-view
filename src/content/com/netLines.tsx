/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
	FC,
	ReactElement,
	memo,
	LegacyRef,
	useMemo,
} from "react";
import { Stage, Graphics, Container, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import { Rectangle } from "../utils/basicShaps";
import { useCandleViewPixiContext } from "..";

/**
 * 传入参数
 */
export interface iprops {}

const NetLines: FC<iprops> = ({}, _ref): ReactElement => {
	//===============useHooks=================
	const CVData = useCandleViewPixiContext();

	//===============state====================
	const [isMounted, setIsMounted] = useState<boolean>(false);

	//===============static===================

	//===============ref======================

	//===============function=================

	/* 创建网格线 */
	const makeNetLinesx = function () {
		let result: React.JSX.Element[] = [];
		let index = 0;
		for (var item of CVData.hookObjs.xAxisObj.data.netLineArr) {
			result.push(
				<React.Fragment key={index + "_c"}>
					<Rectangle
						color={PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.netLineColor!)}
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

	const makeNetLinesy = function () {
		let result: React.JSX.Element[] = [];
		let index = 0;
		for (var item of CVData.hookObjs.yAxisObj.data.netLineArr) {
			result.push(
				<React.Fragment key={index + "_b"}>
					<Rectangle
						color={PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.netLineColor!)}
						size={{
							width: item.length,
							height: item.size,
						}}
						position={item.cPosition}
						alignX="left"
						alignY="center"
					></Rectangle>
				</React.Fragment>
			);
			index++;
		}

		return result;
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

	let netLinesx = useMemo(
		function () {
			return makeNetLinesx();
		},
		[CVData.hookObjs.xAxisObj.data.netLineArr, CVData.hookObjs.xAxisObj.initArgs.netLineColor]
	);

	let netLinesy = useMemo(
		function () {
			return makeNetLinesy();
		},
		[CVData.hookObjs.yAxisObj.data.netLineArr, CVData.hookObjs.yAxisObj.initArgs.netLineColor]
	);

	return (
		<>
			{/* 创建轴网格线 */}
			<Container x={CVData.hookObjs.xAxisObj.data.x}>
				<>{netLinesx}</>
			</Container>
			{netLinesy}
		</>
	);
};

//使用memo不让其因为上级节点的更新而频繁更新
export default memo(NetLines);
