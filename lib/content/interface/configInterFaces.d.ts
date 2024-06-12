/// <reference types="react" />
import { IToolTipItem, IcandleItem, tickItem } from "./itemsInterFace";
import { TtimeType } from "./timeDefineInterFace";
export type Tlanguage = "zh" | "en";
/**
 * useCandleView的参数
 */
export interface IuseCandleView {
    /**
     * 标题
     */
    title?: string | React.ReactElement | React.ReactElement[];
    enableTitle?: boolean;
    enableinfo?: boolean;
    /**
     * 时间类型
     */
    timeFormat?: TtimeType;
    /**
     * 背景颜色
     */
    backgroundColor?: string;
    /**
     * 宽度
     */
    width?: number | string;
    /**
     * 高度
     */
    height?: number | string;
    /**
     * resize时的防抖时间（单位毫秒）
     * 填写为0就不防抖
     */
    resizeDebounceTime?: number;
    /**
     * y轴设置
     */
    yAxis?: Iaxis;
    /**
     * x轴设置
     */
    xAxis?: Iaxis;
    /**
     * 数据设置
     */
    data?: IdataConfig;
    /**
     * 语言设置
     *  */
    language?: Tlanguage;
    /**
     * 时区设置
     *  */
    timeZone?: Itimezone;
}
/**
 * 时区配置的接口
 */
export interface Itimezone {
    /**
     * 数据源中时间字段的所在时区
     * 如果数据源的时间是根据GMT +0800来生成的
     * 这里就设置8
     * 如果是根据GMT +0000来生成的，
     * 这里就设置0
     */
    dataSourceTimeZone: number | "local";
    /**
     * 发起数据异步查询时,查询参数中的“开始”和“结束”时间应该所在的时区
     */
    fetchConditionTimeZone: number | "local";
    /**
     * 时间在组件中进行显示时，使用的时区
     */
    displayTimeZone: number | "local";
}
/**
 * 轴的接口
 */
export interface Iaxis {
    /**
     * label空间
     * x轴就是指底部的空间
     * y轴就是指侧边的空间
     */
    labelSpace?: number | string;
    /**
     * 轴label格式器
     */
    formatter?: (axisItem: tickItem) => string;
    /**
     * 轴label颜色
     */
    fontColor?: string;
    /**
     * 轴label大小
     */
    fontSize?: number | string;
    /**
     * 轴网格线颜色
     */
    netLineColor?: string;
    /**
     * 轴线颜色
     */
    lineColor?: string;
    /**
     * 轴标颜色
     */
    tickColor?: string;
    /**
     * 轴标长度
     */
    tickLength?: string | number;
    /**
     * 轴网格线最大数量
     */
    netLineMaxCount?: number;
    /**
     * 轴网格线最小数量
     */
    netLineMinCount?: number;
    /**
     * 轴网格线大小
     */
    netLineSize?: number;
    /**
     * 轴线大小
     */
    lineSize?: number;
    /**
     * 轴标大小
     */
    tickSize?: number;
    /**
     * tooltip接口
     */
    tooltip?: ITooltipConfig;
    /**
     * 背景颜色
     */
    backgroundColor?: string;
    /**
     * 初始化时间点
     * 填写这个值将设置图表默认定位的时间
     * 默认情况下时间将定位到【现在】
     * 但是可以通过这个设置将默认时间定位到别的地方
     * 设置"now"就是指现在，默认情况下可以不用特别设置它
     * 设置其他时间格式: yyyy-MM-dd HH:mm:ss 时分秒请一定要写全
     */
    initTimePoint?: string;
    /**
     *边界
     */
    displayPadding?: number;
}
/**
 * tooltip 接口
 */
export interface ITooltipConfig {
    /**
     * 是否开启
     */
    enabled?: boolean;
    /**
     * 颜色
     */
    color?: string;
    /**
     * 线条粗细
     */
    lineSize?: string | number;
    /**
     * 虚线 实部长度
     */
    dashLength?: number;
    /**
     * 虚线 空白长度
     */
    spaceLength?: number;
    /**
     * label选项
     */
    label?: ILabelConfig;
}
/**
 * label 接口
 */
export interface ILabelConfig {
    /**
     * 字体大小
     */
    fontsize?: number;
    /**
     * 颜色
     */
    color?: string;
    /**
     * 背景颜色
     */
    backGroundColor?: string;
    /**
     * 透明度
     */
    backGroundAlpha?: number;
    /**
     * 格式化处理器
     */
    formatter?: (arg: tickItem | IToolTipItem, language?: Tlanguage) => string | number;
}
/**
 * 动态加载数据设置
 */
export interface IdynamicData {
    /**
     * 是否开启动态数据加载
     * 如果开启了的话
     * config.data.staticData 里的数据将不进行展示
     */
    enabled?: boolean;
    /**
     * 请求数据回调函数
     */
    dataFetchCallback?: (timeType: TtimeType, startTime: number, endTime: number) => Promise<IcandleItem[]>;
    /**
     * 每次请求数据条数
     * 这里决定了在发起请求时的事件跨度，设置越大，时间跨度越大
     * 比如100条
     * 那么每次在拖拽或缩放图表时遇到需要请求新数据的情况下
     * 每次发出数据请求时，根据时间跨度设置生成准确的请求时间
     * 发出请求。
     */
    dataFetchCountPreTime?: number;
    /**
     * 是否在动态加载数据时显示loading
     */
    showLoading?: boolean;
    /**
     * 是否在动态加载数据时阻止用户操作
     */
    stopUserOperateWhenLoading?: boolean;
}
/**
 * 数据配置
 */
export interface IdataConfig {
    /**
     * 直接填写的静态数据
     */
    staticData?: IcandleItem[];
    /**
     * 动态数据配置
     */
    dynamicData?: IdynamicData;
    /**
     * 设置candle的显示属性
     */
    candleStyles?: {
        /**
         * 填写百分比，例如 80%
         * 这是相对于x轴数据空间算出来的宽度
         */
        candleWidth?: string;
        wickWidth?: string;
        /**
         * 涨的candle颜色
         */
        candleRiseColor?: string;
        /**
         * 跌的candle颜色
         */
        candleFallColor?: string;
        /**
         * 涨的芯颜色
         */
        wickRiseColor?: string;
        /**
         * 跌的芯颜色
         */
        wickFallColor?: string;
        /**
         * 当前价格tooltip
         */
        currentPriceTooltip?: ITooltipConfig;
        /**
         * 当前显示范围价格Tooltip
         */
        viewLastPriceTooltip?: ITooltipConfig;
        /**
         *交易量
         */
        volumChart?: {
            /**
             *是否显示交易量
             */
            enabled?: boolean;
            /**
             *下降的颜色
             */
            fallColor: string;
            /**
             *上升的颜色
             */
            riseColor: string;
            /**
             *交易量图表高度
             */
            volumeChartHeight?: number | string;
            /**
             *交易量图表透明度
             */
            alpha?: number;
            currentPriceTooltip: ITooltipConfig;
            viewLastPriceTooltip: ITooltipConfig;
        };
    };
}
//# sourceMappingURL=configInterFaces.d.ts.map