import { createContext, useState, useContext, useRef, useCallback, useEffect, FC, ReactElement } from "react";

/**
 * 节流钩子
 */
const useThrottle = function () {
	/**
	 * ============================state===========================
	 */
	const [isMounted, setIsMounted] = useState<boolean>(false);

	const ThrottleFunction = useRef<(() => void) | null>(null);
	const ThrottleTimeOut = useRef<NodeJS.Timeout | null>(null);

	/**
	 * ==========================函数==============================
	 */

	const Throttle = function (_func: () => void, _time: number) {
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
					ThrottleFunction.current!();
					ThrottleFunction.current = null;
					ThrottleTimeOut.current = null;
				}
			}, _time);
		}
	};

	/**
	 * ==================================Effects===============================
	 */
	useEffect(function (): ReturnType<React.EffectCallback> {
		if (isMounted === false) {
			setIsMounted(true);
		}
		return function (): void {
			setIsMounted(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return Throttle;
};

export default useThrottle;
