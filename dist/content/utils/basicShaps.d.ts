/// <reference types="react" />
import { Graphics } from "pixi.js";
import { IPixiKlineBatching, IPixiShapeDashedLine, IPixiShapeRectangle, IPixiVolumeBatching } from "../interface/basicShapesInterFace";
export declare const Rectangle: import("react").FC<IPixiShapeRectangle & {
    ref?: import("react").Ref<Graphics>;
}>;
/**
 * 用于对k线图进行批量绘制的形状
 */
export declare const KlineBatching: import("react").FC<IPixiKlineBatching & {
    ref?: import("react").Ref<Graphics>;
}>;
/**
 * 用于对Volume交易量进行批量绘制的形状
 */
export declare const VolumeBatching: import("react").FC<IPixiVolumeBatching & {
    ref?: import("react").Ref<Graphics>;
}>;
/**
 * 矩形pixi对象的初始值
 */
export declare const DEFAULTRECTANGLE: IPixiShapeRectangle;
export declare const DashedLine: import("react").FC<IPixiShapeDashedLine & {
    ref?: import("react").Ref<Graphics>;
}>;
