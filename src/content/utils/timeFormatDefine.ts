import { findRoundTimeCountFromArrayDataItem, jsonObjectType } from "../interface/itemsInterFace";
import { ItimeFormat, TtimeType } from "../interface/timeDefineInterFace";
import { binarySearchByKeyStrictlyEqual, countSelectedElements } from "./consts";
import { LANGUAGES } from "./languages";

export const getshifttime = function (hourShift?: number | "local") {
	if (typeof hourShift === "undefined" || hourShift === 0) {
		return 0;
	}
	let date = new Date();
	let localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
	if (hourShift === "local") {
		hourShift = localtimeZone;
	}
	return 1000 * 60 * 60 * hourShift;
};

/**
 *1分钟
 */
export const ONEMIN: ItimeFormat = {
	name: "1min",
	lang: "oneMin",
	timeGap: 1000 * 60,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);
		// 求整
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 1);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 1);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 1 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 1 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},

	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 20, end: +new Date() + 1000 * 60 * 10 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 20, end: +new Date(initTime) + 1000 * 60 * 10 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getMinutes() + LANGUAGES[lan]!.timeFormat.unitminute;
	},
};

/**
 *2分钟
 */
export const TWO: ItimeFormat = {
	name: "2min",
	lang: "twoMin",
	timeGap: 1000 * 60 * 2,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);

		for (let time = 0; time < 60; time += 2) {
			if (now.getMinutes() >= time) {
				now.setMinutes(time);
			}
		}
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 2);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 2);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 2 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 2 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},

	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 2 * 2, end: +new Date() + 1000 * 60 * 10 * 2 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 20 * 2, end: +new Date(initTime) + 1000 * 60 * 10 * 2 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getMinutes() + LANGUAGES[lan]!.timeFormat.unitminute;
	},
};

/**
 *3分钟
 */
export const THREE: ItimeFormat = {
	name: "3min",
	lang: "threeMin",
	timeGap: 1000 * 60 * 3,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);

		for (let time = 0; time < 60; time += 3) {
			if (now.getMinutes() >= time) {
				now.setMinutes(time);
			}
		}
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 3);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 3);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 3 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 3 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},

	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 2 * 3, end: +new Date() + 1000 * 60 * 10 * 3 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 20 * 3, end: +new Date(initTime) + 1000 * 60 * 10 * 3 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getMinutes() + LANGUAGES[lan]!.timeFormat.unitminute;
	},
};

/**
 *5分钟
 */
export const FMIN: ItimeFormat = {
	name: "5min",
	lang: "fiveMin",
	timeGap: 1000 * 60 * 5,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);
		// 求整
		if (now.getMinutes() >= 55) {
			now.setMinutes(55);
		} else if (now.getMinutes() >= 50) {
			now.setMinutes(50);
		} else if (now.getMinutes() >= 45) {
			now.setMinutes(45);
		} else if (now.getMinutes() >= 40) {
			now.setMinutes(40);
		} else if (now.getMinutes() >= 35) {
			now.setMinutes(35);
		} else if (now.getMinutes() >= 30) {
			now.setMinutes(30);
		} else if (now.getMinutes() >= 25) {
			now.setMinutes(25);
		} else if (now.getMinutes() >= 20) {
			now.setMinutes(20);
		} else if (now.getMinutes() >= 15) {
			now.setMinutes(15);
		} else if (now.getMinutes() >= 10) {
			now.setMinutes(10);
		} else if (now.getMinutes() >= 5) {
			now.setMinutes(5);
		} else if (now.getMinutes() >= 0) {
			now.setMinutes(0);
		}
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 5);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 5);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 5 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 5 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},

	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 2 * 5, end: +new Date() + 1000 * 60 * 10 * 5 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 20 * 5, end: +new Date(initTime) + 1000 * 60 * 10 * 5 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getMinutes() + LANGUAGES[lan]!.timeFormat.unitminute;
	},
};

/**
 *10分钟
 */
