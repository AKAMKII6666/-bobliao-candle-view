import { useState, useRef, useEffect } from "react";

/**
 * 防抖钩子
 */
const useDebounce = function () {
	/**
	 * ============================state===========================
	 */
	const [isMounted, setIsMounted] = useState<boolean>(false);

	const debounceFunction = useRef<(() => void) | null>(null);
	const debounceTimeOut = useRef<NodeJS.Timeout | null>(null);

	/**
	 * ==========================函数==============================
	 */

	const debounce = function (_func: () => void, _time: number) {
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
				debounceFunction.current!();
				debounceFunction.current = null;
			}
		}, _time);
	};

	/**
	 * ==================================Effects===============================
	 */
	useEffect(function (): ReturnType<React.EffectCallback> {
		if (isMounted === false) {
			setIsMounted(true);
		}
		return function (): void {
			// 清理定时器，防止组件卸载后定时器仍执行导致内存泄漏
			if (debounceTimeOut.current !== null) {
				clearTimeout(debounceTimeOut.current);
				debounceTimeOut.current = null;
			}
			debounceFunction.current = null;
			setIsMounted(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return debounce;
};

export default useDebounce;
