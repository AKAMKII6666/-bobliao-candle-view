/**
 * 廖力编写 2024年5月25日 00:36:41
 */
import { createContext, useState, useContext, useEffect } from "react";
import usexAxis from "../hooks/xAxisHook";
import useyAxis from "../hooks/yAxisHook";
import useCandleHook from "../hooks/candleHook";
import lodash from "lodash";
import { DEFAULTVALUES } from "../utils/defaultValues";
import { getSpaceSize } from "../utils/consts";
/**
 * 创建一个需要全局使用的钱包context
 **/
const candleViewContext = createContext({});
/**
 * 钱包的公用钩子
 */
const useCandleView = function (args) {
    /**
     *默认参数状态
     */
    const [initArgs, setinitArgs] = useState(lodash.merge(DEFAULTVALUES, args));
    /**
     * ============================hooks===========================
     */
    /**
     *x轴钩子对象
     */
    const xAxisObj = usexAxis(initArgs.xAxis, undefined, initArgs);
    /**
     *y轴钩子对象
     */
    const yAxisObj = useyAxis(initArgs.yAxis, xAxisObj);
    /**
     * candle 对象
     * 数据展示对象
     */
    const candleObj = useCandleHook(initArgs.data, xAxisObj, yAxisObj, initArgs);
    /**
     * ============================state===========================
     */
    const [isMounted, setIsMounted] = useState(false);
    /**
     *画布宽度
     */
    const [canvasWidth, setcanvasWidth] = useState(0);
    /**
     *画布高度
     */
    const [canvasHeight, setcanvasHeight] = useState(0);
    /**
     *画布颜色
     */
    const [canvasBackgroundColor, setcanvasBackgroundColor] = useState("#fff");
    /**
     *数据显示区域（去除x轴和y轴的占有区域）
     */
    const [dataArea, setdataArea] = useState({ width: 0, height: 0 });
    /**
     * ==========================函数==============================
     */
    /**
     * 更改时间格式，传入 TtimeType 类型的变量
     * 需要查看当前的时间格式可以访问
     * CandleViewV2.initArgs.timeFormat
     */
    const setTimeFormat = function (value) {
        let _initArgs = { ...initArgs };
        _initArgs.timeFormat = value;
        setinitArgs(_initArgs);
    };
    /**
     * ==================================Effects===============================
     */
    useEffect(function () {
        if (isMounted === false) {
            setIsMounted(true);
        }
        return function () {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(function () {
        if (xAxisObj.data.isFinishedInit && yAxisObj.data.isFinishedInit) {
            xAxisObj.funcs.setinitArgs(initArgs.xAxis);
            yAxisObj.funcs.setinitArgs(initArgs.yAxis);
            candleObj.funcs.setinitArgs(initArgs.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initArgs]);
    useEffect(function () {
        if (canvasHeight !== 0 && canvasWidth !== 0 && !xAxisObj.data.isFinishedInit) {
            //初始化x轴
            xAxisObj.funcs.initAxisSates(initArgs.timeFormat, canvasWidth, canvasHeight, initArgs.yAxis?.labelSpace);
            //初始化y轴
            yAxisObj.funcs.updateAxisSates(canvasWidth, canvasHeight, {
                start: 500,
                end: 600,
            });
        }
        else {
            //更新x轴
            xAxisObj.funcs.updateAxisSates(canvasWidth, canvasHeight, initArgs.yAxis?.labelSpace);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasWidth, canvasHeight]);
    useEffect(function () {
        if (xAxisObj.data.isFinishedInit) {
            //重新初始化x轴
            xAxisObj.funcs.initAxisSates(initArgs.timeFormat, canvasWidth, canvasHeight, initArgs.yAxis?.labelSpace);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initArgs.timeFormat, initArgs.yAxis?.labelSpace]);
    useEffect(function () {
        if (xAxisObj.data.isFinishedInit) {
            //计算数据可用区域
            setdataArea({
                width: canvasWidth - getSpaceSize(initArgs.yAxis.labelSpace, canvasWidth),
                height: canvasHeight - getSpaceSize(initArgs.xAxis.labelSpace, canvasHeight),
            });
        }
    }, [xAxisObj.data.isFinishedInit, canvasWidth, canvasHeight]);
    return {
        /**
         *初始化时的参数
         */
        initArgs,
        /**
         *x导出的数据
         */
        data: {
            /**
             *画布宽度
             */
            canvasWidth,
            /**
             *画布高度
             */
            canvasHeight,
            /**
             *画布颜色
             */
            canvasBackgroundColor,
            /**
             *数据显示区域（去除x轴和y轴的占有区域）
             */
            dataArea,
        },
        /**
         *x导出的方法
         */
        funcs: {
            /**
             *设置画布宽度
             */
            setcanvasWidth,
            /**
             *设置画布高度
             */
            setcanvasHeight,
            /**
             *设置画布颜色
             */
            setcanvasBackgroundColor,
            setInitArgs: setinitArgs,
            /**
             * 向图表更新当前实时的价格，价格的变化将反应在第一个candle上 (右边第一个 )
             * @param time 更新的时间，用当前时间就好了，不用取整
             * @param currentPrice 当前更新的价格
             * @param volume 当前更新的交易量
             * @returns 当前图表最末尾一个数据对象
             */
            appendData: candleObj.funcs.updateLatestCandleData,
            setTimeFormat,
        },
        hookObjs: {
            /**
             *x轴钩子对象
             */
            xAxisObj,
            /**
             *y轴钩子对象
             */
            yAxisObj,
            /**
             *candleobj
             */
            candleObj,
        },
    };
};
let useCandleViewContext = function () {
    var r = useContext(candleViewContext);
    return r;
};
export { 
//交易图的context
candleViewContext as default, 
//创建自定义交易图钩子
useCandleView, 
//在子组件中,获取交易图的context对象
useCandleViewContext, };
//# sourceMappingURL=candleViewContext.js.map