export const TENMIN: ItimeFormat = {
	name: "10min",
	lang: "tenMin",
	timeGap: 1000 * 60 * 10,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);
		// 求整
		if (now.getMinutes() >= 50) {
			now.setMinutes(50);
		} else if (now.getMinutes() >= 40) {
			now.setMinutes(40);
		} else if (now.getMinutes() >= 30) {
			now.setMinutes(30);
		} else if (now.getMinutes() >= 20) {
			now.setMinutes(20);
		} else if (now.getMinutes() >= 10) {
			now.setMinutes(10);
		} else if (now.getMinutes() >= 0) {
			now.setMinutes(0);
		}
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 10);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 10);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 10 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 10 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},

	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 2 * 10, end: +new Date() + 1000 * 60 * 10 * 10 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 20 * 10, end: +new Date(initTime) + 1000 * 60 * 10 * 10 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getMinutes() + LANGUAGES[lan]!.timeFormat.unitminute;
	},
};

/**
 *15分钟
 */
export const FIFMIN: ItimeFormat = {
	name: "15min",
	lang: "fifteenMin",
	timeGap: 1000 * 60 * 15,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);
		// 求整
		if (now.getMinutes() >= 45) {
			now.setMinutes(45);
		} else if (now.getMinutes() >= 30) {
			now.setMinutes(30);
		} else if (now.getMinutes() >= 15) {
			now.setMinutes(15);
		} else if (now.getMinutes() >= 0) {
			now.setMinutes(0);
		}
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 15);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 15);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加15分钟
		date.setMinutes(date.getMinutes() + 15 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减15分钟
		date.setMinutes(date.getMinutes() - 15 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 15 * 18, end: +new Date() + 1000 * 60 * 15 * 6 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 15 * 18, end: +new Date(initTime) + 1000 * 60 * 15 * 6 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getMinutes() + LANGUAGES[lan]!.timeFormat.unitminute;
	},
};

/**
 *30分钟
 */
export const HALFHOUR: ItimeFormat = {
	name: "30min",
	lang: "halfhour",
	timeGap: 1000 * 60 * 30,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);
		// 设置分钟和秒数为0
		if (now.getMinutes() > 30) {
			now.setMinutes(30);
		} else {
			now.setMinutes(0);
		}
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加半小时
		date.setMinutes(date.getMinutes() + 30);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减半小时
		date.setMinutes(date.getMinutes() - 30);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);

		// 加半小时
		date.setMinutes(date.getMinutes() + 30 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减半小时
		date.setMinutes(date.getMinutes() - 30 * times);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 30 * 18, end: +new Date() + 1000 * 60 * 30 * 6 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 30 * 18, end: +new Date(initTime) + 1000 * 60 * 30 * 6 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		if (date.getMinutes() === 30) {
			return date.getHours() + LANGUAGES[lan]!.timeFormat.unithalfOur;
		}

		return date.getHours() + LANGUAGES[lan]!.timeFormat.unitoclock;
	},
};

/**
 *x小时
 */
export const HOUR: ItimeFormat = {
	name: "1h",
	lang: "oneHour",
	timeGap: 1000 * 60 * 60,
	/* 取整 */
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);

		// 设置分钟和秒数为0
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime();
		return result;
	},
	/* 往未来查找一个单位 */
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减去一个小时的毫秒数
		date.setHours(date.getHours() + 1);

		// 设置分钟和秒数为0
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找一个单位 */
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减去一个小时的毫秒数
		date.setHours(date.getHours() - 1);

		// 设置分钟和秒数为0
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减去一个小时的毫秒数
		date.setHours(date.getHours() + 1 * times);

		// 设置分钟和秒数为0
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取时间对象
		const date = new Date(timeStamp);
		// 减去一个小时的毫秒数
		date.setHours(date.getHours() - 1 * times);

		// 设置分钟和秒数为0
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 返回上一个小时的时间戳（毫秒）
		return date.getTime();
	},
	/* 获得初始化的时间范围 */
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 60 * 18, end: +new Date() + 1000 * 60 * 60 * 6 };
		} else {
			return { start: +new Date(initTime) - 1000 * 60 * 60 * 18, end: +new Date(initTime) + 1000 * 60 * 60 * 6 };
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		return date.getHours() + LANGUAGES[lan]!.timeFormat.unithour;
	},
};

/**
 *天
 */
