import { findRoundTimeCountFromArrayDataItem, jsonObjectType } from "../interface/itemsInterFace";
import { ItimeFormat, TtimeType } from "../interface/timeDefineInterFace";
export declare const getshifttime: (hourShift?: number | "local") => number;
/**
 *1分钟
 */
export declare const ONEMIN: ItimeFormat;
/**
 *2分钟
 */
export declare const TWO: ItimeFormat;
/**
 *3分钟
 */
export declare const THREE: ItimeFormat;
/**
 *5分钟
 */
export declare const FMIN: ItimeFormat;
/**
 *10分钟
 */
export declare const TENMIN: ItimeFormat;
/**
 *15分钟
 */
export declare const FIFMIN: ItimeFormat;
/**
 *30分钟
 */
export declare const HALFHOUR: ItimeFormat;
/**
 *x小时
 */
export declare const HOUR: ItimeFormat;
/**
 *天
 */
export declare const DAY: ItimeFormat;
/**
 *周
 */
export declare const WEEK: ItimeFormat;
/**
 *月
 */
export declare const MONTH: ItimeFormat;
/**
 *年
 */
export declare const YEAR: ItimeFormat;
/**
 * 时间类型对应表
 */
export declare const timeTypeMap: {
    [propName: string]: ItimeFormat;
};
/**
 *通过时间对象查找某个数组里的时间为特定时间对象的整数的个数
 */
export declare const findRoundTimeCountFromArray: (array: jsonObjectType[] | number[], timeShift: number | "local", currentType: TtimeType, key?: string) => findRoundTimeCountFromArrayDataItem[] | null;
//# sourceMappingURL=timeFormatDefine.d.ts.map