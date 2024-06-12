import { ItimeFormat } from "./timeDefineInterFace";

/**
 * tickItem接口
 */
export interface tickItem {
	/**
	 * 下标
	 */
	index?: number;
	/**
	 * tick颜色
	 */
	color: string;
	/**
	 * tick长度
	 */
	length: number;
	/**
	 * 粗细
	 */
	size: number;
	/**
	 * 位置
	 * （上中定位）
	 */
	cPosition: pointCoord;
	/**
	 * 值
	 */
	value: number | string;
	/**
	 * 显示值
	 */
	displayValue?: number | string;
	/**
	 * 占用数据范围
	 */
	dataSpace?: numberScope;
	/**
	 * 占用空间(像素)范围
	 */
	pixSpace?: numberScope;
	/**
	 * 占用数据宽度
	 */
	dataWidth?: number;
	/**
	 * 占用空间(像素)宽度
	 */
	pixWidth?: number;
}

/**
 * 网格线Item接口
 */
export interface netLineItem {
	/**
	 * 网格线颜色
	 */
	color: string;
	/**
	 * 网格线长度
	 */
	length: number;
	/**
	 * 网格线粗细
	 */
	size: number;
	/**
	 * 网格线位置
	 * （上中定位）
	 */
	cPosition: pointCoord;
	/**
	 * 值
	 */
	value: number | string;
}

/**
 * 数字范围
 */
export interface numberScope {
	start: number;
	end: number;
}

/**
 * string数字范围
 */
export interface numberScopeString {
	start: string;
	end: string;
}

/**
 * 尺寸
 */
export interface Isize {
	width: number;
	height: number;
}

/**
 * tooltip接口
 */
export interface IToolTipItem {
	/**
	 * 位置
	 */
	position: pointCoord;
	/**
	 * 长度
	 */
	length: number;
	/**
	 * 值
	 */
	value: number | string;
	/**
	 * 值
	 */
	displayValue?: number | string;
	/**
	 * 停靠tick
	 */
	relatedTickItem: tickItem | null;
	/**
	 *粗细
	 */
	size: number;
}

/**
 * candleItem
 */
export interface IcandleItem {
	/**
	 * 开盘价格
	 */
	open: number | string;
	/**
	 * 关盘价格
	 */
	close: number | string;
	/**
	 * 高点
	 */
	high: number | string;
	/**
	 * 低点
	 */
	low: number | string;
	/**
	 * 交易量
	 */
	volume: number | string;
	/**
	 * 对应时间
	 */
	time: number | string;
}

/**
 * 用于数据更新的数据对象
 */
export interface IcandleUpdateItem {
	/**
	 * 是否为合并模式
	 * 开启快速合并模式后（isMergeMode：true），只需要在addData方法里传入
	 * close volume time 就好了
	 * 否则就要将所有参数全部传入
	 */
	isMergeMode?: boolean;
	/**
	 * 开盘价格
	 */
	open?: number | string;
	/**
	 * 关盘价格
	 */
	close: number | string;
	/**
	 * 高点
	 */
	high?: number | string;
	/**
	 * 低点
	 */
	low?: number | string;
	/**
	 * 交易量
	 */
	volume: number | string;
	/**
	 * 对应时间
	 */
	time: number | string;
}

/**
 * candledata
 */
export interface IcandleData {
	/**
	 * 开盘价格
	 */
	open: number | string;
	/**
	 * 关盘价格
	 */
	close: number | string;
	/**
	 * 高点
	 */
	high: number | string;
	/**
	 * 低点
	 */
	low: number | string;
	/**
	 * 交易量
	 */
	volume: number | string;
	/**
	 * 对应时间
	 */
	time: number | string;
	/**
	 * 对应的tick
	 */
	currentTick?: tickItem;
	/**
	 * candle绘制的位置
	 */
	candlePixPosition?: pointCoord;
	/**
	 * candle绘制的长度
	 */
	candleLength?: number;
	/**
	 * candle绘制的宽度
	 */
	candleWidth?: number;
	/**
	 * wick绘制的位置
	 */
	wickPixPosition?: pointCoord;
	/**
	 * wick绘制的长度
	 */
	wickLength?: number;
	/**
	 * wick绘制的宽度
	 */
	wickWidth?: number;
	/**
	 * candle颜色
	 */
	candleColor?: string;
	/**
	 * wick颜色
	 */
	wickColor?: string;
	/* 
		是否跳过渲染
	*/
	isEscaped?: boolean;
	/* 
		更新tag
	*/
	updateTag?: string;
	/**
	 * candle的状态
	 */
	candleStateus?: "rise" | "fall";
	/**
	 * wick的状态
	 */
	wickStateus?: "rise" | "fall";
}

/**
 * 万能的json类型
 */
export type jsonObjectType = {
	[propName: string]: jsonObjectType | number | string | void | null;
};

/**
 * 用于描述二维坐标的类型
 */
export interface pointCoord {
	x: number;
	y: number;
}

export interface findRoundTimeCountFromArrayDataItem {
	count: number;
	startIndex: number;
	step: number;
	type: ItimeFormat;
}
