/// <reference types="react" />
import { IcandleViewContext, TcandleViewContext } from "../interface/contextInterFace";
/**
 * candleViewContext
 * k线context
 **/
declare const candleViewContext: import("react").Context<IcandleViewContext>;
/**
 * candleView钩子
 */
declare const useCandleView: TcandleViewContext;
export interface IuseCandleViewContext {
    (): IcandleViewContext;
}
declare let useCandleViewContext: IuseCandleViewContext;
export { candleViewContext, useCandleView, useCandleViewContext, };
