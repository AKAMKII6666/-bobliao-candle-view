import { Iaxis, IdataConfig, IuseCandleView } from "./configInterFaces";
import { IToolTipItem, IcandleData, IcandleItem, IcandleUpdateItem, Isize, netLineItem, numberScope, numberScopeString, pointCoord, tickItem } from "./itemsInterFace";
import { ItimeFormat, TtimeType } from "./timeDefineInterFace";
export interface IyAxisobj {
    /**
     *导出的数据
     */
    data: {
        isFinishedInit: boolean;
        tooltipState: IToolTipItem | null;
        tooltipIsShow: boolean;
        currentDataScope: numberScopeString;
        currentDataSpace: string;
        currentDataPositionOfStart: string;
        viewSize: Isize;
        linePosition: pointCoord;
        labelSpace: number;
        lineColor: string;
        netLineArr: Array<netLineItem>;
        netLineMaxCount: number;
        netLineMinCount: number;
        displayTickArr: tickItem[];
        tickLength: number;
        lineSize: {
            /**
             * line的长度
             */
            height: number;
            /**
             * line的粗细
             */
            size: number;
        };
        yAxisUpdateTimeStamp: number;
    };
    /**
     *导出的方法
     */
    funcs: {
        updateAxisSates: (viewWidth: number, viewHeight: number, dataScope: numberScope) => void;
        tooltipMove: (position: pointCoord, isShowTooltip: boolean) => void;
        expandDataSpanceEdge: <T extends numberScopeString>(input: T) => {
            dataScope: T;
            currentDataSpace: string;
        };
        expandDataSpanceEdgePIX: <T extends numberScope>(input: T) => {
            dataScope: T;
            currentDataSpace: string;
        };
        setinitArgs: (arg: Iaxis) => void;
    };
    /**
     *初始化时用到的参数
     */
    initArgs: Iaxis;
}
/**
 * 轴钩子返回的方法和数据
 */
