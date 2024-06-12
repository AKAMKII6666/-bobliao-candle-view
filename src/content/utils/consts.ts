import _bigNumber from "bignumber.js";
import { IcandleData, jsonObjectType, numberScope, pointCoord, tickItem } from "../interface/itemsInterFace";

/**
 * 格式化时间
 */
export const formatDate = function (date: Date, format: string): string {
	date = date || new Date();
	format = format || "yyyy-MM-dd HH:mm:ss";
	var result = format
		.replace("yyyy", date.getFullYear().toString())
		.replace("yy", date.getFullYear().toString().substring(2, 4))
		.replace("MM", (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1).toString())
		.replace("dd", (date.getDate() < 10 ? "0" : "") + date.getDate().toString())
		.replace("HH", (date.getHours() < 10 ? "0" : "") + date.getHours().toString())
		.replace("mm", (date.getMinutes() < 10 ? "0" : "") + date.getMinutes().toString())
		.replace("ss", (date.getSeconds() < 10 ? "0" : "") + date.getSeconds().toString());

	return result;
};

/**
 * 将本地时间时区换算成格林威治时间 GMT+0000
 * 例如输入时间为 GMT +0800
 * 它将会把时间换算成 GMT+0000  也就是减去八小时
 */
export const localTimeToGMT0000 = function (time: number | Date) {
	let date = new Date(time);
	let timeZone = Math.abs(date.getTimezoneOffset() / 60);
	date.setHours(date.getHours() - timeZone);
	return date.getTime();
};
export const GMT0000TolocalTime = function (time: number | Date) {
	let date = new Date(time);
	let timeZone = Math.abs(date.getTimezoneOffset() / 60);
	date.setHours(date.getHours() + timeZone);
	return date.getTime();
};

/**
 * 将某个时间重置到GMT +0000 然后再变换到GMT +0n00
 */
export const anyTimeToGMT0000ToTarget = function (
	time: number | Date,
	currentTimeZone: number | "local",
	targetTimeZone: number | "local"
) {
	let date = new Date(time);
	let localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
	if (targetTimeZone === "local") {
		targetTimeZone = localtimeZone;
	}

	if (currentTimeZone === "local") {
		currentTimeZone = localtimeZone;
	}
	date.setHours(date.getHours() - currentTimeZone + targetTimeZone);
	return date.getTime();
};

/**
 * 获得长度
 *@param  {number | string} arg 输入值
 *@param  {number} length 相对的长度
 *@returns {number}
 */
export const getSpaceSize = function (arg: number | string, length: number): number {
	if (typeof arg === "string" && arg === "auto") {
		return length;
	}

	if (typeof arg === "string" && arg.indexOf("%") !== -1) {
		let value = Number(arg.replace("%", "")) / 100;
		return length * value;
	}

	if (typeof arg === "string" && arg.indexOf("px") !== -1) {
		return Number(arg.replace("px", ""));
	}

	if (typeof arg === "number" || !isNaN(Number(arg))) {
		return Number(arg);
	}

	console.log("no useful length !");
	return 0;
};

/**
 * 通过时间 计算点的坐标
 *@param  {number} value 值
 *@param  {number} length 数组长度
 *@param {number} pixWidth 像素长度
 */
export const getRangePosition = function (
	//
	value: number,
	range: numberScope,
	pixWidth: number
): number {
	return pixWidth * ((value - range.start) / (range.end - range.start));
};

/**
 * 求tick的交集
 */
export const findIntersection = function (tickArr: tickItem[], scope: numberScope): tickItem[] {
	let result: tickItem[] = [];

	if (tickArr.length < 300) {
		for (var item of tickArr) {
			if (Number(item.value) >= scope.start && Number(item.value) <= scope.end) {
				result.push(item);
			}
		}
	} else {
		result = findIntersectionByKey(tickArr as unknown as jsonObjectType[], scope, "value") as unknown as tickItem[];
	}

	return result;
};

/**
 * 求candle的交集
 */
export const findIntersectionCandle = function (candle: IcandleData[], scope: numberScope): IcandleData[] {
	let result: IcandleData[] = [];
	//for (var item of candle) {
	//	if (Number(item.time) >= scope.start && Number(item.time) <= scope.end) {
	//		result.push(item);
	//	}
	//}

	result = findIntersectionByKey(candle as unknown as jsonObjectType[], scope, "time") as unknown as IcandleData[];

	return result;
};

//换算区块链的数字单位
export const shiftNumber = function (_number: string | number, _shiftLength: number): string {
	return new _bigNumber(_number).times(new _bigNumber(10).exponentiatedBy(_shiftLength)).toString();
};

/**
 * 将数组快速转换为hash表
 */