export const DAY: ItimeFormat = {
	name: "1d",
	lang: "oneday",
	timeGap: 1000 * 60 * 60 * 24,
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);

		// 设置分钟和秒数为0
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime() + getshifttime(hourShift);
		return result;
	},
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setDate(date.getDate() + 1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setDate(date.getDate() - 1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setDate(date.getDate() + 1 * times);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setDate(date.getDate() - 1 * times);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 60 * 24 * 20, end: +new Date() + 1000 * 60 * 60 * 24 * 10 };
		} else {
			return {
				start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 20,
				end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 10,
			};
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);
		//date.setHours(date.getHours() + plusTimeArea);

		if (date.getDate() === 1) {
			return date.getDate() + LANGUAGES[lan]!.timeFormat.unitdayst;
		}
		if (date.getDate() === 2) {
			return date.getDate() + LANGUAGES[lan]!.timeFormat.unitdaynd;
		}
		if (date.getDate() === 3) {
			return date.getDate() + LANGUAGES[lan]!.timeFormat.unitdayrd;
		}
		return date.getDate() + LANGUAGES[lan]!.timeFormat.unitday;
	},
};

/**
 *周
 */
export const WEEK: ItimeFormat = {
	name: "1w",
	lang: "oneWeek",
	timeGap: 1000 * 60 * 60 * 24 * 7,
	roundingFunction: function (timeStamp, hourShift) {
		const today = new Date(timeStamp);
		const currentDay = today.getDay(); // 获取今天是周几（0-6，0代表周日）
		const offsetDays = currentDay === 0 ? -6 : 1 - currentDay; // 计算偏移天数，如果周日则减6天，其他情况加1减去当前天数
		const monday = new Date(today.setDate(today.getDate() + offsetDays));
		return monday.getTime() + getshifttime(hourShift);
	},
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 将时间戳转换为Date对象
		const date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000

		// 设置日期到下周一
		date.setDate(date.getDate() + 7);
		// 设置时间为下周一的凌晨0点
		date.setHours(0, 0, 0, 0);
		// 返回下周一时间戳（转换回秒级时间戳）
		return Math.floor(date.getTime()) + getshifttime(hourShift);
	},
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 将时间戳转换为Date对象
		const date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000

		// 设置日期到上周一
		date.setDate(date.getDate() - 7);
		// 设置时间为上周一的凌晨0点
		date.setHours(0, 0, 0, 0);
		// 返回上周一时间戳（转换回秒级时间戳）
		return Math.floor(date.getTime()) + getshifttime(hourShift);
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 将时间戳转换为Date对象
		const date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000

		// 设置日期到下周一
		date.setDate(date.getDate() + 7 * times);
		// 设置时间为下周一的凌晨0点
		date.setHours(0, 0, 0, 0);
		// 返回下周一时间戳（转换回秒级时间戳）
		return Math.floor(date.getTime()) + getshifttime(hourShift);
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 将时间戳转换为Date对象
		const date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000

		// 设置日期到上周一
		date.setDate(date.getDate() - 7 * times);
		// 设置时间为上周一的凌晨0点
		date.setHours(0, 0, 0, 0);
		// 返回上周一时间戳（转换回秒级时间戳）
		return Math.floor(date.getTime()) + getshifttime(hourShift);
	},
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return { start: +new Date() - 1000 * 60 * 60 * 24 * 7 * 5, end: +new Date() + 1000 * 60 * 60 * 24 * 7 * 5 };
		} else {
			return {
				start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 7 * 5,
				end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 7 * 5,
			};
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);

		if (date.getDate() === 1) {
			return date.getDate() + LANGUAGES[lan]!.timeFormat.unitdayst;
		}
		if (date.getDate() === 2) {
			return date.getDate() + LANGUAGES[lan]!.timeFormat.unitdaynd;
		}
		if (date.getDate() === 3) {
			return date.getDate() + LANGUAGES[lan]!.timeFormat.unitdayrd;
		}
		return date.getDate() + LANGUAGES[lan]!.timeFormat.unitday;
	},
};

/**
 *月
 */
