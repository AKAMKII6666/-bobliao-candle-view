/// <reference types="react" />
import { IcandleViewContext, TcandleViewContext } from "../interface/contextInterFace";
/**
 * 创建一个需要全局使用的钱包context
 **/
declare const candleViewContext: import("react").Context<IcandleViewContext>;
/**
 * 钱包的公用钩子
 */
declare const useCandleView: TcandleViewContext;
export interface IuseCandleViewContext {
    (): IcandleViewContext;
}
declare let useCandleViewContext: IuseCandleViewContext;
export { candleViewContext as default, useCandleView, useCandleViewContext, };
//# sourceMappingURL=candleViewContext.d.ts.map