export const arrayToHash = function (arr: any[], keyProperty: string) {
	return arr.reduce((hash, obj, index) => {
		hash[obj[keyProperty]] = obj;
		hash[obj[keyProperty]].index = index;
		return hash;
	}, {});
};

/**
 * 获得某个数字的小数位数
 */
export const getDecimalOfLength = function (num: number): number {
	return new _bigNumber(num).decimalPlaces() as number;
};

/**
 * 获得某个数字的整数位数
 */
export const getIntOfLength = function (num: number): number {
	return new _bigNumber(num).toFixed(0).toString().length;
};

/**
 * 把任意整数的末尾数字算成整数例如 12345678  算成 12345680
 * “四舍五入”到最近的十的倍数 (N的倍数)
 */
export const roundToNearestTenBigNumber = function (num: string, intGetPar: number) {
	// 创建BigNumber实例
	const bigNum = new _bigNumber(num);

	// 计算末尾数字（余数）
	const remainder = bigNum.modulo(intGetPar);

	// 判断并进行相应的加减操作
	// 注意：BigNumber的运算需要使用其提供的方法，不能直接使用+-*/等运算符
	let result;
	// 加（intGetPar - 余数）
	//永远往大推，不要往小推
	result = bigNum.minus(remainder).plus(intGetPar);

	// 确保结果是整数，虽然一般操作结果已经是整数，但可做显式转换
	return result.integerValue(_bigNumber.ROUND_FLOOR).toString();
};

//这是我自己写的

///**
// * 查找点
// * @param inputArr 查找的数组
// * @param target 目标数字
// * @param key 目标字段
// * @param targetType 找 起点<= 目标  还是 终点>= 目标
// */
//function binarySearchByKey(
//	inputArr: jsonObjectType[],
//	target: number,
//	key: string,
//	targetType: "forStart" | "forEnd"
//): number | null {
//	if (targetType === "forStart" && target <= (inputArr[0][key] as number)) {
//		return 0;
//	}
//	if (targetType === "forEnd" && target >= (inputArr[inputArr.length - 1][key] as number)) {
//		return inputArr.length - 1;
//	}
//
//	let left = 0;
//	let right = inputArr.length - 1;
//	let mid: number;
//
//	while (left <= right) {
//		mid = left + Math.floor((right - left) / 2);
//
//		if (inputArr[mid][key] === target) {
//			if (targetType === "forStart") {
//				// 查找起点，继续在左半边查找可能更小的索引
//				right = mid - 1;
//			} else {
//				// 查找终点，继续在右半边查找可能更大的索引
//				left = mid + 1;
//			}
//		} else if ((inputArr[mid][key] as number) < target) {
//			left = mid + 1;
//		} else {
//			right = mid - 1;
//		}
//	}
//
//	// 根据targetType确定返回值
//	if (targetType === "forStart") {
//		// 如果是查找起点，返回第一个大于等于target的索引
//		return left;
//	} else {
//		// 如果是查找终点，由于循环结束时left已经越过了目标，所以返回right
//		return right;
//	}
//}
//
///**
// * 二分查找法求交集
// * @param inputArr 输入数组
// * @param scope 范围
// * @param key 目标字段
// * @returns 返回找到的数组范围
// */
//export const findIntersectionByKey = function (
//	inputArr: jsonObjectType[],
//	scope: numberScope,
//	key: string
//): jsonObjectType[] {
//	let startIndex = binarySearchByKey(inputArr, scope.start, key, "forStart");
//	let endIndex = binarySearchByKey(inputArr, scope.end, key, "forEnd");
//
//	// 确保索引有效
//	startIndex = startIndex === null ? 0 : startIndex;
//	endIndex = endIndex === null ? inputArr.length - 1 : endIndex;
//
//	// 调整endIndex以确保包含等于scope.end的元素
//	if (endIndex < inputArr.length && inputArr[endIndex][key] < scope.end) {
//		endIndex++;
//	}
//
//	return inputArr.slice(startIndex, endIndex);
//};

/**
 * 查找点
 * @param inputArr 查找的数组
 * @param target 目标数字
 * @param key 目标字段
 * @param targetType 找 起点=== 目标  还是 终点=== 目标
 */
