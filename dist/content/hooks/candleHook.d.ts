import { IdataConfig, IuseCandleView } from '../interface/configInterFaces';
import { IAxisobj, IuseCandleHook, IyAxisobj } from '../interface/hooksInterFace';
/**
 * 数据处理钩子
 *
 * 1.静态模式下拿到数据的处理步骤
 *   1.1 全部由过去到现在进行一遍排序
 *   1.2 检查 data[0] ~ data[1] 的时间范围是否为当前设置的时间类型的时间范围：
 *      1.2.1 如果比当前设置的时间范围小，就进行归并
 *      1.2.3 归并之后的数据放进allComputedCandleData堆里
 *      1.2.4 如果比当前设置的时间范围大，就不进行任何操作，直接停止更新。
 *      1.2.4 如果等于当前设置的时间范围，就不进行归并操作，放进allComputedCandleData堆里。
 *   1.3 根据x轴的tick 在 allComputedCandleData里找到的数据生成并计算完位置等信息后放进 displayCandleData
 *   1.4 根据上面1.3的计算更新y轴的范围
 *
 *
 * 2.静态模式下移动和缩放时响应的方式：
 *   2.1 根据x轴的tick 在 allComputedCandleData里找到的数据生成并计算完位置等信息后放进 displayCandleData
 *   2.2 根据上面1.3的计算更新y轴的范围
 *
 * 但不是每次移动都这样，需要一个响亮来进行控制，当拖动速度很快时只进行移动计算，不往 displayarr里加入任何东西 只计算视图内的数据，同时发起webworker离线计算接下来可能要更新的数据
 *当速度小于某个值的时候，就把webworker算好的数据更新进来
 */
declare const useCandleHook: (args: IdataConfig, xAxis: IAxisobj, yAxis: IyAxisobj, baseConfig: IuseCandleView) => IuseCandleHook;
export default useCandleHook;