export interface IAxisobj {
    /**
     *导出的数据
     */
    data: {
        /**
         * 当前时间类型
         */
        currentTimeType: ItimeFormat | null;
        /**
         * 初始时间范围
         */
        lastTimeScope: numberScope;
        /**
         * 当前时间范围
         */
        currentTimeScope: numberScope;
        /**
         * line的位置（上左定位）
         *内容区和label区的分割线的位置
         */
        linePosition: pointCoord;
        /**
         * line的尺寸
         */
        lineSize: {
            /**
             * line的长度
             */
            width: number;
            /**
             * line的粗细
             */
            size: number;
        };
        /**
         * line的颜色
         */
        lineColor: string;
        /**
         * 网格线的最大数量
         */
        netLineMaxCount: number;
        /**
         * 网格线组
         */
        netLineArr: Array<netLineItem>;
        /**
         * 轴网格线最小数量
         */
        netLineMinCount: number;
        /**
         * 真实tick组（实际的tick空间）
         */
        tickArr: Array<tickItem>;
        /**
         * 显示tick组（用于显示的tick）
         */
        displayTickArr: Array<tickItem>;
        /**
         * 显示tick组（用于显示的tick）
         */
        isFinishedInit: boolean;
        /**
         * 每次缩放的增减值
         */
        scaleStep: number;
        /**
         * tooltip
         */
        tooltipState: IToolTipItem | null;
        /**
         * tooltip是否显示
         */
        tooltipIsShow: boolean;
        labelSpace: number;
        /**
         * x轴每次拖拽缩放将触发这里的更新
         */
        xAxisUpdateTimeStamp: number;
        viewSize: Isize;
        /**
         * tick的共有数据宽度
         */
        displayTickCommonWidth: number;
        /**
         * tick的共有像素宽度
         */
        displayTickCommonpixWidth: number;
        moveAmount: number;
        x: number;
        xAxisUpdateMoveMentTimeStamp: number;
        xAxisUpdateScaleTimeStamp: number;
        mouseSpeedSec: number;
        moveDirection: "add" | "min";
    };
    /**
     *导出的方法
     */
    funcs: {
        /**
         * 设置初始时间范围
         */
        setlastTimeScope: (arg: numberScope) => void;
        /**
         * 设置当前时间范围
         */
        setcurrentTimeScope: (arg: {
            /**
             * 最左边的时间
             */
            start: number;
            /**
             * 最右边的时间
             */
            end: number;
        }) => void;
        /**
         * 设置line的位置（上左定位）
         *内容区和label区的分割线的位置
         */
        setlinePosition: (arg: pointCoord) => void;
        /**
         * 设置line的尺寸
         */
        setlineSize: (arg: {
            /**
             * line的长度
             */
            width: number;
            /**
             * line的粗细
             */
            size: number;
        }) => void;
        /**
         * 设置line的颜色
         */
        setlineColor: (arg: string) => void;
        /**
         * 设置网格线的最大数量
         */
        setnetLineMaxCount: (arg: number) => void;
        /**
         * 设置网格线组
         */
        setnetLineArr: (arg: Array<netLineItem>) => void;
        /**
         * 设置轴网格线最小数量
         */
        setnetLineMinCount: (arg: number) => void;
        /**
         * 设置真实tick组（实际的tick空间）
         */
        settickArr: (arg: Array<tickItem>) => void;
        /**
         * 设置显示tick组（用于显示的tick）
         */
        setdisplayTickArr: (arg: Array<tickItem>) => void;
        /**
         * 初始化轴
         *@param {TtimeType} timeType 时间类型
         *@param  {number} viewWidth 界面的全量宽度
         *@param  {number} viewHeight 界面的全量高度
         *@param {number | string} yAxisLabelSpace y轴的label空间
         *@returns {void}
         */
        initAxisSates: (timeType: TtimeType, viewWidth: number, viewHeight: number, yAxisLabelSpace: number | string) => void;
        /**
         * 更新轴
         *@param  {number} viewWidth 界面的全量宽度
         *@param  {number} viewHeight 界面的全量高度
         *@param {number | string} yAxisLabelSpace y轴的label空间
         *@returns {void}
         */
        updateAxisSates: (viewWidth: number, viewHeight: number, yAxisLabelSpace: number | string) => void;
        /**
         * 移动轴
         *@param  {number} start 开始的x位置
         *@param  {number} stop 结束的x位置
         */
        moveAxis: (start: number, stop: number, isSaveScope: boolean) => void;
        /**
         * 移动轴
         *@param  {number} start 开始的x位置
         *@param  {number} stop 结束的x位置
         */
        moveContainer: (start: number, stop: number, isSaveScope: boolean) => void;
        /**
         * 缩放轴
         */
        scale: (point: number, precent: number, movement: "zoomIn" | "zoomOut") => void;
        /**
         * tooltip移动
         */
        tooltipMove: (position: pointCoord, isShowTooltip: boolean) => void;
        setx: (v: number) => void;
        setcandleObj: (v: IuseCandleHook) => void;
        setinitArgs: (arg: Iaxis) => void;
        reGenXAxis: () => void;
    };
    /**
     *初始化时用到的参数
     */
    initArgs: Iaxis;
}
/**
 * x轴钩子定义
 */
export declare type TAxis = (args: Iaxis, otherAxis?: IAxisobj, totalConfig?: IuseCandleView) => IAxisobj;
/**
 * 数据处理钩子输入参数接口
 */
export interface IuseCandleHook {
    /**
     *导出的数据
     */
    data: {
        displayCandleData: IcandleData[];
        isDQuickUpdateing: boolean;
        latestCandleToolTip: IToolTipItem | null;
        latestdisplayLatestCandle: IToolTipItem | null;
        latestVolumeToolTip: IToolTipItem | null;
        latestdisplayLatestVolume: IToolTipItem | null;
        cursorCandleItem: IcandleItem | null;
        latestCandleItem: IcandleData | null;
        volumChartPixHeight: number;
        volumChartViewMax: number;
        yScale: number;
        miny: number;
        updateStamp: number;
        isFetchingData: boolean;
        isFinishedInit: boolean;
    };
    /**
     *导出的方法
     */
    funcs: {
        /**
         *  向图表更新当前实时的价格，价格的变化将反应在第一个candle上
         * @param candleItem {open:开盘价,close:收盘价,high:最高价,low:最低价,volume:交易量,time:时间}
         * @returns void
         */
        updateLatestCandleData: (candleItem: IcandleUpdateItem) => void;
        setinitArgs: (arg: IdataConfig) => void;
    };
    /**
     *初始化时用到的参数
     */
    initArgs: IdataConfig;
}
