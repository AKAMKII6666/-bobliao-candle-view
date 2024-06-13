/// <reference types="react" />
import * as CVbasicShapesInterFace from './content/interface/basicShapesInterFace';
import * as CVconfigInterFaces from './content/interface/configInterFaces';
import * as CVcontextInterFace from './content/interface/contextInterFace';
import * as CVhooksInterFace from './content/interface/hooksInterFace';
import * as CVitemsInterFace from './content/interface/itemsInterFace';
import * as CVtimeDefineInterFace from './content/interface/timeDefineInterFace';
declare const _default: {
    CandleView: import("react").NamedExoticComponent<import("./content").iprops>;
    useCandleView: CVcontextInterFace.TcandleViewContext;
    useCandleViewContext: import("./content/context/candleViewContext").IuseCandleViewContext;
    candleViewContext: import("react").Context<CVcontextInterFace.IcandleViewContext>;
    CVbasicShapesInterFace: typeof CVbasicShapesInterFace;
    CVconfigInterFaces: typeof CVconfigInterFaces;
    CVcontextInterFace: typeof CVcontextInterFace;
    CVhooksInterFace: typeof CVhooksInterFace;
    CVitemsInterFace: typeof CVitemsInterFace;
    CVtimeDefineInterFace: typeof CVtimeDefineInterFace;
};
export default _default;
