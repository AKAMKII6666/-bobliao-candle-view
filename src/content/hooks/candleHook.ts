import {
  createContext,
  useState,
  useContext,
  useRef,
  useCallback,
  useEffect,
  FC,
  ReactElement,
} from 'react';

import {
  GMT0000TolocalTime,
  anyTimeToGMT0000ToTarget,
  findIntersectionByKey,
  findIntersectionCandle,
  getRightDate,
  getSpaceSize,
  localTimeToGMT0000,
  newGuid,
} from '../utils/consts';
import _bigNumber from 'bignumber.js';
import lodash from 'lodash';
import useDebounce from './debounceHook';
import useThrottle from './throttleHook';
import {
  IdataConfig,
  Itimezone,
  IuseCandleView,
} from '../interface/configInterFaces';
import {
  IAxisobj,
  IuseCandleHook,
  IyAxisobj,
} from '../interface/hooksInterFace';
import { DEFAULTDATAVALUES } from '../utils/defaultValues';
import {
  IToolTipItem,
  IcandleData,
  IcandleItem,
  IcandleUpdateItem,
  numberScope,
  numberScopeString,
  tickItem,
} from '../interface/itemsInterFace';
import { TtimeType } from '../interface/timeDefineInterFace';

interface MessageEventInit<T = any> extends EventInit {
  lastEventId?: string;
  channel?: string;
  data?: T;
  origin?: string;
  ports?: MessagePort[];
  source?: Window;
}
interface MessageEvent<T = any> extends Event {
  readonly data: T;
  readonly origin: string;
  readonly ports: any;
  readonly source: Window;
  initMessageEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    dataArg: T,
    originArg: string,
    lastEventIdArg: string,
    sourceArg: Window
  ): void;
}

