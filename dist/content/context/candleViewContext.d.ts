/// <reference types="react" />
import { IcandleViewContext, TcandleViewContext } from '../interface/contextInterFace';
/**
 * Candleview K-line图的context,用于给CandleView组件提供数据
 **/
declare const candleViewContext: import("react").Context<IcandleViewContext>;
/**
 * 初始化 Candleview K-line图的钩子
 */
declare const useCandleView: TcandleViewContext;
export interface IuseCandleViewContext {
    (): IcandleViewContext;
}
declare let useCandleViewContext: IuseCandleViewContext;
export { candleViewContext, useCandleView, useCandleViewContext, };