export const MONTH: ItimeFormat = {
	name: "1m",
	lang: "onemonth",
	timeGap: 1000 * 60 * 60 * 24 * 30,
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);

		// 设置日期为1
		now.setDate(1);
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime() + getshifttime(hourShift);
		return result;
	},
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setMonth(date.getMonth() + 1);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setMonth(date.getMonth() - 1);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setMonth(date.getMonth() + 1 * times);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setMonth(date.getMonth() - 1 * times);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return {
				start: +new Date() - 1000 * 60 * 60 * 24 * 30 * 8,
				end: +new Date() + 1000 * 60 * 60 * 24 * 30 * 4,
			};
		} else {
			return {
				start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 30 * 8,
				end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 30 * 4,
			};
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);

		switch (date.getMonth()) {
			case 0:
				return LANGUAGES[lan]!.timeFormat.January;
			case 1:
				return LANGUAGES[lan]!.timeFormat.February;
			case 2:
				return LANGUAGES[lan]!.timeFormat.March;
			case 3:
				return LANGUAGES[lan]!.timeFormat.April;
			case 4:
				return LANGUAGES[lan]!.timeFormat.May;
			case 5:
				return LANGUAGES[lan]!.timeFormat.June;
			case 6:
				return LANGUAGES[lan]!.timeFormat.July;
			case 7:
				return LANGUAGES[lan]!.timeFormat.August;
			case 8:
				return LANGUAGES[lan]!.timeFormat.September;
			case 9:
				return LANGUAGES[lan]!.timeFormat.October;
			case 10:
				return LANGUAGES[lan]!.timeFormat.November;
			case 11:
				return LANGUAGES[lan]!.timeFormat.December;
		}
	},
};

/**
 *年
 */
