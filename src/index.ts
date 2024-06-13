import CandleView from './content/index';
import candleViewContext, {
  //创建自定义交易图钩子
  useCandleView,
  //在子组件中,获取交易图的context对象
  useCandleViewContext,
} from './content/context/candleViewContext';
import * as CVbasicShapesInterFace from './content/interface/basicShapesInterFace';
import * as CVconfigInterFaces from './content/interface/configInterFaces';
import * as CVcontextInterFace from './content/interface/contextInterFace';
import * as CVhooksInterFace from './content/interface/hooksInterFace';
import * as CVitemsInterFace from './content/interface/itemsInterFace';
import * as CVtimeDefineInterFace from './content/interface/timeDefineInterFace';

export default {
  CandleView,
  useCandleView,
  useCandleViewContext,
  candleViewContext,
  CVbasicShapesInterFace,
  CVconfigInterFaces,
  CVcontextInterFace,
  CVhooksInterFace,
  CVitemsInterFace,
  CVtimeDefineInterFace,
};
