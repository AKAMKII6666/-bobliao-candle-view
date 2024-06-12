import { useState, useRef, useEffect } from "react";
/**
 * 防抖钩子
 */
const useDebounce = function () {
    /**
     * ============================state===========================
     */
    const [isMounted, setIsMounted] = useState(false);
    const debounceFunction = useRef(null);
    const debounceTimeOut = useRef(null);
    /**
     * ==========================函数==============================
     */
    const debounce = function (_func, _time) {
        if (typeof _time === "undefined") {
            _time = 500;
        }
        if (_time === 0) {
            _func();
            return;
        }
        debounceFunction.current = _func;
        if (debounceTimeOut.current !== null) {
            clearTimeout(debounceTimeOut.current);
        }
        debounceTimeOut.current = setTimeout(function () {
            if (debounceFunction.current !== null) {
                debounceFunction.current();
                debounceFunction.current = null;
            }
        }, _time);
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
    return debounce;
};
export default useDebounce;
//# sourceMappingURL=debounceHook.js.map