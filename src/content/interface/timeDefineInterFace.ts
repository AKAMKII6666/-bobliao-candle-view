import { Tlanguage } from "./configInterFaces";
import { numberScope } from "./itemsInterFace";

/**
 * 时间格式
 */
export interface ItimeFormat {
	/**
	 * 格式名称
	 */
	name: string;
	/**
	 * 对应多语言字段
	 */
	lang: string;
	/**
	 * 时间间隔（毫秒）
	 */
	timeGap: number;
	/**
	 * 时间取整函数
	 * 传入一个时间戳，获取当前时间的整数
	 * 例如现在格式为1h  传入时间为2024-06-01 00:21:33 将返回:2024-06-01 00:21:00
	 */
	roundingFunction: (timeStamp: number, hourShift: number | "local") => number;
	/**
	 * 往前一个时间单位
	 */
	forwardSingleUnit: (timeStamp: number, hourShift: number | "local") => number;
	/**
	 * 往后一个时间单位
	 */
	backwardSingleUnit: (timeStamp: number, hourShift: number | "local") => number;
	/**
	 * 往前一n个时间单位
	 */
	forwardTimeUnit: (timeStamp: number, times: number, hourShift: number | "local") => number;
	/**
	 * 往后一n个时间单位
	 */
	backwardTimeUnit: (timeStamp: number, times: number, hourShift: number | "local") => number;
	/**
	 * 获取初始化时间范围
	 */
	getInitTimeScope: (initTime: string) => numberScope;
	/**
	 * 格式器
	 */
	formatter: (value: number, lan: Tlanguage, hourShift?: number | "local") => string;
}

/**
 * 支持的时间格式
 *  */

export type TtimeType = "1min" | "2min" | "3min" | "5min" | "10min" | "15min" | "30min" | "1h" | "1d" | "1w" | "1m" | "1y";
