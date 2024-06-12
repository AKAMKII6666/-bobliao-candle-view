/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, { useEffect, useState } from "react";
import styles from "../assets/styles/loaddingLay.module.scss";
import { useCandleViewContext } from "../context/candleViewContext";
const Loading = ({ color = "black" }, _ref) => {
    //===============useHooks=================
    const CVData = useCandleViewContext();
    //===============state====================
    const [isMounted, setIsMounted] = useState(false);
    //===============static===================
    //===============ref======================
    //===============function=================
    const loadData = async function () { };
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
    if (CVData.initArgs.data?.dynamicData?.showLoading && CVData.hookObjs.candleObj.data.isFetchingData) {
        return (<>
				<div className={styles.container + " " + styles[color]}></div>
			</>);
    }
    else if (!CVData.hookObjs.candleObj.data.isFinishedInit) {
        return (<>
				<div className={styles.container + " " + styles[color]}></div>
			</>);
    }
    {
        return <></>;
    }
};
export default Loading;
//# sourceMappingURL=loadingLay.jsx.map