/**
 * 防抖钩子
 */
declare const useDebounce: () => (_func: () => void, _time: number) => void;
export default useDebounce;
