/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  FC,
  ReactElement,
  memo,
  LegacyRef,
  useMemo,
} from 'react';
import {
  Stage,
  Graphics,
  Container,
  Text,
  ParticleContainer,
  Sprite,
} from '@pixi/react';
import * as PIXI from 'pixi.js';
import { DashedLine, KlineBatching, Rectangle } from '../utils/basicShaps';
import { useCandleViewPixiContext } from '..';
import { getSpaceSize } from '../utils/consts';

/**
 * 传入参数
 */
export interface iprops {}

export interface wickAndCandle {
  wick: ReactElement[];
  candle: ReactElement[];
}

const Data: FC<iprops> = ({}, _ref): ReactElement => {
  //===============useHooks=================
  const CVData = useCandleViewPixiContext();

  //===============state====================
  const [isMounted, setIsMounted] = useState<boolean>(false);

  //===============static===================
  const labelPadding: number = 10;

  //===============ref======================
  const tooltipTextRef = useRef<any>(null);

  const getColor = function(
    status: 'rise' | 'fall',
    type: 'wick' | 'candle'
  ): string {
    if (status === 'rise' && type === 'wick') {
      return CVData.initArgs.data?.candleStyles?.wickRiseColor!;
    }

    if (status === 'fall' && type === 'wick') {
      return CVData.initArgs.data?.candleStyles?.wickFallColor!;
    }

    if (status === 'rise' && type === 'candle') {
      return CVData.initArgs.data?.candleStyles?.candleRiseColor!;
    }

    if (status === 'fall' && type === 'candle') {
      return CVData.initArgs.data?.candleStyles?.candleFallColor!;
    }
    return '';
  };

  //===============function=================
  /* 创建candle */
  const makeCandle = function() {
    let result: React.JSX.Element[] = [];

    for (var item of CVData.hookObjs.candleObj.data.displayCandleData) {
      result.push(
        <Rectangle
          key={item.time + '_candle'}
          color={PIXI.utils.string2hex(
            getColor(item!.candleStateus!, 'candle')
          )}
          size={{
            width: item.candleWidth!,
            height: item.candleLength!,
          }}
          position={{
            x: item.currentTick!.cPosition.x!,
            y: item.candlePixPosition!.y!,
          }}
          alignX="center"
          alignY="top"
        ></Rectangle>
      );
    }
    return result;
  };

  /* 创建wick */
  const makeWick = function() {
    let result: React.JSX.Element[] = [];
    let index = 0;
    for (var item of CVData.hookObjs.candleObj.data.displayCandleData) {
      if (!item.isEscaped!) {
        result.push(
          <Rectangle
            key={item.time + '_wick'}
            color={PIXI.utils.string2hex(
              getColor(item!.candleStateus!, 'wick')
            )}
            size={{
              width: item.wickWidth!,
              height: item.wickLength!,
            }}
            position={{
              x: item.currentTick!.cPosition.x!,
              y: item.wickPixPosition!.y!,
            }}
            alignX="center"
            alignY="top"
          ></Rectangle>
        );
      } else {
        result.push(
          <Rectangle
            key={item.time + '_wick'}
            color={0}
            size={{
              width: 0,
              height: 0,
            }}
            position={{
              x: 0,
              y: 0,
            }}
            alignX="center"
            alignY="top"
          ></Rectangle>
        );
      }
      index++;
    }

    return result;
  };

  /* 创建批渲染 */
  const makeBatchKline = function() {
    return (
      <>
        <KlineBatching
          {...{
            isDQuickUpdateing: CVData.hookObjs.candleObj.data.isDQuickUpdateing,
            wickRiseColor: CVData.initArgs.data?.candleStyles?.wickRiseColor!,
            wickFallColor: CVData.initArgs.data?.candleStyles?.wickFallColor!,
            candleRiseColor: CVData.initArgs.data?.candleStyles
              ?.candleRiseColor!,
            candleFallColor: CVData.initArgs.data?.candleStyles
              ?.candleFallColor!,
            data: CVData.hookObjs.candleObj.data.displayCandleData,
          }}
        ></KlineBatching>
      </>
    );
  };

  //===============effects==================
  useEffect(
    function(): ReturnType<React.EffectCallback> {
      if (isMounted === false) {
        setIsMounted(true);
      }
    },
    [isMounted]
  );

  useEffect(function(): ReturnType<React.EffectCallback> {
    return function(): void {
      setIsMounted(false);
    };
  }, []);

  let wc: wickAndCandle = { wick: [], candle: [] };
  let batchKLine = <></>;

  if (CVData.hookObjs.xAxisObj.data.tickArr.length > 120) {
    batchKLine = useMemo(
      function() {
        return makeBatchKline();
      },
      [
        CVData.hookObjs.candleObj.data.displayCandleData,
        CVData.hookObjs.candleObj.data.isDQuickUpdateing,
        CVData.initArgs.data!.candleStyles!.wickFallColor!,
        CVData.initArgs.data!.candleStyles!.wickFallColor!,
        CVData.initArgs.data!.candleStyles!.candleFallColor!,
        CVData.initArgs.data!.candleStyles!.candleRiseColor!,
        { ...CVData.initArgs.timeZone },
      ]
    );
  } else {
    wc = useMemo(
      function() {
        let result: wickAndCandle = { wick: [], candle: [] };
        if (CVData.hookObjs.candleObj.data.displayCandleData.length === 0) {
          result.wick = [];
          result.candle = [];
          return result;
        }

        if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
          result.candle = makeCandle();
        }
        result.wick = makeWick();
        return result;
      },
      [
        CVData.hookObjs.candleObj.data.displayCandleData,
        CVData.hookObjs.candleObj.data.isDQuickUpdateing,
        CVData.initArgs.data!.candleStyles!.wickFallColor!,
        CVData.initArgs.data!.candleStyles!.wickFallColor!,
        CVData.initArgs.data!.candleStyles!.candleFallColor!,
        CVData.initArgs.data!.candleStyles!.candleRiseColor!,
        { ...CVData.initArgs.timeZone },
      ]
    );
  }

  return (
    <>
      <Container
        x={CVData.hookObjs.xAxisObj.data.x}
        y={CVData.hookObjs.candleObj.data.miny}
        scale={{ x: 1, y: CVData.hookObjs.candleObj.data.yScale }}
      >
        {(function() {
          if (CVData.hookObjs.xAxisObj.data.tickArr.length > 120) {
            return batchKLine;
          } else {
            return (
              <>
                {wc.wick}
                {wc.candle}
              </>
            );
          }
        })()}
      </Container>
    </>
  );
};

//使用memo不让其因为上级节点的更新而频繁更新
export default memo(Data);
