/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, { useEffect, useRef, useState, memo, useMemo, } from "react";
import { Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import { DashedLine, Rectangle } from "../utils/basicShaps";
import { useCandleViewPixiContext } from "..";
import DataToolTip from "./dataToolTip";
const YAxis = ({}, _ref) => {
    //===============useHooks=================
    const CVData = useCandleViewPixiContext();
    //===============state====================
    const [isMounted, setIsMounted] = useState(false);
    //===============static===================
    const labelPadding = 10;
    //===============ref======================
    const tooltipTextRef = useRef(null);
    //===============function=================
    /* 创建tick */
    const makeTicks = function () {
        let result = [];
        let index = 0;
        for (var item of CVData.hookObjs.yAxisObj.data.displayTickArr) {
            result.push(<Rectangle key={index + "_a"} color={PIXI.utils.string2hex(item.color)} size={{
                    width: item.length,
                    height: item.size,
                }} position={item.cPosition} alignX="left" alignY="center"></Rectangle>);
            index++;
        }
        return result;
    };
    /* 创建label */
    const makeLabels = function () {
        let result = [];
        let index = 0;
        for (var item of CVData.hookObjs.yAxisObj.data.displayTickArr) {
            result.push(<Text key={index + "_b"} anchor={{ x: 0, y: 0.6 }} x={item.cPosition.x + item.length * 2} y={item.cPosition.y} text={CVData.hookObjs.yAxisObj.initArgs.formatter(item)} resolution={2} style={new PIXI.TextStyle({
                    fontSize: CVData.hookObjs.yAxisObj.initArgs.fontSize,
                    fill: PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tickColor),
                })}/>);
            index++;
        }
        return result;
    };
    /* 创建tooltip */
    const makeTooltip = function () {
        if (!CVData.hookObjs.yAxisObj.initArgs.tooltip.enabled ||
            CVData.hookObjs.yAxisObj.data.tooltipState === null ||
            !CVData.hookObjs.yAxisObj.data.tooltipIsShow) {
            return null;
        }
        return (<>
				<DashedLine color={PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tooltip.color)} size={CVData.hookObjs.yAxisObj.data.tooltipState.size} positionStart={CVData.hookObjs.yAxisObj.data.tooltipState.position} positionStop={{
                x: CVData.hookObjs.yAxisObj.data.tooltipState.length,
                y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y,
            }} dashLength={CVData.hookObjs.yAxisObj.initArgs.tooltip.dashLength} spaceLength={CVData.hookObjs.yAxisObj.initArgs.tooltip.spaceLength}></DashedLine>

				<Rectangle color={PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tooltip?.label?.backGroundColor)} size={{
                width: CVData.hookObjs.yAxisObj.data.labelSpace,
                height: tooltipTextRef.current?.height + labelPadding,
            }} position={{
                x: CVData.hookObjs.yAxisObj.data.linePosition.x,
                y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y,
            }} alignX="left" alignY="center"></Rectangle>
				<Rectangle color={PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tooltip?.label?.color)} size={{
                width: CVData.hookObjs.yAxisObj.data.tickLength,
                height: CVData.hookObjs.yAxisObj.initArgs.tickSize,
            }} position={{
                x: CVData.hookObjs.yAxisObj.data.linePosition.x,
                y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y,
            }} alignX="left" alignY="center"></Rectangle>
				<Text ref={tooltipTextRef} anchor={{ x: 0, y: 0.6 }} x={CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2} y={CVData.hookObjs.yAxisObj.data.tooltipState.position.y} text={CVData.hookObjs.yAxisObj.initArgs.tooltip?.label?.formatter(CVData.hookObjs.yAxisObj.data.tooltipState)} resolution={2} style={new PIXI.TextStyle({
                fontSize: CVData.hookObjs.yAxisObj.initArgs.tooltip?.label?.fontsize,
                fill: PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tooltip?.label?.color),
            })}/>
			</>);
    };
    //===============effects==================
    useEffect(function () {
        if (isMounted === false) {
            setIsMounted(true);
        }
    }, [isMounted]);
    useEffect(function () {
        return function () {
            setIsMounted(false);
        };
    }, []);
    /* y轴背景 */
    let yBackground = useMemo(function () {
        return (<>
					{/* y轴背景 */}
					<Rectangle color={PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.backgroundColor)} size={{
                width: CVData.hookObjs.yAxisObj.data.labelSpace,
                height: CVData.hookObjs.yAxisObj.data.viewSize.height,
            }} position={CVData.hookObjs.yAxisObj.data.linePosition} alignX="left" alignY="top"></Rectangle>
				</>);
    }, [
        CVData.hookObjs.yAxisObj.data.labelSpace,
        CVData.hookObjs.yAxisObj.data.viewSize,
        CVData.hookObjs.yAxisObj.data.linePosition,
        CVData.hookObjs.yAxisObj.data.lineColor,
        CVData.hookObjs.yAxisObj.initArgs.backgroundColor,
    ]);
    {
        /*  y轴 */
    }
    let yAxis = useMemo(function () {
        return (<>
					{/*  y轴 */}
					<Rectangle color={CVData.hookObjs.yAxisObj.data.lineColor} size={{
                width: CVData.hookObjs.yAxisObj.data.lineSize.size,
                height: CVData.hookObjs.yAxisObj.data.viewSize.height,
            }} position={CVData.hookObjs.yAxisObj.data.linePosition} alignX="left" alignY="top"></Rectangle>
				</>);
    }, [
        CVData.hookObjs.yAxisObj.data.viewSize,
        CVData.hookObjs.yAxisObj.data.lineSize,
        CVData.hookObjs.yAxisObj.data.linePosition,
        CVData.hookObjs.yAxisObj.data.lineColor,
    ]);
    /* 创建y轴标 */
    let yTicks = useMemo(function () {
        return makeTicks();
    }, [CVData.hookObjs.yAxisObj.data.displayTickArr]);
    /* 创建label */
    let yLabels = useMemo(function () {
        return makeLabels();
    }, [CVData.hookObjs.yAxisObj.data.displayTickArr, CVData.hookObjs.yAxisObj.initArgs]);
    /* 创建ToolTip */
    let tooltip = useMemo(function () {
        return makeTooltip();
    }, [
        CVData.hookObjs.yAxisObj.data.tooltipState,
        CVData.hookObjs.yAxisObj.data.tooltipIsShow,
        CVData.hookObjs.yAxisObj.initArgs.tooltip,
    ]);
    return (<>
			{/* y轴背景 */}
			{yBackground}
			{/*  y轴 */}
			{yAxis}
			{/* 创建y轴标 */}
			{yTicks}
			{/* 创建label */}
			{yLabels}
			<DataToolTip></DataToolTip>
			{/* 创建ToolTip */}
			{tooltip}
		</>);
};
//使用memo不让其因为上级节点的更新而频繁更新
export default memo(YAxis);
//# sourceMappingURL=yAxis.jsx.map