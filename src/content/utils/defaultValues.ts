import { IPixiShapeRectangle } from '../interface/basicShapesInterFace';
import {
  ITooltipConfig,
  Iaxis,
  IdataConfig,
  IuseCandleView,
  Tlanguage,
} from '../interface/configInterFaces';
import { IToolTipItem, tickItem } from '../interface/itemsInterFace';
import { formatDate, getUnitNumber } from './consts';
import * as PIXI from 'pixi.js';

/**
 *tooltip的初始值
 */
export const DEFAULTTOOLTIPVALUES: ITooltipConfig = {
  enabled: true,
  color: '#02121c',
  lineSize: 0.5,
  dashLength: 4,
  spaceLength: 3,
  label: {
    fontsize: 12,
    color: '#ffffff',
    backGroundColor: '#454545',
    backGroundAlpha: 1,
    formatter: function(axisItem: tickItem | IToolTipItem) {
      //yyyy-MM-dd HH:mm:ss
      return formatDate(new Date(axisItem.value), 'yyyy-MM-dd HH:mm:ss');
    },
  },
};

/**
 *轴组件的初始值
 */
export const DEFAULTAXISVALUES: Iaxis = {
  labelSpace: '90px',
  fontColor: '#454545',
  fontSize: '12px',
  netLineColor: '#dedede',
  lineColor: '#454545',
  tickColor: '#454545',
  tickLength: '3px',
  netLineMaxCount: 34,
  netLineMinCount: 3,
  netLineSize: 1,
  lineSize: 1,
  tickSize: 1,
  backgroundColor: '#ffffff',
  tooltip: DEFAULTTOOLTIPVALUES,
  initTimePoint: 'now',
  displayPadding: 0.1,
};

/**
 *数据组件的初始值
 */
export const DEFAULTDATAVALUES: IdataConfig = {
  staticData: [],
  dynamicData: {
    enabled: false,
    showLoading: false,
    stopUserOperateWhenLoading: false,
    dataFetchCountPreTime: 160,
    dataFetchCallback: async function(time, start, end) {
      return [];
    },
  },
  candleStyles: {
    candleWidth: '80%',
    wickWidth: '1px',
    candleRiseColor: '#7de17c',
    candleFallColor: '#c85656',
    wickRiseColor: '#7de17c',
    wickFallColor: '#c85656',
    //当前最末尾价格的tooltip设置
    currentPriceTooltip: {
      enabled: true,
      color: '#b9b42c',
      lineSize: 0.5,
      dashLength: 8,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: '#ffffff',
        backGroundColor: '#b9b42c',
        backGroundAlpha: 1,
        formatter: function(axisItem: tickItem | IToolTipItem) {
          axisItem = axisItem as IToolTipItem;
          //yyyy-MM-dd HH:mm:ss
          return axisItem.displayValue!;
        },
      },
    },
    //当前显示范围的最末尾的tooltip设置
    viewLastPriceTooltip: {
      enabled: true,
      color: '#b9b42c',
      lineSize: 0.5,
      dashLength: 8,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: '#ffffff',
        backGroundColor: '#826abe',
        backGroundAlpha: 0.5,
        formatter: function(axisItem: tickItem | IToolTipItem) {
          axisItem = axisItem as IToolTipItem;
          //yyyy-MM-dd HH:mm:ss
          return axisItem.displayValue!;
        },
      },
    },
    /**
     *交易量
     */
    volumChart: {
      /**
       *是否显示交易量
       */
      enabled: true,

      /**
       *交易量图表高度
       */
      volumeChartHeight: '30%',

      /**
       *交易量图表透明度
       */
      alpha: 0.6,
      /**
       *上升时显示的颜色
       */
      riseColor: '#d6dfc5',
      /**
       *下降时显示的颜色
       */
      fallColor: '#c7c7c7',

      //当前最末尾价格的tooltip设置
      currentPriceTooltip: {
        enabled: true,
        color: '#b9b42c',
        lineSize: 0.5,
        dashLength: 8,
        spaceLength: 3,
        label: {
          fontsize: 12,
          color: '#ffffff',
          backGroundColor: '#b9b42c',
          backGroundAlpha: 1,
          formatter: function(
            axisItem: tickItem | IToolTipItem,
            language: Tlanguage = 'en'
          ) {
            axisItem = axisItem as IToolTipItem;
            //yyyy-MM-dd HH:mm:ss
            return getUnitNumber(Number(axisItem.displayValue), language, 5);
          },
        },
      },
      //当前显示范围的最末尾的tooltip设置
      viewLastPriceTooltip: {
        enabled: true,
        color: '#b9b42c',
        lineSize: 0.5,
        dashLength: 8,
        spaceLength: 3,
        label: {
          fontsize: 12,
          color: '#ffffff',
          backGroundColor: '#826abe',
          backGroundAlpha: 0.5,
          formatter: function(
            axisItem: tickItem | IToolTipItem,
            language: Tlanguage = 'en'
          ) {
            axisItem = axisItem as IToolTipItem;
            //yyyy-MM-dd HH:mm:ss
            return getUnitNumber(Number(axisItem.displayValue), language, 5);
          },
        },
      },
    },
  },
};

/**
 *组件的初始值
 初始值的定义和注释和可以去参看接口定义
 */
export const DEFAULTVALUES: IuseCandleView = {
  title: '交易对:🚀BNB/USDT🚀这是⚡CandleView⚡组件示例V2',
  enableTitle: true,
  enableinfo: true,
  timeFormat: '1h',
  width: 'auto',
  height: '500px',
  backgroundColor: '#fff',
  resizeDebounceTime: 100,
  language: 'zh',
  timeZone: {
    dataSourceTimeZone: 0,
    fetchConditionTimeZone: 0,
    displayTimeZone: 0,
  },
  yAxis: {
    labelSpace: '90px',
    formatter: function(axisItem: tickItem) {
      return axisItem.displayValue!.toString();
    },
    fontColor: '#454545',
    fontSize: '12px',
    netLineColor: '#dedede',
    lineColor: '#454545',
    tickColor: '#454545',
    tickLength: '3px',
    netLineMaxCount: 14,
    netLineMinCount: 3,
    displayPadding: 0.3,
    tooltip: {
      enabled: true,
      color: '#02121c',
      lineSize: 0.5,
      dashLength: 4,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: '#ffffff',
        backGroundColor: '#454545',
        backGroundAlpha: 1,
        formatter: function(axisItem: tickItem | IToolTipItem) {
          axisItem = axisItem as IToolTipItem;
          //yyyy-MM-dd HH:mm:ss
          return axisItem.displayValue!;
        },
      },
    },
  },
  xAxis: {
    labelSpace: '30px',
    fontColor: '#454545',
    fontSize: '12px',
    netLineColor: '#dedede',
    lineColor: '#454545',
    tickColor: '#454545',
    tickLength: '4px',
    netLineMaxCount: 30,
    netLineMinCount: 0,
    netLineSize: 0.5,
    initTimePoint: 'now',
    displayPadding: 0,
    tooltip: {
      enabled: true,
      color: '#02121c',
      lineSize: 0.5,
      dashLength: 4,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: '#ffffff',
        backGroundColor: '#454545',
        backGroundAlpha: 1,
        formatter: function(axisItem: tickItem | IToolTipItem) {
          //yyyy-MM-dd HH:mm:ss
          return formatDate(new Date(axisItem.value), 'yyyy-MM-dd HH:mm:ss');
        },
      },
    },
  },
  data: DEFAULTDATAVALUES,
};
