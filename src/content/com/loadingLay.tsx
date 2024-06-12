/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, FC, ReactElement } from "react";
import styles from "../assets/styles/loaddingLay.module.scss";
import { useCandleViewContext } from "../context/candleViewContext";

/**
 * 传入参数
 */
export interface iprops {
	color?: "black" | "white";
}

const Loading: FC<iprops> = ({ color = "black" }, _ref): ReactElement => {
	//===============useHooks=================
	const CVData = useCandleViewContext();

	//===============state====================
	const [isMounted, setIsMounted] = useState<boolean>(false);

	//===============static===================

	//===============ref======================

	//===============function=================
	const loadData = async function (): Promise<void> {};

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

	if (CVData.initArgs.data?.dynamicData?.showLoading && CVData.hookObjs.candleObj.data.isFetchingData) {
		return (
			<>
				<div className={styles.container + " " + styles[color]}></div>
			</>
		);
	} else if (!CVData.hookObjs.candleObj.data.isFinishedInit) {
		return (
			<>
				<div className={styles.container + " " + styles[color]}></div>
			</>
		);
	}
	{
		return <></>;
	}
};
export default Loading;