declare var MessageEvent: {
  prototype: MessageEvent;
  new <T>(type: string, eventInitDict?: MessageEventInit<T>): MessageEvent<T>;
};

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
const useCandleHook = function(
  args: IdataConfig,
  xAxis: IAxisobj,
  yAxis: IyAxisobj,
  baseConfig: IuseCandleView
): IuseCandleHook {
  xAxis = xAxis!;
  yAxis = yAxis!;
  const [initArgs, setinitArgs] = useState<IdataConfig>(
    lodash.merge(DEFAULTDATAVALUES, args)
  );
  let updateThrottlereComputAllDisplayedCandleData = useThrottle();
  let updateThrottle = useThrottle();
  /**
   * ============================state===========================
   */
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentTimeTypeName, setcurrentTimeTypeName] = useState<string>('');
  const [miny, setminy] = useState<number>(0);
  const [isFetchingData, setisFetchingData] = useState<boolean>(true);
  const [fetchDataStemp, setfetchDataStemp] = useState<number>(-1);
  const [streamData, setstreamData] = useState<IcandleUpdateItem | null>(null);
  const [stopDynamicFetching, setstopDynamicFetching] = useState<boolean>(
    false
  );
  const [lastMaxMiny, setlastMaxMiny] = useState<numberScope>({
    start: 0,
    end: 0,
  });
  const [currentTimeZone, setcurrentTimeZone] = useState<Itimezone>();

  const [workMessage, seworkMessage] = useState<MessageEvent<any>>();
  const [LastScopeddcData, setLastScopeddcData] = useState<IcandleData[]>([]);

  //全量更新的时候才会更新这个guid,这个guid是用来判断每个candle是否需要进行重新计算的标志
  //每次全量更新会更新一次，每次都不太一样。
  const [currentGUIDUpdateTag, setcurrentGUIDUpdateTag] = useState<string>('');

  /**
   * 动态数据暂存处
   */
  const [TempDynamicData, setTempDynamicData] = useState<IcandleItem[] | null>(
    null
  );
  const [isFirstTimeUpdate, setisFirstTimeUpdate] = useState<boolean>(false);

  /**
   * 是否已完成初始化
   */
  const [isFinishedInit, setisFinishedInit] = useState<boolean>(false);
  const [isDQuickUpdateing, setisDQuickUpdateing] = useState<boolean>(false);

  const [cursorCandleItem, setCursorCandleItem] = useState<IcandleData | null>(
    null
  );
  const [latestCandleItem, setlatestCandleItem] = useState<IcandleData | null>(
    null
  );

  /**
   * 上次更新的X轴时间戳
   */
  const [lastTimexAsixStemp, setlastTimexAsixStemp] = useState<number>(798);

  /**
   * volume 数据图表的高度
   */
  const [volumChartPixHeight, setvolumChartPixHeight] = useState<number>(0);
  /**
   * volume 数据图表 当前视窗区域的最大值
   */
  const [volumChartViewMax, setvolumChartViewMax] = useState<number>(0);

  /**
   * 是否为静态数据模式
   */
  const [isStaticData, setisStaticData] = useState<boolean>(false);

  /**
   * 所有的candle数据（原始数据，未经过加工）
   */
  const [orgCandleData, setorgCandleData] = useState<IcandleItem[]>([]);

  /**
   * 用于显示的candle数据(经过加工和归并之后的数据 )
   */
  const [displayCandleData, setdisplayCandleData] = useState<IcandleData[]>([]);

  /**
   * 记录当前视窗内y轴数据的最大值和最小值
   */
  const [displayCandleMaxMin, setdisplayCandleMaxMin] = useState<
    numberScopeString
  >({ start: '0', end: '0' });
  const [org_displayCandleMaxMin, setorg_displayCandleMaxMin] = useState<
    numberScopeString
  >({ start: '0', end: '0' });
  const [yScale, setyScale] = useState<number>(1);

  /**
   * latestCandle
   * 最新的candle
   * 最末尾的Candle
   */
  const [latestCandle, setlatestCandle] = useState<IcandleData>();
  const [
    latestCandleToolTip,
    setlatestCandleToolTip,
  ] = useState<IToolTipItem | null>(null);
  const [
    latestVolumeToolTip,
    setlatestVolumeToolTip,
  ] = useState<IToolTipItem | null>(null);

  /**
   * 视图范围内最末尾的candle
   * 最新的candle
   */
  const [
    displayLatestCandle,
    setdisplayLatestCandle,
  ] = useState<IcandleData | null>(null);
  const [
    latestdisplayLatestCandle,
    setlatestdisplayLatestCandle,
  ] = useState<IToolTipItem | null>(null);
  const [
    latestdisplayLatestVolume,
    setlatestdisplayLatestVolume,
  ] = useState<IToolTipItem | null>(null);

  /**
   * view的全量尺寸
   */
  const [viewSize, setviewSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [updateStamp, setupdateStamp] = useState<number>(-1);
  const [initDyStamp, setinitDyStamp] = useState<number>(-1);

  /**
   * ==================================Ref===============================
   */

  /**
   * 所有的归并后的数据(数据来源于orgCandleData )
   */
  let allComputedCandleData = useRef<{ [propName: string]: IcandleItem }>(
    {} as { [propName: string]: IcandleItem }
  );
  let isUpdateing = useRef<boolean>(false);
  let isQuickUpdateing = useRef<boolean>(false);
  let isEscapeItems = useRef<boolean>(false);
  let mWorker = useRef<Worker>();

  /**
   * ==========================静态常量==============================
   */
  //显示时取小数点后几位
  const displayFix = 7;

  /**
   * ==========================函数==============================
   */

  /**
   * 判断数据的事件跨度是否和当前设置的时间跨度相符
   */
  const determineTimeSpaceConsistent = function(
    data: IcandleItem[]
  ): 'same' | 'bigger' | 'smaller' {
    if (data.length === 1) {
      return 'smaller';
    }
    let inputDataTimeSpace =
      getRightDate(data[1].time) - getRightDate(data[0].time);
    let configDataTimeSpace = xAxis.data.currentTimeType!.timeGap;
    if (inputDataTimeSpace === configDataTimeSpace) {
      return 'same';
    } else if (inputDataTimeSpace > configDataTimeSpace) {
      return 'bigger';
    }
    return 'smaller';
  };

  const getMin = function(item: IcandleItem, start: number): number {
    let result: number = start;
    if (result > Number(item.open)) {
      result = Number(item.open);
    }

    if (result > Number(item.close)) {
      result = Number(item.close);
    }

    if (result > Number(item.high)) {
      result = Number(item.high);
    }

    if (result > Number(item.low)) {
      result = Number(item.low);
    }
    return result;
  };

  const getMax = function(item: IcandleItem, end: number): number {
    let result: number = end;
    if (result < Number(item.open)) {
      result = Number(item.open);
    }

    if (result < Number(item.close)) {
      result = Number(item.close);
    }

    if (result < Number(item.high)) {
      result = Number(item.high);
    }

    if (result < Number(item.low)) {
      result = Number(item.low);
    }
    return result;
  };

  //按照当前的时间刻度归并数据（确保数据已经排序）
  //数据只支持比当前设置的最小单位小的
  //合并完数据就直接把数据放进allComputedCandleData堆里去了
  const mergeData = function(data: IcandleItem[]): numberScopeString {
    //归并的方式是这样的，首先确保数据已经排序，排序顺序为从最早到最晚
    //那么我们可以从数组的最晚数据开始进行归并
    //拿取最后一个数据的时间，通过时间配置对象取到整数
    //将这个整数进行保存。然后归并到一个新的IcandleData对象里
    //继续下一个，
    //拿取下一个数据的时间，通过时间配置对象取到整数
    //通过当前的项目的整数时间和上一个对象的整数时间进行比对
    //一致就归并到一起
    //不一致就另起一个新的IcandleData 将数据放进去，以此类推到数组循环结束
    let _currentCandleStick: IcandleData = ({
      time: -1,
      open: -1,
      close: -1,
      high: -1,
      low: -1,
      volume: 0,
    } as unknown) as IcandleData;

    let prevItem: IcandleItem = data[data.length - 1];
    //let result: IcandleData[] = [];

    let _displayCandleMaxMin: numberScopeString = {
      /**
       * 最低点
       * */
      start: '9999999999999999999999',
      /**
       * 最高点
       * */
      end: '-9999999999999999999999',
    };
    for (let i = data.length - 1; i > -1; i--) {
      let item = data[i];
      let time = xAxis.data.currentTimeType!.roundingFunction(
        getRightDate(item.time),
        baseConfig.timeZone!.displayTimeZone!
      );

      if (
        _currentCandleStick.time === -1 ||
        time !== _currentCandleStick.time
      ) {
        if (
          time !== _currentCandleStick.time &&
          _currentCandleStick.time !== -1 &&
          typeof allComputedCandleData.current[_currentCandleStick.time] ===
            'undefined'
        ) {
          allComputedCandleData.current[
            _currentCandleStick.time
          ] = _currentCandleStick;
          //result.push(_currentCandleStick);
        }

        _currentCandleStick = {
          time: time,
          open: -1,
          close: -1,
          high: '-9999999999999999999999',
          low: '9999999999999999999999',
          volume: 0,
        };
      }

      _currentCandleStick.open = item.open;
      if (
        time <
          xAxis.data.currentTimeType!.roundingFunction(
            getRightDate(prevItem.time),
            baseConfig!.timeZone!.displayTimeZone!
          ) ||
        _currentCandleStick.close === -1
      ) {
        _currentCandleStick.close = item.close;
      }
      if (Number(_currentCandleStick.high) < Number(item.high)) {
        _currentCandleStick.high = item.high;
      }

      if (Number(_currentCandleStick.low) > Number(item.low)) {
        _currentCandleStick.low = item.low;
      }

      _displayCandleMaxMin.start = getMin(
        item,
        Number(_displayCandleMaxMin.start)
      ).toString();
      _displayCandleMaxMin.end = getMax(
        item,
        Number(_displayCandleMaxMin.end)
      ).toString();

      _currentCandleStick.volume =
        Number(_currentCandleStick.volume) + Number(item.volume);
      prevItem = item;

      if (i === 0) {
        allComputedCandleData.current[
          _currentCandleStick.time
        ] = _currentCandleStick;
        //result.push(_currentCandleStick);
      }
    }

    return _displayCandleMaxMin;
  };

  /**
   * 将数据直接放进allComputedCandleData
   * @param data 输入数据
   */
  const putDataIntoAllComputedCandleData = function(
    data: IcandleItem[]
  ): numberScopeString {
    let _displayCandleMaxMin: numberScopeString = {
      /**
       * 最低点
       * */
      start: '9999999999999999999999',
      /**
       * 最高点
       * */
      end: '-9999999999999999999999',
    };
    for (var item of data) {
      if (typeof allComputedCandleData.current[item.time] === 'undefined') {
        _displayCandleMaxMin.start = getMin(
          item,
          Number(_displayCandleMaxMin.start)
        ).toString();
        _displayCandleMaxMin.end = getMax(
          item,
          Number(_displayCandleMaxMin.end)
        ).toString();
        allComputedCandleData.current[item.time] = { ...item };
      }
    }

    return _displayCandleMaxMin;
  };

  const getCandleColor = function(
    start: string,
    end: string,
    type: 'wick' | 'candle'
  ): string {
    if (Number(start) > Number(end)) {
      if (type === 'wick') return initArgs.candleStyles!.wickFallColor!;
      if (type === 'candle') return initArgs.candleStyles!.candleFallColor!;
    }
    if (type === 'wick') return initArgs.candleStyles!.wickRiseColor!;
    if (type === 'candle') return initArgs.candleStyles!.candleRiseColor!;
    return '#fff';
  };

  const getCandleStatus = function(
    start: string,
    end: string,
    type: 'wick' | 'candle'
  ): 'rise' | 'fall' {
    if (Number(start) > Number(end)) {
      if (type === 'wick') return 'fall';
      if (type === 'candle') return 'fall';
    }
    if (type === 'wick') return 'rise';
    if (type === 'candle') return 'rise';
    return 'rise';
  };

  const getDataSpaceFromNumberScope = function(
    dataScope: numberScopeString,
    start: number,
    end: number
  ) {
    let space = Number(dataScope.end) - Number(dataScope.start);
    let cspace = end - start;
    let precent = Number((cspace / space).toFixed(5));
    let yHeight =
      xAxis.data.viewSize.height -
      getSpaceSize(xAxis.initArgs.labelSpace!, xAxis.data.viewSize.height);
    return yHeight * precent;
  };

  const getDataY = function(
    dataScope: numberScopeString,
    dataPoint: string
  ): number {
    let space = Number(dataScope.end) - Number(dataScope.start);
    let precent = Number(
      ((Number(dataPoint) - Number(dataScope.start)) / space).toFixed(5)
    );
    let yHeight =
      xAxis.data.viewSize.height -
      getSpaceSize(xAxis.initArgs.labelSpace!, xAxis.data.viewSize.height);
    return yHeight - yHeight * precent;
  };

  //用y轴数据计算单个指标的各种属性
  const computSingalCandledata = function(
    //进行计算的项目
    dataitem: IcandleData,
    //扩展后的范围（数据）
    dataScope: numberScopeString,
    //是否强制全量渲染
    isForceAllDataConput: boolean = false
  ): IcandleData {
    dataitem.candleColor = getCandleColor(
      dataitem.open as string,
      dataitem.close as string,
      'candle'
    );
    dataitem.wickColor = getCandleColor(
      dataitem.open as string,
      dataitem.close as string,
      'wick'
    );
    dataitem.candleStateus = getCandleStatus(
      dataitem.open as string,
      dataitem.close as string,
      'candle'
    );
    dataitem.wickStateus = getCandleStatus(
      dataitem.open as string,
      dataitem.close as string,
      'wick'
    );
    //快速渲染
    if (isQuickUpdateing.current == true && isForceAllDataConput === false) {
      dataitem.wickWidth = 1.2;
      dataitem.candlePixPosition = {
        x: 0,
        y: getDataY(
          dataScope,
          Math.max(Number(dataitem.close), Number(dataitem.open)).toString()
        ),
      };
      dataitem.wickPixPosition = {
        x: 0, //x在渲染时直接取currentTick这里就不用计算了
        y: getDataY(dataScope, dataitem.high.toString()),
      };
      dataitem.wickLength = getDataSpaceFromNumberScope(
        dataScope,
        Number(dataitem.low),
        Number(dataitem.high)
      );
      //全量渲染
    } else {
      try {
        dataitem.candleWidth = getSpaceSize(
          initArgs.candleStyles!.candleWidth!,
          xAxis.data.displayTickCommonpixWidth!
        );
        dataitem.wickWidth = getSpaceSize(
          initArgs.candleStyles!.wickWidth!,
          xAxis.data.displayTickCommonpixWidth!
        );
      } catch (_e) {}

      dataitem.candlePixPosition = {
        x: 0, //x在渲染时直接取currentTick这里就不用计算了
        y: getDataY(
          dataScope,
          Math.max(Number(dataitem.close), Number(dataitem.open)).toString()
        ),
      };
      dataitem.wickPixPosition = {
        x: 0, //x在渲染时直接取currentTick这里就不用计算了
        y: getDataY(dataScope, dataitem.high.toString()),
      };
      dataitem.candleLength = getDataSpaceFromNumberScope(
        dataScope,
        Math.min(Number(dataitem.open), Number(dataitem.close)),
        Math.max(Number(dataitem.open), Number(dataitem.close))
      );
      if (dataitem.candleLength < 1) {
        dataitem.candleLength = 1;
      }
      dataitem.wickLength = getDataSpaceFromNumberScope(
        dataScope,
        Number(dataitem.low),
        Number(dataitem.high)
      );
    }
    try {
      //顺便计算单个tick的数据空间是否在最左边边缘
      //记录视图范围内最末尾的candle
      if (
        xAxis.data.lineSize.width -
          xAxis.data.x -
          dataitem.currentTick!.pixSpace!.start >=
          0 &&
        dataitem.currentTick!.pixSpace!.end -
          (xAxis.data.lineSize.width - xAxis.data.x) <=
          dataitem.currentTick!.pixSpace!.end -
            dataitem.currentTick!.pixSpace!.start
      ) {
        setdisplayLatestCandle(dataitem);
      }
    } catch (_e) {}
    return dataitem;
  };

  //用y轴数据计算单个指标的各种属性
  const computSingalCandledataMini = function(
    //candle项目
    dataitem: IcandleData
  ): void {
    try {
      //顺便计算单个tick的数据空间是否在最左边边缘
      //记录视图范围内最末尾的candle
      if (
        xAxis.data.lineSize.width -
          xAxis.data.x -
          dataitem.currentTick!.pixSpace!.start >=
          0 &&
        dataitem.currentTick!.pixSpace!.end -
          (xAxis.data.lineSize.width - xAxis.data.x) <=
          dataitem.currentTick!.pixSpace!.end -
            dataitem.currentTick!.pixSpace!.start
      ) {
        setdisplayLatestCandle(dataitem);
      }
    } catch (_e) {}
  };

  /**
   * 从x轴指针里查找数据
   * @param tickArr x轴指针
   * @param dataScope 范围
   * @returns
   */
  const findDataByTicks = function(
    tickArr: tickItem[]
  ): IcandleData[] | { data: IcandleData[]; scope: numberScopeString } {
    let result: IcandleData[] = [];
    let _displayCandleMaxMin: numberScopeString = {
      /**
       * 最低点
       * */
      start: '9999999999999999999999',
      /**
       * 最高点
       * */
      end: '-9999999999999999999999',
    };
    let maxVolume: number = -99999999999999;
    for (let inde_i = 0; inde_i < tickArr.length; inde_i++) {
      let item = tickArr[inde_i];
      if (typeof allComputedCandleData.current[item.value] !== 'undefined') {
        let dataitem: IcandleData = allComputedCandleData.current[
          item.value
        ] as IcandleData;
        dataitem!.currentTick! = item;

        _displayCandleMaxMin.start = getMin(
          dataitem,
          Number(_displayCandleMaxMin.start)
        ).toString();
        _displayCandleMaxMin.end = getMax(
          dataitem,
          Number(_displayCandleMaxMin.end)
        ).toString();

        if (maxVolume < Number(dataitem.volume)) {
          maxVolume = Number(dataitem.volume);
        }

        result.push(dataitem);
      }
    }
    setvolumChartViewMax(maxVolume);

    return { data: result, scope: _displayCandleMaxMin };
  };

  //将数据里所有的时间按照用户设置的数据源时区还原GMT +0000，然后再设置到显示时区
  const seAllDataDateToUserConfigedGMT = function(data: IcandleData[]) {
    for (let item of data) {
      //如果填写的是"本地时间"，就不做任何操作
      if (baseConfig.timeZone!.dataSourceTimeZone === 'local') {
        item.time = getRightDate(item.time);
      } else {
        //否则，先把时间按照用户设置的归零，然后再设置到显示时间
        item.time = anyTimeToGMT0000ToTarget(
          getRightDate(item.time),
          baseConfig.timeZone!.dataSourceTimeZone!,
          baseConfig.timeZone!.displayTimeZone!
        );
      }
    }

    return data;
  };

  /**
   * 初始化动态数据
   */
  const initDynamicData = async function() {
    //清空堆数据
    Object.keys(allComputedCandleData.current).forEach(
      key => delete allComputedCandleData.current[key]
    );
    setupdateStamp(-1);
    setorgCandleData([]);
    setdisplayCandleData([]);
    setyScale(1);
    setminy(0);
    setisFetchingData(true);
    setCursorCandleItem(null);
    setlatestCandleItem(null);
    setvolumChartPixHeight(0);
    setvolumChartViewMax(0);
    setdisplayCandleMaxMin({ start: '0', end: '0' });
    setorg_displayCandleMaxMin({ start: '0', end: '0' });
    setlatestCandleToolTip(null);
    setlatestVolumeToolTip(null);
    setdisplayLatestCandle(null);
    setlatestdisplayLatestCandle(null);
    setlatestdisplayLatestVolume(null);
    allComputedCandleData.current = {};
    isUpdateing.current = false;
    isQuickUpdateing.current = false;
    isEscapeItems.current = false;
    setisFinishedInit(false);
    setstopDynamicFetching(false);
    // TODO: 1.获得时间范围，获得当前x轴时间范围的end,然后往后推用户设置的数据条数（也就是时间单位）
    let endTime = xAxis.data.currentTimeScope.end;

    let preTime = initArgs.dynamicData!.dataFetchCountPreTime!;

    /**
     * 当前的整数时间
     */
    let _timeInteger = xAxis.data.currentTimeType!.roundingFunction(endTime, 0);

    let timeZoneD = 0;

    if (baseConfig.timeZone!.displayTimeZone === 'local') {
      let date = new Date();
      let localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
      timeZoneD = localtimeZone;
    } else {
      timeZoneD = baseConfig.timeZone!.displayTimeZone!;
    }

    endTime = anyTimeToGMT0000ToTarget(
      _timeInteger,
      timeZoneD,
      baseConfig.timeZone!.fetchConditionTimeZone!
    );

    /**
     * 获得末尾时间
     */
    let startTime = xAxis.data.currentTimeType!.backwardTimeUnit!(
      endTime,
      preTime,
      baseConfig!.timeZone!.displayTimeZone!
    );
    let result: IcandleItem[] = await initArgs.dynamicData!.dataFetchCallback!(
      (xAxis.data.currentTimeType!.name as unknown) as TtimeType,
      startTime,
      endTime
    );
    if (result.length !== 0) {
      setisFirstTimeUpdate(true);
      setTempDynamicData(seAllDataDateToUserConfigedGMT(result));
    }
    //计算volum图的像素高度
    let heightPixVolumArea = getSpaceSize(
      initArgs.candleStyles?.volumChart?.volumeChartHeight!,
      xAxis.data.linePosition.y
    );
    setvolumChartPixHeight(heightPixVolumArea);
    setisFetchingData(false);

    setisFinishedInit(true);
  };

  /**
   * 在数据滚动或者缩放时发起的动态数据拉取
   */
  const lunchDynamicData = async function(endTime: number) {
    if (isFetchingData) {
      return;
    }
    setisFetchingData(true);
    /**
     * 获得末尾时间
     */
    let startTime = xAxis.data.currentTimeType!.backwardTimeUnit!(
      endTime,
      initArgs.dynamicData!.dataFetchCountPreTime!,
      0
    );

    let timeZoneD = 0;

    if (baseConfig.timeZone!.displayTimeZone === 'local') {
      let date = new Date();
      let localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
      timeZoneD = localtimeZone;
    } else {
      timeZoneD = baseConfig.timeZone!.displayTimeZone!;
    }
    //如果设置了时间归零
    //查询时间会被错开，所以查询的时候就再还原一下时间
    startTime = anyTimeToGMT0000ToTarget(
      startTime,
      timeZoneD,
      baseConfig.timeZone!.fetchConditionTimeZone!
    );
    endTime = anyTimeToGMT0000ToTarget(
      endTime,
      timeZoneD,
      baseConfig.timeZone!.fetchConditionTimeZone!
    );

    let result: IcandleItem[] = await initArgs.dynamicData!.dataFetchCallback!(
      (xAxis.data.currentTimeType!.name as unknown) as TtimeType,
      startTime,
      endTime
    );

    //返回数据为0或为空
    //停止拉取数据了
    if (typeof result === 'undefined' || result === null) {
      setstopDynamicFetching(true);
      return;
    }

    //如果result的结果等于1
    //然后这个结果在显示candle集合里的最末尾
    if (result.length === 1) {
      let intTime = anyTimeToGMT0000ToTarget(
        Number(result[0].time),
        baseConfig.timeZone!.dataSourceTimeZone!,
        baseConfig.timeZone!.displayTimeZone!
      );
      //说明数据已经到头了
      if (intTime === displayCandleData[0].time) {
        setstopDynamicFetching(true);
        return;
      }
    }

    if (result.length !== 0) {
      setTempDynamicData(seAllDataDateToUserConfigedGMT(result));
    }
    setisFetchingData(false);
  };

  /**
   * 更新动态数据
   */
  const updateDynamicData = function(data: IcandleItem[]) {
    if (isFetchingData) {
      return;
    }
    if (!isFinishedInit) {
      return;
    }

    //排序
    let _data = data.sort(function(a, b) {
      return getRightDate(a.time) - getRightDate(b.time);
    });

    //判断时间类型是不是一致，还是大了还是小了
    var isConsistentOfDateType = determineTimeSpaceConsistent(data);

    //大了就没办法了，直接return
    if (isConsistentOfDateType === 'bigger') {
      console.log(
        'The time interval of the data is inconsistent with the given configured time interval!'
      );
      return;
    }

    //将新数据加入到当前现有的数据里去
    //小了的话就按照配置的时间类型进行归并
    if (isConsistentOfDateType === 'smaller') {
      mergeData(_data);
    } else {
      //如果是一致的，就直接将这些数据放进堆里
      putDataIntoAllComputedCandleData(_data);
    }

    //新老数据合并做个备份
    let _orgCandleData = [..._data, ...orgCandleData];

    setorgCandleData(_orgCandleData);

    if (isFirstTimeUpdate) {
      setisFirstTimeUpdate(false);
      setinitDyStamp(+new Date());
    } else {
      setfetchDataStemp(+new Date());
    }
  };

  /**
   * 初始化静态数据
   */
  const initStaticData = function() {
    //清空堆数据
    Object.keys(allComputedCandleData.current).forEach(
      key => delete allComputedCandleData.current[key]
    );
    //排序
    let _orgCandleData = seAllDataDateToUserConfigedGMT(
      initArgs.staticData!.sort(function(a, b) {
        return getRightDate(a.time) - getRightDate(b.time);
      })
    );

    //判断时间类型是不是一致，还是大了还是小了
    var isConsistentOfDateType = determineTimeSpaceConsistent(_orgCandleData);

    //大了就没办法了，直接return
    if (isConsistentOfDateType === 'bigger') {
      console.log(
        'The time interval of the data is inconsistent with the given configured time interval!'
      );
      return;
    }

    let dataScope: numberScopeString = { start: '500', end: '700' };
    //小了的话就按照配置的时间类型进行归并
    if (isConsistentOfDateType === 'smaller') {
      dataScope = mergeData(_orgCandleData);
    } else {
      //如果是一致的，就直接将这些数据放进堆里
      dataScope = putDataIntoAllComputedCandleData(_orgCandleData);
    }

    //dataScope  这个scope是指所有数据的scope,并不是当前屏幕显示范围的scope

    //用于显示的数据
    let result = findDataByTicks(xAxis.data.tickArr) as {
      data: IcandleData[];
      scope: numberScopeString;
    };

    for (let item of result.data) {
      item = computSingalCandledata(item, result.scope);
    }
    dataScope = result.scope;

    //计算volum图的像素高度
    let heightPixVolumArea = getSpaceSize(
      initArgs.candleStyles?.volumChart?.volumeChartHeight!,
      xAxis.data.linePosition.y
    );

    setvolumChartPixHeight(heightPixVolumArea);

    setorgCandleData(_orgCandleData);
    setdisplayCandleData(result.data);
    setviewSize(xAxis.data.viewSize);
    setisFinishedInit(true);
    setorg_displayCandleMaxMin(result.scope);
    setyScale(1);
    setminy(0);
    //更新y轴
    yAxis.funcs.updateAxisSates(
      xAxis.data.viewSize.width,
      xAxis.data.viewSize.height,
      {
        start: Number(dataScope.start),
        end: Number(dataScope.end),
      }
    );
    setdisplayCandleMaxMin(dataScope);
    setupdateStamp(+new Date());
    setisFetchingData(false);
  };

  //只计算缩放和刚进来的数据，不进行全量更新
  //这个算法主要的运算方式是：
  //1.重新用xAxis.data.tickArr循环一遍，从哈希表里直接取到当前的显示canle组
  //2.然后循环取出来的列表再循环一次计算位置，
  //3.计算位置的时候判断这个列表里有哪些candle项目已经被计算过计算过的就不算了，没计算过的计算一下
  const updatePartialCandleData = function() {
    let _xAxisdatatickArr = [...xAxis.data.tickArr];
    let _viewSize = { ...xAxis.data.viewSize };
    let _org_displayCandleMaxMin = { ...org_displayCandleMaxMin };
    let isEscapeItems_current = isEscapeItems.current;
    let isQuickUpdateing_current = isQuickUpdateing.current;

    //用于显示的数据
    let result = findDataByTicks(_xAxisdatatickArr) as {
      data: IcandleData[];
      scope: numberScopeString;
    };

    //result.data 为 和目前x轴tick的交集displaycandles
    //result.scope 为扩展之前的数据范围 真实的数据范围
    if (result.data.length === 0) {
      //没找到
      setdisplayCandleData([]);
      checkDynamicData();
      return;
    }

    //先通知y轴更新了
    requestAnimationFrame(function() {
      //更新y轴
      yAxis.funcs.updateAxisSates(_viewSize.width, _viewSize.height, {
        start: Number(result.scope.start),
        end: Number(result.scope.end),
      });
    });

    //上次缩放或重置后使用的最大值最小值(数据范围，不是像素 )
    //而且是未经扩展过的数据范围（素）的

    let orgMaxMiny: numberScope = {
      //start 找 y+length 最大的
      start: -9999999999999999,
      //end找y最小的
      end: 99999999999999,
    };
    //进行数据计算
    let index = 0;

    for (var item of result.data) {
      //如果已经打开了省略模式

      //如果已经打开了省略模式
      if (isEscapeItems_current) {
        if (Number(index) % 2) {
          //全部进行全量计算
          //如果上次更新的tag和现在当前的值不一致，说明是上次缩放后还没来得及计算的元素
          //这样的元素就需要重新进行计算，
          //否则就不需要进行计算
          if (
            typeof item.updateTag === 'undefined' ||
            item.updateTag !== currentGUIDUpdateTag
          ) {
            item = computSingalCandledata(item, _org_displayCandleMaxMin);
            item.updateTag = currentGUIDUpdateTag;
          } else {
            computSingalCandledataMini(item);
          }
          item.isEscaped = false;
        } else {
          //省略过的只收集数据
          computSingalCandledataMini(item);
          item.isEscaped = true;
        }
      } else {
        //全部进行全量计算
        //如果上次更新的tag和现在当前的值不一致，说明是上次缩放后还没来得及计算的元素
        //这样的元素就需要重新进行计算，
        //否则就不需要进行计算
        if (
          typeof item.updateTag === 'undefined' ||
          item.updateTag !== currentGUIDUpdateTag
        ) {
          item = computSingalCandledata(item, _org_displayCandleMaxMin);
          item.updateTag = currentGUIDUpdateTag;
        } else {
          computSingalCandledataMini(item);
        }
        item.isEscaped = false;
      }

      if (isQuickUpdateing_current) {
        if (
          Number(item.wickPixPosition?.y) + Number(item.wickLength) >
          orgMaxMiny.start
        ) {
          //求（像素）y最大值
          orgMaxMiny.start =
            Number(item.wickPixPosition?.y) + Number(item.wickLength);
        }
        //求（像素）y最小值
        if (Number(item.wickPixPosition?.y) < orgMaxMiny.end) {
          orgMaxMiny.end = Number(item.wickPixPosition?.y);
        }
      } else {
        if (
          Math.max(
            Number(item.candlePixPosition?.y) + Number(item.candleLength),
            Number(item.wickPixPosition?.y) + Number(item.wickLength)
          ) > orgMaxMiny.start
        ) {
          //求（像素）y最大值
          orgMaxMiny.start = Math.max(
            Number(item.candlePixPosition?.y) + Number(item.candleLength),
            Number(item.wickPixPosition?.y) + Number(item.wickLength)
          );
        }
        //求（像素）y最小值
        if (
          Math.min(
            Number(item.candlePixPosition?.y),
            Number(item.wickPixPosition?.y)
          ) < orgMaxMiny.end
        ) {
          orgMaxMiny.end = Math.min(
            Number(item.candlePixPosition?.y),
            Number(item.wickPixPosition?.y)
          );
        }
      }

      index++;
    }

    //对查找出来的边界进行扩展
    ///let expandedMaxMin = yAxis.funcs.expandDataSpanceEdgePIX(orgMaxMiny);

    let currentheight = orgMaxMiny.start - orgMaxMiny.end;
    let expendHeight =
      currentheight + currentheight * yAxis.initArgs.displayPadding!;
    let scale = yAxis.data.lineSize.height / expendHeight;
    let y =
      -orgMaxMiny.end + (currentheight * yAxis.initArgs.displayPadding!) / 2;

    setdisplayCandleData(result.data);

    setdisplayCandleMaxMin(result.scope);

    if (result.data.length !== 0) {
      setminy(y * scale);
      setyScale(scale);
      checkDynamicData(result.data);
      setupdateStamp(+new Date());
    }
  };

  /*
	第三版结合所有优点根据情况决定是计算还是更新
	*/
  const updatePartialCandleDataV3 = function() {
    let onlyUpdatePositionAndScale = function(_cArr?: IcandleData[]) {
      let isFromAppend = false;
      if (typeof _cArr === 'undefined') {
        _cArr = [...displayCandleData];
        _cArr = _cArr.sort(function(a, b) {
          return Number(a.time) - Number(b.time);
        });
      } else {
        isFromAppend = true;
      }
      if (_cArr.length === 0) {
        return;
      }
      let barr = [];
      barr = _cArr;
      let currentScopeDisplayCandleData = findIntersectionCandle(
        barr,
        xAxis.data.currentTimeScope
      );
      if (isFromAppend) {
        currentScopeDisplayCandleData = _cArr;
      } else {
        currentScopeDisplayCandleData = findIntersectionCandle(
          barr,
          xAxis.data.currentTimeScope
        );
      }
      let orgMaxMiny: numberScope = {
        //start 找 y+length 最大的
        start: -9999999999999999,
        //end找y最小的
        end: 99999999999999,
      };
      let _displayCandleMaxMin: numberScopeString = {
        /**
         * 最低点
         * */
        start: '9999999999999999999999',
        /**
         * 最高点
         * */
        end: '-9999999999999999999999',
      };
      let maxVolume: number = -99999999999999;

      let i = 0;
      while (i < currentScopeDisplayCandleData.length) {
        let item = currentScopeDisplayCandleData[i];
        if (isQuickUpdateing.current) {
          if (
            Number(item.wickPixPosition?.y) + Number(item.wickLength) >
            orgMaxMiny.start
          ) {
            //求（像素）y最大值
            orgMaxMiny.start =
              Number(item.wickPixPosition?.y) + Number(item.wickLength);
          }
          //求（像素）y最小值
          if (Number(item.wickPixPosition?.y) < orgMaxMiny.end) {
            orgMaxMiny.end = Number(item.wickPixPosition?.y);
          }
        } else {
          if (
            Math.max(
              Number(item.candlePixPosition?.y) + Number(item.candleLength),
              Number(item.wickPixPosition?.y) + Number(item.wickLength)
            ) > orgMaxMiny.start
          ) {
            //求（像素）y最大值
            orgMaxMiny.start = Math.max(
              Number(item.candlePixPosition?.y) + Number(item.candleLength),
              Number(item.wickPixPosition?.y) + Number(item.wickLength)
            );
          }
          //求（像素）y最小值
          if (
            Math.min(
              Number(item.candlePixPosition?.y),
              Number(item.wickPixPosition?.y)
            ) < orgMaxMiny.end
          ) {
            orgMaxMiny.end = Math.min(
              Number(item.candlePixPosition?.y),
              Number(item.wickPixPosition?.y)
            );
          }
        }
        i++;
      }

      let currentheight = orgMaxMiny.start - orgMaxMiny.end;
      let expendHeight =
        currentheight + currentheight * yAxis.initArgs.displayPadding!;
      let scale = yAxis.data.lineSize.height / expendHeight;
      let y =
        -orgMaxMiny.end + (currentheight * yAxis.initArgs.displayPadding!) / 2;

      setminy(y * scale);
      setyScale(scale);
      /* setLastScopeddcData(() => currentScopeDisplayCandleData); */

      for (let i = 0; i < currentScopeDisplayCandleData.length; i++) {
        let item = currentScopeDisplayCandleData[i];
        computSingalCandledataMini(item);

        _displayCandleMaxMin.start = getMin(
          item,
          Number(_displayCandleMaxMin.start)
        ).toString();
        _displayCandleMaxMin.end = getMax(
          item,
          Number(_displayCandleMaxMin.end)
        ).toString();
        if (maxVolume < Number(item.volume)) {
          maxVolume = Number(item.volume);
        }
      }

      //先通知y轴更新了
      requestAnimationFrame(function() {
        if (currentScopeDisplayCandleData.length === 0) {
          return;
        }
        //更新y轴
        yAxis.funcs.updateAxisSates(viewSize.width, viewSize.height, {
          start: Number(_displayCandleMaxMin.start),
          end: Number(_displayCandleMaxMin.end),
        });
      });

      setdisplayCandleMaxMin(_displayCandleMaxMin);
      setvolumChartViewMax(maxVolume);
      setupdateStamp(+new Date());
    };

    let updateAndAppendNewCandle = function() {
      let _totalCandleDisplayArr = [...displayCandleData];
      if (_totalCandleDisplayArr.length === 0) {
        return;
      }
      let orgMaxMiny: numberScope = {
        //start 找 y+length 最大的
        start: -9999999999999999,
        //end找y最小的
        end: 99999999999999,
      };
      let backwardDCArr: IcandleData[] = [];
      //判断是前面少了还是后面少了
      if (xAxis.data.tickArr[0].value !== _totalCandleDisplayArr[0].time) {
        let index = 0;
        while (
          typeof xAxis.data.tickArr[index] !== 'undefined' &&
          xAxis.data.tickArr[index].value < _totalCandleDisplayArr[0].time
        ) {
          let item = (allComputedCandleData.current[
            xAxis.data.tickArr[index].value
          ] as unknown) as IcandleData;
          if (typeof item !== 'undefined') {
            item.currentTick = xAxis.data.tickArr[index];
            backwardDCArr.push(item);
          }
          index++;
        }
      }

      let forwardDCArr: IcandleData[] = [];
      if (
        xAxis.data.tickArr[xAxis.data.tickArr.length - 1].value !==
        _totalCandleDisplayArr[_totalCandleDisplayArr.length - 1].time
      ) {
        let index = xAxis.data.tickArr.length - 1;
        while (
          typeof xAxis.data.tickArr[index] !== 'undefined' &&
          xAxis.data.tickArr[index].value >
            _totalCandleDisplayArr[_totalCandleDisplayArr.length - 1].time
        ) {
          let item = (allComputedCandleData.current[
            xAxis.data.tickArr[index].value
          ] as unknown) as IcandleData;
          if (typeof item !== 'undefined') {
            item.currentTick = xAxis.data.tickArr[index];
            forwardDCArr.unshift(item);
          }
          index--;
        }
      }

      let _displayCandleData = [
        ...backwardDCArr,
        ..._totalCandleDisplayArr,
        ...forwardDCArr,
      ].sort(function(a, b) {
        return Number(a.time) - Number(b.time);
      });

      let currentScopeDisplayCandleData = findIntersectionCandle(
        _displayCandleData,
        xAxis.data.currentTimeScope
      );

      //计算当前屏幕上显示的数据，没显示在屏幕范围的不参与计算
      let _org_displayCandleMaxMin = org_displayCandleMaxMin;
      let currentTag =
        _org_displayCandleMaxMin.start + _org_displayCandleMaxMin.end;

      for (var item of currentScopeDisplayCandleData) {
        if (
          typeof item.updateTag === 'undefined' ||
          item.updateTag !== currentGUIDUpdateTag
        ) {
          item = computSingalCandledata(item, _org_displayCandleMaxMin);
          item.updateTag = currentGUIDUpdateTag;
        } else {
          computSingalCandledataMini(item);
        }
      }

      //丢弃数据
      //丢弃掉低于开始时间最早1500条数据
      //丢弃掉高于结束时间最早1500条数据
      //先算低于的
      //mouseSpeedSec为正数就是在往以前推动
      //mouseSpeedSec为负数就是在往未来拖动
      //比现在显示最边缘的时间还小1500个单位以外

      if (
        _displayCandleData.length > 0 &&
        currentScopeDisplayCandleData.length > 0
      ) {
        let rangeNamber = 900;
        if (
          Number(_displayCandleData[0].time) <
          xAxis.data.currentTimeType!.backwardTimeUnit!(
            Number(currentScopeDisplayCandleData[0].time),
            rangeNamber,
            0
          )!
        ) {
          let i = 0;
          let count = 0;
          let starttime = xAxis.data.currentTimeType!.backwardTimeUnit!(
            Number(currentScopeDisplayCandleData[0].time),
            rangeNamber,
            0
          )!;
          while (Number(_displayCandleData[i].time) < starttime) {
            i++;
            count++;
          }
          _displayCandleData = _displayCandleData.slice(
            i,
            _displayCandleData.length
          );
        }

        //比现在显示最边缘的时间还大1500个单位以外
        if (
          Number(_displayCandleData[_displayCandleData.length - 1].time) >
          xAxis.data.currentTimeType!.forwardTimeUnit!(
            Number(
              currentScopeDisplayCandleData[
                currentScopeDisplayCandleData.length - 1
              ].time
            ),
            rangeNamber,
            0
          )!
        ) {
          let i = _displayCandleData.length - 1;
          let count = 0;
          let endTime = xAxis.data.currentTimeType!.forwardTimeUnit!(
            Number(
              currentScopeDisplayCandleData[
                currentScopeDisplayCandleData.length - 1
              ].time
            ),
            rangeNamber,
            0
          );
          while (Number(_displayCandleData[i].time) > endTime) {
            i--;
            count++;
          }
          _displayCandleData = _displayCandleData.slice(0, i + 1);
        }
      }

      setdisplayCandleData(_displayCandleData);
      checkDynamicData(_displayCandleData);
      return currentScopeDisplayCandleData;
    };
    window.requestAnimationFrame(function() {
      if (xAxis.data.tickArr.length > 120) {
        let inputArr: IcandleData[] | undefined = undefined;
        if (
          xAxis.data.lastTimeScope.start !==
            xAxis.data.currentTimeScope.start &&
          xAxis.data.lastTimeScope.end !== xAxis.data.currentTimeScope.end
        ) {
          if (Math.abs(xAxis.data.mouseSpeedSec) < 6) {
            inputArr = updateAndAppendNewCandle();
          }
        } else {
          inputArr = updateAndAppendNewCandle();
        }

        onlyUpdatePositionAndScale(inputArr);
      } else {
        updatePartialCandleData();
      }
    });
  };

  //只计算缩放和刚进来的数据，不进行全量更新
  //这个算法主要的运算方式是：
  //1.重新用xAxis.data.tickArr循环一遍，从哈希表里直接取到当前的显示canle组
  //2.然后循环取出来的列表再循环一次计算位置，
  //3.计算位置的时候判断这个列表里有哪些candle项目已经被计算过计算过的就不算了，没计算过的计算一下
  //多线程版本
  const updatePartialCandleDataWorker = function() {
    let _xAxisdatatickArr = [...xAxis.data.tickArr];
    let _viewSize = { ...xAxis.data.viewSize };
    let _org_displayCandleMaxMin = { ...org_displayCandleMaxMin };
    let isEscapeItems_current = isEscapeItems.current;
    let isQuickUpdateing_current = isQuickUpdateing.current;
    let allComputedCandleData_current = allComputedCandleData.current;
    let xAxis_initArgs_labelSpace = xAxis.initArgs.labelSpace;
    let initArgs_candleStyles_wickFallColor = initArgs.candleStyles!
      .wickFallColor!;
    let initArgs_candleStyles_candleFallColor = initArgs.candleStyles!
      .candleFallColor!;
    let initArgs_candleStyles_wickRiseColor = initArgs.candleStyles!
      .wickRiseColor!;
    let initArgs_candleStyles_candleRiseColor = initArgs.candleStyles!
      .candleRiseColor!;
    let initArgs_candleStyles_candleWidth = initArgs.candleStyles!.candleWidth!;
    let initArgs_candleStyles_wickWidth = initArgs.candleStyles!.wickWidth!;
    let xAxis_data_displayTickCommonpixWidth = xAxis.data
      .displayTickCommonpixWidth!;
    let xAxis_data_lineSize_width = xAxis.data.lineSize.width;
    let xAxis_data_x = xAxis.data.x;

    mWorker.current?.postMessage({
      message: 'move',
      _xAxisdatatickArr: _xAxisdatatickArr,
      _viewSize: _viewSize,
      _org_displayCandleMaxMin: _org_displayCandleMaxMin,
      isEscapeItems_current: isEscapeItems_current,
      isQuickUpdateing_current: isQuickUpdateing_current,
      allComputedCandleData_current: allComputedCandleData_current,
      xAxis_initArgs_labelSpace: xAxis_initArgs_labelSpace,
      initArgs_candleStyles_wickFallColor: initArgs_candleStyles_wickFallColor,
      initArgs_candleStyles_candleFallColor: initArgs_candleStyles_candleFallColor,
      initArgs_candleStyles_wickRiseColor: initArgs_candleStyles_wickRiseColor,
      initArgs_candleStyles_candleRiseColor: initArgs_candleStyles_candleRiseColor,
      initArgs_candleStyles_candleWidth: initArgs_candleStyles_candleWidth,
      initArgs_candleStyles_wickWidth: initArgs_candleStyles_wickWidth,
      xAxis_data_displayTickCommonpixWidth: xAxis_data_displayTickCommonpixWidth,
      xAxis_data_lineSize_width: xAxis_data_lineSize_width,
      xAxis_data_x: xAxis_data_x,
    });

    //let currentheight = orgMaxMiny.start - orgMaxMiny.end;
    //let expendHeight = currentheight + currentheight * yAxis.initArgs.displayPadding!;
    //let scale = yAxis.data.lineSize.height / expendHeight;
    //let y = -orgMaxMiny.end + (currentheight * yAxis.initArgs.displayPadding!) / 2;
    //
    //setdisplayCandleData(() => {
    //	return result.data;
    //});
    //
    //setdisplayCandleMaxMin(() => {
    //	return result.scope;
    //});
    //
    //if (result.data.length !== 0) {
    //	setminy(y * scale);
    //	setyScale(scale);
    //	checkDynamicData(result.data);
    //	setupdateStamp(+new Date());
    //}
  };

  //只计算刚进来的数据，不做全量更新
  //第二个版本
  //1.用二分查找直接取到剩下还能用的candle
  //2.使用推进法扩展candle
  /* const updatePartialCandleDataV2 = function () {
		let _cArr = [...displayCandleData];
		let lastDisplayCandleData = findIntersectionCandle(_cArr, xAxis.data.currentTimeScope);

		let backwardDCArr: IcandleData[] = [];
		//判断是前面少了还是后面少了
		if (xAxis.data.tickArr[0].value !== lastDisplayCandleData[0].time) {
			let index = 0;
			while (xAxis.data.tickArr[index].value < lastDisplayCandleData[0].time) {
				let item = allComputedCandleData.current[xAxis.data.tickArr[index].value] as unknown as IcandleData;
				if (typeof item !== "undefined") {
					item.currentTick = xAxis.data.tickArr[index];
					backwardDCArr.push(item);
				}
				index++;
			}
		}

		let forwardDCArr: IcandleData[] = [];
		if (
			xAxis.data.tickArr[xAxis.data.tickArr.length - 1].value !==
			lastDisplayCandleData[lastDisplayCandleData.length - 1].time
		) {
			let index = xAxis.data.tickArr.length - 1;
			while (xAxis.data.tickArr[index].value > lastDisplayCandleData[lastDisplayCandleData.length - 1].time) {
				let item = allComputedCandleData.current[xAxis.data.tickArr[index].value] as unknown as IcandleData;
				if (typeof item !== "undefined") {
					item.currentTick = xAxis.data.tickArr[index];
					forwardDCArr.unshift(item);
				}
				index--;
			}
		}

		if (backwardDCArr.length === 0 && forwardDCArr.length === 0) {
			return;
		}
		//上次缩放或重置后使用的最大值最小值(数据范围，不是像素 )
		//而且是未经扩展过的数据范围（素）的
		let _org_displayCandleMaxMin = org_displayCandleMaxMin;
		let currentTag = _org_displayCandleMaxMin.start + _org_displayCandleMaxMin.end;

		//继承上一次的结果，并从这次的新结果里查找最大的y和最小的y
		let orgMaxMiny: numberScope = { ...lastMaxMiny };
		//继承上一次的
		let _displayCandleMaxMin: numberScopeString = { ...displayCandleMaxMin };

		///计算新选出来的displaycandle项目
		let comp = function (arrayCD: IcandleData[]): IcandleData[] {
			//进行数据计算
			let index = 0;
			isEscapeItems.current = false;
			for (var item of arrayCD) {
				//如果已经打开了省略模式

				//全部进行全量计算
				//如果上次更新的tag和现在当前的值不一致，说明是上次缩放后还没来得及计算的元素
				//这样的元素就需要重新进行计算，
				//否则就不需要进行计算
				if (typeof item.updateTag === "undefined" || item.updateTag !== currentTag) {
					item = computSingalCandledata(item, _org_displayCandleMaxMin, _org_displayCandleMaxMin);
				} else {
					computSingalCandledataMini(item, _org_displayCandleMaxMin);
				}
				item.isEscaped = false;

				if (isQuickUpdateing.current) {
					if (Number(item.wickPixPosition?.y) + Number(item.wickLength) > orgMaxMiny.start) {
						//求（像素）y最大值
						orgMaxMiny.start = Number(item.wickPixPosition?.y) + Number(item.wickLength);
					}
					//求（像素）y最小值
					if (Number(item.wickPixPosition?.y) < orgMaxMiny.end) {
						orgMaxMiny.end = Number(item.wickPixPosition?.y);
					}
				} else {
					if (
						Math.max(
							Number(item.candlePixPosition?.y) + Number(item.candleLength),
							Number(item.wickPixPosition?.y) + Number(item.wickLength)
						) > orgMaxMiny.start
					) {
						//求（像素）y最大值
						orgMaxMiny.start = Math.max(
							Number(item.candlePixPosition?.y) + Number(item.candleLength),
							Number(item.wickPixPosition?.y) + Number(item.wickLength)
						);
					}
					//求（像素）y最小值
					if (Math.min(Number(item.candlePixPosition?.y), Number(item.wickPixPosition?.y)) < orgMaxMiny.end) {
						orgMaxMiny.end = Math.min(Number(item.candlePixPosition?.y), Number(item.wickPixPosition?.y));
					}
				}

				_displayCandleMaxMin.start = getMin(item, Number(_displayCandleMaxMin.start)).toString();
				_displayCandleMaxMin.end = getMax(item, Number(_displayCandleMaxMin.end)).toString();

				index++;
			}
			return arrayCD;
		};

		let _displayCandleData = comp(backwardDCArr).concat(lastDisplayCandleData).concat(comp(forwardDCArr));

		let currentheight = orgMaxMiny.start - orgMaxMiny.end;
		let expendHeight = currentheight + currentheight * yAxis.initArgs.displayPadding!;
		let scale = yAxis.data.lineSize.height / expendHeight;
		let y = -orgMaxMiny.end + (currentheight * yAxis.initArgs.displayPadding!) / 2;

		setdisplayCandleData(_displayCandleData);

		setdisplayCandleMaxMin(() => {
			return _displayCandleMaxMin;
		});

		if (_displayCandleData.length !== 0) {
			setminy(y * scale);
			setyScale(scale);
			checkDynamicData(_displayCandleData);
			setupdateStamp(+new Date());
			setlastMaxMiny(orgMaxMiny);
		}
	}; */

  //进行全量更新
  const reComputAllDisplayedCandleData = function() {
    //用于显示的数据
    let result = findDataByTicks(xAxis.data.tickArr) as {
      data: IcandleData[];
      scope: numberScopeString;
    };
    if (result.data.length === 0) {
      setdisplayCandleData([]);
      checkDynamicData();
      return;
    }

    requestAnimationFrame(function() {
      //更新y轴
      yAxis.funcs.updateAxisSates(
        xAxis.data.viewSize.width,
        xAxis.data.viewSize.height,
        {
          start: Number(result.scope.start),
          end: Number(result.scope.end),
        }
      );
    });

    setdisplayCandleMaxMin(() => {
      return result.scope;
    });

    //if (xAxis.data.tickArr.length > 2000) {
    //	isEscapeItems.current = true;
    //} else {
    //	isEscapeItems.current = false;
    //}

    let index = 0;
    let updateTag = newGuid();
    for (let item of result.data) {
      //如果已经打开了省略模式
      if (isEscapeItems.current) {
        if (Number(index) % 2) {
          //没有被省略的进行全量计算
          item = computSingalCandledata(item, result.scope);
          item.isEscaped = false;
          item.updateTag = updateTag;
        } else {
          //省略过的只收集数据
          computSingalCandledataMini(item);
          item.isEscaped = true;
        }
      } else {
        //全部进行全量计算
        item = computSingalCandledata(item, result.scope);
        item.isEscaped = false;
        item.updateTag = updateTag;
      }
      index++;
    }

    setdisplayCandleData(result.data);
    setviewSize(xAxis.data.viewSize);

    if (result.data.length !== 0) {
      let scale =
        xAxis.data.linePosition.y /
        (xAxis.data.linePosition.y! * yAxis.initArgs.displayPadding! +
          xAxis.data.linePosition.y);
      let y = (xAxis.data.linePosition.y! * yAxis.initArgs.displayPadding!) / 2;
      setminy(y * scale);
      setyScale(scale);
      setorg_displayCandleMaxMin(result.scope);
      setcurrentGUIDUpdateTag(updateTag);
      checkDynamicData(result.data);
      setupdateStamp(+new Date());
      setlastMaxMiny({
        start: xAxis.data.linePosition.y,
        end: 0,
      });
    }
  };

  const checkDynamicData = async function(data?: IcandleData[]) {
    if (typeof data === 'undefined') {
      return;
    }
    //如果当前缩放、拖动超过所有内存中数据能显示的范围
    //判断是否为动态数据加载模式
    if (
      initArgs.dynamicData!.enabled! &&
      !isStaticData &&
      !stopDynamicFetching
    ) {
      if (typeof data !== 'undefined') {
        if (Number(data[0].time) - Number(xAxis.data.tickArr[0].value) > 0) {
          //往下拉取数据
          lunchDynamicData(Number(data[0].time));
        }
      } else {
        lunchDynamicData(
          Number(xAxis.data.tickArr[xAxis.data.tickArr.length - 1].value)
        );
      }
    }
  };

  /**
   * 缩放的更新
   */
  const scaleUpdate = function() {
    if (!isUpdateing.current) {
      isUpdateing.current = true;
      //如果数据太多就设置为简便更新
      if (xAxis.data.tickArr.length > 500) {
        setisDQuickUpdateing(true);
        isQuickUpdateing.current = true;
      } else {
        setisDQuickUpdateing(false);
        isQuickUpdateing.current = false;
      }

      if (isQuickUpdateing.current) {
        updateThrottlereComputAllDisplayedCandleData(function() {
          reComputAllDisplayedCandleData();
          xAxis.funcs.setx(0);
        }, 50);
      } else {
        reComputAllDisplayedCandleData();
        xAxis.funcs.setx(0);
      }
      isUpdateing.current = false;
    }
  };

  /**
   * 移动的更新
   */
  const moveUpdate = function() {
    if (!isUpdateing.current) {
      isUpdateing.current = true;
      //如果数据太多就设置为简便更新
      if (xAxis.data.tickArr.length > 500) {
        setisDQuickUpdateing(true);
        isQuickUpdateing.current = true;
      } else {
        setisDQuickUpdateing(false);
        isQuickUpdateing.current = false;
      }
      if (isQuickUpdateing.current) {
        updatePartialCandleDataV3();
      } else {
        updatePartialCandleDataV3();
      }
      isUpdateing.current = false;
    }
  };

  /**
   * 更新最末尾的Candle
   */
  let updateLatestCandleData = function(candleItem: IcandleUpdateItem): void {
    setstreamData(candleItem);
  };

  let updateStreamData = function() {
    if (!isFinishedInit) {
      return;
    }
    if (displayCandleData.length === 0) {
      return;
    }
    if (streamData === null) {
      return;
    }
    if (latestCandleItem === null) {
      return null;
    }

    let { time, open, close, high, low, volume, isMergeMode } = {
      ...streamData,
    };

    //将新进来的数据的时间，归零到格林威治时间
    if (baseConfig.timeZone!.dataSourceTimeZone === 'local') {
      time = Number(new Date(time).getTime());
    } else {
      time = anyTimeToGMT0000ToTarget(
        Number(new Date(time).getTime()),
        baseConfig.timeZone!.dataSourceTimeZone!,
        baseConfig.timeZone!.displayTimeZone!
      );
    }
    let _displayCandleData = [...displayCandleData];
    let currentRoundTime = xAxis.data.currentTimeType?.roundingFunction!(
      Number(time),
      baseConfig!.timeZone!.displayTimeZone!
    )!;
    let _latestCandleItem = { ...latestCandleItem };
    let isNew = false;
    _latestCandleItem.isEscaped = false;

    let isChangeDisplayCandleArr = false;

    //如果只是更新现有的
    if (currentRoundTime === _latestCandleItem?.time!) {
      //是否为快速合并模式
      if (typeof isMergeMode !== 'undefined' && isMergeMode === true) {
        _latestCandleItem.close = close;
        _latestCandleItem.high = Math.max(
          Number(_latestCandleItem.high),
          Number(close)
        );
        _latestCandleItem.low = Math.min(
          Number(_latestCandleItem.low),
          Number(close)
        );
        _latestCandleItem.volume = volume;
      } else {
        _latestCandleItem.time = currentRoundTime;
        //_latestCandleItem.open = open!; //可以不用填open的，如果用户数据源没设置好还能兼容一下
        _latestCandleItem.close = close!;
        _latestCandleItem.high = high!;
        _latestCandleItem.low = low!;
        _latestCandleItem.volume = volume;
      }

      //匹配displayCandleData
      for (var i = _displayCandleData.length - 1; i > -1; i--) {
        if (_displayCandleData[i].time === currentRoundTime) {
          _latestCandleItem.currentTick = _displayCandleData[i].currentTick;

          _latestCandleItem = computSingalCandledata(
            _latestCandleItem,
            org_displayCandleMaxMin,
            true
          );
          _latestCandleItem.updateTag = currentGUIDUpdateTag;
          _displayCandleData[i] = _latestCandleItem;
          isChangeDisplayCandleArr = true;
          _latestCandleItem.updateTag = '0';
          break;
        }
      }
    } else if (currentRoundTime > Number(_latestCandleItem?.time!)) {
      //如果是下一个时间刻度
      //是否为快速合并模式
      if (typeof isMergeMode !== 'undefined' && isMergeMode === true) {
        _latestCandleItem.time = currentRoundTime;
        _latestCandleItem.open = close;
        _latestCandleItem.close = close;
        _latestCandleItem.high = close;
        _latestCandleItem.low = close;
        _latestCandleItem.volume = volume;
      } else {
        _latestCandleItem.time = currentRoundTime;
        _latestCandleItem.open = open!;
        _latestCandleItem.close = close!;
        _latestCandleItem.high = high!;
        _latestCandleItem.low = low!;
        _latestCandleItem.volume = volume;
        _latestCandleItem.updateTag = '0';
      }

      //查找ticks
      for (var i = xAxis.data.tickArr.length - 1; i > -1; i--) {
        let tick = xAxis.data.tickArr[i];
        if (tick.value === _latestCandleItem.time) {
          _latestCandleItem.currentTick = tick;
          break;
        }
      }

      _latestCandleItem = computSingalCandledata(
        _latestCandleItem,
        org_displayCandleMaxMin,
        true
      );
      _latestCandleItem.updateTag = currentGUIDUpdateTag;

      //在可见范围内更新，不可见就不更新
      if (
        xAxis.data.currentTimeScope.start <= currentRoundTime &&
        xAxis.data.currentTimeScope.end >= currentRoundTime
      ) {
        _displayCandleData.push(_latestCandleItem);
        isChangeDisplayCandleArr = true;
      }

      isNew = true;
    } else {
      //既不等于
      //又不大于
      //那就有可能是上次时间类型的数据流响应 直接忽略
      return;
    }

    allComputedCandleData.current[currentRoundTime] = _latestCandleItem;
    setvolumChartViewMax(
      Math.max(Number(_latestCandleItem.volume), volumChartViewMax)
    );
    setlatestCandleItem({ ..._latestCandleItem });
    if (!isNew) {
      let newMaxMin = {
        start: Math.min(
          Number(displayCandleMaxMin.start),
          Number(_latestCandleItem.close)
        ).toString(),
        end: Math.max(
          Number(displayCandleMaxMin.end),
          Number(_latestCandleItem.close)
        ).toString(),
      };
      if (
        newMaxMin.start !== displayCandleMaxMin.start ||
        newMaxMin.end !== displayCandleMaxMin.end
      ) {
        setfetchDataStemp(+new Date());
      } else {
        if (isChangeDisplayCandleArr) {
          setdisplayCandleData(_displayCandleData);
        }
        //更新tooltip
        setupdateStamp(+new Date());
      }
    } else {
      //可见范围内的话就移动一下
      if (
        xAxis.data.currentTimeScope.start <= currentRoundTime &&
        xAxis.data.currentTimeScope.end >= currentRoundTime
      ) {
        xAxis.funcs.moveContainer!(
          0,
          0 -
            (_latestCandleItem!.currentTick!.pixSpace!.end -
              _latestCandleItem!.currentTick!.pixSpace!.start),
          true
        );
      }
      if (isChangeDisplayCandleArr) {
        setdisplayCandleData(_displayCandleData);
      }
      //更新tooltip
      setupdateStamp(+new Date());
    }

    return _latestCandleItem;
  };

  /**
   * 更新最末尾的tooltip
   */
  let updateLatestCandleTooltip = function() {
    if (orgCandleData.length !== 0 && displayCandleData.length !== 0) {
      var dataItem: IcandleData;
      if (latestCandleItem === null) {
        if (isStaticData) {
          let soted = orgCandleData.sort(function(a, b) {
            return getRightDate(a.time) - getRightDate(b.time);
          });
          let intTime = xAxis.data.currentTimeType!.roundingFunction!(
            getRightDate(orgCandleData[orgCandleData.length - 1].time!),
            baseConfig.timeZone!.displayTimeZone!
          )!;
          dataItem = allComputedCandleData.current[intTime] as IcandleData;
        } else {
          dataItem = allComputedCandleData.current[
            displayCandleData[displayCandleData.length - 1].time
          ] as IcandleData;
        }
      } else {
        dataItem = latestCandleItem;
      }

      if (typeof dataItem !== 'undefined') {
        let copyedItem = { ...dataItem };

        let orgScope = { ...displayCandleMaxMin };
        ////这里的数据是给tooltip计算的
        let edgeScope = yAxis.funcs.expandDataSpanceEdge(orgScope);
        computSingalCandledata(copyedItem, edgeScope.dataScope);
        copyedItem.updateTag = currentGUIDUpdateTag;

        let _tooltipState: IToolTipItem = {
          position: {
            x: 0,
            y: (function() {
              if (Number(copyedItem.close) > Number(copyedItem.open)) {
                return copyedItem.candlePixPosition!.y!;
              }
              return (
                copyedItem.candlePixPosition!.y! + copyedItem.candleLength!
              );
            })(),
          },
          length: xAxis.data.lineSize.width,
          value: copyedItem.close,
          displayValue: new _bigNumber(copyedItem.close).toFixed(displayFix),
          relatedTickItem: null,
          size: getSpaceSize(
            initArgs.candleStyles!.currentPriceTooltip!.lineSize!,
            viewSize.width
          ),
        };

        setlatestCandleToolTip(_tooltipState);

        setlatestCandleItem(copyedItem);

        let currentHeight =
          volumChartPixHeight * (Number(copyedItem.volume) / volumChartViewMax);
        let _latestVolumeToolTip: IToolTipItem = {
          position: {
            x: 0,
            y: xAxis.data.linePosition.y - currentHeight,
          },
          length: xAxis.data.lineSize.width,
          value: copyedItem.volume,
          displayValue: new _bigNumber(copyedItem.volume).toFixed(displayFix),
          relatedTickItem: null,
          size: getSpaceSize(
            initArgs.candleStyles!.volumChart?.currentPriceTooltip.lineSize!,
            viewSize.width
          ),
        };
        setlatestVolumeToolTip(_latestVolumeToolTip);
      }
    }
  };

  /**
   * 视图范围内最末尾的candle
   */
  let updateLatestdisplayLatestCandle = function() {
    if (displayLatestCandle !== null) {
      let edgeScope = yAxis.funcs.expandDataSpanceEdge(displayCandleMaxMin);
      let _displayLatestCandle = computSingalCandledata(
        { ...displayLatestCandle },
        edgeScope.dataScope,
        true
      );
      _displayLatestCandle.updateTag = currentGUIDUpdateTag;
      if (_displayLatestCandle.isEscaped! === true) {
        return;
      }
      let _tooltipState: IToolTipItem = {
        position: {
          x: 0,
          y: (function() {
            let y = 0;
            if (
              Number(_displayLatestCandle.close) >
              Number(_displayLatestCandle.open)
            ) {
              y = _displayLatestCandle.candlePixPosition!.y!;
            } else {
              y =
                _displayLatestCandle.candlePixPosition!.y! +
                _displayLatestCandle.candleLength!;
              if (isNaN(y)) {
                y = _displayLatestCandle.candlePixPosition!.y! + 0;
              }
            }
            return y;
          })(),
        },
        length: xAxis.data.lineSize.width,
        value: _displayLatestCandle.close,
        displayValue: new _bigNumber(_displayLatestCandle.close).toFixed(
          displayFix
        ),
        relatedTickItem: null,
        size: getSpaceSize(
          initArgs.candleStyles!.viewLastPriceTooltip!.lineSize!,
          viewSize.width
        ),
      };
      setlatestdisplayLatestCandle(_tooltipState);

      let currentHeight =
        volumChartPixHeight *
        (Number(_displayLatestCandle.volume) / volumChartViewMax);
      let _latestdisplayLatestVolume: IToolTipItem = {
        position: {
          x: 0,
          y: xAxis.data.linePosition.y - currentHeight,
        },
        length: xAxis.data.lineSize.width,
        value: _displayLatestCandle.volume,
        displayValue: new _bigNumber(_displayLatestCandle.volume).toFixed(
          displayFix
        ),
        relatedTickItem: null,
        size: getSpaceSize(
          initArgs.candleStyles!.volumChart?.viewLastPriceTooltip.lineSize!,
          viewSize.width
        ),
      };
      setlatestdisplayLatestVolume(_latestdisplayLatestVolume);
    }
  };

  let getCurrentCursorCandle = function() {
    if (
      xAxis.data.tooltipIsShow &&
      typeof xAxis.data.tooltipState !== 'undefined' &&
      xAxis.data.tooltipState !== null &&
      typeof xAxis.data.tooltipState!.relatedTickItem !== 'undefined' &&
      xAxis.data.tooltipState!.relatedTickItem !== null
    ) {
      let key = xAxis.data.tooltipState!.relatedTickItem!.value!.toString();
      let item = allComputedCandleData.current[key] as IcandleItem;
      setCursorCandleItem(item);
    }
  };

  let workerReciveMessage = function(e: MessageEvent<any>) {
    let data = e.data;

    if (data.message === 'setdisplayLatestCandle') {
      setdisplayLatestCandle(data.data);
      return;
    }

    if (data.message === 'not found') {
      //没找到
      setdisplayCandleData([]);
      checkDynamicData();
      return;
    }

    if (data.message === 'updateYaxis') {
      requestAnimationFrame(function() {
        //更新y轴
        yAxis.funcs.updateAxisSates(
          xAxis.data.viewSize.width,
          xAxis.data.viewSize.height,
          {
            start: Number(data.data.start),
            end: Number(data.data.end),
          }
        );
      });
      return;
    }

    if (data.message === 'finishWork') {
      let currentheight = data.data.orgMaxMiny.start - data.data.orgMaxMiny.end;
      let expendHeight =
        currentheight + currentheight * yAxis.initArgs.displayPadding!;
      let scale = yAxis.data.lineSize.height / expendHeight;
      let y =
        -data.data.orgMaxMiny.end +
        (currentheight * yAxis.initArgs.displayPadding!) / 2;
      //
      setdisplayCandleData(data.data.result.data);
      //
      setdisplayCandleMaxMin(data.data.result.scope);
      //
      if (data.data.result.data.length !== 0) {
        setminy(y * scale);
        setyScale(scale);
        checkDynamicData(data.data.result.data);
        setupdateStamp(+new Date());
      }
      return;
    }
  };

  let openMoveWorker = function() {
    mWorker.current = new Worker(
      new URL('../webWorkers/moveWorker', import.meta.url)
    );
    mWorker.current.addEventListener('message', (e: MessageEvent<any>) => {
      seworkMessage(e);
    });
  };

  /**
   * ==================================Effects===============================
   */
  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (typeof workMessage !== 'undefined') {
        workerReciveMessage(workMessage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [workMessage]
  );
  useEffect(function(): ReturnType<React.EffectCallback> {
    if (isMounted === false) {
      setIsMounted(true);
      if (
        typeof initArgs.staticData !== 'undefined' &&
        initArgs.staticData!.length > 0
      ) {
        setisStaticData(true);
      } else {
        setisStaticData(false);
      }
      //openMoveWorker();
    }
    return function(): void {
      setIsMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //这里专门用于第一次载入时的更新
  useEffect(
    function(): ReturnType<React.EffectCallback> {
      //静态模式是依据initArgs.staticData.length 进行的
      //如果initArgs.staticData.length > 0 就说明现在需要进行静态数据的展示
      if (
        isMounted === true &&
        xAxis.data.isFinishedInit &&
        yAxis.data.isFinishedInit
      ) {
        //记录一下当前的时间类型
        setcurrentTimeTypeName(xAxis.data.currentTimeType?.name!);
        setcurrentTimeZone(baseConfig.timeZone!);
        //如果是静态数据
        if (isStaticData) {
          //初始化静态数据
          initStaticData();
        } else if (initArgs.dynamicData!.enabled) {
          //否则进入动态数据模式
          initDynamicData();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [xAxis.data.isFinishedInit, yAxis.data.isFinishedInit, xAxis.data.InitStemp]
  );

  //数据动态载入完成以后需要重新渲染一下数据
  useEffect(
    function(): ReturnType<React.EffectCallback> {
      //静态模式是依据initArgs.staticData.length 进行的
      //如果initArgs.staticData.length > 0 就说明现在需要进行静态数据的展示
      if (fetchDataStemp !== -1) {
        moveUpdate();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [fetchDataStemp]
  );

  useEffect(
    function(): ReturnType<React.EffectCallback> {
      //静态模式是依据initArgs.staticData.length 进行的
      //如果initArgs.staticData.length > 0 就说明现在需要进行静态数据的展示
      if (initDyStamp !== -1) {
        window.requestAnimationFrame(function() {
          scaleUpdate();
        });
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [initDyStamp]
  );

  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (xAxis.data.xAxisUpdateMoveMentTimeStamp !== -1) {
        moveUpdate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [xAxis.data.xAxisUpdateMoveMentTimeStamp]
  );

  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (xAxis.data.xAxisUpdateScaleTimeStamp !== -1) {
        window.requestAnimationFrame(function() {
          scaleUpdate();
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [xAxis.data.xAxisUpdateScaleTimeStamp]
  );

  //这里专门用于计算完candle之后的操作
  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (updateStamp !== -1) {
        updateLatestCandleTooltip();
        updateLatestdisplayLatestCandle();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [updateStamp]
  );

  useEffect(
    function(): ReturnType<React.EffectCallback> {
      getCurrentCursorCandle();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [xAxis.data.tooltipState]
  );

  //ws动态更新第一个数据
  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (
        streamData !== null &&
        //
        streamData.time !== -1 &&
        isFinishedInit === true &&
        isFetchingData === false
      ) {
        updateStreamData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [streamData, isFinishedInit, isFetchingData]
  );

  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (TempDynamicData !== null) {
        updateDynamicData([...TempDynamicData]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [TempDynamicData]
  );

  return {
    data: {
      displayCandleData,
      isDQuickUpdateing,
      latestCandleToolTip,
      latestdisplayLatestCandle,
      volumChartPixHeight,
      volumChartViewMax,
      latestVolumeToolTip,
      latestdisplayLatestVolume,
      cursorCandleItem,
      latestCandleItem,
      yScale,
      miny,
      updateStamp,
      isFetchingData,
      isFinishedInit,
    },
    funcs: {
      updateLatestCandleData,
      setinitArgs: function(arg: IdataConfig) {
        setinitArgs(lodash.merge(initArgs, arg));
      },
    },
    initArgs,
  };
};

export default useCandleHook;
