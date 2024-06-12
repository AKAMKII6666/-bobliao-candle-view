/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, { useEffect, useState, useMemo } from "react";
import useJquery from "@bobliao/use-jquery-hook";
import styles from "../index.module.scss";
import { useCandleViewContext } from "../context/candleViewContext";
import { thousandsSplit } from "../utils/consts";
import BigNumber from "bignumber.js";
import { LANGUAGES } from "../utils/languages";
const Info = ({}, _ref) => {
    //===============useHooks=================
    const CVData = useCandleViewContext();
    const $ = useJquery();
    //===============state====================
    const [isMounted, setIsMounted] = useState(false);
    //===============static===================
    //===============ref======================
    //===============function=================
    const makeInfo = function () {
        if (!CVData.initArgs.enableinfo) {
            return null;
        }
        if (CVData.hookObjs.xAxisObj.data.tooltipState !== null &&
            CVData.hookObjs.xAxisObj.data.tooltipIsShow &&
            typeof CVData.hookObjs.candleObj.data.cursorCandleItem !== "undefined" &&
            CVData.hookObjs.candleObj.data.cursorCandleItem !== null) {
            let _tooltipState = CVData.hookObjs.xAxisObj.data.tooltipState;
            let item = CVData.hookObjs.candleObj.data.cursorCandleItem;
            return (<>
					<div className={styles.info}>
						<div className={styles.timetype}>
							<label>
								{LANGUAGES[CVData.initArgs.language].timeFormat[CVData.hookObjs.xAxisObj.data.currentTimeType?.lang]}
							</label>
						</div>
						<div>
							<span>Date:</span>
							<label>
								{CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.formatter(_tooltipState.relatedTickItem)}
							</label>

							<label>GMT +{CVData.initArgs.timeZone?.displayTimeZone}</label>
						</div>
						<div>
							<span>Open:</span>
							<label>{thousandsSplit(Number(new BigNumber(item.open).toFixed(3)))}</label>
						</div>
						<div>
							<span>Close:</span>
							<label>{thousandsSplit(Number(new BigNumber(item.close).toFixed(3)))}</label>
						</div>
						<div>
							<span>High:</span>
							<label>{thousandsSplit(Number(new BigNumber(item.high).toFixed(3)))}</label>
						</div>
						<div>
							<span>Low:</span>
							<label>{thousandsSplit(Number(new BigNumber(item.low).toFixed(3)))}</label>
						</div>
						<div>
							<span>Volume:</span>
							<label>{thousandsSplit(Number(new BigNumber(item.volume).toFixed(3)))}</label>
						</div>
					</div>
				</>);
        }
        else if (CVData.hookObjs.candleObj.data.latestCandleItem !== null) {
            let currentItem = CVData.hookObjs.candleObj.data.latestCandleItem;
            return (<>
					<div className={styles.info}>
						<div className={styles.timetype}>
							<label>
								{LANGUAGES[CVData.initArgs.language].timeFormat[CVData.hookObjs.xAxisObj.data.currentTimeType?.lang]}
							</label>
						</div>
						<div>
							<span>Date:</span>
							<label>
								{CVData.hookObjs.xAxisObj.initArgs.tooltip?.label?.formatter({
                    value: currentItem.time,
                })}
							</label>
							<label>GMT +{CVData.initArgs.timeZone?.displayTimeZone}</label>
						</div>
						<div>
							<span>Open:</span>
							<label>{thousandsSplit(Number(new BigNumber(currentItem.open).toFixed(3)))}</label>
						</div>
						<div>
							<span>Current:</span>
							<label>{thousandsSplit(Number(new BigNumber(currentItem.close).toFixed(3)))}</label>
						</div>
						<div>
							<span>High:</span>
							<label>{thousandsSplit(Number(new BigNumber(currentItem.high).toFixed(3)))}</label>
						</div>
						<div>
							<span>Low:</span>
							<label>{thousandsSplit(Number(new BigNumber(currentItem.low).toFixed(3)))}</label>
						</div>
						<div>
							<span>Volume:</span>
							<label>{thousandsSplit(Number(new BigNumber(currentItem.volume).toFixed(3)))}</label>
						</div>
					</div>
				</>);
        }
        return null;
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
    let title = useMemo(function () {
        if (CVData.initArgs.enableTitle) {
            return <div className={styles.title}>{CVData.initArgs.title}</div>;
        }
        return null;
    }, [CVData.initArgs.title]);
    let infoLayer = useMemo(function () {
        return makeInfo();
    }, [
        CVData.hookObjs.candleObj.data.latestCandleItem,
        CVData.hookObjs.xAxisObj.data.tooltipIsShow,
        CVData.hookObjs.candleObj.data.cursorCandleItem,
    ]);
    return (<>
			<div className={styles.infoDisplayLayer}>
				<>
					{title}
					{infoLayer}
				</>
			</div>
		</>);
};
export default Info;
//# sourceMappingURL=info.jsx.map