export function binarySearchByKeyStrictlyEqual(
	inputArr: jsonObjectType[] | number[],
	target: number,
	targetType: "forStart" | "forEnd",
	key?: string
): number | null {
	let getItem = function (arr: any[], index: any): number {
		if (typeof arr[index] === "object" || typeof key !== "undefined") {
			return Number(arr[index][key!]);
		}
		return Number(arr[index]);
	};
	if (targetType === "forStart" && target === (getItem(inputArr, 0) as number)) {
		return 0;
	}
	if (targetType === "forEnd" && target === (getItem(inputArr, inputArr.length - 1) as number)) {
		return inputArr.length - 1;
	}

	let left = 0;
	let right = inputArr.length - 1;
	let mid: number;

	while (left <= right) {
		mid = left + Math.floor((right - left) / 2);

		if (getItem(inputArr, mid) === target) {
			if (targetType === "forStart") {
				// 查找起点，继续在左半边查找可能更小的索引
				right = mid - 1;
			} else {
				// 查找终点，继续在右半边查找可能更大的索引
				left = mid + 1;
			}
		} else if ((getItem(inputArr, mid) as number) < target) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	// 根据targetType确定返回值
	if (targetType === "forStart") {
		// 如果是查找起点，返回第一个大于等于target的索引
		return left;
	} else {
		// 如果是查找终点，由于循环结束时left已经越过了目标，所以返回right
		return right;
	}
}

//ai帮忙优化的版本，确实优雅一些
/**
 * 查找点
 * @param inputArr 查找的数组
 * @param target 目标数字
 * @param key 目标字段
 * @param targetType 找 起点<= 目标  还是 终点>= 目标
 */
function binarySearchByKey(
	inputArr: jsonObjectType[],
	target: number,
	key: string,
	targetType: "forStart" | "forEnd"
): number | null {
	if (typeof inputArr[0] === "undefined") {
		return -1;
	}
	if (targetType === "forStart" && target <= (inputArr[0][key] as number)) {
		return 0;
	}
	if (targetType === "forEnd" && target >= (inputArr[inputArr.length - 1][key] as number)) {
		return inputArr.length - 1;
	}

	let left = 0;
	let right = inputArr.length - 1;
	let mid: number;

	while (left <= right) {
		mid = left + Math.floor((right - left) / 2);

		if (inputArr[mid][key] === target) {
			if (targetType === "forStart") {
				// 查找起点，继续在左半边查找可能更小的索引
				right = mid - 1;
			} else {
				// 查找终点，继续在右半边查找可能更大的索引
				left = mid + 1;
			}
		} else if ((inputArr[mid][key] as number) < target) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	// 根据targetType确定返回值
	if (targetType === "forStart") {
		// 如果是查找起点，返回第一个大于等于target的索引
		return left;
	} else {
		// 如果是查找终点，由于循环结束时left已经越过了目标，所以返回right
		return right;
	}
}

/**
 * 二分查找法求交集
 * @param inputArr 输入数组
 * @param scope 范围
 * @param key 目标字段
 * @returns 返回找到的数组范围
 */
export const findIntersectionByKey = function (
	inputArr: jsonObjectType[],
	scope: numberScope,
	key: string
): jsonObjectType[] {
	let startIndex = binarySearchByKey(inputArr, scope.start, key, "forStart");
	let endIndex = binarySearchByKey(inputArr, scope.end, key, "forEnd");

	// 确保索引有效
	startIndex = startIndex === null ? 0 : startIndex;
	endIndex = endIndex === null ? inputArr.length - 1 : endIndex;
	if (typeof inputArr[endIndex] === "undefined") {
		return [];
	}
	if (endIndex < inputArr.length && (inputArr[endIndex][key] as number) < scope.end) {
		// 调整endIndex以确保包含等于scope.end的元素
		endIndex++;
	}

	return inputArr.slice(startIndex, endIndex);
};

/**
 * 获得正确的时间
 */
export const getRightDate = function (dateTime: number | string) {
	if (typeof dateTime === "number") {
		return dateTime;
	}
	return +new Date(dateTime);
};

//千分位分割
export const thousandsSplit = function (num: number): string {
	var numStr = num.toString().trim().split(".")[0].split("");
	var output = "";

	var j = 0;
	for (var i = numStr.length - 1; i > -1; i--) {
		if (j % 3 == 0 && j != 0) {
			output = numStr[i] + "," + output;
		} else {
			output = numStr[i] + output;
		}
		j++;
	}
	if (num.toString().split(".")[1]) {
		output += "." + num.toString().split(".")[1];
	}
	return output;
};

//通过语言信息获得单位换算
export const getUnitNumber = function (_num: number, _lan: string, _fix: number): string {
	if (typeof _lan === "undefined") {
		_lan = "en";
	}

	if (typeof _fix === "undefined") {
		_fix = 0;
	}

	var result: string = _num.toString();

	switch (_lan) {
		case "en":
			result = translateNumberT(_num, _fix);
			break;
		case "ja":
			result = translateNumberF(_num, _fix);
			break;
		case "ko":
			result = translateNumberK(_num, _fix);
			break;
		case "zh":
			result = translateNumberF(_num, _fix);
			break;
		case "ru":
			result = translateNumberT(_num, _fix);
			break;
	}

	return result;
};

//韩文
export const translateNumberK = function (_num: number, _fix: number): string {
	if (typeof _fix === "undefined") {
		_fix = 0;
	}
	var num = new _bigNumber(_num).toFixed().split(".");
	var nIARR = num[0].split("");
	var nFARR = [];
	if (typeof num[1] !== "undefined") {
		nFARR = num[1].split("");
	}

	/**
	 * 万 = 10000
	 * 亿 = 100000000
	 * 兆 = 1000000000000
	 */

	//兆 = 1000000000000
	if (nIARR.length >= 13) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(12).toFixed()).toFixed(_fix, 1);
		return num + "조";
	}

	//亿 = 100000000
	if (nIARR.length >= 9) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(8).toFixed()).toFixed(_fix, 1);
		return num + "억";
	}

	//万 = 10000
	if (nIARR.length >= 5) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(4).toFixed()).toFixed(_fix, 1);
		return num + "만";
	}

	return new _bigNumber(_num).toFixed(_fix);
};

