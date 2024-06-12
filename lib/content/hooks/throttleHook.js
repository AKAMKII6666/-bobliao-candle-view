import { useState, useRef, useEffect } from "react";
/**
 * 节流钩子
 */
const useThrottle = function () {
    /**
     * ============================state===========================
     */
    const [isMounted, setIsMounted] = useState(false);
    const ThrottleFunction = useRef(null);
    const ThrottleTimeOut = useRef(null);
    /**
     * ==========================函数==============================
     */
    const Throttle = function (_func, _time) {
        if (typeof _time === "undefined") {
            _time = 500;
        }
        if (_time === 0) {
            _func();
            return;
        }
        ThrottleFunction.current = _func;
        if (ThrottleTimeOut.current === null) {
            ThrottleTimeOut.current = setTimeout(function () {
                if (ThrottleFunction.current !== null) {
                    ThrottleFunction.current();
                    ThrottleFunction.current = null;
                    ThrottleTimeOut.current = null;
                }
            }, _time);
        }
    };
    /**
     * ==================================Effects===============================
     */
    useEffect(function () {
        if (isMounted === false) {
            setIsMounted(true);
        }
        return function () {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return Throttle;
};
export default useThrottle;
//# sourceMappingURL=throttleHook.js.map