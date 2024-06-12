import { IcandleData, jsonObjectType, numberScope, pointCoord, tickItem } from "../interface/itemsInterFace";
/**
 * 格式化时间
 */
export declare const formatDate: (date: Date, format: string) => string;
/**
 * 将本地时间时区换算成格林威治时间 GMT+0000
 * 例如输入时间为 GMT +0800
 * 它将会把时间换算成 GMT+0000  也就是减去八小时
 */
export declare const localTimeToGMT0000: (time: number | Date) => number;
export declare const GMT0000TolocalTime: (time: number | Date) => number;
/**
 * 将某个时间重置到GMT +0000 然后再变换到GMT +0n00
 */
export declare const anyTimeToGMT0000ToTarget: (time: number | Date, currentTimeZone: number | "local", targetTimeZone: number | "local") => number;
/**
 * 获得长度
 *@param  {number | string} arg 输入值
 *@param  {number} length 相对的长度
 *@returns {number}
 */
export declare const getSpaceSize: (arg: number | string, length: number) => number;
/**
 * 通过时间 计算点的坐标
 *@param  {number} value 值
 *@param  {number} length 数组长度
 *@param {number} pixWidth 像素长度
 */
export declare const getRangePosition: (value: number, range: numberScope, pixWidth: number) => number;
/**
 * 求tick的交集
 */
export declare const findIntersection: (tickArr: tickItem[], scope: numberScope) => tickItem[];
/**
 * 求candle的交集
 */
export declare const findIntersectionCandle: (candle: IcandleData[], scope: numberScope) => IcandleData[];
export declare const shiftNumber: (_number: string | number, _shiftLength: number) => string;
/**
 * 将数组快速转换为hash表
 */
export declare const arrayToHash: (arr: any[], keyProperty: string) => any;
/**
 * 获得某个数字的小数位数
 */
export declare const getDecimalOfLength: (num: number) => number;
/**
 * 获得某个数字的整数位数
 */
export declare const getIntOfLength: (num: number) => number;
/**
 * 把任意整数的末尾数字算成整数例如 12345678  算成 12345680
 * “四舍五入”到最近的十的倍数 (N的倍数)
 */
export declare const roundToNearestTenBigNumber: (num: string, intGetPar: number) => string;
/**
 * 查找点
 * @param inputArr 查找的数组
 * @param target 目标数字
 * @param key 目标字段
 * @param targetType 找 起点=== 目标  还是 终点=== 目标
 */
export declare function binarySearchByKeyStrictlyEqual(inputArr: jsonObjectType[] | number[], target: number, targetType: "forStart" | "forEnd", key?: string): number | null;
/**
 * 二分查找法求交集
 * @param inputArr 输入数组
 * @param scope 范围
 * @param key 目标字段
 * @returns 返回找到的数组范围
 */
export declare const findIntersectionByKey: (inputArr: jsonObjectType[], scope: numberScope, key: string) => jsonObjectType[];
/**
 * 获得正确的时间
 */
export declare const getRightDate: (dateTime: number | string) => number;
export declare const thousandsSplit: (num: number) => string;
export declare const getUnitNumber: (_num: number, _lan: string, _fix: number) => string;
export declare const translateNumberK: (_num: number, _fix: number) => string;
export declare const translateNumberF: (_num: number, _fix: number) => string;
export declare const translateNumberT: (_num: number, _fix: number) => string;
/**
 * 求等差数列的个数
 * @param length 数组的长度
 * @param step 每隔几个元素取一个元素
 * @returns 返回共可取多少元素
 */
export declare const countSelectedElements: (length: number, step: number) => number;
/**
 * 检查数组里的元素是否有重复
 */
export declare const hasDuplicates: (arr: any) => boolean;
export declare const getLength: (p1: pointCoord, p2: pointCoord) => number;
//# sourceMappingURL=consts.d.ts.map