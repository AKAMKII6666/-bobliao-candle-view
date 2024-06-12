import { PixiComponent } from "@pixi/react";
import { Graphics, utils } from "pixi.js";
export const Rectangle = PixiComponent("Rectangle", {
    create: () => new Graphics(),
    applyProps: (instance, oldProps, props) => {
        const new_props = Object.assign(true, DEFAULTRECTANGLE, props);
        let newxy = xyComput(new_props);
        let x = newxy.x;
        let y = newxy.y;
        instance.clear();
        instance.beginFill(new_props.color || 0x0, new_props.opacity);
        instance.drawRect(x, y, new_props.size.width, new_props.size.height);
        instance.endFill();
    },
});
const xyComput = function (props) {
    let x = props.position.x;
    let y = props.position.y;
    if (props.alignX === "center") {
        x = props.position.x - props.size.width / 2;
    }
    if (props.alignX === "right") {
        x = props.position.x - props.size.width;
    }
    if (props.alignY === "center") {
        y = props.position.y - props.size.height / 2;
    }
    if (props.alignY === "bottom") {
        y = props.position.y - props.size.height;
    }
    return { x, y };
};
/**
 * 矩形pixi对象的初始值
 */
export const DEFAULTRECTANGLE = {
    color: utils.string2hex("#000000"),
    size: { width: 100, height: 100 },
    position: { x: 0, y: 0 },
    alignX: "left",
    alignY: "top",
    opacity: 1,
};
const drawDash = function (target, x1, y1, x2, y2, dashLength = 5, spaceLength = 5) {
    let x = x2 - x1;
    let y = y2 - y1;
    let hyp = Math.sqrt(x * x + y * y);
    let units = hyp / (dashLength + spaceLength);
    let dashSpaceRatio = dashLength / (dashLength + spaceLength);
    let dashX = (x / units) * dashSpaceRatio;
    let spaceX = x / units - dashX;
    let dashY = (y / units) * dashSpaceRatio;
    let spaceY = y / units - dashY;
    target.moveTo(x1, y1);
    while (hyp > 0) {
        x1 += dashX;
        y1 += dashY;
        hyp -= dashLength;
        if (hyp < 0) {
            x1 = x2;
            y1 = y2;
        }
        target.lineTo(x1, y1);
        x1 += spaceX;
        y1 += spaceY;
        target.moveTo(x1, y1);
        hyp -= spaceLength;
    }
    target.moveTo(x2, y2);
    return target;
};
export const DashedLine = PixiComponent("DashedLine", {
    create: () => new Graphics(),
    applyProps: (instance, _, newProps) => {
        let defaults = {
            color: utils.string2hex("#000000"),
            size: 1,
            positionStart: { x: 0, y: 0 },
            positionStop: { x: 0, y: 0 },
            dashLength: 4,
            spaceLength: 3,
        };
        //这里会产生引用
        const props = Object.assign(true, defaults, newProps);
        instance.clear();
        instance.lineStyle(props.size, props.color);
        instance = drawDash(instance, props.positionStart.x, props.positionStart.y, props.positionStop.x, props.positionStop.y, 4, 3);
        instance.endFill();
    },
});
//import * as PIXI from "pixi.js";
//import { Stage, Container, Sprite, CustomPIXIComponent } from "react-pixi-fiber";
//import { pointCoord } from "@/components/interfaces/iComon";
//import { IPixiShapeDashedLine, IPixiShapeRectangle } from "../interface/basicShapesInterFace";
//import { DEFAULTRECTANGLE } from "./defaultValues";
//
////计算xy
//const xyComput = function (props: IPixiShapeRectangle) {
//	let x = props.position.x;
//	let y = props.position.y;
//	if (props.alignX === "center") {
//		x = props.position.x - props.size.width / 2;
//	}
//	if (props.alignX === "right") {
//		x = props.position.x - props.size.width;
//	}
//	if (props.alignY === "center") {
//		y = props.position.y - props.size.height / 2;
//	}
//	if (props.alignY === "bottom") {
//		y = props.position.y - props.size.height;
//	}
//	return { x, y };
//};
//
///**
// * 矩形(自定义PIXI图形)
// */
//export const Rectangle = CustomPIXIComponent(
//	{
//		customDisplayObject: () => new PIXI.Graphics(),
//		customApplyProps: (instance: PIXI.Graphics, oldProps, newProps: IPixiShapeRectangle) => {
//			//这里会产生引用
//			const new_props = Object.assign(true, DEFAULTRECTANGLE, newProps);
//
//			let newxy = xyComput(new_props);
//			let x = newxy.x;
//			let y = newxy.y;
//			instance.clear();
//			instance.beginFill(new_props.color || 0x0, new_props.opacity);
//			instance.drawRect(x, y, new_props.size.width, new_props.size.height);
//			instance.endFill();
//
//			/* if (typeof oldProps === "undefined") {
//				let x = newxy.x;
//				let y = newxy.y;
//				instance.clear();
//				instance.beginFill(new_props.color || 0x0, new_props.opacity);
//				instance.drawRect(x, y, new_props.size.width, new_props.size.height);
//				instance.endFill();
//			} else {
//				const old_Props = Object.assign(true, defaultsRectangle, oldProps);
//				let oldxy = xyComput(old_Props);
//
//				if (oldxy.x !== newxy.x) {
//					instance.x += newxy.x - oldxy.x;
//				}
//				if (oldxy.y !== newxy.y) {
//					instance.y += newxy.y - oldxy.y;
//				}
//				if (old_Props.size.width !== new_props.size.width) {
//					instance.width = new_props.size.width;
//				}
//				if (old_Props.size.height !== new_props.size.height) {
//					instance.height = new_props.size.height;
//				}
//				if (old_Props.color !== new_props.color) {
//					instance.beginFill(new_props.color);
//				}
//				if (old_Props.opacity !== new_props.opacity) {
//					instance.alpha = new_props.opacity as number;
//				}
//			} */
//		},
//	},
//	"Rectangle"
//);
//
///**
// * 矩形(自定义PIXI图形)
// */
////export const superRectangle = CustomPIXIComponent(
////	{
////		customDisplayObject: () => new PIXI.Graphics(),
////		customApplyProps: (instance: PIXI.Graphics, oldProps, newProps: IPixiShapeRectangle) => {
////			//这里会产生引用
////			const new_props = Object.assign(true, DEFAULTRECTANGLE, newProps);
////
////			let newxy = xyComput(new_props);
////			let x = newxy.x;
////			let y = newxy.y;
////			instance.clear();
////			instance.beginFill(new_props.color || 0x0, new_props.opacity);
////			instance.drawRect(x, y, new_props.size.width, new_props.size.height);
////			instance.endFill();
////
////			/* if (typeof oldProps === "undefined") {
////				let x = newxy.x;
////				let y = newxy.y;
////				instance.clear();
////				instance.beginFill(new_props.color || 0x0, new_props.opacity);
////				instance.drawRect(x, y, new_props.size.width, new_props.size.height);
////				instance.endFill();
////			} else {
////				const old_Props = Object.assign(true, defaultsRectangle, oldProps);
////				let oldxy = xyComput(old_Props);
////
////				if (oldxy.x !== newxy.x) {
////					instance.x += newxy.x - oldxy.x;
////				}
////				if (oldxy.y !== newxy.y) {
////					instance.y += newxy.y - oldxy.y;
////				}
////				if (old_Props.size.width !== new_props.size.width) {
////					instance.width = new_props.size.width;
////				}
////				if (old_Props.size.height !== new_props.size.height) {
////					instance.height = new_props.size.height;
////				}
////				if (old_Props.color !== new_props.color) {
////					instance.beginFill(new_props.color);
////				}
////				if (old_Props.opacity !== new_props.opacity) {
////					instance.alpha = new_props.opacity as number;
////				}
////			} */
////		},
////	},
////	"superRectangle"
////);
//
//
///**
// * 虚线(自定义PIXI图形)
// */
//export const DashedLine = CustomPIXIComponent(
//	{
//		customDisplayObject: () => new PIXI.Graphics(),
//		customApplyProps: (instance: PIXI.Graphics, oldProps, newProps: IPixiShapeDashedLine) => {
//			let defaults: IPixiShapeDashedLine = {
//				color: PIXI.utils.string2hex("#000000"),
//				size: 1,
//				positionStart: { x: 0, y: 0 },
//				positionStop: { x: 0, y: 0 },
//				dashLength: 4,
//				spaceLength: 3,
//			};
//			//这里会产生引用
//			const props = Object.assign(true, defaults, newProps);
//			instance.clear();
//			instance.lineStyle(props.size, props.color);
//			instance = drawDash(
//				instance,
//				props.positionStart.x,
//				props.positionStart.y,
//				props.positionStop.x,
//				props.positionStop.y,
//				4,
//				3
//			);
//			instance.endFill();
//		},
//	},
//	"DashedLine"
//);
//
//# sourceMappingURL=basicShaps.js.map