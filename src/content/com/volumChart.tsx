/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */
import React, {
  useEffect,
  useState,
  FC,
  ReactElement,
  memo,
  useMemo,
} from 'react';
import { Container } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Rectangle } from '../utils/basicShaps';
import { useCandleViewPixiContext } from '..';

/**
 * 传入参数
 */
export interface iprops {}

const VolumChat: FC<iprops> = ({}, _ref): ReactElement => {
  //===============useHooks=================
  const CVData = useCandleViewPixiContext();

  //===============state====================
  const [isMounted, setIsMounted] = useState<boolean>(false);

  //===============function=================
  /* 创建volume */
  const makeChat = function() {
    if (!CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.enabled) {
      return [];
    }
    let result: React.JSX.Element[] = [];
    let index = 0;

    for (var item of CVData.hookObjs.candleObj.data.displayCandleData) {
      let alpha =
        CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart?.alpha;
      let currentHeight =
        CVData.hookObjs.candleObj.data.volumChartPixHeight *
        (Number(item.volume) /
          CVData.hookObjs.candleObj.data.volumChartViewMax);

      if (!item.isEscaped!) {
        result.push(
          <Rectangle
            key={item.time + '_volume'}
            color={PIXI.utils.string2hex(
              (function() {
                if (item.candleStateus === 'rise') {
                  return CVData.hookObjs.candleObj.initArgs.candleStyles!
                    .volumChart!.riseColor!;
                }
                return CVData.hookObjs.candleObj.initArgs.candleStyles!
                  .volumChart!.fallColor!;
              })()
            )}
            opacity={(function() {
              if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
                return alpha;
              }
              return 1;
            })()}
            size={{
              width: (function() {
                if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
                  return item.candleWidth!;
                }
                return 1;
              })(),
              height: currentHeight,
            }}
            position={{
              x: item.currentTick!.cPosition.x!,
              y: CVData.hookObjs.xAxisObj.data.linePosition.y,
            }}
            alignX="center"
            alignY="bottom"
          ></Rectangle>
        );
      } else {
        result.push(
          <React.Fragment key={item.time + '_volume'}></React.Fragment>
        );
      }

      index++;
    }

    return result;
  };

  /* 		const makeChat = function () {
			let result: React.JSX.Element[] = [];
			let index = 0;

			for (var item of CVData.hookObjs.candleObj.data.displayCandleData) {
				let alpha = CVData.hookObjs.candleObj.initArgs.candleStyles?.volumChart?.alpha;
				let currentHeight =
					CVData.hookObjs.candleObj.data.volumChartPixHeight *
					(Number(item.volume) / CVData.hookObjs.candleObj.data.volumChartViewMax);

				if (!item.isEscaped!) {
					result.push(
						<Sprite
							key={item.time + "_volume"}
							width={(function () {
								if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
									return item.candleWidth!;
								}
								return 1;
							})()}
							height={currentHeight}
							position={{
								x: item.currentTick!.cPosition.x!,
								y: CVData.hookObjs.xAxisObj.data.linePosition.y,
							}}
							texture={PIXI.Texture.WHITE}
							tint={PIXI.utils.string2hex(
								(function () {
									if (
										item.candleColor! ===
										CVData.hookObjs.candleObj.initArgs.candleStyles!.candleRiseColor!
									) {
										return CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.riseColor!;
									}
									return CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.fallColor!;
								})()
							)}
							alpha={(function () {
								if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
									return CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.alpha;
								}
								return 1;
							})()}
							anchor="0.5,1"
						></Sprite>
					);
				} else {
					result.push(<React.Fragment key={item.time + "_volume"}></React.Fragment>);
				}

				index++;
			}

			return result;
		}; */

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

  let chat = useMemo(
    function() {
      return makeChat();
    },
    [
      CVData.hookObjs.candleObj.data.displayCandleData,
      CVData.hookObjs.candleObj.data.isDQuickUpdateing,
      CVData.hookObjs.candleObj.data.volumChartViewMax,
      CVData.hookObjs.candleObj.data.volumChartPixHeight,
      CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.riseColor,
      CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.fallColor,
      CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.alpha,
      CVData.hookObjs.candleObj.initArgs.candleStyles!.volumChart!.enabled,
    ]
  );

  return (
    <>
      <Container x={CVData.hookObjs.xAxisObj.data.x}>{chat}</Container>
    </>
  );
};

//使用memo不让其因为上级节点的更新而频繁更新
export default memo(VolumChat);
