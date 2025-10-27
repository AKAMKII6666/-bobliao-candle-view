import { PixiComponent } from "@pixi/react";
import { Graphics, utils } from "pixi.js";
import { IPixiKlineBatching, IPixiShapeDashedLine, IPixiShapeRectangle, IPixiVolumeBatching } from "../interface/basicShapesInterFace";

export const Rectangle = PixiComponent<IPixiShapeRectangle, Graphics>("Rectangle", {
	create: () => new Graphics(),
	applyProps: (instance, oldProps, props) => {
		const new_props = Object.assign(true, DEFAULTRECTANGLE, props);
		let newxy = xyComput(new_props);
		let x = newxy.x;
		let y = newxy.y;
		instance.clear();
		instance.beginFill(Number(new_props.color) || 0x0, Number(new_props.opacity) || 1);
		instance.drawRect(x, y, new_props.size.width, new_props.size.height);
		instance.endFill();
	},
});

const xyComput = function (props: IPixiShapeRectangle) {
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
 * 用于对k线图进行批量绘制的形状
 */
export const KlineBatching = PixiComponent<IPixiKlineBatching, Graphics>("KlineBatching", {
	create: () => new Graphics(),
	applyProps: (instance, oldProps, props) => {
		const new_props: IPixiKlineBatching = Object.assign(
			true,
			{
				isDQuickUpdateing: false,
				wickRiseColor: "#000000",
				wickFallColor: "#000000",
				candleRiseColor: "#000000",
				candleFallColor: "#000000",
				data: [],
			},
			props
		);

		const getColor = function (status: "rise" | "fall", type: "wick" | "candle"): string {
			if (status === "rise" && type === "wick") {
				return new_props.wickRiseColor!;
			}

			if (status === "fall" && type === "wick") {
				return new_props.wickFallColor!;
			}

			if (status === "rise" && type === "candle") {
				return new_props.candleRiseColor!;
			}

			if (status === "fall" && type === "candle") {
				return new_props.candleFallColor!;
			}
			return "";
		};

		instance.clear();
		//先画wick
		for (var item of new_props.data) {
			let size = {
				width: item.wickWidth!,
				height: item.wickLength!,
			};
			let position = {
				x: item.currentTick!.cPosition.x!,
				y: item.wickPixPosition!.y!,
			};

			let wickProps: IPixiShapeRectangle = {
				/**
				 * 颜色
				 */
				color: (function () {
					if (!new_props.isDQuickUpdateing) {
						return utils.string2hex(getColor(item!.candleStateus!, "wick"));
					}
					return utils.string2hex(getColor(item!.candleStateus!, "candle"));
				})(),
				/**
				 * 尺寸
				 */
				size: size,
				/**
				 * 坐标
				 */
				position: position,
				/**
				 * 对齐x坐标的模式
				 */
				alignX: "center",
				/**
				 * 对齐y坐标的模式
				 */
				alignY: "top",
				/**
				 * 透明度
				 */
				opacity: 1,
			};

			let newxy = xyComput(wickProps);
			let x = newxy.x;
			let y = newxy.y;
			instance.beginFill(Number(wickProps.color) || 0x0, Number(wickProps.opacity) || 1);
			instance.drawRect(x, y, size.width, size.height);
		}

		if (!new_props.isDQuickUpdateing) {
			//再画candle
			for (var item of new_props.data) {
				let size = {
					width: item.candleWidth!,
					height: item.candleLength!,
				};
				let position = {
					x: item.currentTick!.cPosition.x!,
					y: item.candlePixPosition!.y!,
				};

				let candleProps: IPixiShapeRectangle = {
					/**
					 * 颜色
					 */
					color: utils.string2hex(getColor(item!.candleStateus!, "candle")),
					/**
					 * 尺寸
					 */
					size: size,
					/**
					 * 坐标
					 */
					position: position,
					/**
					 * 对齐x坐标的模式
					 */
					alignX: "center",
					/**
					 * 对齐y坐标的模式
					 */
					alignY: "top",
					/**
					 * 透明度
					 */
					opacity: 1,
				};

				let newxy = xyComput(candleProps);
				let x = newxy.x;
				let y = newxy.y;
				instance.beginFill(Number(candleProps.color) || 0x0, Number(candleProps.opacity) || 1);
				instance.drawRect(x, y, size.width, size.height);
			}
		}

		instance.endFill();
	},
});

/**
 * 用于对Volume交易量进行批量绘制的形状
 */
export const VolumeBatching = PixiComponent<IPixiVolumeBatching, Graphics>("VolumeBatching", {
	create: () => new Graphics(),
	applyProps: (instance, oldProps, props) => {
		const new_props: IPixiVolumeBatching = Object.assign(
			true,
			{
				alpha: 0,
				staticMax: 0,
				volumChartPixHeight: 0,
				riseColor: "",
				fallColor: "",
				isDQuickUpdateing: false,
				linePositionY: 0,
				data: [],
			},
			props
		);

		instance.clear();

		for (var item of new_props.data) {
			let currentHeight = new_props.volumChartPixHeight * (Number(item.volume) / new_props.staticMax);
			let size = {
				width: (function () {
					if (!new_props.isDQuickUpdateing) {
						return item.candleWidth!;
					}
					return 1;
				})(),
				height: currentHeight,
			};
			let position = {
				x: item.currentTick!.cPosition.x!,
				y: new_props.linePositionY,
			};

			let volumeProps: IPixiShapeRectangle = {
				/**
				 * 颜色
				 */
				color: utils.string2hex(
					(function () {
						if (item.candleStateus === "rise") {
							return new_props.riseColor!;
						}
						return new_props.fallColor!;
					})()
				),
				/**
				 * 尺寸
				 */
				size: size,
				/**
				 * 坐标
				 */
				position: position,
				/**
				 * 对齐x坐标的模式
				 */
				alignX: "center",
				/**
				 * 对齐y坐标的模式
				 */
				alignY: "bottom",
				/**
				 * 透明度
				 */
				opacity: 1,
			};

			let newxy = xyComput(volumeProps);
			let x = newxy.x;
			let y = newxy.y;
			instance.beginFill(Number(volumeProps.color) || 0x0, Number(volumeProps.opacity) || 1);
			instance.drawRect(x, y, size.width, size.height);
		}

		instance.endFill();
	},
});

/**
 * 矩形pixi对象的初始值
 */
export const DEFAULTRECTANGLE: IPixiShapeRectangle = {
	color: utils.string2hex("#000000"),
	size: { width: 100, height: 100 },
	position: { x: 0, y: 0 },
	alignX: "left",
	alignY: "top",
	opacity: 1,
};

const drawDash = function (target: Graphics, x1: number, y1: number, x2: number, y2: number, dashLength: number = 5, spaceLength: number = 5): Graphics {
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

export const DashedLine = PixiComponent<IPixiShapeDashedLine, Graphics>("DashedLine", {
	create: () => new Graphics(),
	applyProps: (instance, _, newProps) => {
		let defaults: IPixiShapeDashedLine = {
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
