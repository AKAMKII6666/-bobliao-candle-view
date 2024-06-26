import { IcandleData, Isize, pointCoord } from './itemsInterFace';

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
  alignX?: 'left' | 'center' | 'right';
  /**
   * 对齐y坐标的模式
   */
  alignY?: 'top' | 'center' | 'bottom';
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

/**
 * 批量绘制k线的参数
 */
export interface IPixiKlineBatching {
  isDQuickUpdateing: boolean;
  wickRiseColor: string;
  wickFallColor: string;
  candleRiseColor: string;
  candleFallColor: string;
  data: IcandleData[];
}

/**
 * 批量绘制Volume的参数
 */
export interface IPixiVolumeBatching {
  alpha: number;
  staticMax: number;
  volumChartPixHeight: number;
  riseColor: string;
  fallColor: string;
  isDQuickUpdateing: boolean;
  linePositionY: number;
  data: IcandleData[];
}
