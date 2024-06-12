import { Isize, pointCoord } from "./itemsInterFace";

/**
 * pixi的矩形绘制接口
 */
export interface IPixiShapeRectangle {
	/**
	 * 颜色
	 */
	color: number | string;
	/**
	 * 尺寸
	 */
	size: Isize;
	/**
	 * 坐标
	 */
	position: pointCoord;
	/**
	 * 对齐x坐标的模式
	 */
	alignX?: "left" | "center" | "right";
	/**
	 * 对齐y坐标的模式
	 */
	alignY?: "top" | "center" | "bottom";
	/**
	 * 透明度
	 */
	opacity?: number;
}

/**
 * pixi的虚线绘制接口
 */
export interface IPixiShapeDashedLine {
	color: number;
	size: number;
	positionStart: pointCoord;
	positionStop: pointCoord;
	dashLength: number;
	spaceLength: number;
}