export const YEAR: ItimeFormat = {
	name: "1y",
	lang: "oneYear",
	timeGap: 1000 * 60 * 60 * 24 * 30 * 12,
	roundingFunction: function (timeStamp, hourShift) {
		// 获取当前时间
		const now = new Date(timeStamp);

		// 设置日期为1
		now.setMonth(0);
		now.setDate(1);
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		// 获取当前整小时的时间戳（毫秒）
		let result = now.getTime() + getshifttime(hourShift);
		return result;
	},
	forwardSingleUnit: function (timeStamp, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setFullYear(date.getFullYear() + 1);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	backwardSingleUnit: function (timeStamp, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setFullYear(date.getFullYear() - 1);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	/* 往未来查找n个单位 */
	forwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setFullYear(date.getFullYear() + 1 * times);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	/* 往过去查找n个单位 */
	backwardTimeUnit: function (timeStamp, times, hourShift) {
		// 获取当前时间
		const date = new Date(timeStamp);

		// 设置分钟和秒数为0
		date.setFullYear(date.getFullYear() - 1 * times);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		// 获取当前整小时的时间戳（毫秒）
		let result = date.getTime() + getshifttime(hourShift);
		return result;
	},
	getInitTimeScope: function (initTime: string) {
		if (initTime === "now") {
			return {
				start: +new Date() - 1000 * 60 * 60 * 24 * 30 * 12 * 3,
				end: +new Date() + 1000 * 60 * 60 * 24 * 30 * 12 * 3,
			};
		} else {
			return {
				start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 30 * 12 * 3,
				end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 30 * 12 * 3,
			};
		}
	},
	formatter: function (value, lan, hourShift) {
		// 获取时间对象
		const date = new Date(value);

		return date.getFullYear() + LANGUAGES[lan]!.timeFormat.year;
	},
};

/**
 * 时间类型对应表
 */
export const timeTypeMap: { [propName: string]: ItimeFormat } = {
	"1min": ONEMIN,
	"2min": TWO,
	"3min": THREE,
	"5min": FMIN,
	"10min": TENMIN,
	"15min": FIFMIN,
	"30min": HALFHOUR,
	"1h": HOUR,
	"1d": DAY,
	"1w": WEEK,
	"1m": MONTH,
	"1y": YEAR,
};

/**
 *通过时间对象查找某个数组里的时间为特定时间对象的整数的个数
 */
export const findRoundTimeCountFromArray = function (
	array: jsonObjectType[] | number[],
	timeShift: number | "local",
	currentType: TtimeType,
	key?: string
): findRoundTimeCountFromArrayDataItem[] | null {
	let getItemTime = function (arr: any[], index: any): number {
		if (typeof array[index] === "object" || typeof key !== "undefined") {
			return Number(arr[index][key!]);
		}
		return Number(arr[index]);
	};

	//获得当前的显示时间时区
	//某些情况下需要错位时间
	//例如当前时间间隔设置的是1d 那么数据时间可能指示到了08:00:00 而不是0点，所以
	//这种情况下需要计算这个查找位移
	//像1d以下的时间就不用计算
	let getTimeShift = function () {
		if (currentType === "1d" || currentType === "1w" || currentType === "1m" || currentType === "1y") {
			return timeShift;
		}
		return 0;
	};

	if (array.length === 0) {
		return null;
	}

	let result: findRoundTimeCountFromArrayDataItem[] = [];
	let start = getItemTime(array, 0);
	let end = getItemTime(array, array.length - 1);

	let gap = end - start;

	let _timeTypeMap: { [propName: string]: ItimeFormat } = {};

	//小于一小时
	if (gap < 1000 * 60 * 60) {
		_timeTypeMap = { "1min": ONEMIN, "5min": FIFMIN, "10min": TENMIN };
	}

	//大于1小时，但是小于5小时
	if (gap >= 1000 * 60 * 60 && gap < 1000 * 60 * 60 * 5) {
		_timeTypeMap = { "15min": FIFMIN, "30min": HALFHOUR, "1h": HOUR };
	}

	//大于5小时，但是小于35小时
	if (gap >= 1000 * 60 * 60 * 5 && gap < 1000 * 60 * 60 * 35) {
		_timeTypeMap = { "30min": HALFHOUR, "1h": HOUR };
	}

	//大于35小时，但是小于15天
	if (gap >= 1000 * 60 * 60 * 35 && gap < 1000 * 60 * 60 * 24 * 15) {
		_timeTypeMap = { "1h": HOUR, "1d": DAY };
	}

	//大于15天，但是小于55天
	if (gap >= 1000 * 60 * 60 * 24 * 15 && gap < 1000 * 60 * 60 * 24 * 55) {
		_timeTypeMap = { "1d": DAY, "1m": MONTH };
	}

	//大于55天，但是小于1年
	if (gap >= 1000 * 60 * 60 * 24 * 35 && gap < 1000 * 60 * 60 * 24 * 365) {
		_timeTypeMap = { "1d": DAY, "1m": MONTH, "1y": YEAR };
	}

	//大于1年
	if (gap >= 1000 * 60 * 60 * 24 * 365) {
		_timeTypeMap = { "1m": MONTH, "1y": YEAR };
	}
	//查找数量
	let findRoundTimeCount = function (timeType: ItimeFormat): { count: number; startIndex: number; step: number } {
		let result_c = { count: 0, startIndex: 0, step: 0 };
		//先取整
		let round = timeType.roundingFunction(end, getTimeShift());
		//然后从后往前找，看看有没有这个时间
		let latestEqualIndex = binarySearchByKeyStrictlyEqual(array, round, "forEnd", key);
		//如果找到的这个下标都已经在数组里过半了，就直接返回0 ，说明这种时间格式不合适
		if (latestEqualIndex === null || latestEqualIndex === -1) {
			return result_c;
		}
		if (latestEqualIndex <= array.length / 2) {
			result_c.count = 1;
			result_c.startIndex = latestEqualIndex!;
			result_c.step = 99999999999999999;
			return result_c;
		}
		//找到了它就根据它继续找下一个，获得跨度
		let nextRound = timeType.backwardSingleUnit(getItemTime(array, latestEqualIndex), getTimeShift());
		//找到下一个这个时间类型的整数点
		let nextEqualIndex = binarySearchByKeyStrictlyEqual(array.slice(0, latestEqualIndex), nextRound, "forEnd", key);
		if (nextEqualIndex === null || nextEqualIndex === -1) {
			result_c.count = 1;
			result_c.startIndex = latestEqualIndex!;
			result_c.step = 99999999999999999;
			return result_c;
		}
		//计算两个时间下标点之间的差，获得step
		let step = latestEqualIndex - 1 - nextEqualIndex;
		//计算按照这种时间格式进行排列时的个数
		let stepCount = countSelectedElements(latestEqualIndex + 1, step);

		result_c.count = stepCount;
		result_c.startIndex = latestEqualIndex;
		result_c.step = step;
		return result_c;
	};

	for (let timeTypeItem in _timeTypeMap) {
		if (
			_timeTypeMap.hasOwnProperty(timeTypeItem) &&
			timeTypeItem !== "1w" &&
			timeTypeItem !== "2min" &&
			timeTypeItem !== "3min"
		) {
			let item = _timeTypeMap[timeTypeItem];
			result.push({ ...findRoundTimeCount(item), type: item });
		}
	}
	return result;
};