//中文
export const translateNumberF = function (_num: number, _fix: number): string {
	if (typeof _fix === "undefined") {
		_fix = 0;
	}
	var num = new _bigNumber(_num).toFixed().split(".");
	var nIARR = num[0].split("");
	var nFARR = [];
	if (typeof num[1] !== "undefined") {
		nFARR = num[1].split("");
	}

	/**
	 * 百 = 100
	 * 千 = 1000
	 * 万 = 10000
	 * 百万 = 1000000
	 * 千万 = 10000000
	 * 亿 = 100000000
	 * 兆 = 1000000000000
	 */

	//兆 = 1000000000000
	if (nIARR.length >= 13) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(12).toFixed()).toFixed(_fix, 1);
		return num + "兆";
	}

	//亿 = 100000000
	if (nIARR.length >= 9) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(8).toFixed()).toFixed(_fix, 1);
		return num + "亿";
	}

	//千万 = 10000000
	if (nIARR.length >= 8) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(7).toFixed()).toFixed(_fix, 1);
		return num + "千萬";
	}

	//百万 = 1000000
	if (nIARR.length >= 7) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(6).toFixed()).toFixed(_fix, 1);
		return num + "百萬";
	}

	//万 = 10000
	if (nIARR.length >= 5) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(4).toFixed()).toFixed(_fix, 1);
		return num + "萬";
	}

	return new _bigNumber(_num).toFixed(_fix);
};

//换算单位英文
export const translateNumberT = function (_num: number, _fix: number): string {
	if (typeof _fix === "undefined") {
		_fix = 0;
	}
	var num = new _bigNumber(_num).toFixed().split(".");
	var nIARR = num[0].split("");
	var nFARR = [];
	if (typeof num[1] !== "undefined") {
		nFARR = num[1].split("");
	}

	/**
	 * k = 1000
	 * m = 10000000
	 * b = 1000000000
	 * t = 10000000000
	 */

	//t = 10000000000
	if (nIARR.length >= 11) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(10).toFixed()).toFixed(_fix, 1);
		return num + "T";
	}

	//b = 1000000000
	if (nIARR.length >= 10) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(9).toFixed()).toFixed(_fix, 1);
		return num + "B";
	}

	//m = 1000000
	if (nIARR.length >= 7) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(6).toFixed()).toFixed(_fix, 1);
		return num + "M";
	}

	//k = 1000
	if (nIARR.length >= 4) {
		let num = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(3).toFixed()).toFixed(_fix, 1);
		return num + "K";
	}
	return new _bigNumber(_num).toFixed(_fix);
};

/**
 * 求等差数列的个数
 * @param length 数组的长度
 * @param step 每隔几个元素取一个元素
 * @returns 返回共可取多少元素
 */
export const countSelectedElements = function (length: number, step: number): number {
	// 计算数组长度
	const arrayLength = length;
	step = step + 1;

	// 如果步长大于数组长度，则没有元素可以挑选
	if (step >= arrayLength) {
		return 0;
	}

	// 计算挑选的元素数量
	// 使用整数除法向下取整
	const count = Math.floor((arrayLength - 1) / step) + 1;

	return count;
};

/**
 * 检查数组里的元素是否有重复
 */
export const hasDuplicates = function (arr: any) {
	// 创建一个Set对象，它会自动去除重复的元素
	const uniqueSet = new Set(arr);

	// 如果Set的大小小于数组的长度，说明数组中有重复元素
	return uniqueSet.size !== arr.length;
};

//获得两点之间的距离
export const getLength = function (p1: pointCoord, p2: pointCoord): number {
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};
