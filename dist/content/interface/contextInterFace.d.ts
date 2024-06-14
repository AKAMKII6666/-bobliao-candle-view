import { IuseCandleView } from "./configInterFaces";
import { IAxisobj, IuseCandleHook, IyAxisobj } from "./hooksInterFace";
import { IcandleUpdateItem, Isize } from "./itemsInterFace";
import { TtimeType } from "./timeDefineInterFace";
/**
 * context导出的内容
 */
export interface IcandleViewContext {
    /**
     *初始化时的参数
     */
    initArgs: IuseCandleView;
    data: {
        /**
         *画布宽度
         */
        canvasWidth: number;
        /**
         *画布高度
         */
        canvasHeight: number;
        /**
         *画布颜色
         */
        canvasBackgroundColor: string;
        /**
         *数据显示区域（去除x轴和y轴的占有区域）
         */
        dataArea: Isize;
    };
    funcs: {
        /**
         *设置画布宽度
         */
        setcanvasWidth: (arg: number) => void;
        /**
         *设置画布高度
         */
        setcanvasHeight: (arg: number) => void;
        /**
         *设置画布颜色
         */
        setcanvasBackgroundColor: (arg: string) => void;
        setInitArgs: (arg: IuseCandleView) => void;
        /**
         * 向图表更新当前实时的价格，价格的变化将反应在第一个candle上
         * @param time 更新的时间，用当前时间就好了，不用取整
         * @param currentPrice 当前更新的价格
         * @param volume 当前交易量
         * @returns 当前图表最末尾一个数据对象
         */
        appendData: (candleItem: IcandleUpdateItem) => void;
        /**
         * 更改时间格式，传入 TtimeType 类型的变量
         * 需要查看当前的时间格式可以访问
         * CandleViewV2.initArgs.timeFormat
         */
        setTimeFormat: (value: TtimeType) => void;
    };
    hookObjs: {
        xAxisObj: IAxisobj;
        yAxisObj: IyAxisobj;
        candleObj: IuseCandleHook;
    };
}
/**
 * useCandleView的类型定义
 */
export declare type TcandleViewContext = (args: IuseCandleView) => IcandleViewContext;
