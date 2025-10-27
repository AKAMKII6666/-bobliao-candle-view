/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import { FC } from "react";
import "../assets/styles/loaddingLay.css";
/**
 * 传入参数
 */
export interface iprops {
    color?: "black" | "white";
}
declare const Loading: FC<iprops>;
export default Loading;
