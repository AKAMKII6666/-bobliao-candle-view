/// <reference types="react" />
import { Graphics } from "pixi.js";
import { IPixiShapeDashedLine, IPixiShapeRectangle } from "../interface/basicShapesInterFace";
export declare const Rectangle: import("react").FC<IPixiShapeRectangle & {
    ref?: import("react").Ref<Graphics> | undefined;
}>;
/**
 * 矩形pixi对象的初始值
 */
export declare const DEFAULTRECTANGLE: IPixiShapeRectangle;
export declare const DashedLine: import("react").FC<IPixiShapeDashedLine & {
    ref?: import("react").Ref<Graphics> | undefined;
}>;
//# sourceMappingURL=basicShaps.d.ts.map