/**
 * 廖力编写
 * 模块名称：交易图表
 * 模块说明：用于模仿tradingView做的交易实时图表
 * 编写时间：2024年5月25日 00:30:05
 */
import React from "react";
import { IuseCandleViewContext } from "./context/candleViewContext";
import { IcandleViewContext } from "./interface/contextInterFace";
/**
 * 传入参数
 */
export interface iprops {
}
/**
 * 创建一个需要全局使用的钱包context
 **/
export declare const candleViewPixiContext: React.Context<IcandleViewContext>;
export declare const useCandleViewPixiContext: IuseCandleViewContext;
declare const _default: React.NamedExoticComponent<iprops>;
export default _default;
//# sourceMappingURL=index.d.ts.map