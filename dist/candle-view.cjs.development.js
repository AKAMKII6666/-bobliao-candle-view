'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var _bigNumber = _interopDefault(require('bignumber.js'));
var lodash = _interopDefault(require('lodash'));
var react = require('@pixi/react');
var useJquery = _interopDefault(require('@bobliao/use-jquery-hook'));
var ResizeObserver = _interopDefault(require('resize-observer-polyfill'));
var PIXI = require('pixi.js');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * 格式化时间
 */

var formatDate = function formatDate(date, format) {
  date = date || new Date();
  format = format || "yyyy-MM-dd HH:mm:ss";
  var result = format.replace("yyyy", date.getFullYear().toString()).replace("yy", date.getFullYear().toString().substring(2, 4)).replace("MM", (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1).toString()).replace("dd", (date.getDate() < 10 ? "0" : "") + date.getDate().toString()).replace("HH", (date.getHours() < 10 ? "0" : "") + date.getHours().toString()).replace("mm", (date.getMinutes() < 10 ? "0" : "") + date.getMinutes().toString()).replace("ss", (date.getSeconds() < 10 ? "0" : "") + date.getSeconds().toString());
  return result;
};
/**
 * 将某个时间重置到GMT +0000 然后再变换到GMT +0n00
 */

var anyTimeToGMT0000ToTarget = function anyTimeToGMT0000ToTarget(time, currentTimeZone, targetTimeZone) {
  var date = new Date(time);
  var localtimeZone = Math.abs(date.getTimezoneOffset() / 60);

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

var getSpaceSize = function getSpaceSize(arg, length) {
  if (typeof arg === "string" && arg === "auto") {
    return length;
  }

  if (typeof arg === "string" && arg.indexOf("%") !== -1) {
    var value = Number(arg.replace("%", "")) / 100;
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

var getRangePosition = function getRangePosition( //
value, range, pixWidth) {
  return pixWidth * ((value - range.start) / (range.end - range.start));
};
/**
 * 求tick的交集
 */

var findIntersection = function findIntersection(tickArr, scope) {
  var result = [];

  if (tickArr.length < 300) {
    for (var _iterator = _createForOfIteratorHelperLoose(tickArr), _step; !(_step = _iterator()).done;) {
      var item = _step.value;

      if (Number(item.value) >= scope.start && Number(item.value) <= scope.end) {
        result.push(item);
      }
    }
  } else {
    result = findIntersectionByKey(tickArr, scope, "value");
  }

  return result;
};
/**
 * 求candle的交集
 */

var findIntersectionCandle = function findIntersectionCandle(candle, scope) {
  var result = []; //for (var item of candle) {
  //	if (Number(item.time) >= scope.start && Number(item.time) <= scope.end) {
  //		result.push(item);
  //	}
  //}

  result = findIntersectionByKey(candle, scope, "time");
  return result;
}; //换算区块链的数字单位

var shiftNumber = function shiftNumber(_number, _shiftLength) {
  return new _bigNumber(_number).times(new _bigNumber(10).exponentiatedBy(_shiftLength)).toString();
};
/**
 * 将数组快速转换为hash表
 */

var arrayToHash = function arrayToHash(arr, keyProperty) {
  return arr.reduce(function (hash, obj, index) {
    hash[obj[keyProperty]] = obj;
    hash[obj[keyProperty]].index = index;
    return hash;
  }, {});
};
/**
 * 把任意整数的末尾数字算成整数例如 12345678  算成 12345680
 * “四舍五入”到最近的十的倍数 (N的倍数)
 */

var roundToNearestTenBigNumber = function roundToNearestTenBigNumber(num, intGetPar) {
  // 创建BigNumber实例
  var bigNum = new _bigNumber(num); // 计算末尾数字（余数）

  var remainder = bigNum.modulo(intGetPar); // 判断并进行相应的加减操作
  // 注意：BigNumber的运算需要使用其提供的方法，不能直接使用+-*/等运算符

  var result; // 加（intGetPar - 余数）
  //永远往大推，不要往小推

  result = bigNum.minus(remainder).plus(intGetPar); // 确保结果是整数，虽然一般操作结果已经是整数，但可做显式转换

  return result.integerValue(_bigNumber.ROUND_FLOOR).toString();
};
/**
 * 查找点
 * @param inputArr 查找的数组
 * @param target 目标数字
 * @param key 目标字段
 * @param targetType 找 起点=== 目标  还是 终点=== 目标
 */

function binarySearchByKeyStrictlyEqual(inputArr, target, targetType, key) {
  var getItem = function getItem(arr, index) {
    if (typeof arr[index] === "object" || typeof key !== "undefined") {
      return Number(arr[index][key]);
    }

    return Number(arr[index]);
  };

  if (targetType === "forStart" && target === getItem(inputArr, 0)) {
    return 0;
  }

  if (targetType === "forEnd" && target === getItem(inputArr, inputArr.length - 1)) {
    return inputArr.length - 1;
  }

  var left = 0;
  var right = inputArr.length - 1;
  var mid;

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
    } else if (getItem(inputArr, mid) < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  } // 根据targetType确定返回值


  if (targetType === "forStart") {
    // 如果是查找起点，返回第一个大于等于target的索引
    return left;
  } else {
    // 如果是查找终点，由于循环结束时left已经越过了目标，所以返回right
    return right;
  }
} //ai帮忙优化的版本，确实优雅一些

/**
 * 查找点
 * @param inputArr 查找的数组
 * @param target 目标数字
 * @param key 目标字段
 * @param targetType 找 起点<= 目标  还是 终点>= 目标
 */

function binarySearchByKey(inputArr, target, key, targetType) {
  if (typeof inputArr[0] === "undefined") {
    return -1;
  }

  if (targetType === "forStart" && target <= inputArr[0][key]) {
    return 0;
  }

  if (targetType === "forEnd" && target >= inputArr[inputArr.length - 1][key]) {
    return inputArr.length - 1;
  }

  var left = 0;
  var right = inputArr.length - 1;
  var mid;

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
    } else if (inputArr[mid][key] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  } // 根据targetType确定返回值


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


var findIntersectionByKey = function findIntersectionByKey(inputArr, scope, key) {
  var startIndex = binarySearchByKey(inputArr, scope.start, key, "forStart");
  var endIndex = binarySearchByKey(inputArr, scope.end, key, "forEnd"); // 确保索引有效

  startIndex = startIndex === null ? 0 : startIndex;
  endIndex = endIndex === null ? inputArr.length - 1 : endIndex;

  if (typeof inputArr[endIndex] === "undefined") {
    return [];
  }

  if (endIndex < inputArr.length && inputArr[endIndex][key] < scope.end) {
    // 调整endIndex以确保包含等于scope.end的元素
    endIndex++;
  }

  return inputArr.slice(startIndex, endIndex);
};
/**
 * 获得正确的时间
 */

var getRightDate = function getRightDate(dateTime) {
  if (typeof dateTime === "number") {
    return dateTime;
  }

  return +new Date(dateTime);
}; //千分位分割

var thousandsSplit = function thousandsSplit(num) {
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
}; //通过语言信息获得单位换算

var getUnitNumber = function getUnitNumber(_num, _lan, _fix) {
  if (typeof _lan === "undefined") {
    _lan = "en";
  }

  if (typeof _fix === "undefined") {
    _fix = 0;
  }

  var result = _num.toString();

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
}; //韩文

var translateNumberK = function translateNumberK(_num, _fix) {
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
    var _num2 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(12).toFixed()).toFixed(_fix, 1);

    return _num2 + "조";
  } //亿 = 100000000


  if (nIARR.length >= 9) {
    var _num3 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(8).toFixed()).toFixed(_fix, 1);

    return _num3 + "억";
  } //万 = 10000


  if (nIARR.length >= 5) {
    var _num4 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(4).toFixed()).toFixed(_fix, 1);

    return _num4 + "만";
  }

  return new _bigNumber(_num).toFixed(_fix);
}; //中文

var translateNumberF = function translateNumberF(_num, _fix) {
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
    var _num5 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(12).toFixed()).toFixed(_fix, 1);

    return _num5 + "兆";
  } //亿 = 100000000


  if (nIARR.length >= 9) {
    var _num6 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(8).toFixed()).toFixed(_fix, 1);

    return _num6 + "亿";
  } //千万 = 10000000


  if (nIARR.length >= 8) {
    var _num7 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(7).toFixed()).toFixed(_fix, 1);

    return _num7 + "千萬";
  } //百万 = 1000000


  if (nIARR.length >= 7) {
    var _num8 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(6).toFixed()).toFixed(_fix, 1);

    return _num8 + "百萬";
  } //万 = 10000


  if (nIARR.length >= 5) {
    var _num9 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(4).toFixed()).toFixed(_fix, 1);

    return _num9 + "萬";
  }

  return new _bigNumber(_num).toFixed(_fix);
}; //换算单位英文

var translateNumberT = function translateNumberT(_num, _fix) {
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
    var _num10 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(10).toFixed()).toFixed(_fix, 1);

    return _num10 + "T";
  } //b = 1000000000


  if (nIARR.length >= 10) {
    var _num11 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(9).toFixed()).toFixed(_fix, 1);

    return _num11 + "B";
  } //m = 1000000


  if (nIARR.length >= 7) {
    var _num12 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(6).toFixed()).toFixed(_fix, 1);

    return _num12 + "M";
  } //k = 1000


  if (nIARR.length >= 4) {
    var _num13 = new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(3).toFixed()).toFixed(_fix, 1);

    return _num13 + "K";
  }

  return new _bigNumber(_num).toFixed(_fix);
};
/**
 * 求等差数列的个数
 * @param length 数组的长度
 * @param step 每隔几个元素取一个元素
 * @returns 返回共可取多少元素
 */

var countSelectedElements = function countSelectedElements(length, step) {
  // 计算数组长度
  var arrayLength = length;
  step = step + 1; // 如果步长大于数组长度，则没有元素可以挑选

  if (step >= arrayLength) {
    return 0;
  } // 计算挑选的元素数量
  // 使用整数除法向下取整


  var count = Math.floor((arrayLength - 1) / step) + 1;
  return count;
};

var getLength = function getLength(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}; //获得一个gui ID

var newGuid = function newGuid() {
  var guid = "";

  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 32.0).toString(32);
    guid += n;
  }

  return guid;
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

/**
 *tooltip的初始值
 */

var DEFAULTTOOLTIPVALUES = {
  enabled: true,
  color: "#02121c",
  lineSize: 0.5,
  dashLength: 4,
  spaceLength: 3,
  label: {
    fontsize: 12,
    color: "#ffffff",
    backGroundColor: "#454545",
    backGroundAlpha: 1,
    formatter: function formatter(axisItem) {
      //yyyy-MM-dd HH:mm:ss
      return formatDate(new Date(axisItem.value), "yyyy-MM-dd HH:mm:ss");
    }
  }
};
/**
 *轴组件的初始值
 */

var DEFAULTAXISVALUES = {
  labelSpace: "90px",
  fontColor: "#454545",
  fontSize: "12px",
  netLineColor: "#dedede",
  lineColor: "#454545",
  tickColor: "#454545",
  tickLength: "3px",
  netLineMaxCount: 34,
  netLineMinCount: 3,
  netLineSize: 1,
  lineSize: 1,
  tickSize: 1,
  backgroundColor: "#ffffff",
  tooltip: DEFAULTTOOLTIPVALUES,
  initTimePoint: "now",
  displayPadding: 0.1
};
/**
 *数据组件的初始值
 */

var DEFAULTDATAVALUES = {
  staticData: [],
  dynamicData: {
    enabled: false,
    showLoading: false,
    stopUserOperateWhenLoading: false,
    dataFetchCountPreTime: 200,
    dataFetchCallback: /*#__PURE__*/function () {
      var _dataFetchCallback = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(time, start, end) {
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", []);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function dataFetchCallback(_x, _x2, _x3) {
        return _dataFetchCallback.apply(this, arguments);
      }

      return dataFetchCallback;
    }()
  },
  candleStyles: {
    candleWidth: "80%",
    wickWidth: "1px",
    candleRiseColor: "#7de17c",
    candleFallColor: "#c85656",
    wickRiseColor: "#7de17c",
    wickFallColor: "#c85656",
    //当前最末尾价格的tooltip设置
    currentPriceTooltip: {
      enabled: true,
      color: "#b9b42c",
      lineSize: 0.5,
      dashLength: 8,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: "#ffffff",
        backGroundColor: "#b9b42c",
        backGroundAlpha: 1,
        formatter: function formatter(axisItem) {
          axisItem = axisItem; //yyyy-MM-dd HH:mm:ss

          return axisItem.displayValue;
        }
      }
    },
    //当前显示范围的最末尾的tooltip设置
    viewLastPriceTooltip: {
      enabled: true,
      color: "#b9b42c",
      lineSize: 0.5,
      dashLength: 8,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: "#ffffff",
        backGroundColor: "#826abe",
        backGroundAlpha: 0.5,
        formatter: function formatter(axisItem) {
          axisItem = axisItem; //yyyy-MM-dd HH:mm:ss

          return axisItem.displayValue;
        }
      }
    },

    /**
     *交易量
     */
    volumChart: {
      /**
       *是否显示交易量
       */
      enabled: true,

      /**
       *交易量图表高度
       */
      volumeChartHeight: "30%",

      /**
       *交易量图表透明度
       */
      alpha: 0.6,

      /**
       *上升时显示的颜色
       */
      riseColor: "#d6dfc5",

      /**
       *下降时显示的颜色
       */
      fallColor: "#c7c7c7",
      //当前最末尾价格的tooltip设置
      currentPriceTooltip: {
        enabled: true,
        color: "#b9b42c",
        lineSize: 0.5,
        dashLength: 8,
        spaceLength: 3,
        label: {
          fontsize: 12,
          color: "#ffffff",
          backGroundColor: "#b9b42c",
          backGroundAlpha: 1,
          formatter: function formatter(axisItem, language) {
            if (language === void 0) {
              language = "en";
            }

            axisItem = axisItem; //yyyy-MM-dd HH:mm:ss

            return getUnitNumber(Number(axisItem.displayValue), language, 5);
          }
        }
      },
      //当前显示范围的最末尾的tooltip设置
      viewLastPriceTooltip: {
        enabled: true,
        color: "#b9b42c",
        lineSize: 0.5,
        dashLength: 8,
        spaceLength: 3,
        label: {
          fontsize: 12,
          color: "#ffffff",
          backGroundColor: "#826abe",
          backGroundAlpha: 0.5,
          formatter: function formatter(axisItem, language) {
            if (language === void 0) {
              language = "en";
            }

            axisItem = axisItem; //yyyy-MM-dd HH:mm:ss

            return getUnitNumber(Number(axisItem.displayValue), language, 5);
          }
        }
      }
    }
  }
};
/**
 *组件的初始值
 初始值的定义和注释和可以去参看接口定义
 */

var DEFAULTVALUES = {
  title: "交易对:🚀BNB/USDT🚀这是⚡CandleView⚡组件示例",
  enableTitle: true,
  enableinfo: true,
  timeFormat: "1h",
  width: "auto",
  height: "500px",
  backgroundColor: "#fff",
  resizeDebounceTime: 100,
  language: "zh",
  timeZone: {
    dataSourceTimeZone: 0,
    fetchConditionTimeZone: 0,
    displayTimeZone: 0
  },
  yAxis: {
    labelSpace: "90px",
    formatter: function formatter(axisItem) {
      return axisItem.displayValue.toString();
    },
    fontColor: "#454545",
    fontSize: "12px",
    netLineColor: "#dedede",
    lineColor: "#454545",
    tickColor: "#454545",
    tickLength: "3px",
    netLineMaxCount: 14,
    netLineMinCount: 3,
    displayPadding: 0.3,
    tooltip: {
      enabled: true,
      color: "#02121c",
      lineSize: 0.5,
      dashLength: 4,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: "#ffffff",
        backGroundColor: "#454545",
        backGroundAlpha: 1,
        formatter: function formatter(axisItem) {
          axisItem = axisItem; //yyyy-MM-dd HH:mm:ss

          return axisItem.displayValue;
        }
      }
    }
  },
  xAxis: {
    labelSpace: "30px",
    fontColor: "#454545",
    fontSize: "12px",
    netLineColor: "#dedede",
    lineColor: "#454545",
    tickColor: "#454545",
    tickLength: "4px",
    netLineMaxCount: 30,
    netLineMinCount: 0,
    netLineSize: 0.5,
    initTimePoint: "now",
    displayPadding: 0,
    tooltip: {
      enabled: true,
      color: "#02121c",
      lineSize: 0.5,
      dashLength: 4,
      spaceLength: 3,
      label: {
        fontsize: 12,
        color: "#ffffff",
        backGroundColor: "#454545",
        backGroundAlpha: 1,
        formatter: function formatter(axisItem) {
          //yyyy-MM-dd HH:mm:ss
          return formatDate(new Date(axisItem.value), "yyyy-MM-dd HH:mm:ss");
        }
      }
    }
  },
  data: DEFAULTDATAVALUES
};

var LANGUAGES = {
  zh: {
    timeFormat: {
      today: "今天",
      yesterday: "昨天",
      unitsecond: "秒",
      unitminute: "分",
      unithour: "点",
      unithalfOur: "点半",
      unitoclock: "点整",
      unitday: "号",
      unitdayst: "号",
      unitdaynd: "号",
      unitdayrd: "号",
      thisMonth: "这个月",
      nextMonth: "上个月",
      January: "一月份",
      February: "二月份",
      March: "三月份",
      April: "四月份",
      May: "五月份",
      June: "六月份",
      July: "七月份",
      August: "八月份",
      September: "九月份",
      October: "十月份",
      November: "十一月份",
      December: "十二月份",
      year: "年",
      thisyear: "今年",
      lastyear: "去年",
      oneMin: "1分钟",
      twoMin: "2分钟",
      threeMin: "3分钟",
      fiveMin: "5分钟",
      tenMin: "10分钟",
      fifteenMin: "15分钟",
      halfhour: "半小时",
      oneHour: "1小时",
      oneday: "1天",
      oneWeek: "1周",
      onemonth: "1个月",
      oneYear: "1年"
    }
  },
  en: {
    timeFormat: {
      today: "Today",
      yesterday: "Yesterday",
      unitsecond: "sec",
      unitminute: "min",
      unithour: "",
      unithalfOur: " O'clock past half",
      unitoclock: " O'clock",
      unitday: "th",
      unitdayst: "st",
      unitdaynd: "nd",
      unitdayrd: "rd",
      thisMonth: "This month",
      nextMonth: "Last month",
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
      year: "",
      thisyear: "This year",
      lastyear: "Last year",
      oneMin: "1 Minute",
      twoMin: "2 Minute",
      threeMin: "3 Minute",
      fiveMin: "5 Minute",
      tenMin: "10 Minute",
      fifteenMin: "15 Minute",
      halfhour: "Half Hour",
      oneHour: "One Hour",
      oneday: "One Day",
      oneWeek: "One Week",
      onemonth: "One Month",
      oneYear: "One Year"
    }
  }
};

var getshifttime = function getshifttime(hourShift) {
  if (typeof hourShift === "undefined" || hourShift === 0) {
    return 0;
  }

  var date = new Date();
  var localtimeZone = Math.abs(date.getTimezoneOffset() / 60);

  if (hourShift === "local") {
    hourShift = localtimeZone;
  }

  return 1000 * 60 * 60 * hourShift;
};
/**
 *1分钟
 */

var ONEMIN = {
  name: "1min",
  lang: "oneMin",
  timeGap: 1000 * 60,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 求整

    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 1);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 1);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 1 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 1 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 20,
        end: +new Date() + 1000 * 60 * 10
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 20,
        end: +new Date(initTime) + 1000 * 60 * 10
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getMinutes() + LANGUAGES[lan].timeFormat.unitminute;
  }
};
/**
 *2分钟
 */

var TWO = {
  name: "2min",
  lang: "twoMin",
  timeGap: 1000 * 60 * 2,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp);
    var setTime = 0;

    for (var time = 0; time < 60; time += 3) {
      if (now.getMinutes() >= time) {
        setTime = time;
      }
    }

    now.setMinutes(setTime);
    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 2);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 2);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 2 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 2 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 30,
        end: +new Date() + 1000 * 60 * 30
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 30,
        end: +new Date(initTime) + 1000 * 60 * 30
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getMinutes() + LANGUAGES[lan].timeFormat.unitminute;
  }
};
/**
 *3分钟
 */

var THREE = {
  name: "3min",
  lang: "threeMin",
  timeGap: 1000 * 60 * 3,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp);
    var setTime = 0;

    for (var time = 0; time < 60; time += 3) {
      if (now.getMinutes() >= time) {
        setTime = time;
      }
    }

    now.setMinutes(setTime);
    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 3);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 3);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 3 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 3 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 60,
        end: +new Date() + 1000 * 60 * 60
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 60,
        end: +new Date(initTime) + 1000 * 60 * 60
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getMinutes() + LANGUAGES[lan].timeFormat.unitminute;
  }
};
/**
 *5分钟
 */

var FMIN = {
  name: "5min",
  lang: "fiveMin",
  timeGap: 1000 * 60 * 5,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 求整

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
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 5);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 5);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 5 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 5 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 50,
        end: +new Date() + 1000 * 60 * 10
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 50,
        end: +new Date(initTime) + 1000 * 60 * 10
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getMinutes() + LANGUAGES[lan].timeFormat.unitminute;
  }
};
/**
 *10分钟
 */

var TENMIN = {
  name: "10min",
  lang: "tenMin",
  timeGap: 1000 * 60 * 10,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 求整

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
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 10);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 10);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 10 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 10 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 2 * 10,
        end: +new Date() + 1000 * 60 * 10 * 10
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 20 * 10,
        end: +new Date(initTime) + 1000 * 60 * 10 * 10
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getMinutes() + LANGUAGES[lan].timeFormat.unitminute;
  }
};
/**
 *15分钟
 */

var FIFMIN = {
  name: "15min",
  lang: "fifteenMin",
  timeGap: 1000 * 60 * 15,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 求整

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
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 15);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 15);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加15分钟

    date.setMinutes(date.getMinutes() + 15 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减15分钟

    date.setMinutes(date.getMinutes() - 15 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 15 * 18,
        end: +new Date() + 1000 * 60 * 15 * 6
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 15 * 18,
        end: +new Date(initTime) + 1000 * 60 * 15 * 6
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getMinutes() + LANGUAGES[lan].timeFormat.unitminute;
  }
};
/**
 *30分钟
 */

var HALFHOUR = {
  name: "30min",
  lang: "halfhour",
  timeGap: 1000 * 60 * 30,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 设置分钟和秒数为0

    if (now.getMinutes() > 30) {
      now.setMinutes(30);
    } else {
      now.setMinutes(0);
    }

    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加半小时

    date.setMinutes(date.getMinutes() + 30);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减半小时

    date.setMinutes(date.getMinutes() - 30);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 加半小时

    date.setMinutes(date.getMinutes() + 30 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减半小时

    date.setMinutes(date.getMinutes() - 30 * times);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 30 * 18,
        end: +new Date() + 1000 * 60 * 30 * 6
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 30 * 18,
        end: +new Date(initTime) + 1000 * 60 * 30 * 6
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    if (date.getMinutes() === 30) {
      return date.getHours() + LANGUAGES[lan].timeFormat.unithalfOur;
    }

    return date.getHours() + LANGUAGES[lan].timeFormat.unitoclock;
  }
};
/**
 *x小时
 */

var HOUR = {
  name: "1h",
  lang: "oneHour",
  timeGap: 1000 * 60 * 60,

  /* 取整 */
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 设置分钟和秒数为0

    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime();
    return result;
  },

  /* 往未来查找一个单位 */
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减去一个小时的毫秒数

    date.setHours(date.getHours() + 1); // 设置分钟和秒数为0

    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找一个单位 */
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减去一个小时的毫秒数

    date.setHours(date.getHours() - 1); // 设置分钟和秒数为0

    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减去一个小时的毫秒数

    date.setHours(date.getHours() + 1 * times); // 设置分钟和秒数为0

    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取时间对象
    var date = new Date(timeStamp); // 减去一个小时的毫秒数

    date.setHours(date.getHours() - 1 * times); // 设置分钟和秒数为0

    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 返回上一个小时的时间戳（毫秒）

    return date.getTime();
  },

  /* 获得初始化的时间范围 */
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 60 * 18,
        end: +new Date() + 1000 * 60 * 60 * 6
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 60 * 18,
        end: +new Date(initTime) + 1000 * 60 * 60 * 6
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    return date.getHours() + LANGUAGES[lan].timeFormat.unithour;
  }
};
/**
 *天
 */

var DAY = {
  name: "1d",
  lang: "oneday",
  timeGap: 1000 * 60 * 60 * 24,
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 设置分钟和秒数为0

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime() + getshifttime(hourShift);
    return result;
  },
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setDate(date.getDate() + 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setDate(date.getDate() - 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setDate(date.getDate() + 1 * times);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setDate(date.getDate() - 1 * times);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 60 * 24 * 20,
        end: +new Date() + 1000 * 60 * 60 * 24 * 10
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 20,
        end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 10
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value); //date.setHours(date.getHours() + plusTimeArea);

    if (date.getDate() === 1) {
      return date.getDate() + LANGUAGES[lan].timeFormat.unitdayst;
    }

    if (date.getDate() === 2) {
      return date.getDate() + LANGUAGES[lan].timeFormat.unitdaynd;
    }

    if (date.getDate() === 3) {
      return date.getDate() + LANGUAGES[lan].timeFormat.unitdayrd;
    }

    return date.getDate() + LANGUAGES[lan].timeFormat.unitday;
  }
};
/**
 *周
 */

var WEEK = {
  name: "1w",
  lang: "oneWeek",
  timeGap: 1000 * 60 * 60 * 24 * 7,
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    var today = new Date(timeStamp);
    var currentDay = today.getDay(); // 获取今天是周几（0-6，0代表周日）

    var offsetDays = currentDay === 0 ? -6 : 1 - currentDay; // 计算偏移天数，如果周日则减6天，其他情况加1减去当前天数

    var monday = new Date(today.setDate(today.getDate() + offsetDays));
    return monday.getTime() + getshifttime(hourShift);
  },
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 将时间戳转换为Date对象
    var date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000
    // 设置日期到下周一

    date.setDate(date.getDate() + 7); // 设置时间为下周一的凌晨0点

    date.setHours(0, 0, 0, 0); // 返回下周一时间戳（转换回秒级时间戳）

    return Math.floor(date.getTime()) + getshifttime(hourShift);
  },
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 将时间戳转换为Date对象
    var date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000
    // 设置日期到上周一

    date.setDate(date.getDate() - 7); // 设置时间为上周一的凌晨0点

    date.setHours(0, 0, 0, 0); // 返回上周一时间戳（转换回秒级时间戳）

    return Math.floor(date.getTime()) + getshifttime(hourShift);
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 将时间戳转换为Date对象
    var date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000
    // 设置日期到下周一

    date.setDate(date.getDate() + 7 * times); // 设置时间为下周一的凌晨0点

    date.setHours(0, 0, 0, 0); // 返回下周一时间戳（转换回秒级时间戳）

    return Math.floor(date.getTime()) + getshifttime(hourShift);
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 将时间戳转换为Date对象
    var date = new Date(timeStamp); // 注意：JavaScript时间戳是毫秒级，所以乘以1000
    // 设置日期到上周一

    date.setDate(date.getDate() - 7 * times); // 设置时间为上周一的凌晨0点

    date.setHours(0, 0, 0, 0); // 返回上周一时间戳（转换回秒级时间戳）

    return Math.floor(date.getTime()) + getshifttime(hourShift);
  },
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 60 * 24 * 7 * 5,
        end: +new Date() + 1000 * 60 * 60 * 24 * 7 * 5
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 7 * 5,
        end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 7 * 5
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value);

    if (date.getDate() === 1) {
      return date.getDate() + LANGUAGES[lan].timeFormat.unitdayst;
    }

    if (date.getDate() === 2) {
      return date.getDate() + LANGUAGES[lan].timeFormat.unitdaynd;
    }

    if (date.getDate() === 3) {
      return date.getDate() + LANGUAGES[lan].timeFormat.unitdayrd;
    }

    return date.getDate() + LANGUAGES[lan].timeFormat.unitday;
  }
};
/**
 *月
 */

var MONTH = {
  name: "1m",
  lang: "onemonth",
  timeGap: 1000 * 60 * 60 * 24 * 30,
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 设置日期为1

    now.setDate(1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime() + getshifttime(hourShift);
    return result;
  },
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setMonth(date.getMonth() - 1);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setMonth(date.getMonth() + 1 * times);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setMonth(date.getMonth() - 1 * times);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 60 * 24 * 30 * 12,
        end: +new Date() + 1000 * 60 * 60 * 24 * 30 * 2
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 30 * 12,
        end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 30 * 2
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value);

    switch (date.getMonth()) {
      case 0:
        return LANGUAGES[lan].timeFormat.January;

      case 1:
        return LANGUAGES[lan].timeFormat.February;

      case 2:
        return LANGUAGES[lan].timeFormat.March;

      case 3:
        return LANGUAGES[lan].timeFormat.April;

      case 4:
        return LANGUAGES[lan].timeFormat.May;

      case 5:
        return LANGUAGES[lan].timeFormat.June;

      case 6:
        return LANGUAGES[lan].timeFormat.July;

      case 7:
        return LANGUAGES[lan].timeFormat.August;

      case 8:
        return LANGUAGES[lan].timeFormat.September;

      case 9:
        return LANGUAGES[lan].timeFormat.October;

      case 10:
        return LANGUAGES[lan].timeFormat.November;

      case 11:
        return LANGUAGES[lan].timeFormat.December;
    }
  }
};
/**
 *年
 */

var YEAR = {
  name: "1y",
  lang: "oneYear",
  timeGap: 1000 * 60 * 60 * 24 * 30 * 12,
  roundingFunction: function roundingFunction(timeStamp, hourShift) {
    // 获取当前时间
    var now = new Date(timeStamp); // 设置日期为1

    now.setMonth(0);
    now.setDate(1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = now.getTime() + getshifttime(hourShift);
    return result;
  },
  forwardSingleUnit: function forwardSingleUnit(timeStamp, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },
  backwardSingleUnit: function backwardSingleUnit(timeStamp, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setFullYear(date.getFullYear() - 1);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },

  /* 往未来查找n个单位 */
  forwardTimeUnit: function forwardTimeUnit(timeStamp, times, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setFullYear(date.getFullYear() + 1 * times);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },

  /* 往过去查找n个单位 */
  backwardTimeUnit: function backwardTimeUnit(timeStamp, times, hourShift) {
    // 获取当前时间
    var date = new Date(timeStamp); // 设置分钟和秒数为0

    date.setFullYear(date.getFullYear() - 1 * times);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0); // 获取当前整小时的时间戳（毫秒）

    var result = date.getTime() + getshifttime(hourShift);
    return result;
  },
  getInitTimeScope: function getInitTimeScope(initTime) {
    if (initTime === "now") {
      return {
        start: +new Date() - 1000 * 60 * 60 * 24 * 30 * 12 * 3,
        end: +new Date() + 1000 * 60 * 60 * 24 * 30 * 12 * 3
      };
    } else {
      return {
        start: +new Date(initTime) - 1000 * 60 * 60 * 24 * 30 * 12 * 3,
        end: +new Date(initTime) + 1000 * 60 * 60 * 24 * 30 * 12 * 3
      };
    }
  },
  formatter: function formatter(value, lan, hourShift) {
    // 获取时间对象
    var date = new Date(value);
    return date.getFullYear() + LANGUAGES[lan].timeFormat.year;
  }
};
/**
 * 时间类型对应表
 */

var timeTypeMap = {
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
  "1y": YEAR
};
/**
 *通过时间对象查找某个数组里的时间为特定时间对象的整数的个数
 */

var findRoundTimeCountFromArray = function findRoundTimeCountFromArray(array, timeShift, currentType, key) {
  var getItemTime = function getItemTime(arr, index) {
    if (typeof array[index] === "object" || typeof key !== "undefined") {
      return Number(arr[index][key]);
    }

    return Number(arr[index]);
  }; //获得当前的显示时间时区
  //某些情况下需要错位时间
  //例如当前时间间隔设置的是1d 那么数据时间可能指示到了08:00:00 而不是0点，所以
  //这种情况下需要计算这个查找位移
  //像1d以下的时间就不用计算


  var getTimeShift = function getTimeShift() {
    if (currentType === "1d" || currentType === "1w" || currentType === "1m" || currentType === "1y") {
      return timeShift;
    }

    return 0;
  };

  if (array.length === 0) {
    return null;
  }

  var result = [];
  var start = getItemTime(array, 0);
  var end = getItemTime(array, array.length - 1);
  var gap = end - start;
  var _timeTypeMap = {}; //小于一小时

  if (gap < 1000 * 60 * 60) {
    _timeTypeMap = {
      "1min": ONEMIN,
      "5min": FIFMIN,
      "10min": TENMIN
    };
  } //大于1小时，但是小于5小时


  if (gap >= 1000 * 60 * 60 && gap < 1000 * 60 * 60 * 5) {
    _timeTypeMap = {
      "15min": FIFMIN,
      "30min": HALFHOUR,
      "1h": HOUR
    };
  } //大于5小时，但是小于35小时


  if (gap >= 1000 * 60 * 60 * 5 && gap < 1000 * 60 * 60 * 35) {
    _timeTypeMap = {
      "30min": HALFHOUR,
      "1h": HOUR
    };
  } //大于35小时，但是小于15天


  if (gap >= 1000 * 60 * 60 * 35 && gap < 1000 * 60 * 60 * 24 * 15) {
    _timeTypeMap = {
      "1h": HOUR,
      "1d": DAY
    };
  } //大于15天，但是小于55天


  if (gap >= 1000 * 60 * 60 * 24 * 15 && gap < 1000 * 60 * 60 * 24 * 55) {
    _timeTypeMap = {
      "1d": DAY,
      "1m": MONTH
    };
  } //大于55天，但是小于1年


  if (gap >= 1000 * 60 * 60 * 24 * 35 && gap < 1000 * 60 * 60 * 24 * 365) {
    _timeTypeMap = {
      "1d": DAY,
      "1m": MONTH,
      "1y": YEAR
    };
  } //大于1年


  if (gap >= 1000 * 60 * 60 * 24 * 365) {
    _timeTypeMap = {
      "1m": MONTH,
      "1y": YEAR
    };
  } //查找数量


  var findRoundTimeCount = function findRoundTimeCount(timeType) {
    var result_c = {
      count: 0,
      startIndex: 0,
      step: 0
    }; //先取整

    var round = timeType.roundingFunction(end, getTimeShift()); //然后从后往前找，看看有没有这个时间

    var latestEqualIndex = binarySearchByKeyStrictlyEqual(array, round, "forEnd", key); //如果找到的这个下标都已经在数组里过半了，就直接返回0 ，说明这种时间格式不合适

    if (latestEqualIndex === null || latestEqualIndex === -1) {
      return result_c;
    }

    if (latestEqualIndex <= array.length / 2) {
      result_c.count = 1;
      result_c.startIndex = latestEqualIndex;
      result_c.step = 99999999999999999;
      return result_c;
    } //找到了它就根据它继续找下一个，获得跨度


    var nextRound = timeType.backwardSingleUnit(getItemTime(array, latestEqualIndex), getTimeShift()); //找到下一个这个时间类型的整数点

    var nextEqualIndex = binarySearchByKeyStrictlyEqual(array.slice(0, latestEqualIndex), nextRound, "forEnd", key);

    if (nextEqualIndex === null || nextEqualIndex === -1) {
      result_c.count = 1;
      result_c.startIndex = latestEqualIndex;
      result_c.step = 99999999999999999;
      return result_c;
    } //计算两个时间下标点之间的差，获得step


    var step = latestEqualIndex - 1 - nextEqualIndex; //计算按照这种时间格式进行排列时的个数

    var stepCount = countSelectedElements(latestEqualIndex + 1, step);
    result_c.count = stepCount;
    result_c.startIndex = latestEqualIndex;
    result_c.step = step;
    return result_c;
  };

  for (var timeTypeItem in _timeTypeMap) {
    if (_timeTypeMap.hasOwnProperty(timeTypeItem) && timeTypeItem !== "1w" && timeTypeItem !== "2min" && timeTypeItem !== "3min") {
      var item = _timeTypeMap[timeTypeItem];
      result.push(_extends({}, findRoundTimeCount(item), {
        type: item
      }));
    }
  }

  return result;
};

/**
 * x轴钩子
 */

var usexAxis = function usexAxis(args, igorn, config) {
  /**
   *默认参数状态
   */
  var _useState = React.useState(Object.assign(true, DEFAULTAXISVALUES, args)),
      initArgs = _useState[0],
      _setinitArgs = _useState[1];

  var _useState2 = React.useState(-1),
      initArgsChange = _useState2[0],
      setinitArgsChange = _useState2[1]; //鼠标移动速度检测


  var _useState3 = React.useState(0),
      mousePosition = _useState3[0],
      setmousePosition = _useState3[1];

  var _useState4 = React.useState(0),
      lastmousePosition = _useState4[0],
      setlastmousePosition = _useState4[1];

  var _useState5 = React.useState(0),
      mouseSpeedSec = _useState5[0],
      setmouseSpeedSec = _useState5[1];

  var _useState6 = React.useState(0),
      mouseSpeedTemp = _useState6[0],
      setmouseSpeedTemp = _useState6[1];

  var _useState7 = React.useState(),
      mouseSpeedTimmer = _useState7[0],
      setmouseSpeedTimmer = _useState7[1];
  /**
   * ============================state===========================
   */


  var _useState8 = React.useState(false),
      isMounted = _useState8[0],
      setIsMounted = _useState8[1]; //移动的运动方向


  var _useState9 = React.useState("add"),
      moveDirection = _useState9[0],
      setmoveDirection = _useState9[1];
  /**
   * 是否已完成初始化
   */


  var _useState10 = React.useState(false),
      isFinishedInit = _useState10[0],
      setisFinishedInit = _useState10[1];
  /**
   * 普通的更新状态（位移，缩放）
   */


  var _useState11 = React.useState(-1),
      xAxisUpdateTimeStamp = _useState11[0],
      setxAxisUpdateTimeStamp = _useState11[1];

  var _useState12 = React.useState(-1),
      InitStemp = _useState12[0],
      setInitStemp = _useState12[1];

  var _useState13 = React.useState(-1),
      xAxisUpdateMoveMentTimeStamp = _useState13[0],
      setxAxisUpdateMoveMentTimeStamp = _useState13[1];

  var _useState14 = React.useState(-1),
      xAxisUpdateScaleTimeStamp = _useState14[0],
      setxAxisUpdateScaleTimeStamp = _useState14[1];
  /**
   * ============================tooltip state===========================
   */

  /**
   * tooltip状态
   */


  var _useState15 = React.useState({}),
      tooltipState = _useState15[0],
      setTooltipState = _useState15[1];
  /**
   * tooltip显示状态
   */


  var _useState16 = React.useState(false),
      tooltipIsShow = _useState16[0],
      settooltipIsShow = _useState16[1];
  /**
   * ============================缩放 state===========================
   */
  //总位移量


  var _useState17 = React.useState(0),
      moveAmount = _useState17[0],
      setmoveAmount = _useState17[1];

  var _useState18 = React.useState(0),
      x = _useState18[0],
      setx = _useState18[1]; //缩放量


  var _useState19 = React.useState(1),
      setscaleValue = _useState19[1];

  var _useState20 = React.useState({
    start: 0,
    end: 0
  }),
      orgScope = _useState20[0],
      setorgScope = _useState20[1];
  /**
   * 每次缩放的增减值
   */


  var _useState21 = React.useState(0.1),
      scaleStep = _useState21[0];
  /**
   * 计算显示tick时跳过tick的数量
   */


  var _useState22 = React.useState(0),
      tickStep = _useState22[0],
      settickStep = _useState22[1];
  /**
   * ============================时间 state===========================
   */

  /**
   * 当前时间类型
   */


  var _useState23 = React.useState(null),
      currentTimeType = _useState23[0],
      setcurrentTimeType = _useState23[1];
  /**
   * 初始时间范围 (上次的时间范围 )
   */


  var _useState24 = React.useState({
    start: 0,
    end: 0
  }),
      lastTimeScope = _useState24[0],
      setlastTimeScope = _useState24[1];
  /**
   * 当前时间范围
   */


  var _useState25 = React.useState({
    /**
     * 最左边的时间
     */
    start: 0,

    /**
     * 最右边的时间
     */
    end: 0
  }),
      currentTimeScope = _useState25[0],
      setcurrentTimeScope = _useState25[1];
  /**
   * view的全量尺寸
   */


  var _useState26 = React.useState({
    width: 0,
    height: 0
  }),
      viewSize = _useState26[0],
      setviewSize = _useState26[1];
  /**
   * ============================line 属性state===========================
   */

  /**
   * y轴的label空间
   */


  var _useState27 = React.useState(0),
      setyAxisSpace = _useState27[1];
  /**
   * line的位置（上左定位）
   *内容区和label区的分割线的位置
   */


  var _useState28 = React.useState({
    x: 0,
    y: 0
  }),
      linePosition = _useState28[0],
      setlinePosition = _useState28[1];

  var _useState29 = React.useState(0),
      labelSpace = _useState29[0],
      setlabelSpace = _useState29[1];
  /**
   * line的尺寸
   */


  var _useState30 = React.useState({
    width: 0,
    size: 0
  }),
      lineSize = _useState30[0],
      setlineSize = _useState30[1];
  /**
   * line的颜色
   */


  var _useState31 = React.useState(""),
      lineColor = _useState31[0],
      setlineColor = _useState31[1];
  /**
   * ============================网格线 属性state===========================
   */

  /**
   * 网格线组
   */


  var _useState32 = React.useState([]),
      netLineArr = _useState32[0],
      setnetLineArr = _useState32[1];
  /**
   * 网格线的最大数量
   */


  var _useState33 = React.useState(0),
      netLineMaxCount = _useState33[0],
      setnetLineMaxCount = _useState33[1];
  /**
   * 轴网格线最小数量
   */


  var _useState34 = React.useState(0),
      netLineMinCount = _useState34[0],
      setnetLineMinCount = _useState34[1];
  /**
   * ============================tick 属性state===========================
   */

  /**
   * 真实tick组（实际的tick组）
   */


  var _useState35 = React.useState([]),
      tickArr = _useState35[0],
      settickArr = _useState35[1];
  /**
   * 显示tick组（用于显示的tick）
   */


  var _useState36 = React.useState([]),
      displayTickArr = _useState36[0],
      setdisplayTickArr = _useState36[1];
  /**
   * tick的共有数据宽度
   */


  var _useState37 = React.useState(0),
      displayTickCommonWidth = _useState37[0],
      setdisplayTickCommonWidth = _useState37[1];
  /**
   * tick的共有像素宽度
   */


  var _useState38 = React.useState(0),
      displayTickCommonpixWidth = _useState38[0],
      setdisplayTickCommonpixWidth = _useState38[1];
  /**
   * ============================ref===========================
   */


  var _useState39 = React.useState(null),
      candleObj = _useState39[0],
      setcandleObj = _useState39[1];
  /**
   * ============================静态变量===========================
   */

  /**
   * ==========================函数==============================
   */

  /**
   * 初始化轴
   *@param {TtimeType} timeType 时间类型
   *@param  {number} viewWidth 界面的全量宽度
   *@param  {number} viewHeight 界面的全量高度
   *@param {number | string} yAxisLabelSpace y轴的label空间
   *@returns {void}
   */


  var initAxisSates = function initAxisSates(timeType, viewWidth, viewHeight, yAxisLabelSpace) {
    /* 设置各项属性 */
    setviewSize({
      width: viewWidth,
      height: viewHeight
    });
    setyAxisSpace(getSpaceSize(yAxisLabelSpace, viewWidth));
    setlinePosition({
      x: 0,
      y: viewHeight - getSpaceSize(initArgs.labelSpace, viewHeight)
    });
    setlineSize({
      width: viewWidth - getSpaceSize(yAxisLabelSpace, viewWidth),
      size: initArgs.lineSize
    });
    setlabelSpace(getSpaceSize(initArgs.labelSpace, viewHeight));
    setlineColor(initArgs.lineColor);
    setnetLineMaxCount(initArgs.netLineMaxCount);
    setnetLineMinCount(initArgs.netLineMinCount);
    /* 重置属性 */

    setorgScope({
      start: 0,
      end: 0
    });
    setdisplayTickCommonWidth(0);
    setdisplayTickCommonpixWidth(0);
    setlastTimeScope({
      start: 0,
      end: 0
    });
    setcurrentTimeScope({
      start: 0,
      end: 0
    });
    settickArr([]);
    setnetLineArr([]);
    setdisplayTickArr([]);
    setx(0);
    setmoveAmount(0);
    var tiemType = timeTypeMap[timeType];
    setcurrentTimeType(tiemType);
  };

  var update = function update() {
    setlineColor(initArgs.lineColor);
  };
  /**
   * 往以前推测时间
   */


  var timeSpeculation_backrward = function timeSpeculation_backrward(timeInteger, initTimeScopeStart) {
    var currentTime = timeInteger;
    var timeScopeArr = [timeInteger];

    while (true) {
      currentTime = currentTimeType.backwardSingleUnit(currentTime, config.timeZone.displayTimeZone);

      if (currentTime < initTimeScopeStart) {
        break;
      } else {
        //从顶端往里推入
        timeScopeArr.unshift(currentTime);
      }
    }

    return timeScopeArr;
  };
  /**
   * 往未来推测时间
   */


  var timeSpeculation_forward = function timeSpeculation_forward(timeInteger, initTimeScopeEnd) {
    var currentTime = timeInteger;
    var timeScopeArr = [timeInteger];

    while (true) {
      currentTime = currentTimeType.forwardSingleUnit(currentTime, config.timeZone.displayTimeZone);

      if (currentTime > initTimeScopeEnd) {
        break;
      } else {
        //从后面里推入
        timeScopeArr.push(currentTime);
      }
    }

    return timeScopeArr;
  };
  /**
   * 扩展tick组
   */


  var updateTicks = function updateTicks(targetTickArr, timeScope, isComputCommonProp, _moveAmount, moveDir) {
    if (moveDir === "add" || moveDir === "all") {
      var forwardArr = timeSpeculation_forward(targetTickArr[targetTickArr.length - 1].value, timeScope.end);

      if (forwardArr.length > 1) {
        var arr = createTickers(forwardArr, timeScope, isComputCommonProp, _moveAmount);

        for (var i = 1; i < arr.length; i++) {
          targetTickArr.push(arr[i]);
        }
      }
    }

    if (moveDir === "min" || moveDir === "all") {
      var backwardArr = timeSpeculation_backrward(targetTickArr[0].value, timeScope.start);

      if (backwardArr.length > 1) {
        var _arr = createTickers(backwardArr, timeScope, isComputCommonProp, _moveAmount);

        for (var i = _arr.length - 2; i > -1; i--) {
          targetTickArr.unshift(_arr[i]);
        }
      }
    }

    var commonPixProperties;

    if (isComputCommonProp) {
      commonPixProperties = computTickCommonProp(timeScope, lineSize.width, targetTickArr.length);
    } else {
      commonPixProperties = {
        dataWidth: displayTickCommonWidth,
        pixWidth: displayTickCommonpixWidth,
        incriseWidth: function () {
          return lineSize.width * initArgs.displayPadding;
        }()
      };
    }

    if (isComputCommonProp) {
      //更新位置
      var index = 0;

      for (var _iterator = _createForOfIteratorHelperLoose(targetTickArr), _step; !(_step = _iterator()).done;) {
        var item = _step.value;
        var width = lineSize.width + commonPixProperties.incriseWidth * 2; //计算位置

        item.cPosition = {
          x: getRangePosition(Number(item.value), timeScope, width) - commonPixProperties.incriseWidth - _moveAmount,
          y: linePosition.y
        };
        item.index = index;
        index++;
        item = computDataPixTick(item, timeScope, index, commonPixProperties.dataWidth, commonPixProperties.pixWidth);
      }

      targetTickArr = targetTickArr.sort(function (a, b) {
        return a.value - b.value;
      });
    }

    return targetTickArr;
  };
  /**
   * 扩展displaytick组
   */


  var updateDisplayTicks = function updateDisplayTicks(targetTickArr, newTickArr) {
    //将tickArr转换成hash 方便查找
    var newTickHash = arrayToHash(newTickArr, "value"); //往前扩展
    //取最早的值

    var correspondItem;
    var nextStep = 0;
    correspondItem = newTickHash[targetTickArr[0].value];
    nextStep = correspondItem.index;

    while (true) {
      //获得下一个 step
      nextStep = nextStep - 1 - tickStep;

      if (typeof newTickArr[nextStep] === "undefined") {
        break;
      } else {
        targetTickArr.unshift(newTickArr[nextStep]);
      }
    } //往未来扩展


    correspondItem = newTickHash[targetTickArr[targetTickArr.length - 1].value];
    nextStep = correspondItem.index;

    while (true) {
      //获得下一个 step
      nextStep = nextStep + 1 + tickStep;

      if (typeof newTickArr[nextStep] === "undefined") {
        break;
      } else {
        targetTickArr.unshift(newTickArr[nextStep]);
      }
    } //去重


    return Array.from(new Set(targetTickArr));
  }; //计算tick的共有属性


  var computTickCommonProp = function computTickCommonProp(range, width, totalArrLength) {
    //扩展宽度 增加数据显示边界 padding
    var incriseWidth = width * initArgs.displayPadding;
    width = width + incriseWidth * 2; //计算数据宽度

    var dataWidth = (range.end - range.start) / totalArrLength; //计算像素宽度

    var pixWidth = width / totalArrLength;
    setdisplayTickCommonWidth(dataWidth);
    setdisplayTickCommonpixWidth(pixWidth);
    return {
      dataWidth: dataWidth,
      pixWidth: pixWidth,
      incriseWidth: incriseWidth
    };
  };
  /**
   * 计算tick的位置和数据关系数据
   */


  var computDataPixTick = function computDataPixTick(item, range, index, dataWidth, pixWidth) {
    item.dataSpace = {
      start: index * dataWidth + range.start,
      end: (index + 1) * dataWidth + range.start
    }; //计算占用像素范围

    item.pixSpace = {
      start: item.cPosition.x - pixWidth / 2,
      end: item.cPosition.x + pixWidth / 2
    };
    return item;
  };
  /**
   * 创建真实tick组
   */


  var createTickers = function createTickers(arr, range, isComputCommonProp, moveAmount) {
    debugger;
    var result = [];
    var commonPixProperties;

    if (isComputCommonProp) {
      commonPixProperties = computTickCommonProp(range, lineSize.width, arr.length);
    } else {
      commonPixProperties = {
        dataWidth: displayTickCommonWidth,
        pixWidth: displayTickCommonpixWidth,
        incriseWidth: function () {
          return lineSize.width * initArgs.displayPadding;
        }()
      };
    }

    var index = 0;
    var width = lineSize.width + commonPixProperties.incriseWidth * 2;

    for (var _iterator2 = _createForOfIteratorHelperLoose(arr), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;
      var resultItem = {
        color: initArgs.tickColor,
        length: getSpaceSize(initArgs.tickLength, viewSize.height),
        size: getSpaceSize(initArgs.tickSize, viewSize.height),
        cPosition: {
          x: 0,
          y: linePosition.y
        },
        value: item
      }; //计算位置

      resultItem.cPosition = {
        x: getRangePosition(Number(resultItem.value), range, width) - commonPixProperties.incriseWidth - moveAmount,
        y: linePosition.y
      };
      resultItem.index = index;
      result.push(computDataPixTick(resultItem, range, index, commonPixProperties.dataWidth, commonPixProperties.pixWidth));
      index++;
    }

    return result;
  };
  /**
   * 创建显示Ticker
   * 大于netLineMaxCount就每隔一个项目减半,减半还是大于netLineMaxCount,就再减半，模拟递归
   */


  var createDisplayTickers = function createDisplayTickers(arr) {
    var result = arr;
    var _tickStep = 0;

    while (true) {
      if (result.length > netLineMaxCount) {
        var cArr = [];
        var index = 0;

        for (var _iterator3 = _createForOfIteratorHelperLoose(result), _step3; !(_step3 = _iterator3()).done;) {
          var item = _step3.value;

          if (index % 2) {
            cArr.push(item);
          }

          index++;
        }

        result = cArr;

        if (_tickStep < 1) {
          _tickStep = _tickStep + 1;
        } else {
          _tickStep = _tickStep * 2 + 1;
        }
      } else {
        break;
      }
    }

    settickStep(_tickStep);
    return result;
  };
  /**
   * 通过像素位置查找目标tick
   */
  //ai 优化后的版本


  var findTick = function findTick(position, key) {
    var tickerArr = tickArr.slice(); // 复制数组以避免修改原数组

    var centerIndex = 0;

    while (tickerArr.length > 1) {
      centerIndex = Math.floor(tickerArr.length / 2);
      var midTick = tickerArr[centerIndex];

      if (midTick[key].start <= position && midTick[key].end >= position) {
        // 直接找到目标，无需继续查找
        return midTick;
      } else if (midTick[key].end < position) {
        // 调整查找范围到右半部分
        tickerArr = tickerArr.slice(centerIndex + 1);
      } else {
        // 调整查找范围到左半部分
        tickerArr = tickerArr.slice(0, centerIndex);
      }
    } // 若数组只剩一个元素且未直接命中，则判断该元素是否符合条件


    return tickerArr.length === 1 && tickerArr[0][key].end >= position ? tickerArr[0] : null;
  };
  /**
   * 创建x轴的网格 (纵向)
   */


  var createNetLines = function createNetLines(displaytickItems) {
    var results = [];

    for (var _iterator4 = _createForOfIteratorHelperLoose(displaytickItems), _step4; !(_step4 = _iterator4()).done;) {
      var item = _step4.value;
      results.push({
        /**
         * 网格线颜色
         */
        color: initArgs.netLineColor,

        /**
         * 网格线长度
         */
        length: linePosition.y,

        /**
         * 网格线粗细
         */
        size: initArgs.netLineSize,

        /**
         * 网格线位置
         * （上中定位）
         */
        cPosition: {
          x: item.cPosition.x,
          y: 0
        },

        /**
         * 值
         */
        value: item.value
      });
    }

    return results;
  }; //从所有等差数列的参数里算出具体的数列
  //1.从数组里挑出合适数量的时间类型(最好两组一组时间稍多，一组稍少 )
  //2.按照挑选的两个等差数列的参数，从tickArr中挑选出具体的数组
  //2.合并两个数组
  //3.输出


  var createDisplayTickersByDate = function createDisplayTickersByDate(tickArr, displayTickRoundValuesArray) {
    tickArr = [].concat(tickArr);
    var displayTickArr1 = [];
    var displayTickArr2 = [];
    var isFind = false;

    for (var _iterator5 = _createForOfIteratorHelperLoose(displayTickRoundValuesArray), _step5; !(_step5 = _iterator5()).done;) {
      var _item = _step5.value;

      if (isFind) {
        if (_item.count !== 0) {
          displayTickArr2 = getTickWithFormated(tickArr, _item);
        }

        break;
      }

      if (_item.count > initArgs.netLineMinCount && _item.count < initArgs.netLineMaxCount) {
        isFind = true;
        displayTickArr1 = getTickWithFormated(tickArr, _item);
      }
    }

    var displayTickArr2Map = arrayToHash(displayTickArr2, "value");
    var result = [];

    for (var _iterator6 = _createForOfIteratorHelperLoose(displayTickArr1), _step6; !(_step6 = _iterator6()).done;) {
      var item = _step6.value;

      if (typeof displayTickArr2Map[item.value] !== "undefined") {
        result.push(displayTickArr2Map[item.value]);
      } else {
        result.push(item);
      }
    }

    return result;
  };

  var getTickWithFormated = function getTickWithFormated(tickArr, xCondition) {
    var result = []; //先取到第一个

    var currentIndex = xCondition.startIndex;
    var currentItem = tickArr[currentIndex];
    currentItem.displayValue = xCondition.type.formatter(Number(currentItem.value), config == null ? void 0 : config.language, config.timeZone.displayTimeZone);
    result.push(currentItem); //然后再依次取剩下的

    for (var i = xCondition.count; i > -1; i--) {
      currentIndex = currentIndex - 1 - xCondition.step;

      if (typeof tickArr[currentIndex] === "undefined") {
        break;
      }

      currentItem = tickArr[currentIndex];
      currentItem.displayValue = xCondition.type.formatter(Number(currentItem.value), config == null ? void 0 : config.language, config.timeZone.displayTimeZone);
      result.push(currentItem);
    }

    return result;
  };
  /**
   * 初始化时
   * 制造轴数据
   */


  var createAxisData = function createAxisData() {
    /*
                    1.获得初始的时间范围
                    1.1 拟定时间范围，例如从当前时间往前推 24 小时，这是拟定的时间范围
                    1.2 确定标准时间范围，根据设置的时间类型 以当前时间进行取整+1 获得最末尾时间（最右边的时间），然后将时间往前推，每次一个单位（例如小时），直到超出“拟定时间范围” 得到最开始时间｛最左边的时间｝ 输出【｛最左边的时间｝，｛最左边的时间｝】时间范围； 真实 tick 数数组；
                    1.3 获得显示 tick 组 根据上面生成的 真实小时数数组；以及 最大 tick 显示数量，和最小显示 tick 数量；计算 显示 tick 组
            */

    /**
     * 粗糙时间范围
     */
    var _flexTimeScope = currentTimeType.getInitTimeScope(initArgs.initTimePoint); //如果设置了时间归零
    //就需要把起始的时区算成GMT +0000


    if (config.timeZone.displayTimeZone !== "local") {
      var date = new Date();
      var localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
      _flexTimeScope.start = anyTimeToGMT0000ToTarget(_flexTimeScope.start, localtimeZone, config.timeZone.displayTimeZone);
      _flexTimeScope.end = anyTimeToGMT0000ToTarget(_flexTimeScope.end, localtimeZone, config.timeZone.displayTimeZone);
    }
    /**
     * 当前的整数时间
     */


    var _timeInteger = currentTimeType.roundingFunction(_flexTimeScope.end, config.timeZone.displayTimeZone);
    /* 对齐整数的时间组 */


    var realTimeArr = timeSpeculation_backrward(_timeInteger, _flexTimeScope == null ? void 0 : _flexTimeScope.start);
    /**
     * 当前时间范围
     */

    var _currentTimeScope = _flexTimeScope;
    /**
     * 真实数据位置
     */

    var _tickerArr = createTickers(realTimeArr, _flexTimeScope, true, 0); //挑选出所有按时间整数排列的等差数列的参数


    var displayTickRoundValuesArray = findRoundTimeCountFromArray(_tickerArr, config.timeZone.displayTimeZone, config.timeFormat, "value");

    var _displayTickerArr;

    if (displayTickRoundValuesArray === null) {
      /**
       * 用于显示的ticker
       */
      _displayTickerArr = createDisplayTickers(_tickerArr);
      _displayTickerArr = _displayTickerArr.sort(function (a, b) {
        return a.value - b.value;
      });
    } else {
      //从所有等差数列的参数里算出具体的数列
      _displayTickerArr = createDisplayTickersByDate(_tickerArr, displayTickRoundValuesArray);
    }
    /**
     * 网格线组
     */


    var _netLineArr = createNetLines(_displayTickerArr);

    setorgScope(_flexTimeScope);
    setlastTimeScope(_flexTimeScope);
    setcurrentTimeScope(function () {
      return _currentTimeScope;
    });
    settickArr(_tickerArr);
    setnetLineArr(_netLineArr);
    setdisplayTickArr(_displayTickerArr);
    setisFinishedInit(true);
    setInitStemp(+new Date()); //这里产生出来的指针会偏移一点，很正常 因为最末尾的时间是根据当前时间来的
    //倒数第一个指针是根据最末尾时间取整得来的
  };
  /**
   * 移动轴(鼠标拖拽)
   */


  var moveContainer = function moveContainer(start, stop, isSaveScope) {
    if (isFinishedInit) {
      var pureLength = stop - start;

      var _moveAmount = pureLength + moveAmount; //设置鼠标位置用于计算鼠标速度


      setmousePosition(stop); //设置x用于更新画面

      setx(pureLength + moveAmount);

      if (isSaveScope) {
        setmoveAmount(_moveAmount);
      } //计算移动，并更新tick


      window.requestAnimationFrame(function () {
        moveAxis(start, stop, isSaveScope);
      });
    }
  };
  /**
   * 移动轴(鼠标拖拽)
   */


  var moveAxis = function moveAxis(start, stop, isSaveScope) {
    var _config$data, _config$data$dynamicD;

    if (candleObj != null && candleObj.data.isFetchingData && config != null && (_config$data = config.data) != null && (_config$data$dynamicD = _config$data.dynamicData) != null && _config$data$dynamicD.stopUserOperateWhenLoading) {
      return;
    }

    if (isFinishedInit) {
      var width = lineSize.width; //扩展宽度 增加数据显示边界 padding

      var incriseWidth = width * initArgs.displayPadding;
      width = width + incriseWidth * 2; //移动长度

      var length = stop - start;
      var pureLength = stop - start;

      var _moveAmount = pureLength + moveAmount; //加还是减


      var sign = "add";

      if (length > 0) {
        sign = "min";
      }

      setmoveDirection(sign);
      length = Math.abs(length); //计算这段线在整个宽度里占有百分之多少

      var prec = length / width; //按比例计算出时间变化量

      var changeScope = Number(((lastTimeScope.end - lastTimeScope.start) * prec).toFixed(0));

      if (sign === "min") {
        changeScope = 0 - changeScope;
      } //从新计算currentTimeScope


      var _currentTimeScope = {
        start: lastTimeScope.start + changeScope,
        end: lastTimeScope.end + changeScope
      }; //-----------------比例计算完成开始更新------------------

      /**
       * 用真实数组位置 以及当前取到的时间范围取交集
       * 取所有tick的交集
       */

      var resultInterArr = findIntersection(tickArr, _currentTimeScope);
      /**
       * 用剩下的tick去进行扩展
       */

      var newTicks = updateTicks(resultInterArr, _currentTimeScope, false, _moveAmount, function () {
        if (pureLength + moveAmount - x > 0) {
          return "min";
        }

        return "add";
      }()); //挑选出所有按时间整数排列的等差数列的参数

      var displayTickRoundValuesArray = findRoundTimeCountFromArray(newTicks, config.timeZone.displayTimeZone, config.timeFormat, "value");

      var _displayTickerArr;

      if (displayTickRoundValuesArray === null) {
        /**
         * 求新时间范围和旧显示tick的交集
         * 旧显示tick的交集
         */
        var resultInterDisplayArr = findIntersection(displayTickArr, _currentTimeScope);

        if (resultInterDisplayArr.length === 0) {
          _displayTickerArr = createDisplayTickers(newTicks);
        } else {
          _displayTickerArr = updateDisplayTicks(resultInterDisplayArr, newTicks);
        }

        _displayTickerArr = _displayTickerArr.sort(function (a, b) {
          return a.value - b.value;
        });
      } else {
        //从所有等差数列的参数里算出具体的数列
        _displayTickerArr = createDisplayTickersByDate(newTicks, displayTickRoundValuesArray);
      }
      /**
       * 网格线组
       */


      var _netLineArr = createNetLines(_displayTickerArr);

      setxAxisUpdateMoveMentTimeStamp(+new Date());
      setcurrentTimeScope(_currentTimeScope);
      settickArr(newTicks);
      setnetLineArr(_netLineArr);
      setdisplayTickArr(_displayTickerArr);

      if (isSaveScope) {
        setlastTimeScope(_currentTimeScope);
      }

      setxAxisUpdateTimeStamp(+new Date());
    }
  };
  /**
   * 缩放
   */


  var scale = function scale(point, precent, movement) {
    var _config$data2, _config$data2$dynamic;

    if (candleObj != null && candleObj.data.isFetchingData && config != null && (_config$data2 = config.data) != null && (_config$data2$dynamic = _config$data2.dynamicData) != null && _config$data2$dynamic.stopUserOperateWhenLoading) {
      return;
    }

    if (tickArr.length > 24 * 60 * 2 && movement === "zoomOut") {
      return;
    } //最小缩放


    if (tickArr.length <= netLineMinCount && movement === "zoomIn") {
      return;
    }

    if (isFinishedInit) {
      var leftPrecent = point / lineSize.width;
      var rightPrecent = 1 - leftPrecent;
      leftPrecent = precent * 100 * leftPrecent / 100;
      rightPrecent = precent * 100 * rightPrecent / 100;
      /**
       * 粗糙时间范围
       */

      var _currentTimeScope = lastTimeScope;
      var total = _currentTimeScope.end - _currentTimeScope.start;
      var q = {
        start: total * leftPrecent,
        end: total * rightPrecent
      };

      if (movement === "zoomIn") {
        _currentTimeScope = {
          start: _currentTimeScope.start + q.start,
          end: _currentTimeScope.end - q.end
        };
      }

      if (movement === "zoomOut") {
        _currentTimeScope = {
          start: _currentTimeScope.start - q.start,
          end: _currentTimeScope.end + q.end
        };
      }

      var _tickArr = [].concat(tickArr);
      /**
       * 当前的整数时间
       */

      /**
       * 用真实数组位置 以及当前取到的时间范围取交集
       * 取所有tick的交集
       */


      var resultInterArr = findIntersection(_tickArr, _currentTimeScope);

      if (resultInterArr.length === 0) {
        return;
      }
      /**
       * 用剩下的tick去进行扩展
       */


      var newTicks = updateTicks(resultInterArr, _currentTimeScope, true, 0, "all"); //挑选出所有按时间整数排列的等差数列的参数

      var displayTickRoundValuesArray = findRoundTimeCountFromArray(newTicks, config.timeZone.displayTimeZone, config.timeFormat, "value");

      var _displayTickerArr;

      if (displayTickRoundValuesArray === null) {
        /**
         * 用于显示的ticker
         */
        _displayTickerArr = createDisplayTickers(newTicks);
        _displayTickerArr = _displayTickerArr.sort(function (a, b) {
          return a.value - b.value;
        });
      } else {
        //从所有等差数列的参数里算出具体的数列
        _displayTickerArr = createDisplayTickersByDate(newTicks, displayTickRoundValuesArray);
      }
      /**
       * 网格线组
       */


      var _netLineArr = createNetLines(_displayTickerArr); //缩放量计算


      var _scale = (_currentTimeScope.end - _currentTimeScope.start) / (orgScope.end - orgScope.start);

      setscaleValue(_scale);
      setlastTimeScope(_currentTimeScope);
      setcurrentTimeScope(_currentTimeScope);
      settickArr(newTicks);
      setnetLineArr(_netLineArr);
      setdisplayTickArr(_displayTickerArr);
      setxAxisUpdateTimeStamp(+new Date());
      setxAxisUpdateScaleTimeStamp(+new Date());
      setmoveAmount(0);
    }
  };
  /**
   * tooltip更新
   */


  var tooltipUpdate = function tooltipUpdate() {
    if (isFinishedInit && tooltipIsShow) {
      var _tooltipState$related;

      var _tooltipState = tooltipState;

      if (_tooltipState === null) {
        return;
      }

      _tooltipState.position.x = ((_tooltipState$related = _tooltipState.relatedTickItem) == null ? void 0 : _tooltipState$related.cPosition.x) + x;
      setTooltipState(_tooltipState);
    }
  };
  /**
   * tooltip移动
   */


  var tooltipMove = function tooltipMove(position, isShowTooltip) {
    if (isFinishedInit) {
      var tooltipX = position.x;

      if (tooltipX > lineSize.width) {
        isShowTooltip = false;
      }

      settooltipIsShow(isShowTooltip);

      if (isShowTooltip === false) {
        return;
      } //通过像素位置进行二分法查找目标tick


      var _tickItem = findTick(tooltipX - moveAmount, "pixSpace");

      if (_tickItem === null) {
        setTooltipState(null);
        return;
      }

      var _tooltipState = {
        position: {
          x: _tickItem.cPosition.x + moveAmount,
          y: 0
        },
        length: linePosition.y,
        value: _tickItem.value,
        relatedTickItem: _tickItem,
        size: getSpaceSize(initArgs.tooltip.lineSize, viewSize.width)
      };
      setTooltipState(_tooltipState);
    }
  };
  /**
   * 更新轴
   *@param  {number} viewWidth 界面的全量宽度
   *@param  {number} viewHeight 界面的全量高度
   *@param {number | string} yAxisLabelSpace y轴的label空间
   *@returns {void}
   */


  var updateAxisSates = function updateAxisSates(viewWidth, viewHeight, yAxisLabelSpace) {
    setviewSize({
      width: viewWidth,
      height: viewHeight
    });
    setyAxisSpace(getSpaceSize(yAxisLabelSpace, viewWidth));
    setlinePosition({
      x: 0,
      y: viewHeight - getSpaceSize(initArgs.labelSpace, viewHeight)
    });
    setlineSize({
      width: viewWidth - getSpaceSize(yAxisLabelSpace, viewWidth),
      size: initArgs.lineSize
    });
  };
  /* 重新计算大小 */


  var resize = function resize() {
    if (isFinishedInit) {
      window.requestAnimationFrame(function () {
        scale(viewSize.width / 2, 0, "keep");
      });
    }
  };
  /* 重新生成x轴 */


  var reGenXAxis = function reGenXAxis() {
    if (isFinishedInit) {
      window.requestAnimationFrame(function () {
        scale(viewSize.width / 2, 0, "keep");
      });
    }
  };
  /* 鼠标移动速度检测器 */


  var mouseSpeedDetecor = function mouseSpeedDetecor() {
    var speed = mousePosition - lastmousePosition;
    setmouseSpeedSec(speed);
    setlastmousePosition(mousePosition);
    setUpMouseSpeedDetecor();
  };
  /* 打开鼠标移动速度检测器 */


  var setUpMouseSpeedDetecor = function setUpMouseSpeedDetecor() {
    var timeOut = setTimeout(function () {
      setmouseSpeedTemp(+new Date());
    }, 24);
    setmouseSpeedTimmer(timeOut);
  };
  /* 销毁速度检测器 */


  var destroyMouseSpeedDetecor = function destroyMouseSpeedDetecor() {
    if (typeof mouseSpeedTimmer !== undefined) {
      setmouseSpeedTemp(0);
      clearTimeout(mouseSpeedTimmer);
    }
  };
  /**
   * ==================================Effects===============================
   */


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
      setUpMouseSpeedDetecor();
    }

    return function () {
      setIsMounted(false);
      destroyMouseSpeedDetecor();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //侧鼠标速度

  React.useEffect(function () {
    if (mouseSpeedTemp !== 0) {
      mouseSpeedDetecor();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [mouseSpeedTemp]); //初始化状态以后初始化数轴

  React.useEffect(function () {
    if (currentTimeType !== null && currentTimeScope.start === 0 && currentTimeScope.end === 0) {
      createAxisData();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [currentTimeType, currentTimeScope]); //初始化状态以后初始化数轴

  React.useEffect(function () {
    resize(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSize]); //初始化状态以后初始化数轴

  React.useEffect(function () {
    tooltipUpdate(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);
  React.useEffect(function () {
    if (initArgsChange !== -1) {
      update();
    }
  }, [initArgsChange]);
  return {
    data: {
      /**
       * 当前时间类型
       */
      currentTimeType: currentTimeType,

      /**
       * 初始时间范围
       */
      lastTimeScope: lastTimeScope,

      /**
       * 当前时间范围
       */
      currentTimeScope: currentTimeScope,

      /**
       * line的位置（上左定位）
       *内容区和label区的分割线的位置
       */
      linePosition: linePosition,

      /**
       * line的尺寸
       */
      lineSize: lineSize,

      /**
       * line的颜色
       */
      lineColor: lineColor,

      /**
       * 网格线的最大数量
       */
      netLineMaxCount: netLineMaxCount,

      /**
       * 网格线组
       */
      netLineArr: netLineArr,

      /**
       * 轴网格线最小数量
       */
      netLineMinCount: netLineMinCount,

      /**
       * 真实tick组（实际的tick空间）
       */
      tickArr: tickArr,

      /**
       * 显示tick组（用于显示的tick）
       */
      displayTickArr: displayTickArr,

      /**
       * 是否已完成初始化
       */
      isFinishedInit: isFinishedInit,

      /**
       * 每次缩放的增减值
       */
      scaleStep: scaleStep,

      /**
       * tooltip
       */
      tooltipState: tooltipState,

      /**
       * tooltip是否显示
       */
      tooltipIsShow: tooltipIsShow,
      labelSpace: labelSpace,
      xAxisUpdateTimeStamp: xAxisUpdateTimeStamp,
      viewSize: viewSize,
      displayTickCommonWidth: displayTickCommonWidth,
      displayTickCommonpixWidth: displayTickCommonpixWidth,

      /* 移动量 */
      moveAmount: moveAmount,
      x: x,
      xAxisUpdateMoveMentTimeStamp: xAxisUpdateMoveMentTimeStamp,
      xAxisUpdateScaleTimeStamp: xAxisUpdateScaleTimeStamp,
      mouseSpeedSec: mouseSpeedSec,
      moveDirection: moveDirection,
      InitStemp: InitStemp
    },
    funcs: {
      /**
       * 设置初始时间范围
       */
      setlastTimeScope: setlastTimeScope,

      /**
       * 设置当前时间范围
       */
      setcurrentTimeScope: setcurrentTimeScope,

      /**
       * 设置line的位置（上左定位）
       *内容区和label区的分割线的位置
       */
      setlinePosition: setlinePosition,

      /**
       * 设置line的尺寸
       */
      setlineSize: setlineSize,

      /**
       * 设置line的颜色
       */
      setlineColor: setlineColor,

      /**
       * 设置网格线的最大数量
       */
      setnetLineMaxCount: setnetLineMaxCount,

      /**
       * 设置网格线组
       */
      setnetLineArr: setnetLineArr,

      /**
       * 设置轴网格线最小数量
       */
      setnetLineMinCount: setnetLineMinCount,

      /**
       * 设置真实tick组（实际的tick空间）
       */
      settickArr: settickArr,

      /**
       * 设置显示tick组（用于显示的tick）
       */
      setdisplayTickArr: setdisplayTickArr,

      /**
       * 初始化轴
       *@param {TtimeType} timeType 时间类型
       *@param  {number} viewWidth 界面的全量宽度
       *@param  {number} viewHeight 界面的全量高度
       *@param {number | string} yAxisLabelSpace y轴的label空间
       *@returns {void}
       */
      initAxisSates: initAxisSates,

      /**
       * 更新轴
       *@param  {number} viewWidth 界面的全量宽度
       *@param  {number} viewHeight 界面的全量高度
       *@param {number | string} yAxisLabelSpace y轴的label空间
       *@returns {void}
       */
      updateAxisSates: updateAxisSates,

      /**
       * 移动轴
       */
      moveAxis: moveAxis,
      moveContainer: moveContainer,

      /**
       * 缩放轴
       */
      scale: scale,

      /**
       * tooltip移动
       */
      tooltipMove: tooltipMove,
      setx: setx,
      setcandleObj: setcandleObj,
      setinitArgs: function setinitArgs(arg) {
        _setinitArgs(Object.assign(true, initArgs, arg));

        setinitArgsChange(+new Date());
      },
      reGenXAxis: reGenXAxis
    },

    /**
     *初始化时用到的参数
     */
    initArgs: initArgs
  };
};

/**
 * y轴钩子
 */

var useyAxis = function useyAxis(args, xAxis) {
  xAxis = xAxis;
  /**
   *默认参数状态
   */

  var _useState = React.useState(Object.assign(true, DEFAULTAXISVALUES, args)),
      initArgs = _useState[0],
      _setinitArgs = _useState[1];

  var _useState2 = React.useState(-1),
      initArgsChange = _useState2[0],
      setinitArgsChange = _useState2[1];
  /**
   * ============================state===========================
   */


  var _useState3 = React.useState(false),
      isMounted = _useState3[0],
      setIsMounted = _useState3[1];
  /**
   * 是否已完成初始化
   */


  var _useState4 = React.useState(false),
      isFinishedInit = _useState4[0],
      setisFinishedInit = _useState4[1];
  /**
   * y轴的更新
   */


  var _useState5 = React.useState(-1),
      yAxisUpdateTimeStamp = _useState5[0],
      setyAxisUpdateTimeStamp = _useState5[1];
  /**
   * ============================tooltip state===========================
   */

  /**
   * tooltip状态
   */


  var _useState6 = React.useState({}),
      tooltipState = _useState6[0],
      setTooltipState = _useState6[1];
  /**
   * tooltip显示状态
   */


  var _useState7 = React.useState(false),
      tooltipIsShow = _useState7[0],
      settooltipIsShow = _useState7[1];
  /**
   * ============================数据 state===========================
   */

  /**
   * 当前数据范围
   */


  var _useState8 = React.useState({
    /**
     * 最下面的值
     */
    start: "0",

    /**
     * 最上面的值
     */
    end: "0"
  }),
      currentDataScope = _useState8[0],
      setcurrentDataScope = _useState8[1];
  /**
   * 当前数据整体长度（从0开始）
   */


  var _useState9 = React.useState("0"),
      currentDataSpace = _useState9[0],
      setcurrentDataSpace = _useState9[1];
  /**
   * 当前数据相对0的位置(以start为基准 )
   */


  var _useState10 = React.useState("0"),
      currentDataPositionOfStart = _useState10[0],
      setcurrentDataPositionofStart = _useState10[1];
  /**
   * ============================line 属性state===========================
   */

  /**
   * view的全量尺寸
   */


  var _useState11 = React.useState({
    width: 0,
    height: 0
  }),
      viewSize = _useState11[0],
      setviewSize = _useState11[1];
  /**
   * line的位置（上左定位）
   *内容区和label区的分割线的位置
   */


  var _useState12 = React.useState({
    x: 0,
    y: 0
  }),
      linePosition = _useState12[0],
      setlinePosition = _useState12[1];

  var _useState13 = React.useState(0),
      labelSpace = _useState13[0],
      setlabelSpace = _useState13[1];
  /**
   * line的尺寸
   */


  var _useState14 = React.useState({
    height: 0,
    size: 0
  }),
      lineSize = _useState14[0],
      setlineSize = _useState14[1];
  /**
   * line的颜色
   */


  var _useState15 = React.useState(""),
      lineColor = _useState15[0],
      setlineColor = _useState15[1];
  /**
   * ============================网格线 属性state===========================
   */

  /**
   * 网格线组
   */


  var _useState16 = React.useState([]),
      netLineArr = _useState16[0],
      setnetLineArr = _useState16[1];
  /**
   * 网格线的最大数量
   */


  var _useState17 = React.useState(0),
      netLineMaxCount = _useState17[0],
      setnetLineMaxCount = _useState17[1];
  /**
   * 轴网格线最小数量
   */


  var _useState18 = React.useState(0),
      netLineMinCount = _useState18[0],
      setnetLineMinCount = _useState18[1];
  /**
   * ============================tick 属性state===========================
   */

  /**
   * 显示tick组（用于显示的tick）
   */


  var _useState19 = React.useState([]),
      displayTickArr = _useState19[0],
      setdisplayTickArr = _useState19[1];

  var _useState20 = React.useState(0),
      tickLength = _useState20[0],
      settickLength = _useState20[1];
  /**
   * ==========================静态常量==============================
   */
  //计算用的缩进


  var _shiftLength = 18; //显示时取小数点后几位

  var displayFix = 7;
  /**
   * ==========================函数==============================
   */

  /**
   * 更新轴 (所有数字都依据_shiftLength转换成大数字用BigNumber.js进行计算 )
   *@param  {number} viewWidth 界面的全量宽度
   *@param  {number} viewHeight 界面的全量高度
   *@param {numberScope} dataScope 数据范围
   *@returns {void}
   */

  var updateAxisSates = function updateAxisSates(viewWidth, viewHeight, dataScope) {
    var _dataScope = {
      start: new _bigNumber(dataScope.start).times(new _bigNumber(10).exponentiatedBy(_shiftLength).toFixed()).toFixed(0),
      end: new _bigNumber(dataScope.end).times(new _bigNumber(10).exponentiatedBy(_shiftLength).toFixed()).toFixed(0)
    };
    var scopeResult = expandDataSpanceEdge(_dataScope);

    if (viewWidth === viewSize.width && viewHeight === viewSize.height && scopeResult.dataScope === currentDataScope) {
      return;
    }
    /* 设置各项属性 */


    setviewSize({
      width: viewWidth,
      height: viewHeight
    });
    setlinePosition({
      x: viewWidth - getSpaceSize(initArgs.labelSpace, viewWidth),
      y: 0
    });
    setlineSize({
      height: viewHeight - getSpaceSize(xAxis.initArgs.labelSpace, viewHeight) + 1,
      size: initArgs.lineSize
    });
    setlabelSpace(getSpaceSize(initArgs.labelSpace, viewHeight)); //计算数据边距
    //let _currentDataSpace = new _bigNumber(shiftNumber(dataScope.end - dataScope.start, _shiftLength)).toString();
    ////
    // dataScope.start - _currentDataSpace * initArgs.displayPadding!,

    setcurrentDataScope(scopeResult.dataScope);
    setcurrentDataSpace(scopeResult.currentDataSpace);
    setcurrentDataPositionofStart(new _bigNumber(dataScope.start).minus("0").toString());
    settickLength(getSpaceSize(initArgs.tickLength, viewWidth));
    setlineColor(initArgs.lineColor);
    setnetLineMaxCount(initArgs.netLineMaxCount);
    setnetLineMinCount(initArgs.netLineMinCount);
  };

  var update = function update(viewWidth, viewHeight) {
    /* 设置各项属性 */
    setviewSize({
      width: viewWidth,
      height: viewHeight
    });
    setlinePosition({
      x: viewWidth - getSpaceSize(initArgs.labelSpace, viewWidth),
      y: 0
    });
    setlineSize({
      height: viewHeight - getSpaceSize(xAxis.initArgs.labelSpace, viewHeight) + 1,
      size: initArgs.lineSize
    });
    setlabelSpace(getSpaceSize(initArgs.labelSpace, viewHeight));
    settickLength(getSpaceSize(initArgs.tickLength, viewWidth));
    setlineColor(initArgs.lineColor);
    setnetLineMaxCount(initArgs.netLineMaxCount);
    setnetLineMinCount(initArgs.netLineMinCount);
  }; //扩展数据范围边界（使得显示范围不显得局促）


  var expandDataSpanceEdge = function expandDataSpanceEdge(input) {
    var result = _extends({}, input);

    var currentDataSpace = new _bigNumber(input.end).minus(input.start).toString();

    var _expandAmount = new _bigNumber(currentDataSpace).times(initArgs.displayPadding);

    currentDataSpace = new _bigNumber(currentDataSpace).plus(_expandAmount).toString();
    result.start = new _bigNumber(input.start).minus(new _bigNumber(_expandAmount).div(2)).toString();
    result.end = new _bigNumber(input.end).plus(new _bigNumber(_expandAmount).div(2)).toString();
    return {
      dataScope: result,
      currentDataSpace: currentDataSpace
    };
  }; //扩展像素范围边界（使得显示范围不显得局促）


  var expandDataSpanceEdgePIX = function expandDataSpanceEdgePIX(input) {
    var result = _extends({}, input);

    var currentDataSpace = new _bigNumber(input.start).minus(input.end).toString();

    var _expandAmount = new _bigNumber(currentDataSpace).times(initArgs.displayPadding);

    currentDataSpace = new _bigNumber(currentDataSpace).plus(_expandAmount).toString();
    result.start = Number(new _bigNumber(input.start).plus(new _bigNumber(_expandAmount).div(2)).toString());
    result.end = Number(new _bigNumber(input.end).minus(new _bigNumber(_expandAmount).div(2)).toString());
    return {
      dataScope: result,
      currentDataSpace: currentDataSpace
    };
  };
  /**
   * tick种子计算
   * 给定一个区间【开始，结束】，这是一段范围，需要在这个范围里找到8~4个tick
   * 这个tick需要满足以下条件
   * 1.显示tick的空间只能显示7位数字加一个小数点
   * 2.需要考虑到大于7位数字显示的情况
   * 3.需要考虑1位数字+6位小数的情况
   * (所有数字都依据_shiftLength转换成大数字用BigNumber.js进行计算 )
   *
   *
   * 解决思路：
   * 1.【开始，结束】【1.123456，4.215463】里的数字都*1000000 就算碰到1.123456遮掩的数字，也能进行整除处理 =》 【1123456，4215463】
   * 2.给“开始”数字例如 1123456 进行取整，从10位开始，先取成1123460,先计算跨度 4215463 - 1123460 =3092003 然后计算3092003/10 得到309200.3 我们的目标是<8，所以继续以此类推...
   * 3.上一个数字继续取整 1123460 进行取整，但是这次 10*2=20，那么先取成 1123480 ,先计算跨度 4215463 - 1123480 =3091983,然后计算3091983/20 得到154599.15 我们的目标是<8，所以继续以此类推...
   * 4.上一个数字继续取整 1123480 进行取整，但是这次 20*2=40，那么先取成 1123520 ,先计算跨度 4215463 - 1123520 =3091943,然后计算3091943/40 得到77298.575 我们的目标是<8，所以继续以此类推...
   * 5.上一个数字继续取整 1123520 进行取整，但是这次 40*2=80，那么先取成 1123600 ,先计算跨度 4215463 - 1123600 =3091863,然后计算3091863/80 得到38648.2875 我们的目标是<8，所以继续以此类推...
   * 6.上一个数字继续取整 1123600 进行取整，但是这次 80*2=160，那么先取成 1123760 ,先计算跨度 4215463 - 1123760 =3091703,然后计算3091703/160 得到19323.14375 我们的目标是<8，所以继续以此类推...
   * 7.上一个数字继续取整 1123760 进行取整，但是这次 160*2=380，那么先取成 1121140 ,先计算跨度 4215463 - 1121140 =3094323,然后计算 3094323/380 得到8142.9552631578945 我们的目标是<8，所以继续以此类推...
   * 8.上一个数字继续取整 1121140 进行取整，但是这次 380*2=760，那么先取成 1121800 ,先计算跨度 4215463 - 1121800 =3093663,然后计算 3093663/760 得到4070.6092105263156 我们的目标是<8，所以继续以此类推...
   * 9.上一个数字继续取整 1121800 进行取整，但是这次 760*2=1520，那么先取成 1123300 ,先计算跨度 4215463 - 1123300 =3092163,然后计算 3092163/1520 得到2034.3177631578947 我们的目标是<8，所以继续以此类推...
   * 10.上一个数字继续取整 1123300 进行取整，但是这次 1520*2=3040，那么先取成 1126340 ,先计算跨度 4215463 - 1126340 =3089123,然后计算 3089123/3040 得到1016.1588815789473 我们的目标是<8，所以继续以此类推...
   * 11.上一个数字继续取整 1126340 进行取整，但是这次 3040*2=6080，那么先取成 1132420 ,先计算跨度 4215463 - 1132420 =3083043,然后计算 3083043/6080 得到507.07944078947367 我们的目标是<8，所以继续以此类推...
   * 12.上一个数字继续取整 1132420 进行取整，但是这次 6080*2=12160，那么先取成 1144580 ,先计算跨度 4215463 - 1144580 =3070883,然后计算 3070883/12160 得到252.53972039473683 我们的目标是<8，所以继续以此类推...
   * 13.上一个数字继续取整 1144580 进行取整，但是这次 12160*2=24320，那么先取成 1168900 ,先计算跨度 4215463 - 1168900 =3046563,然后计算 3046563/24320 得到125.26986019736842 我们的目标是<8，所以继续以此类推...
   * 14.上一个数字继续取整 1168900 进行取整，但是这次 24320*2=48640，那么先取成 1217540 ,先计算跨度 4215463 - 1217540 =2997923,然后计算 2997923/48640 得到61.63493009868421 我们的目标是<8，所以继续以此类推...
   * 15.上一个数字继续取整 1217540 进行取整，但是这次 48640*2=97280，那么先取成 1217540 ,先计算跨度 4215463 - 1314820 =2900643,然后计算 2900643/97280 得到61.63493009868421 我们的目标是<8，所以继续以此类推...
   * 16.上一个数字继续取整 1217540 进行取整，但是这次 97280*2=194560 ，那么先取成 1412100 ,先计算跨度 4215463 - 1412100 =2803363,然后计算 2803363/194560 得到14.408732524671052 我们的目标是<8，所以继续以此类推...
   * 17.上一个数字继续取整 1412100 进行取整，但是这次 194560*2=389120 ，那么先取成 1801220 ,先计算跨度 4215463 - 1801220 =2414243,然后计算 2414243/389120 得到6.204366262335526 我们的目标是<8，任务完成；
   * 1801220 / 6.204366262335526 得到每步
   * 然后再用 【每步的数字】 / 1000000
   *
   * 实际计算和上面写的算法有一点点不太一样，每次计算完成后不再是step * 2  而是 step + “0” 也就是加一位数
   *
   */


  var getTickSeed = function getTickSeed() {
    var dataScope = _extends({}, currentDataScope);

    var resultTickArr = []; //范围的计算数值(直接加权7位数进行运算，算完再换算回来 )

    var scope = {
      start: dataScope.start,
      end: dataScope.end
    }; //步数

    var step = "10";
    var stepAdd = "10"; //取整范围

    var intGetPar = "10";
    var tickCount = "8";
    var startInteger = roundToNearestTenBigNumber(scope.start, Number(intGetPar));

    while (true) {
      //算跨度
      //scope.end - startInteger
      var scDf = new _bigNumber(scope.end).minus(startInteger).toString(); //算数量
      //scDf / step

      tickCount = new _bigNumber(scDf).div(step).toFixed().toString(); //看算出来的数量是否大于最大数量，大于的话就继续算

      if (new _bigNumber(tickCount).gt(initArgs.netLineMaxCount)) {
        //把step 加一个0
        var postStep = (Number(step) + Number(stepAdd)).toString();
        /**
         * 这里的思路较原思路有所改变
         * 当step每多一个位 就将每个step的步进多加一位 例如原来的步进是10 如果现在step是100 那么步进就要来到100
         * 取整范围也是，比如之前是个位数取整，步进多了一位就要变成十位取整，以此类推
         */

        if (postStep.length > step.length) {
          stepAdd = stepAdd + "0";
          intGetPar = intGetPar + "0";
          startInteger = roundToNearestTenBigNumber(scope.start, Number(intGetPar));
        }

        step = postStep;
      } else {
        break;
      }
    } //算出每个tick的数据


    for (var i = 0; i < Number(tickCount); i++) {
      //startInteger + (step * i)
      resultTickArr.push(new _bigNumber(startInteger).plus(new _bigNumber(step).times(i)).toString());
    }

    return resultTickArr;
  };
  /**
   * 取得显示tick
   */


  var computDisplayTicks = function computDisplayTicks(tickSeed) {
    var result = [];
    var index = 0;

    for (var _iterator = _createForOfIteratorHelperLoose(tickSeed), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      result.push({
        index: index,
        color: initArgs.tickColor,
        length: getSpaceSize(initArgs.tickLength, viewSize.width),
        size: initArgs.tickSize,
        cPosition: {
          x: linePosition.x,
          y: function () {
            var pre = Number(new _bigNumber(item).minus(currentDataScope.start).div(currentDataSpace).toFixed(_shiftLength));
            return lineSize.height - lineSize.height * pre;
          }()
        },
        value: item,
        displayValue: new _bigNumber(shiftNumber(item, -_shiftLength)).toFixed(displayFix)
      });
      index++;
    }

    return result;
  };
  /**
   * 取得显示line
   */


  var computDisplayLines = function computDisplayLines(tickSeed) {
    var result = [];

    for (var _iterator2 = _createForOfIteratorHelperLoose(tickSeed), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;
      result.push({
        color: initArgs.netLineColor,
        length: linePosition.x,
        size: initArgs.netLineSize,
        cPosition: {
          x: 0,
          y: function () {
            var pre = Number(new _bigNumber(item).minus(currentDataScope.start).div(currentDataSpace).toFixed(_shiftLength));
            return lineSize.height - lineSize.height * pre;
          }()
        },
        value: item
      });
    }

    return result;
  };
  /**
   * 计算tick
   */


  var computTicks = function computTicks() {
    //获得当前轴的整数列（种子）
    var tickSeed = getTickSeed();

    var _displayTickArr = computDisplayTicks(tickSeed);

    var _netLineArr = computDisplayLines(tickSeed);

    setdisplayTickArr(_displayTickArr);
    setnetLineArr(_netLineArr);
    setisFinishedInit(true);
    setyAxisUpdateTimeStamp(+new Date());
  };
  /**
   * 计算tooltip
   */


  var tooltipMove = function tooltipMove(position, isShowTooltip) {
    var tooltipY = position.y;

    if (tooltipY > lineSize.height) {
      isShowTooltip = false;
    }

    settooltipIsShow(isShowTooltip);

    if (isShowTooltip === false) {
      return;
    }

    var pre = 1 - tooltipY / lineSize.height;
    var value = new _bigNumber(currentDataScope.start).plus(new _bigNumber(currentDataSpace).times(pre)).toString();
    var _tooltipState = {
      position: {
        x: 0,
        y: tooltipY
      },
      length: linePosition.x,
      value: value,
      displayValue: new _bigNumber(shiftNumber(value, -_shiftLength)).toFixed(displayFix),
      relatedTickItem: null,
      size: getSpaceSize(initArgs.tooltip.lineSize, viewSize.width)
    };
    setTooltipState(_tooltipState);
  };
  /**
   * ==================================Effects===============================
   */


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }

    return function () {
      setIsMounted(false);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(function () {
    if (currentDataSpace !== "0") {
      computTicks();
    }
  }, [currentDataScope]);
  React.useEffect(function () {
    if (initArgsChange !== -1) {
      update(viewSize.width, viewSize.height);
    }
  }, [initArgsChange]);
  return {
    data: {
      isFinishedInit: isFinishedInit,
      tooltipState: tooltipState,
      tooltipIsShow: tooltipIsShow,
      currentDataScope: currentDataScope,
      currentDataSpace: currentDataSpace,
      currentDataPositionOfStart: currentDataPositionOfStart,
      viewSize: viewSize,
      linePosition: linePosition,
      labelSpace: labelSpace,
      lineColor: lineColor,
      netLineArr: netLineArr,
      netLineMaxCount: netLineMaxCount,
      netLineMinCount: netLineMinCount,
      displayTickArr: displayTickArr,
      lineSize: lineSize,
      tickLength: tickLength,
      yAxisUpdateTimeStamp: yAxisUpdateTimeStamp
    },
    funcs: {
      updateAxisSates: updateAxisSates,
      tooltipMove: tooltipMove,
      expandDataSpanceEdge: expandDataSpanceEdge,
      expandDataSpanceEdgePIX: expandDataSpanceEdgePIX,
      setinitArgs: function setinitArgs(arg) {
        _setinitArgs(Object.assign(true, initArgs, arg));

        setinitArgsChange(+new Date());
      }
    },
    initArgs: initArgs
  };
};

/**
 * 节流钩子
 */

var useThrottle = function useThrottle() {
  /**
   * ============================state===========================
   */
  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1];

  var ThrottleFunction = React.useRef(null);
  var ThrottleTimeOut = React.useRef(null);
  /**
   * ==========================函数==============================
   */

  var Throttle = function Throttle(_func, _time) {
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


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }

    return function () {
      setIsMounted(false);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return Throttle;
};

/**
 * 数据处理钩子
 *
 * 1.静态模式下拿到数据的处理步骤
 *	 1.1 全部由过去到现在进行一遍排序
 *	 1.2 检查 data[0] ~ data[1] 的时间范围是否为当前设置的时间类型的时间范围：
 *			1.2.1 如果比当前设置的时间范围小，就进行归并
 *			1.2.3 归并之后的数据放进allComputedCandleData堆里
 *			1.2.4 如果比当前设置的时间范围大，就不进行任何操作，直接停止更新。
 *			1.2.4 如果等于当前设置的时间范围，就不进行归并操作，放进allComputedCandleData堆里。
 *	 1.3 根据x轴的tick 在 allComputedCandleData里找到的数据生成并计算完位置等信息后放进 displayCandleData
 *	 1.4 根据上面1.3的计算更新y轴的范围
 *
 *
 * 2.静态模式下移动和缩放时响应的方式：
 *	 2.1 根据x轴的tick 在 allComputedCandleData里找到的数据生成并计算完位置等信息后放进 displayCandleData
 *	 2.2 根据上面1.3的计算更新y轴的范围
 *
 * 但不是每次移动都这样，需要一个响亮来进行控制，当拖动速度很快时只进行移动计算，不往 displayarr里加入任何东西 只计算视图内的数据，同时发起webworker离线计算接下来可能要更新的数据
 *当速度小于某个值的时候，就把webworker算好的数据更新进来
 */

var useCandleHook = function useCandleHook(args, xAxis, yAxis, baseConfig) {
  xAxis = xAxis;
  yAxis = yAxis;

  var _useState = React.useState(lodash.merge(DEFAULTDATAVALUES, args)),
      initArgs = _useState[0],
      _setinitArgs = _useState[1];

  var updateThrottlereComputAllDisplayedCandleData = useThrottle();
  var updateThrottle = useThrottle();
  /**
   * ============================state===========================
   */

  var _useState2 = React.useState(false),
      isMounted = _useState2[0],
      setIsMounted = _useState2[1];

  var _useState3 = React.useState(""),
      setcurrentTimeTypeName = _useState3[1];

  var _useState4 = React.useState(0),
      miny = _useState4[0],
      setminy = _useState4[1];

  var _useState5 = React.useState(true),
      isFetchingData = _useState5[0],
      setisFetchingData = _useState5[1];

  var _useState6 = React.useState(-1),
      fetchDataStemp = _useState6[0],
      setfetchDataStemp = _useState6[1];

  var _useState7 = React.useState(null),
      streamData = _useState7[0],
      setstreamData = _useState7[1];

  var _useState8 = React.useState(false),
      stopDynamicFetching = _useState8[0],
      setstopDynamicFetching = _useState8[1];

  var _useState9 = React.useState({
    start: 0,
    end: 0
  }),
      setlastMaxMiny = _useState9[1];

  var _useState10 = React.useState(),
      setcurrentTimeZone = _useState10[1];

  var _useState11 = React.useState(),
      workMessage = _useState11[0];

  var _useState12 = React.useState([]);

  var _useState13 = React.useState(0),
      settotalDataPIXHeight = _useState13[1];

  var _useState14 = React.useState(0),
      setcleanY = _useState14[1]; //全量更新的时候才会更新这个guid,这个guid是用来判断每个candle是否需要进行重新计算的标志
  //每次全量更新会更新一次，每次都不太一样。


  var _useState15 = React.useState(""),
      currentGUIDUpdateTag = _useState15[0],
      setcurrentGUIDUpdateTag = _useState15[1];
  /**
   * 动态数据暂存处
   */


  var _useState16 = React.useState(null),
      TempDynamicData = _useState16[0],
      setTempDynamicData = _useState16[1];

  var _useState17 = React.useState(false),
      isFirstTimeUpdate = _useState17[0],
      setisFirstTimeUpdate = _useState17[1];
  /**
   * 是否已完成初始化
   */


  var _useState18 = React.useState(false),
      isFinishedInit = _useState18[0],
      setisFinishedInit = _useState18[1];

  var _useState19 = React.useState(false),
      isDQuickUpdateing = _useState19[0],
      setisDQuickUpdateing = _useState19[1];

  var _useState20 = React.useState(null),
      cursorCandleItem = _useState20[0],
      setCursorCandleItem = _useState20[1];

  var _useState21 = React.useState(null),
      latestCandleItem = _useState21[0],
      setlatestCandleItem = _useState21[1];
  /**
   * 上次更新的X轴时间戳
   */


  var _useState22 = React.useState(798);
  /**
   * volume 数据图表的高度
   */


  var _useState23 = React.useState(0),
      volumChartPixHeight = _useState23[0],
      setvolumChartPixHeight = _useState23[1];
  /**
   * volume 数据图表 当前视窗区域的最大值
   */


  var _useState24 = React.useState(0),
      volumChartViewMax = _useState24[0],
      setvolumChartViewMax = _useState24[1];
  /**
   * 是否为静态数据模式
   */


  var _useState25 = React.useState(false),
      isStaticData = _useState25[0],
      setisStaticData = _useState25[1];
  /**
   * 所有的candle数据（原始数据，未经过加工）
   */


  var _useState26 = React.useState([]),
      orgCandleData = _useState26[0],
      setorgCandleData = _useState26[1];
  /**
   * 用于显示的candle数据(经过加工和归并之后的数据 )
   */


  var _useState27 = React.useState([]),
      displayCandleData = _useState27[0],
      setdisplayCandleData = _useState27[1];
  /**
   * 记录当前视窗内y轴数据的最大值和最小值
   */


  var _useState28 = React.useState({
    start: "0",
    end: "0"
  }),
      displayCandleMaxMin = _useState28[0],
      setdisplayCandleMaxMin = _useState28[1];

  var _useState29 = React.useState({
    start: "0",
    end: "0"
  }),
      org_displayCandleMaxMin = _useState29[0],
      setorg_displayCandleMaxMin = _useState29[1];

  var _useState30 = React.useState(1),
      yScale = _useState30[0],
      setyScale = _useState30[1];

  var _useState31 = React.useState(1),
      setvolumeScale = _useState31[1];
  /**
   * latestCandle
   * 最新的candle
   * 最末尾的Candle
   */


  var _useState32 = React.useState();

  var _useState33 = React.useState(null),
      latestCandleToolTip = _useState33[0],
      setlatestCandleToolTip = _useState33[1];

  var _useState34 = React.useState(null),
      latestVolumeToolTip = _useState34[0],
      setlatestVolumeToolTip = _useState34[1];
  /**
   * 视图范围内最末尾的candle
   * 最新的candle
   */


  var _useState35 = React.useState(null),
      displayLatestCandle = _useState35[0],
      setdisplayLatestCandle = _useState35[1];

  var _useState36 = React.useState(null),
      latestdisplayLatestCandle = _useState36[0],
      setlatestdisplayLatestCandle = _useState36[1];

  var _useState37 = React.useState(null),
      latestdisplayLatestVolume = _useState37[0],
      setlatestdisplayLatestVolume = _useState37[1];
  /**
   * view的全量尺寸
   */


  var _useState38 = React.useState({
    width: 0,
    height: 0
  }),
      viewSize = _useState38[0],
      setviewSize = _useState38[1];

  var _useState39 = React.useState(-1),
      updateStamp = _useState39[0],
      setupdateStamp = _useState39[1];

  var _useState40 = React.useState(-1),
      initDyStamp = _useState40[0],
      setinitDyStamp = _useState40[1];
  /**
   * ==================================Ref===============================
   */

  /**
   * 所有的归并后的数据(数据来源于orgCandleData )
   */


  var allComputedCandleData = React.useRef({});
  var isUpdateing = React.useRef(false);
  var isQuickUpdateing = React.useRef(false);
  var mWorker = React.useRef();
  /**
   * ==========================静态常量==============================
   */
  //显示时取小数点后几位

  var displayFix = 7;
  /**
   * ==========================函数==============================
   */

  /**
   * 判断数据的事件跨度是否和当前设置的时间跨度相符
   */

  var determineTimeSpaceConsistent = function determineTimeSpaceConsistent(data) {
    if (data.length === 1) {
      return "smaller";
    }

    var inputDataTimeSpace = getRightDate(data[1].time) - getRightDate(data[0].time);
    var configDataTimeSpace = xAxis.data.currentTimeType.timeGap;

    if (inputDataTimeSpace === configDataTimeSpace) {
      return "same";
    } else if (inputDataTimeSpace > configDataTimeSpace) {
      return "bigger";
    }

    return "smaller";
  };

  var getMin = function getMin(item, start) {
    var result = start;

    if (result > Number(item.open)) {
      result = Number(item.open);
    }

    if (result > Number(item.close)) {
      result = Number(item.close);
    }

    if (result > Number(item.high)) {
      result = Number(item.high);
    }

    if (result > Number(item.low)) {
      result = Number(item.low);
    }

    return result;
  };

  var getMax = function getMax(item, end) {
    var result = end;

    if (result < Number(item.open)) {
      result = Number(item.open);
    }

    if (result < Number(item.close)) {
      result = Number(item.close);
    }

    if (result < Number(item.high)) {
      result = Number(item.high);
    }

    if (result < Number(item.low)) {
      result = Number(item.low);
    }

    return result;
  }; //按照当前的时间刻度归并数据（确保数据已经排序）
  //数据只支持比当前设置的最小单位小的
  //合并完数据就直接把数据放进allComputedCandleData堆里去了


  var mergeData = function mergeData(data) {
    //归并的方式是这样的，首先确保数据已经排序，排序顺序为从最早到最晚
    //那么我们可以从数组的最晚数据开始进行归并
    //拿取最后一个数据的时间，通过时间配置对象取到整数
    //将这个整数进行保存。然后归并到一个新的IcandleData对象里
    //继续下一个，
    //拿取下一个数据的时间，通过时间配置对象取到整数
    //通过当前的项目的整数时间和上一个对象的整数时间进行比对
    //一致就归并到一起
    //不一致就另起一个新的IcandleData 将数据放进去，以此类推到数组循环结束
    var _currentCandleStick = {
      time: -1,
      open: -1,
      close: -1,
      high: -1,
      low: -1,
      volume: 0
    };
    var prevItem = data[data.length - 1]; //let result: IcandleData[] = [];

    var _displayCandleMaxMin = {
      /**
       * 最低点
       * */
      start: "9999999999999999999999",

      /**
       * 最高点
       * */
      end: "-9999999999999999999999"
    };

    for (var i = data.length - 1; i > -1; i--) {
      var item = data[i];
      var time = xAxis.data.currentTimeType.roundingFunction(getRightDate(item.time), baseConfig.timeZone.displayTimeZone);

      if (_currentCandleStick.time === -1 || time !== _currentCandleStick.time) {
        if (time !== _currentCandleStick.time && _currentCandleStick.time !== -1 && typeof allComputedCandleData.current[_currentCandleStick.time] === "undefined") {
          allComputedCandleData.current[_currentCandleStick.time] = _currentCandleStick;
        }

        _currentCandleStick = {
          time: time,
          open: -1,
          close: -1,
          high: "-9999999999999999999999",
          low: "9999999999999999999999",
          volume: 0
        };
      }

      _currentCandleStick.open = item.open;

      if (time < xAxis.data.currentTimeType.roundingFunction(getRightDate(prevItem.time), baseConfig.timeZone.displayTimeZone) || _currentCandleStick.close === -1) {
        _currentCandleStick.close = item.close;
      }

      if (Number(_currentCandleStick.high) < Number(item.high)) {
        _currentCandleStick.high = item.high;
      }

      if (Number(_currentCandleStick.low) > Number(item.low)) {
        _currentCandleStick.low = item.low;
      }

      _displayCandleMaxMin.start = getMin(item, Number(_displayCandleMaxMin.start)).toString();
      _displayCandleMaxMin.end = getMax(item, Number(_displayCandleMaxMin.end)).toString();
      _currentCandleStick.volume = Number(_currentCandleStick.volume) + Number(item.volume);
      prevItem = item;

      if (i === 0) {
        allComputedCandleData.current[_currentCandleStick.time] = _currentCandleStick;
      }
    }

    return _displayCandleMaxMin;
  };
  /**
   * 将数据直接放进allComputedCandleData
   * @param data 输入数据
   */


  var putDataIntoAllComputedCandleData = function putDataIntoAllComputedCandleData(data) {
    var _displayCandleMaxMin = {
      /**
       * 最低点
       * */
      start: "9999999999999999999999",

      /**
       * 最高点
       * */
      end: "-9999999999999999999999"
    };

    for (var _iterator = _createForOfIteratorHelperLoose(data), _step; !(_step = _iterator()).done;) {
      var item = _step.value;

      if (typeof allComputedCandleData.current[item.time] === "undefined") {
        _displayCandleMaxMin.start = getMin(item, Number(_displayCandleMaxMin.start)).toString();
        _displayCandleMaxMin.end = getMax(item, Number(_displayCandleMaxMin.end)).toString();
        allComputedCandleData.current[item.time] = _extends({}, item);
      }
    }

    return _displayCandleMaxMin;
  };

  var getCandleColor = function getCandleColor(start, end, type) {
    if (Number(start) > Number(end)) {
      if (type === "wick") return initArgs.candleStyles.wickFallColor;
      if (type === "candle") return initArgs.candleStyles.candleFallColor;
    }

    if (type === "wick") return initArgs.candleStyles.wickRiseColor;
    if (type === "candle") return initArgs.candleStyles.candleRiseColor;
    return "#fff";
  };

  var getCandleStatus = function getCandleStatus(start, end, type) {
    if (Number(start) > Number(end)) {
      if (type === "wick") return "fall";
      if (type === "candle") return "fall";
    }

    if (type === "wick") return "rise";
    if (type === "candle") return "rise";
    return "rise";
  };

  var getDataSpaceFromNumberScope = function getDataSpaceFromNumberScope(dataScope, start, end) {
    var space = Number(dataScope.end) - Number(dataScope.start);
    var cspace = end - start;
    var precent = Number((cspace / space).toFixed(5));
    var yHeight = xAxis.data.viewSize.height - getSpaceSize(xAxis.initArgs.labelSpace, xAxis.data.viewSize.height);
    return yHeight * precent;
  };

  var getDataY = function getDataY(dataScope, dataPoint) {
    var space = Number(dataScope.end) - Number(dataScope.start);
    var precent = Number(((Number(dataPoint) - Number(dataScope.start)) / space).toFixed(5));
    var yHeight = xAxis.data.viewSize.height - getSpaceSize(xAxis.initArgs.labelSpace, xAxis.data.viewSize.height);
    return yHeight - yHeight * precent;
  }; //用y轴数据计算单个指标的各种属性


  var computSingalCandledata = function computSingalCandledata( //进行计算的项目
  dataitem, //扩展后的范围（数据）
  dataScope, //是否强制全量渲染
  isForceAllDataConput) {
    if (isForceAllDataConput === void 0) {
      isForceAllDataConput = false;
    }

    dataitem.candleColor = getCandleColor(dataitem.open, dataitem.close, "candle");
    dataitem.wickColor = getCandleColor(dataitem.open, dataitem.close, "wick");
    dataitem.candleStateus = getCandleStatus(dataitem.open, dataitem.close, "candle");
    dataitem.wickStateus = getCandleStatus(dataitem.open, dataitem.close, "wick"); //快速渲染

    if (isQuickUpdateing.current == true && isForceAllDataConput === false) {
      dataitem.wickWidth = 1.2;
      dataitem.candlePixPosition = {
        x: 0,
        y: getDataY(dataScope, Math.max(Number(dataitem.close), Number(dataitem.open)).toString())
      };
      dataitem.wickPixPosition = {
        x: 0,
        y: getDataY(dataScope, dataitem.high.toString())
      };
      dataitem.wickLength = getDataSpaceFromNumberScope(dataScope, Number(dataitem.low), Number(dataitem.high)); //全量渲染
    } else {
      try {
        dataitem.candleWidth = getSpaceSize(initArgs.candleStyles.candleWidth, xAxis.data.displayTickCommonpixWidth);
        dataitem.wickWidth = getSpaceSize(initArgs.candleStyles.wickWidth, xAxis.data.displayTickCommonpixWidth);
      } catch (_e) {}

      dataitem.candlePixPosition = {
        x: 0,
        y: getDataY(dataScope, Math.max(Number(dataitem.close), Number(dataitem.open)).toString())
      };
      dataitem.wickPixPosition = {
        x: 0,
        y: getDataY(dataScope, dataitem.high.toString())
      };
      dataitem.candleLength = getDataSpaceFromNumberScope(dataScope, Math.min(Number(dataitem.open), Number(dataitem.close)), Math.max(Number(dataitem.open), Number(dataitem.close)));

      if (dataitem.candleLength < 1) {
        dataitem.candleLength = 1;
      }

      dataitem.wickLength = getDataSpaceFromNumberScope(dataScope, Number(dataitem.low), Number(dataitem.high));
    }

    try {
      //顺便计算单个tick的数据空间是否在最左边边缘
      //记录视图范围内最末尾的candle
      if (xAxis.data.lineSize.width - xAxis.data.x - dataitem.currentTick.pixSpace.start >= 0 && dataitem.currentTick.pixSpace.end - (xAxis.data.lineSize.width - xAxis.data.x) <= dataitem.currentTick.pixSpace.end - dataitem.currentTick.pixSpace.start) {
        setdisplayLatestCandle(dataitem);
      }
    } catch (_e) {}

    return dataitem;
  }; //用y轴数据计算单个指标的各种属性


  var computSingalCandledataMini = function computSingalCandledataMini( //candle项目
  dataitem) {
    try {
      //顺便计算单个tick的数据空间是否在最左边边缘
      //记录视图范围内最末尾的candle
      if (xAxis.data.lineSize.width - xAxis.data.x - dataitem.currentTick.pixSpace.start >= 0 && dataitem.currentTick.pixSpace.end - (xAxis.data.lineSize.width - xAxis.data.x) <= dataitem.currentTick.pixSpace.end - dataitem.currentTick.pixSpace.start) {
        setdisplayLatestCandle(dataitem);
      }
    } catch (_e) {}
  };
  /**
   * 从x轴指针里查找数据
   * @param tickArr x轴指针
   * @param dataScope 范围
   * @returns
   */


  var findDataByTicks = function findDataByTicks(tickArr) {
    var result = [];
    var _displayCandleMaxMin = {
      /**
       * 最低点
       * */
      start: "9999999999999999999999",

      /**
       * 最高点
       * */
      end: "-9999999999999999999999"
    };
    var maxVolume = -99999999999999;

    for (var inde_i = 0; inde_i < tickArr.length; inde_i++) {
      var item = tickArr[inde_i];

      if (typeof allComputedCandleData.current[item.value] !== "undefined") {
        var dataitem = allComputedCandleData.current[item.value];
        dataitem.currentTick = item;
        _displayCandleMaxMin.start = getMin(dataitem, Number(_displayCandleMaxMin.start)).toString();
        _displayCandleMaxMin.end = getMax(dataitem, Number(_displayCandleMaxMin.end)).toString();

        if (maxVolume < Number(dataitem.volume)) {
          maxVolume = Number(dataitem.volume);
        }

        result.push(dataitem);
      }
    }

    setvolumChartViewMax(maxVolume);
    return {
      data: result,
      scope: _displayCandleMaxMin
    };
  }; //将数据里所有的时间按照用户设置的数据源时区还原GMT +0000，然后再设置到显示时区


  var seAllDataDateToUserConfigedGMT = function seAllDataDateToUserConfigedGMT(data) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(data), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;

      //如果填写的是"本地时间"，就不做任何操作
      if (baseConfig.timeZone.dataSourceTimeZone === "local") {
        item.time = getRightDate(item.time);
      } else {
        //否则，先把时间按照用户设置的归零，然后再设置到显示时间
        item.time = anyTimeToGMT0000ToTarget(getRightDate(item.time), baseConfig.timeZone.dataSourceTimeZone, baseConfig.timeZone.displayTimeZone);
      }
    }

    return data;
  };
  /**
   * 初始化动态数据
   */


  var initDynamicData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var _initArgs$candleStyle, _initArgs$candleStyle2;

      var endTime, preTime, _timeInteger, timeZoneD, date, localtimeZone, startTime, result, heightPixVolumArea;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //清空堆数据
              Object.keys(allComputedCandleData.current).forEach(function (key) {
                return delete allComputedCandleData.current[key];
              });
              setupdateStamp(-1);
              setorgCandleData([]);
              setdisplayCandleData([]);
              setyScale(1);
              setvolumeScale(1);
              setminy(0);
              settotalDataPIXHeight(0);
              setcleanY(0);
              setisFetchingData(true);
              setCursorCandleItem(null);
              setlatestCandleItem(null);
              setvolumChartPixHeight(0);
              setvolumChartViewMax(0);
              setdisplayCandleMaxMin({
                start: "0",
                end: "0"
              });
              setorg_displayCandleMaxMin({
                start: "0",
                end: "0"
              });
              setlatestCandleToolTip(null);
              setlatestVolumeToolTip(null);
              setdisplayLatestCandle(null);
              setlatestdisplayLatestCandle(null);
              setlatestdisplayLatestVolume(null);
              allComputedCandleData.current = {};
              isUpdateing.current = false;
              isQuickUpdateing.current = false;
              setisFinishedInit(false);
              setstopDynamicFetching(false); // TODO: 1.获得时间范围，获得当前x轴时间范围的end,然后往后推用户设置的数据条数（也就是时间单位）

              endTime = xAxis.data.currentTimeScope.end;
              preTime = initArgs.dynamicData.dataFetchCountPreTime;
              /**
               * 当前的整数时间
               */

              _timeInteger = xAxis.data.currentTimeType.roundingFunction(endTime, 0);
              timeZoneD = 0;

              if (baseConfig.timeZone.displayTimeZone === "local") {
                date = new Date();
                localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
                timeZoneD = localtimeZone;
              } else {
                timeZoneD = baseConfig.timeZone.displayTimeZone;
              }

              endTime = anyTimeToGMT0000ToTarget(_timeInteger, timeZoneD, baseConfig.timeZone.fetchConditionTimeZone);
              /**
               * 获得末尾时间
               */

              startTime = xAxis.data.currentTimeType.backwardTimeUnit(endTime, preTime, baseConfig.timeZone.displayTimeZone);
              _context.next = 35;
              return initArgs.dynamicData.dataFetchCallback(xAxis.data.currentTimeType.name, startTime, endTime);

            case 35:
              result = _context.sent;

              if (result.length !== 0) {
                setisFirstTimeUpdate(true);
                setTempDynamicData(seAllDataDateToUserConfigedGMT(result));
              } //计算volum图的像素高度


              heightPixVolumArea = getSpaceSize((_initArgs$candleStyle = initArgs.candleStyles) == null ? void 0 : (_initArgs$candleStyle2 = _initArgs$candleStyle.volumChart) == null ? void 0 : _initArgs$candleStyle2.volumeChartHeight, xAxis.data.linePosition.y);
              setvolumChartPixHeight(heightPixVolumArea);
              setisFetchingData(false);
              setisFinishedInit(true);

            case 41:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function initDynamicData() {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * 在数据滚动或者缩放时发起的动态数据拉取
   */


  var lunchDynamicData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(endTime) {
      var startTime, timeZoneD, date, localtimeZone, result, intTime;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!isFetchingData) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              setisFetchingData(true);
              /**
               * 获得末尾时间
               */

              startTime = xAxis.data.currentTimeType.backwardTimeUnit(endTime, initArgs.dynamicData.dataFetchCountPreTime, 0);
              timeZoneD = 0;

              if (baseConfig.timeZone.displayTimeZone === "local") {
                date = new Date();
                localtimeZone = Math.abs(date.getTimezoneOffset() / 60);
                timeZoneD = localtimeZone;
              } else {
                timeZoneD = baseConfig.timeZone.displayTimeZone;
              } //如果设置了时间归零
              //查询时间会被错开，所以查询的时候就再还原一下时间


              startTime = anyTimeToGMT0000ToTarget(startTime, timeZoneD, baseConfig.timeZone.fetchConditionTimeZone);
              endTime = anyTimeToGMT0000ToTarget(endTime, timeZoneD, baseConfig.timeZone.fetchConditionTimeZone);
              _context2.next = 10;
              return initArgs.dynamicData.dataFetchCallback(xAxis.data.currentTimeType.name, startTime, endTime);

            case 10:
              result = _context2.sent;

              if (!(typeof result === "undefined" || result === null)) {
                _context2.next = 14;
                break;
              }

              setstopDynamicFetching(true);
              return _context2.abrupt("return");

            case 14:
              if (!(result.length === 1)) {
                _context2.next = 19;
                break;
              }

              intTime = anyTimeToGMT0000ToTarget(Number(result[0].time), baseConfig.timeZone.dataSourceTimeZone, baseConfig.timeZone.displayTimeZone); //说明数据已经到头了

              if (!(intTime === displayCandleData[0].time)) {
                _context2.next = 19;
                break;
              }

              setstopDynamicFetching(true);
              return _context2.abrupt("return");

            case 19:
              if (result.length !== 0) {
                setTempDynamicData(seAllDataDateToUserConfigedGMT(result));
              }

              setisFetchingData(false);

            case 21:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function lunchDynamicData(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * 更新动态数据
   */


  var updateDynamicData = function updateDynamicData(data) {
    if (isFetchingData) {
      return;
    }

    if (!isFinishedInit) {
      return;
    } //排序


    var _data = data.sort(function (a, b) {
      return getRightDate(a.time) - getRightDate(b.time);
    }); //判断时间类型是不是一致，还是大了还是小了


    var isConsistentOfDateType = determineTimeSpaceConsistent(data); //大了就没办法了，直接return

    if (isConsistentOfDateType === "bigger") {
      console.log("The time interval of the data is inconsistent with the given configured time interval!");
      return;
    } //将新数据加入到当前现有的数据里去
    //小了的话就按照配置的时间类型进行归并


    if (isConsistentOfDateType === "smaller") {
      mergeData(_data);
    } else {
      //如果是一致的，就直接将这些数据放进堆里
      putDataIntoAllComputedCandleData(_data);
    } //新老数据合并做个备份


    var _orgCandleData = [].concat(_data, orgCandleData);

    setorgCandleData(_orgCandleData);

    if (isFirstTimeUpdate) {
      setisFirstTimeUpdate(false);
      setinitDyStamp(+new Date());
    } else {
      setfetchDataStemp(+new Date());
    }
  };
  /**
   * 初始化静态数据
   */


  var initStaticData = function initStaticData() {
    var _initArgs$candleStyle3, _initArgs$candleStyle4;

    //清空堆数据
    Object.keys(allComputedCandleData.current).forEach(function (key) {
      return delete allComputedCandleData.current[key];
    }); //排序

    var _orgCandleData = seAllDataDateToUserConfigedGMT(initArgs.staticData.sort(function (a, b) {
      return getRightDate(a.time) - getRightDate(b.time);
    })); //判断时间类型是不是一致，还是大了还是小了


    var isConsistentOfDateType = determineTimeSpaceConsistent(_orgCandleData); //大了就没办法了，直接return

    if (isConsistentOfDateType === "bigger") {
      console.log("The time interval of the data is inconsistent with the given configured time interval!");
      return;
    }

    var dataScope = {
      start: "500",
      end: "700"
    }; //小了的话就按照配置的时间类型进行归并

    if (isConsistentOfDateType === "smaller") {
      dataScope = mergeData(_orgCandleData);
    } else {
      //如果是一致的，就直接将这些数据放进堆里
      dataScope = putDataIntoAllComputedCandleData(_orgCandleData);
    } //dataScope	这个scope是指所有数据的scope,并不是当前屏幕显示范围的scope
    //用于显示的数据


    var result = findDataByTicks(xAxis.data.tickArr);

    for (var _iterator3 = _createForOfIteratorHelperLoose(result.data), _step3; !(_step3 = _iterator3()).done;) {
      var item = _step3.value;
      item = computSingalCandledata(item, result.scope);
    }

    dataScope = result.scope; //计算volum图的像素高度

    var heightPixVolumArea = getSpaceSize((_initArgs$candleStyle3 = initArgs.candleStyles) == null ? void 0 : (_initArgs$candleStyle4 = _initArgs$candleStyle3.volumChart) == null ? void 0 : _initArgs$candleStyle4.volumeChartHeight, xAxis.data.linePosition.y);
    setvolumChartPixHeight(heightPixVolumArea);
    setorgCandleData(_orgCandleData);
    setdisplayCandleData(result.data);
    setviewSize(xAxis.data.viewSize);
    setisFinishedInit(true);
    setorg_displayCandleMaxMin(result.scope);
    setyScale(1);
    setvolumeScale(1);
    setminy(0);
    settotalDataPIXHeight(xAxis.data.linePosition.y);
    setcleanY(0); //更新y轴

    yAxis.funcs.updateAxisSates(xAxis.data.viewSize.width, xAxis.data.viewSize.height, {
      start: Number(dataScope.start),
      end: Number(dataScope.end)
    });
    setdisplayCandleMaxMin(dataScope);
    setupdateStamp(+new Date());
    setisFetchingData(false);
  }; //只计算缩放和刚进来的数据，不进行全量更新
  //这个算法主要的运算方式是：
  //1.重新用xAxis.data.tickArr循环一遍，从哈希表里直接取到当前的显示canle组
  //2.然后循环取出来的列表再循环一次计算位置，
  //3.计算位置的时候判断这个列表里有哪些candle项目已经被计算过计算过的就不算了，没计算过的计算一下


  var updatePartialCandleData = function updatePartialCandleData() {
    var _xAxisdatatickArr = [].concat(xAxis.data.tickArr);

    var _viewSize = _extends({}, xAxis.data.viewSize);

    var _org_displayCandleMaxMin = _extends({}, org_displayCandleMaxMin);

    var isQuickUpdateing_current = isQuickUpdateing.current; //用于显示的数据

    var result = findDataByTicks(_xAxisdatatickArr);
    result.data = result.data.sort(function (a, b) {
      return getRightDate(a.time) - getRightDate(b.time);
    }); //result.data 为 和目前x轴tick的交集displaycandles
    //result.scope 为扩展之前的数据范围 真实的数据范围

    if (result.data.length === 0) {
      //没找到
      setdisplayCandleData([]);
      checkDynamicData();
      return;
    } //先通知y轴更新了


    requestAnimationFrame(function () {
      //更新y轴
      yAxis.funcs.updateAxisSates(_viewSize.width, _viewSize.height, {
        start: Number(result.scope.start),
        end: Number(result.scope.end)
      });
    }); //上次缩放或重置后使用的最大值最小值(数据范围，不是像素 )
    //而且是未经扩展过的数据范围（素）的

    var orgMaxMiny = {
      //start 找 y+length 最大的
      start: -9999999999999999,
      //end找y最小的
      end: 99999999999999
    }; //进行数据计算

    for (var _iterator4 = _createForOfIteratorHelperLoose(result.data), _step4; !(_step4 = _iterator4()).done;) {
      var item = _step4.value;

      //全部进行全量计算
      //如果上次更新的tag和现在当前的值不一致，说明是上次缩放后还没来得及计算的元素
      //这样的元素就需要重新进行计算，
      //否则就不需要进行计算
      if (typeof item.updateTag === "undefined" || item.updateTag !== currentGUIDUpdateTag || item.time === latestCandleItem.time) {
        item = computSingalCandledata(item, _org_displayCandleMaxMin);
        item.updateTag = currentGUIDUpdateTag;
      } else {
        computSingalCandledataMini(item);
      }

      if (isQuickUpdateing_current) {
        var _item$wickPixPosition, _item$wickPixPosition3;

        if (Number((_item$wickPixPosition = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition.y) + Number(item.wickLength) > orgMaxMiny.start) {
          var _item$wickPixPosition2;

          //求（像素）y最大值
          orgMaxMiny.start = Number((_item$wickPixPosition2 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition2.y) + Number(item.wickLength);
        } //求（像素）y最小值


        if (Number((_item$wickPixPosition3 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition3.y) < orgMaxMiny.end) {
          var _item$wickPixPosition4;

          orgMaxMiny.end = Number((_item$wickPixPosition4 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition4.y);
        }
      } else {
        var _item$candlePixPositi, _item$wickPixPosition5, _item$candlePixPositi3, _item$wickPixPosition7;

        if (Math.max(Number((_item$candlePixPositi = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi.y) + Number(item.candleLength), Number((_item$wickPixPosition5 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition5.y) + Number(item.wickLength)) > orgMaxMiny.start) {
          var _item$candlePixPositi2, _item$wickPixPosition6;

          //求（像素）y最大值
          orgMaxMiny.start = Math.max(Number((_item$candlePixPositi2 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi2.y) + Number(item.candleLength), Number((_item$wickPixPosition6 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition6.y) + Number(item.wickLength));
        } //求（像素）y最小值


        if (Math.min(Number((_item$candlePixPositi3 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi3.y), Number((_item$wickPixPosition7 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition7.y)) < orgMaxMiny.end) {
          var _item$candlePixPositi4, _item$wickPixPosition8;

          orgMaxMiny.end = Math.min(Number((_item$candlePixPositi4 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi4.y), Number((_item$wickPixPosition8 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition8.y));
        }
      }
    }

    var currentheight = orgMaxMiny.start - orgMaxMiny.end;
    var expendHeight = currentheight + currentheight * yAxis.initArgs.displayPadding;
    var scale = yAxis.data.lineSize.height / expendHeight;
    var y = -orgMaxMiny.end + currentheight * yAxis.initArgs.displayPadding / 2;
    settotalDataPIXHeight(currentheight + currentheight * yAxis.initArgs.displayPadding);
    setcleanY(orgMaxMiny.end);
    setminy(y * scale);
    setyScale(scale);
    setdisplayCandleData(result.data);
    setdisplayCandleMaxMin(result.scope);
    setupdateStamp(+new Date());

    if (result.data.length !== 0) {
      checkDynamicData(result.data);
    }
  };
  /*
  第三版结合所有优点根据情况决定是计算还是更新
  */


  var updatePartialCandleDataV3 = function updatePartialCandleDataV3() {
    var onlyUpdatePositionAndScale = function onlyUpdatePositionAndScale(_cArr) {
      var isFromAppend = false;

      if (typeof _cArr === "undefined") {
        _cArr = [].concat(displayCandleData);
      } else {
        isFromAppend = true;
      }

      if (_cArr.length === 0) {
        return;
      }

      var barr = [];
      barr = _cArr;
      var currentScopeDisplayCandleData = findIntersectionCandle(barr, xAxis.data.currentTimeScope);

      if (isFromAppend) {
        currentScopeDisplayCandleData = _cArr;
      } else {
        currentScopeDisplayCandleData = findIntersectionCandle(barr, xAxis.data.currentTimeScope);
      }

      var orgMaxMiny = {
        //start 找 y+length 最大的
        start: -9999999999999999,
        //end找y最小的
        end: 99999999999999
      };
      var _displayCandleMaxMin = {
        /**
         * 最低点
         * */
        start: "9999999999999999999999",

        /**
         * 最高点
         * */
        end: "-9999999999999999999999"
      };
      var maxVolume = -99999999999999;
      var i = 0;

      while (i < currentScopeDisplayCandleData.length) {
        var item = currentScopeDisplayCandleData[i];

        if (isQuickUpdateing.current) {
          var _item$wickPixPosition9, _item$wickPixPosition11;

          if (Number((_item$wickPixPosition9 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition9.y) + Number(item.wickLength) > orgMaxMiny.start) {
            var _item$wickPixPosition10;

            //求（像素）y最大值
            orgMaxMiny.start = Number((_item$wickPixPosition10 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition10.y) + Number(item.wickLength);
          } //求（像素）y最小值


          if (Number((_item$wickPixPosition11 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition11.y) < orgMaxMiny.end) {
            var _item$wickPixPosition12;

            orgMaxMiny.end = Number((_item$wickPixPosition12 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition12.y);
          }
        } else {
          var _item$candlePixPositi5, _item$wickPixPosition13, _item$candlePixPositi7, _item$wickPixPosition15;

          if (Math.max(Number((_item$candlePixPositi5 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi5.y) + Number(item.candleLength), Number((_item$wickPixPosition13 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition13.y) + Number(item.wickLength)) > orgMaxMiny.start) {
            var _item$candlePixPositi6, _item$wickPixPosition14;

            //求（像素）y最大值
            orgMaxMiny.start = Math.max(Number((_item$candlePixPositi6 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi6.y) + Number(item.candleLength), Number((_item$wickPixPosition14 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition14.y) + Number(item.wickLength));
          } //求（像素）y最小值


          if (Math.min(Number((_item$candlePixPositi7 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi7.y), Number((_item$wickPixPosition15 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition15.y)) < orgMaxMiny.end) {
            var _item$candlePixPositi8, _item$wickPixPosition16;

            orgMaxMiny.end = Math.min(Number((_item$candlePixPositi8 = item.candlePixPosition) == null ? void 0 : _item$candlePixPositi8.y), Number((_item$wickPixPosition16 = item.wickPixPosition) == null ? void 0 : _item$wickPixPosition16.y));
          }
        }

        i++;
      }

      var currentheight = orgMaxMiny.start - orgMaxMiny.end;
      var expendHeight = currentheight + currentheight * yAxis.initArgs.displayPadding;
      var scale = yAxis.data.lineSize.height / expendHeight;
      var y = -orgMaxMiny.end + currentheight * yAxis.initArgs.displayPadding / 2;
      settotalDataPIXHeight(currentheight + currentheight * yAxis.initArgs.displayPadding);
      setminy(y * scale);
      setcleanY(orgMaxMiny.end);
      setyScale(scale);

      for (var _i = 0; _i < currentScopeDisplayCandleData.length; _i++) {
        var _item = currentScopeDisplayCandleData[_i];

        if (typeof _item.updateTag === "undefined" || _item.updateTag !== currentGUIDUpdateTag) {
          _item = computSingalCandledata(_item, org_displayCandleMaxMin);
          _item.updateTag = currentGUIDUpdateTag;
        } else {
          computSingalCandledataMini(_item);
        }

        computSingalCandledataMini(_item);
        _displayCandleMaxMin.start = getMin(_item, Number(_displayCandleMaxMin.start)).toString();
        _displayCandleMaxMin.end = getMax(_item, Number(_displayCandleMaxMin.end)).toString();

        if (maxVolume < Number(_item.volume)) {
          maxVolume = Number(_item.volume);
        }
      } //先通知y轴更新了


      requestAnimationFrame(function () {
        if (currentScopeDisplayCandleData.length === 0) {
          return;
        } //更新y轴


        yAxis.funcs.updateAxisSates(viewSize.width, viewSize.height, {
          start: Number(_displayCandleMaxMin.start),
          end: Number(_displayCandleMaxMin.end)
        });
      });
      setdisplayCandleMaxMin(_displayCandleMaxMin);
      setvolumChartViewMax(maxVolume);
      setupdateStamp(+new Date());
    };

    var updateAndAppendNewCandle = function updateAndAppendNewCandle() {
      var _totalCandleDisplayArr = [].concat(displayCandleData);

      if (_totalCandleDisplayArr.length === 0) {
        return;
      }
      var backwardDCArr = []; //判断是前面少了还是后面少了

      if (xAxis.data.tickArr[0].value !== _totalCandleDisplayArr[0].time) {
        var index = 0;

        while (typeof xAxis.data.tickArr[index] !== "undefined" && xAxis.data.tickArr[index].value < _totalCandleDisplayArr[0].time) {
          var _item2 = allComputedCandleData.current[xAxis.data.tickArr[index].value];

          if (typeof _item2 !== "undefined") {
            _item2.currentTick = xAxis.data.tickArr[index];
            backwardDCArr.push(_item2);
          }

          index++;
        }
      }

      var forwardDCArr = [];

      if (xAxis.data.tickArr[xAxis.data.tickArr.length - 1].value !== _totalCandleDisplayArr[_totalCandleDisplayArr.length - 1].time) {
        var _index = xAxis.data.tickArr.length - 1;

        while (typeof xAxis.data.tickArr[_index] !== "undefined" && xAxis.data.tickArr[_index].value > _totalCandleDisplayArr[_totalCandleDisplayArr.length - 1].time) {
          var _item3 = allComputedCandleData.current[xAxis.data.tickArr[_index].value];

          if (typeof _item3 !== "undefined") {
            _item3.currentTick = xAxis.data.tickArr[_index];
            forwardDCArr.unshift(_item3);
          }

          _index--;
        }
      }

      var _displayCandleData = [].concat(backwardDCArr, _totalCandleDisplayArr, forwardDCArr);

      var currentScopeDisplayCandleData = findIntersectionCandle(_displayCandleData, xAxis.data.currentTimeScope); //计算当前屏幕上显示的数据，没显示在屏幕范围的不参与计算

      var _org_displayCandleMaxMin = org_displayCandleMaxMin;

      for (var _iterator5 = _createForOfIteratorHelperLoose(currentScopeDisplayCandleData), _step5; !(_step5 = _iterator5()).done;) {
        var item = _step5.value;

        if (typeof item.updateTag === "undefined" || item.updateTag !== currentGUIDUpdateTag) {
          item = computSingalCandledata(item, _org_displayCandleMaxMin);
          item.updateTag = currentGUIDUpdateTag;
        } else {
          computSingalCandledataMini(item);
        }
      } //丢弃数据
      //丢弃掉低于开始时间最早1500条数据
      //丢弃掉高于结束时间最早1500条数据
      //先算低于的
      //mouseSpeedSec为正数就是在往以前推动
      //mouseSpeedSec为负数就是在往未来拖动
      //比现在显示最边缘的时间还小1500个单位以外


      if (_displayCandleData.length > 0 && currentScopeDisplayCandleData.length > 0) {
        /*
        前后数量
        */
        var rangeNamber = 3000;

        if (Number(_displayCandleData[0].time) < xAxis.data.currentTimeType.backwardTimeUnit(Number(currentScopeDisplayCandleData[0].time), rangeNamber, 0)) {
          var i = 0;
          var starttime = xAxis.data.currentTimeType.backwardTimeUnit(Number(currentScopeDisplayCandleData[0].time), rangeNamber, 0);

          while (Number(_displayCandleData[i].time) < starttime) {
            i++;
          }

          _displayCandleData = _displayCandleData.slice(i, _displayCandleData.length);
        } //比现在显示最边缘的时间还大1500个单位以外


        if (Number(_displayCandleData[_displayCandleData.length - 1].time) > xAxis.data.currentTimeType.forwardTimeUnit(Number(currentScopeDisplayCandleData[currentScopeDisplayCandleData.length - 1].time), rangeNamber, 0)) {
          var _i2 = _displayCandleData.length - 1;
          var endTime = xAxis.data.currentTimeType.forwardTimeUnit(Number(currentScopeDisplayCandleData[currentScopeDisplayCandleData.length - 1].time), rangeNamber, 0);

          while (Number(_displayCandleData[_i2].time) > endTime) {
            _i2--;
          }

          _displayCandleData = _displayCandleData.slice(0, _i2 + 1);
        }
      }

      setdisplayCandleData(_displayCandleData);
      checkDynamicData(_displayCandleData);
      return currentScopeDisplayCandleData;
    };

    window.requestAnimationFrame(function () {
      if (xAxis.data.tickArr.length > 120) {
        var inputArr = undefined;

        if (xAxis.data.lastTimeScope.start !== xAxis.data.currentTimeScope.start && xAxis.data.lastTimeScope.end !== xAxis.data.currentTimeScope.end) {
          if (Math.abs(xAxis.data.mouseSpeedSec) < 6) {
            inputArr = updateAndAppendNewCandle();
          }
        } else {
          inputArr = updateAndAppendNewCandle();
        }

        onlyUpdatePositionAndScale(inputArr);
      } else {
        updatePartialCandleData();
      }
    });
  }; //只计算缩放和刚进来的数据，不进行全量更新


  var reComputAllDisplayedCandleData = function reComputAllDisplayedCandleData() {
    //用于显示的数据
    var result = findDataByTicks(xAxis.data.tickArr);

    if (result.data.length === 0) {
      setdisplayCandleData([]);
      checkDynamicData();
      return;
    }

    requestAnimationFrame(function () {
      //更新y轴
      yAxis.funcs.updateAxisSates(xAxis.data.viewSize.width, xAxis.data.viewSize.height, {
        start: Number(result.scope.start),
        end: Number(result.scope.end)
      });
    });
    setdisplayCandleMaxMin(function () {
      return result.scope;
    });
    var updateTag = newGuid();

    for (var _iterator6 = _createForOfIteratorHelperLoose(result.data), _step6; !(_step6 = _iterator6()).done;) {
      var item = _step6.value;
      //全部进行全量计算
      item = computSingalCandledata(item, result.scope);
      item.isEscaped = false;
      item.updateTag = updateTag;
    }

    var scale = xAxis.data.linePosition.y / (xAxis.data.linePosition.y * yAxis.initArgs.displayPadding + xAxis.data.linePosition.y);
    var y = xAxis.data.linePosition.y * yAxis.initArgs.displayPadding / 2;
    settotalDataPIXHeight(xAxis.data.linePosition.y);
    setminy(y * scale);
    setcleanY(0);
    setyScale(scale);
    setdisplayCandleData(result.data);
    setviewSize(xAxis.data.viewSize);
    setorg_displayCandleMaxMin(result.scope);
    setcurrentGUIDUpdateTag(updateTag);
    setupdateStamp(+new Date());
    setlastMaxMiny({
      start: xAxis.data.linePosition.y,
      end: 0
    });

    if (result.data.length !== 0) {
      checkDynamicData(result.data);
    }
  };

  var checkDynamicData = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(data) {
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(typeof data === "undefined")) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return");

            case 2:
              //如果当前缩放、拖动超过所有内存中数据能显示的范围
              //判断是否为动态数据加载模式
              if (initArgs.dynamicData.enabled && !isStaticData && !stopDynamicFetching) {
                if (typeof data !== "undefined") {
                  if (Number(data[0].time) - Number(xAxis.data.tickArr[0].value) > 0) {
                    //往下拉取数据
                    lunchDynamicData(Number(data[0].time));
                  }
                } else {
                  lunchDynamicData(Number(xAxis.data.tickArr[xAxis.data.tickArr.length - 1].value));
                }
              }

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function checkDynamicData(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  /**
   * 缩放的更新
   */


  var scaleUpdate = function scaleUpdate() {
    if (!isUpdateing.current) {
      isUpdateing.current = true; //如果数据太多就设置为简便更新

      if (xAxis.data.tickArr.length > 500) {
        setisDQuickUpdateing(true);
        isQuickUpdateing.current = true;
      } else {
        setisDQuickUpdateing(false);
        isQuickUpdateing.current = false;
      }

      if (isQuickUpdateing.current) {
        updateThrottlereComputAllDisplayedCandleData(function () {
          reComputAllDisplayedCandleData();
          xAxis.funcs.setx(0);
        }, 50);
      } else {
        reComputAllDisplayedCandleData();
        xAxis.funcs.setx(0);
      }

      isUpdateing.current = false;
    }
  };
  /**
   * 移动的更新
   */


  var moveUpdate = function moveUpdate() {
    if (!isUpdateing.current) {
      isUpdateing.current = true; //如果数据太多就设置为简便更新

      if (xAxis.data.tickArr.length > 500) {
        setisDQuickUpdateing(true);
        isQuickUpdateing.current = true;
      } else {
        setisDQuickUpdateing(false);
        isQuickUpdateing.current = false;
      }

      if (isQuickUpdateing.current) {
        updatePartialCandleDataV3();
      } else {
        updatePartialCandleDataV3();
      }

      isUpdateing.current = false;
    }
  };
  /**
   * 更新最末尾的Candle
   */


  var updateLatestCandleData = function updateLatestCandleData(candleItem) {
    setstreamData(candleItem);
  };

  var updateStreamData = function updateStreamData() {
    var _xAxis$data$currentTi, _latestCandleItem2, _latestCandleItem3;

    if (!isFinishedInit) {
      return;
    }

    if (displayCandleData.length === 0) {
      return;
    }

    if (streamData === null) {
      return;
    }

    if (latestCandleItem === null) {
      return null;
    }

    var _streamData = _extends({}, streamData),
        time = _streamData.time,
        open = _streamData.open,
        close = _streamData.close,
        high = _streamData.high,
        low = _streamData.low,
        volume = _streamData.volume,
        isMergeMode = _streamData.isMergeMode; //将新进来的数据的时间，归零到格林威治时间


    if (baseConfig.timeZone.dataSourceTimeZone === "local") {
      time = Number(new Date(time).getTime());
    } else {
      time = anyTimeToGMT0000ToTarget(Number(new Date(time).getTime()), baseConfig.timeZone.dataSourceTimeZone, baseConfig.timeZone.displayTimeZone);
    }

    var currentRoundTime = (_xAxis$data$currentTi = xAxis.data.currentTimeType) == null ? void 0 : _xAxis$data$currentTi.roundingFunction(Number(time), baseConfig.timeZone.displayTimeZone);

    var _displayCandleData = [].concat(displayCandleData);

    var _latestCandleItem = _extends({}, latestCandleItem);

    var isNew = false;
    _latestCandleItem.isEscaped = false;
    var isChangeDisplayCandleArr = false; //如果只是更新现有的

    if (currentRoundTime === ((_latestCandleItem2 = _latestCandleItem) == null ? void 0 : _latestCandleItem2.time)) {
      //是否为快速合并模式
      if (typeof isMergeMode !== "undefined" && isMergeMode === true) {
        _latestCandleItem.close = close;
        _latestCandleItem.high = Math.max(Number(_latestCandleItem.high), Number(close));
        _latestCandleItem.low = Math.min(Number(_latestCandleItem.low), Number(close));
        _latestCandleItem.volume = volume;
      } else {
        _latestCandleItem.time = currentRoundTime; //_latestCandleItem.open = open!; //可以不用填open的，如果用户数据源没设置好还能兼容一下

        _latestCandleItem.close = close;
        _latestCandleItem.high = high;
        _latestCandleItem.low = low;
        _latestCandleItem.volume = volume;
      } //匹配displayCandleData


      for (var i = _displayCandleData.length - 1; i > -1; i--) {
        if (_displayCandleData[i].time === currentRoundTime) {
          _latestCandleItem.currentTick = _displayCandleData[i].currentTick;
          _latestCandleItem = computSingalCandledata(_latestCandleItem, org_displayCandleMaxMin, true);
          _latestCandleItem.updateTag = newGuid();
          _displayCandleData[i] = _latestCandleItem;
          isChangeDisplayCandleArr = true;
          _latestCandleItem.updateTag = "0";
          break;
        }
      }
    } else if (currentRoundTime > Number((_latestCandleItem3 = _latestCandleItem) == null ? void 0 : _latestCandleItem3.time)) {
      //如果是下一个时间刻度
      //是否为快速合并模式
      if (typeof isMergeMode !== "undefined" && isMergeMode === true) {
        _latestCandleItem.time = currentRoundTime;
        _latestCandleItem.open = close;
        _latestCandleItem.close = close;
        _latestCandleItem.high = close;
        _latestCandleItem.low = close;
        _latestCandleItem.volume = volume;
      } else {
        _latestCandleItem.time = currentRoundTime;
        _latestCandleItem.open = open;
        _latestCandleItem.close = close;
        _latestCandleItem.high = high;
        _latestCandleItem.low = low;
        _latestCandleItem.volume = volume;
        _latestCandleItem.updateTag = "0";
      } //查找ticks


      for (var i = xAxis.data.tickArr.length - 1; i > -1; i--) {
        var tick = xAxis.data.tickArr[i];

        if (tick.value === _latestCandleItem.time) {
          _latestCandleItem.currentTick = tick;
          break;
        }
      }

      _latestCandleItem = computSingalCandledata(_latestCandleItem, org_displayCandleMaxMin, true);
      _latestCandleItem.updateTag = newGuid(); //在可见范围内更新，不可见就不更新

      if (xAxis.data.currentTimeScope.start <= currentRoundTime && xAxis.data.currentTimeScope.end >= currentRoundTime) {
        _displayCandleData.push(_latestCandleItem);

        isChangeDisplayCandleArr = true;
      }

      isNew = true;
    } else {
      //既不等于
      //又不大于
      //那就有可能是上次时间类型的数据流响应 直接忽略
      return;
    }

    allComputedCandleData.current[currentRoundTime] = _latestCandleItem;
    setvolumChartViewMax(Math.max(Number(_latestCandleItem.volume), volumChartViewMax));
    setlatestCandleItem(_extends({}, _latestCandleItem));

    if (!isNew) {
      var newMaxMin = {
        start: Math.min(Number(displayCandleMaxMin.start), Number(_latestCandleItem.close)).toString(),
        end: Math.max(Number(displayCandleMaxMin.end), Number(_latestCandleItem.close)).toString()
      };

      if (newMaxMin.start !== displayCandleMaxMin.start || newMaxMin.end !== displayCandleMaxMin.end) {
        setfetchDataStemp(+new Date());
      } else {
        if (isChangeDisplayCandleArr) {
          setdisplayCandleData(_displayCandleData);
        } //更新tooltip


        setupdateStamp(+new Date());
      }
    } else {
      //可见范围内的话就移动一下
      if (xAxis.data.currentTimeScope.start <= currentRoundTime && xAxis.data.currentTimeScope.end >= currentRoundTime) {
        xAxis.funcs.moveContainer(0, 0 - (_latestCandleItem.currentTick.pixSpace.end - _latestCandleItem.currentTick.pixSpace.start), true);
      }

      if (isChangeDisplayCandleArr) {
        setdisplayCandleData(_displayCandleData);
      } //更新tooltip


      setupdateStamp(+new Date());
    }

    return _latestCandleItem;
  };
  /**
   * 更新最末尾的tooltip
   */


  var updateLatestCandleTooltip = function updateLatestCandleTooltip() {
    if (orgCandleData.length !== 0 && displayCandleData.length !== 0) {
      var dataItem;

      if (latestCandleItem === null) {
        if (isStaticData) {
          var intTime = xAxis.data.currentTimeType.roundingFunction(getRightDate(orgCandleData[orgCandleData.length - 1].time), baseConfig.timeZone.displayTimeZone);
          dataItem = allComputedCandleData.current[intTime];
        } else {
          dataItem = allComputedCandleData.current[displayCandleData[displayCandleData.length - 1].time];
        }
      } else {
        dataItem = latestCandleItem;
      }

      if (typeof dataItem !== "undefined") {
        var _initArgs$candleStyle5;

        var copyedItem = _extends({}, dataItem);

        var orgScope = _extends({}, displayCandleMaxMin); ////这里的数据是给tooltip计算的


        var edgeScope = yAxis.funcs.expandDataSpanceEdge(orgScope);
        computSingalCandledata(copyedItem, edgeScope.dataScope);
        copyedItem.updateTag = newGuid();
        var _tooltipState = {
          position: {
            x: 0,
            y: function () {
              if (Number(copyedItem.close) > Number(copyedItem.open)) {
                return copyedItem.candlePixPosition.y;
              }

              return copyedItem.candlePixPosition.y + copyedItem.candleLength;
            }()
          },
          length: xAxis.data.lineSize.width,
          value: copyedItem.close,
          displayValue: new _bigNumber(copyedItem.close).toFixed(displayFix),
          relatedTickItem: null,
          size: getSpaceSize(initArgs.candleStyles.currentPriceTooltip.lineSize, viewSize.width)
        };
        setlatestCandleToolTip(_tooltipState);
        setlatestCandleItem(copyedItem);
        var currentHeight = volumChartPixHeight * (Number(copyedItem.volume) / volumChartViewMax);
        var _latestVolumeToolTip = {
          position: {
            x: 0,
            y: xAxis.data.linePosition.y - currentHeight
          },
          length: xAxis.data.lineSize.width,
          value: copyedItem.volume,
          displayValue: new _bigNumber(copyedItem.volume).toFixed(displayFix),
          relatedTickItem: null,
          size: getSpaceSize((_initArgs$candleStyle5 = initArgs.candleStyles.volumChart) == null ? void 0 : _initArgs$candleStyle5.currentPriceTooltip.lineSize, viewSize.width)
        };
        setlatestVolumeToolTip(_latestVolumeToolTip);
      }
    }
  };
  /**
   * 视图范围内最末尾的candle
   */


  var updateLatestdisplayLatestCandle = function updateLatestdisplayLatestCandle() {
    if (displayLatestCandle !== null) {
      var _initArgs$candleStyle6;

      var edgeScope = yAxis.funcs.expandDataSpanceEdge(displayCandleMaxMin);

      var _displayLatestCandle = computSingalCandledata(_extends({}, displayLatestCandle), edgeScope.dataScope, true);

      _displayLatestCandle.updateTag = newGuid();

      if (_displayLatestCandle.isEscaped === true) {
        return;
      }

      var _tooltipState = {
        position: {
          x: 0,
          y: function () {
            var y = 0;

            if (Number(_displayLatestCandle.close) > Number(_displayLatestCandle.open)) {
              y = _displayLatestCandle.candlePixPosition.y;
            } else {
              y = _displayLatestCandle.candlePixPosition.y + _displayLatestCandle.candleLength;

              if (isNaN(y)) {
                y = _displayLatestCandle.candlePixPosition.y + 0;
              }
            }

            return y;
          }()
        },
        length: xAxis.data.lineSize.width,
        value: _displayLatestCandle.close,
        displayValue: new _bigNumber(_displayLatestCandle.close).toFixed(displayFix),
        relatedTickItem: null,
        size: getSpaceSize(initArgs.candleStyles.viewLastPriceTooltip.lineSize, viewSize.width)
      };
      setlatestdisplayLatestCandle(_tooltipState);
      var currentHeight = volumChartPixHeight * (Number(_displayLatestCandle.volume) / volumChartViewMax);
      var _latestdisplayLatestVolume = {
        position: {
          x: 0,
          y: xAxis.data.linePosition.y - currentHeight
        },
        length: xAxis.data.lineSize.width,
        value: _displayLatestCandle.volume,
        displayValue: new _bigNumber(_displayLatestCandle.volume).toFixed(displayFix),
        relatedTickItem: null,
        size: getSpaceSize((_initArgs$candleStyle6 = initArgs.candleStyles.volumChart) == null ? void 0 : _initArgs$candleStyle6.viewLastPriceTooltip.lineSize, viewSize.width)
      };
      setlatestdisplayLatestVolume(_latestdisplayLatestVolume);
    }
  };

  var getCurrentCursorCandle = function getCurrentCursorCandle() {
    if (xAxis.data.tooltipIsShow && typeof xAxis.data.tooltipState !== "undefined" && xAxis.data.tooltipState !== null && typeof xAxis.data.tooltipState.relatedTickItem !== "undefined" && xAxis.data.tooltipState.relatedTickItem !== null) {
      var key = xAxis.data.tooltipState.relatedTickItem.value.toString();
      var item = allComputedCandleData.current[key];
      setCursorCandleItem(item);
    }
  };

  var workerReciveMessage = function workerReciveMessage(e) {
    var data = e.data;

    if (data.message === "setdisplayLatestCandle") {
      setdisplayLatestCandle(data.data);
      return;
    }

    if (data.message === "not found") {
      //没找到
      setdisplayCandleData([]);
      checkDynamicData();
      return;
    }

    if (data.message === "updateYaxis") {
      requestAnimationFrame(function () {
        //更新y轴
        yAxis.funcs.updateAxisSates(xAxis.data.viewSize.width, xAxis.data.viewSize.height, {
          start: Number(data.data.start),
          end: Number(data.data.end)
        });
      });
      return;
    }

    if (data.message === "finishWork") {
      var currentheight = data.data.orgMaxMiny.start - data.data.orgMaxMiny.end;
      var expendHeight = currentheight + currentheight * yAxis.initArgs.displayPadding;
      var scale = yAxis.data.lineSize.height / expendHeight;
      var y = -data.data.orgMaxMiny.end + currentheight * yAxis.initArgs.displayPadding / 2; //

      setdisplayCandleData(data.data.result.data); //

      setdisplayCandleMaxMin(data.data.result.scope); //

      if (data.data.result.data.length !== 0) {
        settotalDataPIXHeight(currentheight + currentheight * yAxis.initArgs.displayPadding);
        setminy(y * scale);
        setyScale(scale);
        checkDynamicData(data.data.result.data);
        setupdateStamp(+new Date());
      }

      return;
    }
  };
  /**
   * ==================================Effects===============================
   */


  React.useEffect(function () {
    if (typeof workMessage !== "undefined") {
      workerReciveMessage(workMessage);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [workMessage]);
  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);

      if (typeof initArgs.staticData !== "undefined" && initArgs.staticData.length > 0) {
        setisStaticData(true);
      } else {
        setisStaticData(false);
      } //openMoveWorker();

    }

    return function () {
      setIsMounted(false);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //这里专门用于第一次载入时的更新

  React.useEffect(function () {
    //静态模式是依据initArgs.staticData.length 进行的
    //如果initArgs.staticData.length > 0 就说明现在需要进行静态数据的展示
    if (isMounted === true && xAxis.data.isFinishedInit && yAxis.data.isFinishedInit) {
      var _xAxis$data$currentTi2;

      //记录一下当前的时间类型
      setcurrentTimeTypeName((_xAxis$data$currentTi2 = xAxis.data.currentTimeType) == null ? void 0 : _xAxis$data$currentTi2.name);
      setcurrentTimeZone(baseConfig.timeZone); //如果是静态数据

      if (isStaticData) {
        //初始化静态数据
        initStaticData();
      } else if (initArgs.dynamicData.enabled) {
        //否则进入动态数据模式
        initDynamicData();
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [xAxis.data.isFinishedInit, yAxis.data.isFinishedInit, xAxis.data.InitStemp]); //数据动态载入完成以后需要重新渲染一下数据

  React.useEffect(function () {
    //静态模式是依据initArgs.staticData.length 进行的
    //如果initArgs.staticData.length > 0 就说明现在需要进行静态数据的展示
    if (fetchDataStemp !== -1) {
      moveUpdate();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [fetchDataStemp]);
  React.useEffect(function () {
    //静态模式是依据initArgs.staticData.length 进行的
    //如果initArgs.staticData.length > 0 就说明现在需要进行静态数据的展示
    if (initDyStamp !== -1) {
      window.requestAnimationFrame(function () {
        scaleUpdate();
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [initDyStamp]);
  React.useEffect(function () {
    if (xAxis.data.xAxisUpdateMoveMentTimeStamp !== -1) {
      moveUpdate();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [xAxis.data.xAxisUpdateMoveMentTimeStamp]);
  React.useEffect(function () {
    if (xAxis.data.xAxisUpdateScaleTimeStamp !== -1) {
      window.requestAnimationFrame(function () {
        scaleUpdate();
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [xAxis.data.xAxisUpdateScaleTimeStamp]); //这里专门用于计算完candle之后的操作

  React.useEffect(function () {
    if (updateStamp !== -1) {
      updateLatestCandleTooltip();
      updateLatestdisplayLatestCandle();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [updateStamp]);
  React.useEffect(function () {
    getCurrentCursorCandle(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxis.data.tooltipState]); //ws动态更新第一个数据

  React.useEffect(function () {
    if (streamData !== null && //
    streamData.time !== -1 && isFinishedInit === true && isFetchingData === false) {
      updateStreamData();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [streamData, isFinishedInit, isFetchingData]);
  React.useEffect(function () {
    if (TempDynamicData !== null) {
      updateDynamicData([].concat(TempDynamicData));
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [TempDynamicData]);
  return {
    data: {
      displayCandleData: displayCandleData,
      isDQuickUpdateing: isDQuickUpdateing,
      latestCandleToolTip: latestCandleToolTip,
      latestdisplayLatestCandle: latestdisplayLatestCandle,
      volumChartPixHeight: volumChartPixHeight,
      volumChartViewMax: volumChartViewMax,
      latestVolumeToolTip: latestVolumeToolTip,
      latestdisplayLatestVolume: latestdisplayLatestVolume,
      cursorCandleItem: cursorCandleItem,
      latestCandleItem: latestCandleItem,
      yScale: yScale,
      miny: miny,
      updateStamp: updateStamp,
      isFetchingData: isFetchingData,
      isFinishedInit: isFinishedInit
    },
    funcs: {
      updateLatestCandleData: updateLatestCandleData,
      setinitArgs: function setinitArgs(arg) {
        _setinitArgs(lodash.merge(initArgs, arg));
      }
    },
    initArgs: initArgs
  };
};

/**
 * candleViewContext
 * k线context
 **/

var candleViewContext = /*#__PURE__*/React.createContext({});
/**
 * candleView钩子
 */

var useCandleView = function useCandleView(args) {
  var _initArgs$yAxis4;

  /**
   *默认参数状态
   */
  var _useState = React.useState(lodash.merge(DEFAULTVALUES, args)),
      initArgs = _useState[0],
      setinitArgs = _useState[1];
  /**
   * ============================hooks===========================
   */

  /**
   *x轴钩子对象
   */


  var xAxisObj = usexAxis(initArgs.xAxis, undefined, initArgs);
  /**
   *y轴钩子对象
   */

  var yAxisObj = useyAxis(initArgs.yAxis, xAxisObj);
  /**
   * candle 对象
   * 数据展示对象
   */

  var candleObj = useCandleHook(initArgs.data, xAxisObj, yAxisObj, initArgs);
  /**
   * ============================state===========================
   */

  var _useState2 = React.useState(false),
      isMounted = _useState2[0],
      setIsMounted = _useState2[1];
  /**
   *画布宽度
   */


  var _useState3 = React.useState(0),
      canvasWidth = _useState3[0],
      setcanvasWidth = _useState3[1];
  /**
   *画布高度
   */


  var _useState4 = React.useState(0),
      canvasHeight = _useState4[0],
      setcanvasHeight = _useState4[1];
  /**
   *画布颜色
   */


  var _useState5 = React.useState("#fff"),
      canvasBackgroundColor = _useState5[0],
      setcanvasBackgroundColor = _useState5[1];
  /**
   *数据显示区域（去除x轴和y轴的占有区域）
   */


  var _useState6 = React.useState({
    width: 0,
    height: 0
  }),
      dataArea = _useState6[0],
      setdataArea = _useState6[1];
  /**
   * ==========================函数==============================
   */

  /**
   * 更改时间格式，传入 TtimeType 类型的变量
   * 需要查看当前的时间格式可以访问
   * CandleViewV2.initArgs.timeFormat
   */


  var setTimeFormat = function setTimeFormat( //类型
  value, //数据所在时区
  dataSourceTimeZone, //请求数据时将时间参数调整在哪个时区
  fetchConditionTimeZone, //显示时调整到哪个时区
  displayTimeZone) {
    var _initArgs = _extends({}, initArgs);

    _initArgs.timeFormat = value;

    if (typeof dataSourceTimeZone !== "undefined") {
      _initArgs.timeZone.dataSourceTimeZone = dataSourceTimeZone;
    }

    if (typeof fetchConditionTimeZone !== "undefined") {
      _initArgs.timeZone.fetchConditionTimeZone = fetchConditionTimeZone;
    }

    if (typeof displayTimeZone !== "undefined") {
      _initArgs.timeZone.displayTimeZone = displayTimeZone;
    }

    setinitArgs(_initArgs);
  };
  /**
   * 更改语言
   */


  var setLanguage = function setLanguage(language) {
    var _initArgs = _extends({}, initArgs);

    _initArgs.language = language;
    setinitArgs(_initArgs);
  };
  /**
   * 更改时区设定
   */


  var setTimeZone = function setTimeZone(timeZone) {
    var _initArgs = _extends({}, initArgs);

    _initArgs.timeZone = Object.assign(true, _initArgs.timeZone, timeZone);
    setinitArgs(_initArgs);
  };
  /**
   * ==================================Effects===============================
   */


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }

    return function () {
      setIsMounted(false);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(function () {
    if (xAxisObj.data.isFinishedInit && yAxisObj.data.isFinishedInit) {
      xAxisObj.funcs.setinitArgs(initArgs.xAxis);
      yAxisObj.funcs.setinitArgs(initArgs.yAxis);
      candleObj.funcs.setinitArgs(initArgs.data);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [initArgs]);
  React.useEffect(function () {
    xAxisObj.funcs.reGenXAxis(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initArgs.language]);
  React.useEffect(function () {
    if (canvasHeight !== 0 && canvasWidth !== 0 && !xAxisObj.data.isFinishedInit) {
      var _initArgs$yAxis;

      //初始化x轴
      xAxisObj.funcs.initAxisSates(initArgs.timeFormat, canvasWidth, canvasHeight, (_initArgs$yAxis = initArgs.yAxis) == null ? void 0 : _initArgs$yAxis.labelSpace); //初始化y轴

      yAxisObj.funcs.updateAxisSates(canvasWidth, canvasHeight, {
        start: 500,
        end: 600
      });
    } else {
      var _initArgs$yAxis2;

      //更新x轴
      xAxisObj.funcs.updateAxisSates(canvasWidth, canvasHeight, (_initArgs$yAxis2 = initArgs.yAxis) == null ? void 0 : _initArgs$yAxis2.labelSpace);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [canvasWidth, canvasHeight]);
  React.useEffect(function () {
    if (xAxisObj.data.isFinishedInit) {
      var _initArgs$yAxis3;

      //重新初始化x轴
      xAxisObj.funcs.initAxisSates(initArgs.timeFormat, canvasWidth, canvasHeight, (_initArgs$yAxis3 = initArgs.yAxis) == null ? void 0 : _initArgs$yAxis3.labelSpace);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [initArgs.timeFormat, (_initArgs$yAxis4 = initArgs.yAxis) == null ? void 0 : _initArgs$yAxis4.labelSpace, initArgs == null ? void 0 : initArgs.timeZone]);
  React.useEffect(function () {
    if (xAxisObj.data.isFinishedInit) {
      //计算数据可用区域
      setdataArea({
        width: canvasWidth - getSpaceSize(initArgs.yAxis.labelSpace, canvasWidth),
        height: canvasHeight - getSpaceSize(initArgs.xAxis.labelSpace, canvasHeight)
      });
    }
  }, [xAxisObj.data.isFinishedInit, canvasWidth, canvasHeight]);
  return {
    /**
     *初始化时的参数
     */
    initArgs: initArgs,

    /**
     *x导出的数据
     */
    data: {
      /**
       *画布宽度
       */
      canvasWidth: canvasWidth,

      /**
       *画布高度
       */
      canvasHeight: canvasHeight,

      /**
       *画布颜色
       */
      canvasBackgroundColor: canvasBackgroundColor,

      /**
       *数据显示区域（去除x轴和y轴的占有区域）
       */
      dataArea: dataArea
    },

    /**
     *x导出的方法
     */
    funcs: {
      /**
       *设置画布宽度
       */
      setcanvasWidth: setcanvasWidth,

      /**
       *设置画布高度
       */
      setcanvasHeight: setcanvasHeight,

      /**
       *设置画布颜色
       */
      setcanvasBackgroundColor: setcanvasBackgroundColor,
      setInitArgs: setinitArgs,

      /**
       * 向图表更新当前实时的价格，价格的变化将反应在第一个candle上 (右边第一个 )
       * @param time 更新的时间，用当前时间就好了，不用取整
       * @param currentPrice 当前更新的价格
       * @param volume 当前更新的交易量
       * @returns 当前图表最末尾一个数据对象
       */
      appendData: candleObj.funcs.updateLatestCandleData,
      setTimeFormat: setTimeFormat,
      setLanguage: setLanguage,
      setTimeZone: setTimeZone
    },
    hookObjs: {
      /**
       *x轴钩子对象
       */
      xAxisObj: xAxisObj,

      /**
       *y轴钩子对象
       */
      yAxisObj: yAxisObj,

      /**
       *candleobj
       */
      candleObj: candleObj
    }
  };
};

var useCandleViewContext = function useCandleViewContext() {
  var r = React.useContext(candleViewContext);
  return r;
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "@charset \"UTF-8\";\r\n.cvcv_container {\r\n\tposition: relative;\r\n\toverflow: hidden;\r\n}\r\n.cvcv_container .infoDisplayLayer {\r\n\ttop: 20px;\r\n\tleft: 20px;\r\n\tposition: absolute;\r\n\tbox-sizing: border-box;\r\n\tfont-size: 26px;\r\n\t-webkit-user-select: none;\r\n\t   -moz-user-select: none;\r\n\t        user-select: none;\r\n\twidth: 80%;\r\n\ttext-wrap: nowrap;\r\n}\r\n.cvcv_container .infoDisplayLayer .title {\r\n\tfont-size: 26px;\r\n\tfont-weight: bold;\r\n\ttext-align: left;\r\n}\r\n.cvcv_container .infoDisplayLayer .info {\r\n\tdisplay: flex;\r\n\tjustify-content: flex-start;\r\n\talign-content: center;\r\n\tline-height: unset;\r\n\theight: unset;\r\n\twidth: 100%;\r\n}\r\n.cvcv_container .infoDisplayLayer .info div {\r\n\tline-height: unset;\r\n\theight: unset;\r\n\tmargin-right: 20px;\r\n\tbackground-color: rgba(255, 255, 255, 0.4901960784);\r\n\tpadding: 5px 10px;\r\n\tborder-radius: 10px;\r\n\talign-items: center;\r\n\talign-content: center;\r\n\t-webkit-backdrop-filter: blur(2px);\r\n\t        backdrop-filter: blur(2px);\r\n}\r\n.cvcv_container .infoDisplayLayer .info div span,\r\n.cvcv_container .infoDisplayLayer .info div label {\r\n\tdisplay: inline-block;\r\n\tfont-size: 12px;\r\n\tfont-weight: 500;\r\n}\r\n.cvcv_container .infoDisplayLayer .info div label {\r\n\tmargin-left: 5px;\r\n\tcolor: #19123d;\r\n\tfont-weight: bold;\r\n}\r\n.cvcv_container .infoDisplayLayer .info div.timetype {\r\n\tbackground-color: #5b88d1;\r\n}\r\n.cvcv_container .infoDisplayLayer .info div.timetype label {\r\n\tmargin-left: 0;\r\n\tcolor: #fff;\r\n\tfont-weight: bold;\r\n}\r\n.cvcv_container canvas {\r\n\tdisplay: block;\r\n}\r\n\r\n/*移动端时使用的样式:竖屏样式*/\r\n@media (orientation: portrait) {\r\n\t.cvcv_container .infoDisplayLayer .title {\r\n\t\tfont-size: 1.625rem;\r\n\t\tfont-weight: bold;\r\n\t}\r\n\t.cvcv_container .infoDisplayLayer .info {\r\n\t\tdisplay: flex;\r\n\t\tjustify-content: flex-start;\r\n\t\talign-content: center;\r\n\t\tline-height: unset;\r\n\t\theight: unset;\r\n\t\twidth: 100%;\r\n\t}\r\n\t.cvcv_container .infoDisplayLayer .info div {\r\n\t\tline-height: unset;\r\n\t\theight: unset;\r\n\t\tmargin-right: 0.2rem;\r\n\t\tbackground-color: rgba(255, 255, 255, 0.4901960784);\r\n\t\tpadding: 0.3125rem 0.625rem;\r\n\t\tborder-radius: 0.625rem;\r\n\t\t-webkit-backdrop-filter: blur(0.125rem);\r\n\t\t        backdrop-filter: blur(0.125rem);\r\n\t}\r\n\t.cvcv_container .infoDisplayLayer .info div span,\r\n\t.cvcv_container .infoDisplayLayer .info div label {\r\n\t\tdisplay: block;\r\n\t\tfont-size: 0.75rem;\r\n\t\tfont-weight: 500;\r\n\t}\r\n\t.cvcv_container .infoDisplayLayer .info div label {\r\n\t\tmargin-left: 0.3125rem;\r\n\t\tcolor: #19123d;\r\n\t\tfont-weight: bold;\r\n\t}\r\n\t.cvcv_container .infoDisplayLayer .info div.timetype {\r\n\t\tbackground-color: #5b88d1;\r\n\t}\r\n\t.cvcv_container .infoDisplayLayer .info div.timetype label {\r\n\t\tmargin-left: 0;\r\n\t\tcolor: #fff;\r\n\t\tfont-weight: bold;\r\n\t}\r\n}\r\n";
styleInject(css_248z);

/**
 * 防抖钩子
 */

var useDebounce = function useDebounce() {
  /**
   * ============================state===========================
   */
  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1];

  var debounceFunction = React.useRef(null);
  var debounceTimeOut = React.useRef(null);
  /**
   * ==========================函数==============================
   */

  var debounce = function debounce(_func, _time) {
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


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }

    return function () {
      setIsMounted(false);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return debounce;
};

var Rectangle = /*#__PURE__*/react.PixiComponent("Rectangle", {
  create: function create() {
    return new PIXI.Graphics();
  },
  applyProps: function applyProps(instance, oldProps, props) {
    var new_props = Object.assign(true, DEFAULTRECTANGLE, props);
    var newxy = xyComput(new_props);
    var x = newxy.x;
    var y = newxy.y;
    instance.clear();
    instance.beginFill(new_props.color || 0x0, new_props.opacity);
    instance.drawRect(x, y, new_props.size.width, new_props.size.height);
    instance.endFill();
  }
});

var xyComput = function xyComput(props) {
  var x = props.position.x;
  var y = props.position.y;

  if (props.alignX === "center") {
    x = props.position.x - props.size.width / 2;
  }

  if (props.alignX === "right") {
    x = props.position.x - props.size.width;
  }

  if (props.alignY === "center") {
    y = props.position.y - props.size.height / 2;
  }

  if (props.alignY === "bottom") {
    y = props.position.y - props.size.height;
  }

  return {
    x: x,
    y: y
  };
};
/**
 * 用于对k线图进行批量绘制的形状
 */


var KlineBatching = /*#__PURE__*/react.PixiComponent("KlineBatching", {
  create: function create() {
    return new PIXI.Graphics();
  },
  applyProps: function applyProps(instance, oldProps, props) {
    var new_props = Object.assign(true, {
      isDQuickUpdateing: false,
      wickRiseColor: "#000000",
      wickFallColor: "#000000",
      candleRiseColor: "#000000",
      candleFallColor: "#000000",
      data: []
    }, props);

    var getColor = function getColor(status, type) {
      if (status === "rise" && type === "wick") {
        return new_props.wickRiseColor;
      }

      if (status === "fall" && type === "wick") {
        return new_props.wickFallColor;
      }

      if (status === "rise" && type === "candle") {
        return new_props.candleRiseColor;
      }

      if (status === "fall" && type === "candle") {
        return new_props.candleFallColor;
      }

      return "";
    };

    instance.clear(); //先画wick

    for (var _iterator = _createForOfIteratorHelperLoose(new_props.data), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      var _size = {
        width: item.wickWidth,
        height: item.wickLength
      };
      var _position = {
        x: item.currentTick.cPosition.x,
        y: item.wickPixPosition.y
      };
      var wickProps = {
        /**
         * 颜色
         */
        color: function () {
          if (!new_props.isDQuickUpdateing) {
            return PIXI.utils.string2hex(getColor(item.candleStateus, "wick"));
          }

          return PIXI.utils.string2hex(getColor(item.candleStateus, "candle"));
        }(),

        /**
         * 尺寸
         */
        size: _size,

        /**
         * 坐标
         */
        position: _position,

        /**
         * 对齐x坐标的模式
         */
        alignX: "center",

        /**
         * 对齐y坐标的模式
         */
        alignY: "top",

        /**
         * 透明度
         */
        opacity: 1
      };

      var _newxy = xyComput(wickProps);

      var _x = _newxy.x;
      var _y = _newxy.y;
      instance.beginFill(wickProps.color || 0x0, wickProps.opacity);
      instance.drawRect(_x, _y, _size.width, _size.height);
    }

    if (!new_props.isDQuickUpdateing) {
      //再画candle
      for (var _iterator2 = _createForOfIteratorHelperLoose(new_props.data), _step2; !(_step2 = _iterator2()).done;) {
        var item = _step2.value;
        var size = {
          width: item.candleWidth,
          height: item.candleLength
        };
        var position = {
          x: item.currentTick.cPosition.x,
          y: item.candlePixPosition.y
        };
        var candleProps = {
          /**
           * 颜色
           */
          color: PIXI.utils.string2hex(getColor(item.candleStateus, "candle")),

          /**
           * 尺寸
           */
          size: size,

          /**
           * 坐标
           */
          position: position,

          /**
           * 对齐x坐标的模式
           */
          alignX: "center",

          /**
           * 对齐y坐标的模式
           */
          alignY: "top",

          /**
           * 透明度
           */
          opacity: 1
        };
        var newxy = xyComput(candleProps);
        var x = newxy.x;
        var y = newxy.y;
        instance.beginFill(candleProps.color || 0x0, candleProps.opacity);
        instance.drawRect(x, y, size.width, size.height);
      }
    }

    instance.endFill();
  }
});
/**
 * 用于对Volume交易量进行批量绘制的形状
 */

var VolumeBatching = /*#__PURE__*/react.PixiComponent("VolumeBatching", {
  create: function create() {
    return new PIXI.Graphics();
  },
  applyProps: function applyProps(instance, oldProps, props) {
    var new_props = Object.assign(true, {
      alpha: 0,
      staticMax: 0,
      volumChartPixHeight: 0,
      riseColor: "",
      fallColor: "",
      isDQuickUpdateing: false,
      linePositionY: 0,
      data: []
    }, props);
    instance.clear();

    for (var _iterator3 = _createForOfIteratorHelperLoose(new_props.data), _step3; !(_step3 = _iterator3()).done;) {
      var item = _step3.value;
      var currentHeight = new_props.volumChartPixHeight * (Number(item.volume) / new_props.staticMax);
      var size = {
        width: function () {
          if (!new_props.isDQuickUpdateing) {
            return item.candleWidth;
          }

          return 1;
        }(),
        height: currentHeight
      };
      var position = {
        x: item.currentTick.cPosition.x,
        y: new_props.linePositionY
      };
      var volumeProps = {
        /**
         * 颜色
         */
        color: PIXI.utils.string2hex(function () {
          if (item.candleStateus === "rise") {
            return new_props.riseColor;
          }

          return new_props.fallColor;
        }()),

        /**
         * 尺寸
         */
        size: size,

        /**
         * 坐标
         */
        position: position,

        /**
         * 对齐x坐标的模式
         */
        alignX: "center",

        /**
         * 对齐y坐标的模式
         */
        alignY: "bottom",

        /**
         * 透明度
         */
        opacity: 1
      };
      var newxy = xyComput(volumeProps);
      var x = newxy.x;
      var y = newxy.y;
      instance.beginFill(volumeProps.color || 0x0, volumeProps.opacity);
      instance.drawRect(x, y, size.width, size.height);
    }

    instance.endFill();
  }
});
/**
 * 矩形pixi对象的初始值
 */

var DEFAULTRECTANGLE = {
  color: /*#__PURE__*/PIXI.utils.string2hex("#000000"),
  size: {
    width: 100,
    height: 100
  },
  position: {
    x: 0,
    y: 0
  },
  alignX: "left",
  alignY: "top",
  opacity: 1
};

var drawDash = function drawDash(target, x1, y1, x2, y2, dashLength, spaceLength) {
  if (dashLength === void 0) {
    dashLength = 5;
  }

  if (spaceLength === void 0) {
    spaceLength = 5;
  }

  var x = x2 - x1;
  var y = y2 - y1;
  var hyp = Math.sqrt(x * x + y * y);
  var units = hyp / (dashLength + spaceLength);
  var dashSpaceRatio = dashLength / (dashLength + spaceLength);
  var dashX = x / units * dashSpaceRatio;
  var spaceX = x / units - dashX;
  var dashY = y / units * dashSpaceRatio;
  var spaceY = y / units - dashY;
  target.moveTo(x1, y1);

  while (hyp > 0) {
    x1 += dashX;
    y1 += dashY;
    hyp -= dashLength;

    if (hyp < 0) {
      x1 = x2;
      y1 = y2;
    }

    target.lineTo(x1, y1);
    x1 += spaceX;
    y1 += spaceY;
    target.moveTo(x1, y1);
    hyp -= spaceLength;
  }

  target.moveTo(x2, y2);
  return target;
};

var DashedLine = /*#__PURE__*/react.PixiComponent("DashedLine", {
  create: function create() {
    return new PIXI.Graphics();
  },
  applyProps: function applyProps(instance, _, newProps) {
    var defaults = {
      color: PIXI.utils.string2hex("#000000"),
      size: 1,
      positionStart: {
        x: 0,
        y: 0
      },
      positionStop: {
        x: 0,
        y: 0
      },
      dashLength: 4,
      spaceLength: 3
    }; //这里会产生引用

    var props = Object.assign(true, defaults, newProps);
    instance.clear();
    instance.lineStyle(props.size, props.color);
    instance = drawDash(instance, props.positionStart.x, props.positionStart.y, props.positionStop.x, props.positionStop.y, 4, 3);
    instance.endFill();
  }
});

var XAxis = function XAxis(_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewPixiContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static===================


  var labelPadding = 25; //===============ref======================

  var tooltipTextRef = React.useRef(null); //===============function=================

  /* 创建tick */

  var makeTicks = function makeTicks() {
    var result = [];
    var index = 0;

    for (var _iterator = _createForOfIteratorHelperLoose(CVData.hookObjs.xAxisObj.data.displayTickArr), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      result.push(React__default.createElement(React__default.Fragment, {
        key: index + "_d"
      }, React__default.createElement(Rectangle, {
        color: PIXI.utils.string2hex(item.color),
        size: {
          width: item.size,
          height: item.length
        },
        position: item.cPosition,
        alignX: "center",
        alignY: "top"
      })));
      index++;
    }

    return result;
  };
  /* 创建label */


  var makeLabels = function makeLabels() {
    var result = [];
    var index = 0;

    for (var _iterator2 = _createForOfIteratorHelperLoose(CVData.hookObjs.xAxisObj.data.displayTickArr), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;
      result.push(React__default.createElement(React__default.Fragment, {
        key: index + "_a"
      }, React__default.createElement(react.Text, {
        anchor: 0.5,
        x: item.cPosition.x,
        y: item.cPosition.y + CVData.hookObjs.xAxisObj.data.labelSpace / 2,
        text: function () {
          var _item$displayValue;

          if (typeof CVData.hookObjs.xAxisObj.initArgs.formatter !== "undefined") {
            return CVData.hookObjs.xAxisObj.initArgs.formatter(item);
          }

          return (_item$displayValue = item.displayValue) == null ? void 0 : _item$displayValue.toString();
        }(),
        resolution: 2,
        style: new PIXI.TextStyle({
          align: "center",
          fontSize: CVData.hookObjs.xAxisObj.initArgs.fontSize,
          fill: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tickColor)
        })
      })));
      index++;
    }

    return result;
  };
  /* 创建tooltip */


  var makeTooltip = function makeTooltip() {
    var _CVData$hookObjs$xAxi, _CVData$hookObjs$xAxi2, _tooltipTextRef$curre, _CVData$hookObjs$xAxi3, _CVData$hookObjs$xAxi4, _CVData$hookObjs$xAxi5, _CVData$hookObjs$xAxi6, _CVData$hookObjs$xAxi7, _CVData$hookObjs$xAxi8, _CVData$hookObjs$xAxi9, _CVData$hookObjs$xAxi10;

    if (!CVData.hookObjs.xAxisObj.initArgs.tooltip.enabled || CVData.hookObjs.xAxisObj.data.tooltipState === null || !CVData.hookObjs.xAxisObj.data.tooltipIsShow) {
      return null;
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(DashedLine, {
      color: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.tooltip.color),
      size: CVData.hookObjs.xAxisObj.data.tooltipState.size,
      positionStart: CVData.hookObjs.xAxisObj.data.tooltipState.position,
      positionStop: {
        x: CVData.hookObjs.xAxisObj.data.tooltipState.position.x,
        y: CVData.hookObjs.xAxisObj.data.tooltipState.length
      },
      dashLength: CVData.hookObjs.xAxisObj.initArgs.tooltip.dashLength,
      spaceLength: CVData.hookObjs.xAxisObj.initArgs.tooltip.spaceLength
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$xAxi = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi2 = _CVData$hookObjs$xAxi.label) == null ? void 0 : _CVData$hookObjs$xAxi2.backGroundColor),
      size: {
        width: ((_tooltipTextRef$curre = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre.width) + labelPadding,
        height: CVData.hookObjs.xAxisObj.data.labelSpace
      },
      position: function () {
        var _tooltipTextRef$curre2, _tooltipTextRef$curre4;

        if (CVData.hookObjs.xAxisObj.data.tooltipState.position.x - ((_tooltipTextRef$curre2 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre2.width) / 2 - labelPadding / 2 < 0) {
          var _tooltipTextRef$curre3;

          return {
            x: ((_tooltipTextRef$curre3 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre3.width) / 2 + labelPadding / 2,
            y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem.cPosition.y
          };
        }

        if (CVData.hookObjs.xAxisObj.data.tooltipState.position.x + ((_tooltipTextRef$curre4 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre4.width) / 2 + labelPadding / 2 > CVData.hookObjs.xAxisObj.data.lineSize.width) {
          var _tooltipTextRef$curre5;

          return {
            x: CVData.hookObjs.xAxisObj.data.lineSize.width - ((_tooltipTextRef$curre5 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre5.width) / 2 - labelPadding / 2,
            y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem.cPosition.y
          };
        }

        return {
          x: CVData.hookObjs.xAxisObj.data.tooltipState.position.x,
          y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem.cPosition.y
        };
      }(),
      alignX: "center",
      alignY: "top"
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$xAxi3 = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi4 = _CVData$hookObjs$xAxi3.label) == null ? void 0 : _CVData$hookObjs$xAxi4.color),
      size: {
        width: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem.size,
        height: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem.length
      },
      position: {
        x: CVData.hookObjs.xAxisObj.data.tooltipState.position.x,
        y: CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem.cPosition.y
      },
      alignX: "center",
      alignY: "top"
    }), React__default.createElement(react.Text, {
      ref: tooltipTextRef,
      anchor: 0.5,
      x: function () {
        var _tooltipTextRef$curre6, _tooltipTextRef$curre8;

        if (CVData.hookObjs.xAxisObj.data.tooltipState.position.x - ((_tooltipTextRef$curre6 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre6.width) / 2 - labelPadding / 2 < 0) {
          var _tooltipTextRef$curre7;

          return ((_tooltipTextRef$curre7 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre7.width) / 2 + labelPadding / 2;
        }

        if (CVData.hookObjs.xAxisObj.data.tooltipState.position.x + ((_tooltipTextRef$curre8 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre8.width) / 2 + labelPadding / 2 > CVData.hookObjs.xAxisObj.data.lineSize.width) {
          var _tooltipTextRef$curre9;

          return CVData.hookObjs.xAxisObj.data.lineSize.width - ((_tooltipTextRef$curre9 = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre9.width) / 2 - labelPadding / 2;
        }

        return CVData.hookObjs.xAxisObj.data.tooltipState.position.x;
      }(),
      y: CVData.hookObjs.xAxisObj.data.tooltipState.length + CVData.hookObjs.xAxisObj.data.labelSpace / 2,
      text: (_CVData$hookObjs$xAxi5 = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi6 = _CVData$hookObjs$xAxi5.label) == null ? void 0 : _CVData$hookObjs$xAxi6.formatter(CVData.hookObjs.xAxisObj.data.tooltipState.relatedTickItem),
      resolution: 2,
      style: new PIXI.TextStyle({
        align: "center",
        fontSize: (_CVData$hookObjs$xAxi7 = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi8 = _CVData$hookObjs$xAxi7.label) == null ? void 0 : _CVData$hookObjs$xAxi8.fontsize,
        fill: PIXI.utils.string2hex((_CVData$hookObjs$xAxi9 = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi10 = _CVData$hookObjs$xAxi9.label) == null ? void 0 : _CVData$hookObjs$xAxi10.color)
      })
    }));
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);
  /* x轴背景 */

  var xBackground = React.useMemo(function () {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.backgroundColor),
      size: {
        width: CVData.hookObjs.xAxisObj.data.viewSize.width,
        height: CVData.hookObjs.xAxisObj.data.labelSpace
      },
      position: CVData.hookObjs.xAxisObj.data.linePosition,
      alignX: "left",
      alignY: "top"
    }));
  }, [CVData.hookObjs.yAxisObj.data.labelSpace, CVData.hookObjs.yAxisObj.data.viewSize, CVData.hookObjs.yAxisObj.data.linePosition, CVData.hookObjs.yAxisObj.data.lineColor, CVData.hookObjs.yAxisObj.initArgs.backgroundColor]);
  var xAsixElem = React.useMemo(function () {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.lineColor),
      size: {
        width: CVData.hookObjs.xAxisObj.data.lineSize.width,
        height: CVData.hookObjs.xAxisObj.data.lineSize.size
      },
      position: CVData.hookObjs.xAxisObj.data.linePosition,
      alignX: "left",
      alignY: "top"
    }));
  }, [CVData.hookObjs.xAxisObj.data.lineSize.width, CVData.hookObjs.xAxisObj.data.lineSize.size, CVData.hookObjs.xAxisObj.data.linePosition, CVData.hookObjs.xAxisObj.initArgs.lineColor]);
  var ticks = React.useMemo(function () {
    return makeTicks();
  }, [CVData.hookObjs.xAxisObj.data.displayTickArr]);
  var labels = React.useMemo(function () {
    return makeLabels();
  }, [CVData.hookObjs.xAxisObj.data.displayTickArr, CVData.hookObjs.xAxisObj.initArgs]);
  var tooltip = React.useMemo(function () {
    return makeTooltip();
  }, [CVData.hookObjs.xAxisObj.data.tooltipState, CVData.hookObjs.xAxisObj.data.tooltipIsShow, CVData.hookObjs.xAxisObj.data.x, CVData.hookObjs.xAxisObj.initArgs.tooltip]);
  return React__default.createElement(React__default.Fragment, null, xBackground, xAsixElem, React__default.createElement(react.Container, {
    x: CVData.hookObjs.xAxisObj.data.x
  }, ticks, labels), tooltip);
}; //使用memo不让其因为上级节点的更新而频繁更新


var XAxis$1 = /*#__PURE__*/React.memo(XAxis);

var DataTooltop = function DataTooltop(_ref2, _ref) {
  var _CVData$hookObjs$cand73, _CVData$hookObjs$cand74, _CVData$hookObjs$cand75, _CVData$hookObjs$cand76;

  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewPixiContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1];

  var _useState2 = React.useState(0),
      updateTemp = _useState2[0],
      setupdateTemp = _useState2[1]; //===============static===================


  var labelPadding = 10; //===============ref======================

  var lastDataTooltipTextRef = React.useRef(null);
  var lastDataTooltipTextRef2 = React.useRef(null);
  var lastDataTooltipTextRef3 = React.useRef(null);
  var lastDataTooltipTextRef4 = React.useRef(null); //===============function=================

  /* 创建最后一个candle的tooltip */

  var makeLastCandleTooltip = function makeLastCandleTooltip() {
    var _CVData$hookObjs$cand, _CVData$hookObjs$cand2, _CVData$hookObjs$cand3, _lastDataTooltipTextR, _CVData$hookObjs$cand4, _CVData$hookObjs$cand5, _CVData$hookObjs$cand6, _CVData$hookObjs$cand7, _CVData$hookObjs$cand8, _CVData$hookObjs$cand9, _CVData$hookObjs$cand10, _CVData$hookObjs$cand11, _CVData$hookObjs$cand12, _CVData$hookObjs$cand13, _CVData$hookObjs$cand14, _CVData$hookObjs$cand15;

    if (CVData.hookObjs.candleObj.data.latestCandleItem === null || !((_CVData$hookObjs$cand = CVData.hookObjs.candleObj.initArgs.candleStyles) != null && _CVData$hookObjs$cand.currentPriceTooltip.enabled) || CVData.hookObjs.candleObj.data.latestCandleToolTip === null || !CVData.hookObjs.candleObj.data.latestCandleToolTip) {
      return null;
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(DashedLine, {
      color: PIXI.utils.string2hex(CVData.hookObjs.candleObj.data.latestCandleItem.candleColor),
      size: CVData.hookObjs.candleObj.data.latestCandleToolTip.size,
      positionStart: CVData.hookObjs.candleObj.data.latestCandleToolTip.position,
      positionStop: {
        x: CVData.hookObjs.candleObj.data.latestCandleToolTip.length,
        y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y
      },
      dashLength: (_CVData$hookObjs$cand2 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand2.currentPriceTooltip.dashLength,
      spaceLength: (_CVData$hookObjs$cand3 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand3.currentPriceTooltip.spaceLength
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex(CVData.hookObjs.candleObj.data.latestCandleItem.candleColor),
      size: {
        width: CVData.hookObjs.yAxisObj.data.labelSpace,
        height: ((_lastDataTooltipTextR = lastDataTooltipTextRef.current) == null ? void 0 : _lastDataTooltipTextR.height) + labelPadding
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand4 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand5 = _CVData$hookObjs$cand4.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand6 = _CVData$hookObjs$cand5.label) == null ? void 0 : _CVData$hookObjs$cand6.color),
      size: {
        width: CVData.hookObjs.yAxisObj.data.tickLength,
        height: CVData.hookObjs.candleObj.data.latestCandleToolTip.size
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(react.Text, {
      ref: lastDataTooltipTextRef,
      anchor: {
        x: 0,
        y: 0.6
      },
      x: CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2,
      y: CVData.hookObjs.candleObj.data.latestCandleToolTip.position.y,
      text: (_CVData$hookObjs$cand7 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand8 = _CVData$hookObjs$cand7.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand9 = _CVData$hookObjs$cand8.label) == null ? void 0 : _CVData$hookObjs$cand9.formatter(CVData.hookObjs.candleObj.data.latestCandleToolTip),
      resolution: 2,
      style: new PIXI.TextStyle({
        fontSize: (_CVData$hookObjs$cand10 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand11 = _CVData$hookObjs$cand10.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand12 = _CVData$hookObjs$cand11.label) == null ? void 0 : _CVData$hookObjs$cand12.fontsize,
        fill: PIXI.utils.string2hex((_CVData$hookObjs$cand13 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand14 = _CVData$hookObjs$cand13.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand15 = _CVData$hookObjs$cand14.label) == null ? void 0 : _CVData$hookObjs$cand15.color)
      })
    }));
  };
  /* 视图范围内最末尾的candle */


  var makeLatestCandleToolTip = function makeLatestCandleToolTip() {
    var _CVData$hookObjs$cand16, _CVData$hookObjs$cand17, _CVData$hookObjs$cand18, _CVData$hookObjs$cand19, _lastDataTooltipTextR2, _CVData$hookObjs$cand20, _CVData$hookObjs$cand21, _CVData$hookObjs$cand22, _CVData$hookObjs$cand23, _CVData$hookObjs$cand24, _CVData$hookObjs$cand25, _CVData$hookObjs$cand26, _CVData$hookObjs$cand27, _CVData$hookObjs$cand28, _CVData$hookObjs$cand29, _CVData$hookObjs$cand30, _CVData$hookObjs$cand31, _CVData$hookObjs$cand32, _CVData$hookObjs$cand33, _CVData$hookObjs$cand34;

    if (!((_CVData$hookObjs$cand16 = CVData.hookObjs.candleObj.initArgs.candleStyles) != null && _CVData$hookObjs$cand16.viewLastPriceTooltip.enabled) || CVData.hookObjs.candleObj.data.latestdisplayLatestCandle === null || !CVData.hookObjs.candleObj.data.latestdisplayLatestCandle) {
      return null;
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand17 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand18 = _CVData$hookObjs$cand17.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand19 = _CVData$hookObjs$cand18.label) == null ? void 0 : _CVData$hookObjs$cand19.backGroundColor),
      size: {
        width: CVData.hookObjs.yAxisObj.data.labelSpace,
        height: ((_lastDataTooltipTextR2 = lastDataTooltipTextRef2.current) == null ? void 0 : _lastDataTooltipTextR2.height) + labelPadding
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.position.y
      },
      alignX: "left",
      alignY: "center",
      opacity: (_CVData$hookObjs$cand20 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand21 = _CVData$hookObjs$cand20.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand22 = _CVData$hookObjs$cand21.label) == null ? void 0 : _CVData$hookObjs$cand22.backGroundAlpha
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand23 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand24 = _CVData$hookObjs$cand23.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand25 = _CVData$hookObjs$cand24.label) == null ? void 0 : _CVData$hookObjs$cand25.color),
      size: {
        width: CVData.hookObjs.yAxisObj.data.tickLength,
        height: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.size
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(react.Text, {
      ref: lastDataTooltipTextRef2,
      anchor: {
        x: 0,
        y: 0.6
      },
      x: CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2,
      y: CVData.hookObjs.candleObj.data.latestdisplayLatestCandle.position.y,
      text: (_CVData$hookObjs$cand26 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand27 = _CVData$hookObjs$cand26.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand28 = _CVData$hookObjs$cand27.label) == null ? void 0 : _CVData$hookObjs$cand28.formatter(CVData.hookObjs.candleObj.data.latestdisplayLatestCandle),
      resolution: 2,
      style: new PIXI.TextStyle({
        fontSize: (_CVData$hookObjs$cand29 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand30 = _CVData$hookObjs$cand29.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand31 = _CVData$hookObjs$cand30.label) == null ? void 0 : _CVData$hookObjs$cand31.fontsize,
        fill: PIXI.utils.string2hex((_CVData$hookObjs$cand32 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand33 = _CVData$hookObjs$cand32.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand34 = _CVData$hookObjs$cand33.label) == null ? void 0 : _CVData$hookObjs$cand34.color)
      })
    }));
  };
  /* 创建最后一个candle的tooltip */


  var makeLastVolumeTooltip = function makeLastVolumeTooltip() {
    var _CVData$hookObjs$cand35, _CVData$hookObjs$cand36, _CVData$hookObjs$cand37, _CVData$hookObjs$cand38, _CVData$hookObjs$cand39, _CVData$hookObjs$cand40, _CVData$hookObjs$cand41, _lastDataTooltipTextR3, _CVData$hookObjs$cand42, _CVData$hookObjs$cand43, _CVData$hookObjs$cand44, _CVData$hookObjs$cand45, _CVData$hookObjs$cand46, _CVData$hookObjs$cand47, _CVData$hookObjs$cand48, _CVData$hookObjs$cand49, _CVData$hookObjs$cand50, _CVData$hookObjs$cand51, _CVData$hookObjs$cand52, _CVData$hookObjs$cand53;

    if (!((_CVData$hookObjs$cand35 = CVData.hookObjs.candleObj.initArgs.candleStyles) != null && _CVData$hookObjs$cand35.volumChart.currentPriceTooltip.enabled) || CVData.hookObjs.candleObj.data.latestVolumeToolTip === null || !CVData.hookObjs.candleObj.data.latestVolumeToolTip) {
      return null;
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(DashedLine, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand36 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand36.volumChart.currentPriceTooltip.color),
      size: CVData.hookObjs.candleObj.data.latestVolumeToolTip.size,
      positionStart: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position,
      positionStop: {
        x: CVData.hookObjs.candleObj.data.latestVolumeToolTip.length,
        y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y
      },
      dashLength: (_CVData$hookObjs$cand37 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand37.volumChart.currentPriceTooltip.dashLength,
      spaceLength: (_CVData$hookObjs$cand38 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand38.volumChart.currentPriceTooltip.spaceLength
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand39 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand40 = _CVData$hookObjs$cand39.volumChart.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand41 = _CVData$hookObjs$cand40.label) == null ? void 0 : _CVData$hookObjs$cand41.backGroundColor),
      size: {
        width: CVData.hookObjs.yAxisObj.data.labelSpace,
        height: ((_lastDataTooltipTextR3 = lastDataTooltipTextRef3.current) == null ? void 0 : _lastDataTooltipTextR3.height) + labelPadding
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand42 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand43 = _CVData$hookObjs$cand42.volumChart.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand44 = _CVData$hookObjs$cand43.label) == null ? void 0 : _CVData$hookObjs$cand44.color),
      size: {
        width: CVData.hookObjs.yAxisObj.data.tickLength,
        height: CVData.hookObjs.candleObj.data.latestVolumeToolTip.size
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(react.Text, {
      ref: lastDataTooltipTextRef3,
      anchor: {
        x: 0,
        y: 0.6
      },
      x: CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2,
      y: CVData.hookObjs.candleObj.data.latestVolumeToolTip.position.y,
      text: (_CVData$hookObjs$cand45 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand46 = _CVData$hookObjs$cand45.volumChart.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand47 = _CVData$hookObjs$cand46.label) == null ? void 0 : _CVData$hookObjs$cand47.formatter(CVData.hookObjs.candleObj.data.latestVolumeToolTip, CVData.initArgs.language),
      resolution: 2,
      style: new PIXI.TextStyle({
        fontSize: (_CVData$hookObjs$cand48 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand49 = _CVData$hookObjs$cand48.volumChart.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand50 = _CVData$hookObjs$cand49.label) == null ? void 0 : _CVData$hookObjs$cand50.fontsize,
        fill: PIXI.utils.string2hex((_CVData$hookObjs$cand51 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand52 = _CVData$hookObjs$cand51.volumChart.currentPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand53 = _CVData$hookObjs$cand52.label) == null ? void 0 : _CVData$hookObjs$cand53.color)
      })
    }));
  };
  /* 视图范围内最末尾的candle */


  var makeLatestVolumeToolTip = function makeLatestVolumeToolTip() {
    var _CVData$hookObjs$cand54, _CVData$hookObjs$cand55, _CVData$hookObjs$cand56, _CVData$hookObjs$cand57, _lastDataTooltipTextR4, _CVData$hookObjs$cand58, _CVData$hookObjs$cand59, _CVData$hookObjs$cand60, _CVData$hookObjs$cand61, _CVData$hookObjs$cand62, _CVData$hookObjs$cand63, _CVData$hookObjs$cand64, _CVData$hookObjs$cand65, _CVData$hookObjs$cand66, _CVData$hookObjs$cand67, _CVData$hookObjs$cand68, _CVData$hookObjs$cand69, _CVData$hookObjs$cand70, _CVData$hookObjs$cand71, _CVData$hookObjs$cand72;

    if (!((_CVData$hookObjs$cand54 = CVData.hookObjs.candleObj.initArgs.candleStyles) != null && _CVData$hookObjs$cand54.volumChart.viewLastPriceTooltip.enabled) || CVData.hookObjs.candleObj.data.latestdisplayLatestVolume === null || !CVData.hookObjs.candleObj.data.latestdisplayLatestVolume) {
      return null;
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand55 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand56 = _CVData$hookObjs$cand55.volumChart.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand57 = _CVData$hookObjs$cand56.label) == null ? void 0 : _CVData$hookObjs$cand57.backGroundColor),
      size: {
        width: CVData.hookObjs.yAxisObj.data.labelSpace,
        height: ((_lastDataTooltipTextR4 = lastDataTooltipTextRef4.current) == null ? void 0 : _lastDataTooltipTextR4.height) + labelPadding
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.position.y
      },
      alignX: "left",
      alignY: "center",
      opacity: (_CVData$hookObjs$cand58 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand59 = _CVData$hookObjs$cand58.volumChart.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand60 = _CVData$hookObjs$cand59.label) == null ? void 0 : _CVData$hookObjs$cand60.backGroundAlpha
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$cand61 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand62 = _CVData$hookObjs$cand61.volumChart.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand63 = _CVData$hookObjs$cand62.label) == null ? void 0 : _CVData$hookObjs$cand63.color),
      size: {
        width: CVData.hookObjs.yAxisObj.data.tickLength,
        height: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.size
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(react.Text, {
      ref: lastDataTooltipTextRef4,
      anchor: {
        x: 0,
        y: 0.6
      },
      x: CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2,
      y: CVData.hookObjs.candleObj.data.latestdisplayLatestVolume.position.y,
      text: (_CVData$hookObjs$cand64 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand65 = _CVData$hookObjs$cand64.volumChart.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand66 = _CVData$hookObjs$cand65.label) == null ? void 0 : _CVData$hookObjs$cand66.formatter(CVData.hookObjs.candleObj.data.latestdisplayLatestVolume, CVData.initArgs.language),
      resolution: 2,
      style: new PIXI.TextStyle({
        fontSize: (_CVData$hookObjs$cand67 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand68 = _CVData$hookObjs$cand67.volumChart.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand69 = _CVData$hookObjs$cand68.label) == null ? void 0 : _CVData$hookObjs$cand69.fontsize,
        fill: PIXI.utils.string2hex((_CVData$hookObjs$cand70 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand71 = _CVData$hookObjs$cand70.volumChart.viewLastPriceTooltip) == null ? void 0 : (_CVData$hookObjs$cand72 = _CVData$hookObjs$cand71.label) == null ? void 0 : _CVData$hookObjs$cand72.color)
      })
    }));
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
      setTimeout(function () {
        setupdateTemp(+new Date());
      }, 500);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []); //

  React.useEffect(function () {
    return function () {
      setTimeout(function () {
        setupdateTemp(+new Date());
      }, 500);
    };
  }, [CVData.initArgs.timeFormat]);
  var latestCandleToolTip = React.useMemo(function () {
    return makeLatestCandleToolTip();
  }, [_extends({}, CVData.hookObjs.candleObj.data.latestdisplayLatestCandle), updateTemp, _extends({}, (_CVData$hookObjs$cand73 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand73.viewLastPriceTooltip)]);
  var lastCandleTooltip = React.useMemo(function () {
    return makeLastCandleTooltip();
  }, [_extends({}, CVData.hookObjs.candleObj.data.latestCandleToolTip), updateTemp, _extends({}, (_CVData$hookObjs$cand74 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand74.currentPriceTooltip)]);
  var LastVolumeTooltip = React.useMemo(function () {
    return makeLastVolumeTooltip();
  }, [_extends({}, CVData.hookObjs.candleObj.data.latestVolumeToolTip), updateTemp, _extends({}, (_CVData$hookObjs$cand75 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand75.volumChart.currentPriceTooltip)]); //

  var LatestVolumeToolTip = React.useMemo(function () {
    return makeLatestVolumeToolTip();
  }, [_extends({}, CVData.hookObjs.candleObj.data.latestdisplayLatestVolume), updateTemp, _extends({}, (_CVData$hookObjs$cand76 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : _CVData$hookObjs$cand76.volumChart.viewLastPriceTooltip)]);
  return React__default.createElement(React__default.Fragment, null, LatestVolumeToolTip, LastVolumeTooltip, latestCandleToolTip, lastCandleTooltip);
}; //使用memo不让其因为上级节点的更新而频繁更新


var DataToolTip = /*#__PURE__*/React.memo(DataTooltop);

var YAxis = function YAxis(_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewPixiContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static===================


  var labelPadding = 10; //===============ref======================

  var tooltipTextRef = React.useRef(null); //===============function=================

  /* 创建tick */

  var makeTicks = function makeTicks() {
    var result = [];
    var index = 0;

    for (var _iterator = _createForOfIteratorHelperLoose(CVData.hookObjs.yAxisObj.data.displayTickArr), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      result.push(React__default.createElement(Rectangle, {
        key: index + "_a",
        color: PIXI.utils.string2hex(item.color),
        size: {
          width: item.length,
          height: item.size
        },
        position: item.cPosition,
        alignX: "left",
        alignY: "center"
      }));
      index++;
    }

    return result;
  };
  /* 创建label */


  var makeLabels = function makeLabels() {
    var result = [];
    var index = 0;

    for (var _iterator2 = _createForOfIteratorHelperLoose(CVData.hookObjs.yAxisObj.data.displayTickArr), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;
      result.push(React__default.createElement(react.Text, {
        key: index + "_b",
        anchor: {
          x: 0,
          y: 0.6
        },
        x: item.cPosition.x + item.length * 2,
        y: item.cPosition.y,
        text: CVData.hookObjs.yAxisObj.initArgs.formatter(item),
        resolution: 2,
        style: new PIXI.TextStyle({
          fontSize: CVData.hookObjs.yAxisObj.initArgs.fontSize,
          fill: PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tickColor)
        })
      }));
      index++;
    }

    return result;
  };
  /* 创建tooltip */


  var makeTooltip = function makeTooltip() {
    var _CVData$hookObjs$yAxi, _CVData$hookObjs$yAxi2, _tooltipTextRef$curre, _CVData$hookObjs$yAxi3, _CVData$hookObjs$yAxi4, _CVData$hookObjs$yAxi5, _CVData$hookObjs$yAxi6, _CVData$hookObjs$yAxi7, _CVData$hookObjs$yAxi8, _CVData$hookObjs$yAxi9, _CVData$hookObjs$yAxi10;

    if (!CVData.hookObjs.yAxisObj.initArgs.tooltip.enabled || CVData.hookObjs.yAxisObj.data.tooltipState === null || !CVData.hookObjs.yAxisObj.data.tooltipIsShow) {
      return null;
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(DashedLine, {
      color: PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.tooltip.color),
      size: CVData.hookObjs.yAxisObj.data.tooltipState.size,
      positionStart: CVData.hookObjs.yAxisObj.data.tooltipState.position,
      positionStop: {
        x: CVData.hookObjs.yAxisObj.data.tooltipState.length,
        y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y
      },
      dashLength: CVData.hookObjs.yAxisObj.initArgs.tooltip.dashLength,
      spaceLength: CVData.hookObjs.yAxisObj.initArgs.tooltip.spaceLength
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$yAxi = CVData.hookObjs.yAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$yAxi2 = _CVData$hookObjs$yAxi.label) == null ? void 0 : _CVData$hookObjs$yAxi2.backGroundColor),
      size: {
        width: CVData.hookObjs.yAxisObj.data.labelSpace,
        height: ((_tooltipTextRef$curre = tooltipTextRef.current) == null ? void 0 : _tooltipTextRef$curre.height) + labelPadding
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex((_CVData$hookObjs$yAxi3 = CVData.hookObjs.yAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$yAxi4 = _CVData$hookObjs$yAxi3.label) == null ? void 0 : _CVData$hookObjs$yAxi4.color),
      size: {
        width: CVData.hookObjs.yAxisObj.data.tickLength,
        height: CVData.hookObjs.yAxisObj.initArgs.tickSize
      },
      position: {
        x: CVData.hookObjs.yAxisObj.data.linePosition.x,
        y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y
      },
      alignX: "left",
      alignY: "center"
    }), React__default.createElement(react.Text, {
      ref: tooltipTextRef,
      anchor: {
        x: 0,
        y: 0.6
      },
      x: CVData.hookObjs.yAxisObj.data.linePosition.x + CVData.hookObjs.yAxisObj.data.tickLength * 2,
      y: CVData.hookObjs.yAxisObj.data.tooltipState.position.y,
      text: (_CVData$hookObjs$yAxi5 = CVData.hookObjs.yAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$yAxi6 = _CVData$hookObjs$yAxi5.label) == null ? void 0 : _CVData$hookObjs$yAxi6.formatter(CVData.hookObjs.yAxisObj.data.tooltipState),
      resolution: 2,
      style: new PIXI.TextStyle({
        fontSize: (_CVData$hookObjs$yAxi7 = CVData.hookObjs.yAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$yAxi8 = _CVData$hookObjs$yAxi7.label) == null ? void 0 : _CVData$hookObjs$yAxi8.fontsize,
        fill: PIXI.utils.string2hex((_CVData$hookObjs$yAxi9 = CVData.hookObjs.yAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$yAxi10 = _CVData$hookObjs$yAxi9.label) == null ? void 0 : _CVData$hookObjs$yAxi10.color)
      })
    }));
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);
  /* y轴背景 */

  var yBackground = React.useMemo(function () {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement(Rectangle, {
      color: PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.backgroundColor),
      size: {
        width: CVData.hookObjs.yAxisObj.data.labelSpace,
        height: CVData.hookObjs.yAxisObj.data.viewSize.height
      },
      position: CVData.hookObjs.yAxisObj.data.linePosition,
      alignX: "left",
      alignY: "top"
    }));
  }, [CVData.hookObjs.yAxisObj.data.labelSpace, CVData.hookObjs.yAxisObj.data.viewSize, CVData.hookObjs.yAxisObj.data.linePosition, CVData.hookObjs.yAxisObj.data.lineColor, CVData.hookObjs.yAxisObj.initArgs.backgroundColor]);
  var yAxis = React.useMemo(function () {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement(Rectangle, {
      color: CVData.hookObjs.yAxisObj.data.lineColor,
      size: {
        width: CVData.hookObjs.yAxisObj.data.lineSize.size,
        height: CVData.hookObjs.yAxisObj.data.viewSize.height
      },
      position: CVData.hookObjs.yAxisObj.data.linePosition,
      alignX: "left",
      alignY: "top"
    }));
  }, [CVData.hookObjs.yAxisObj.data.viewSize, CVData.hookObjs.yAxisObj.data.lineSize, CVData.hookObjs.yAxisObj.data.linePosition, CVData.hookObjs.yAxisObj.data.lineColor]);
  /* 创建y轴标 */

  var yTicks = React.useMemo(function () {
    return makeTicks();
  }, [CVData.hookObjs.yAxisObj.data.displayTickArr]);
  /* 创建label */

  var yLabels = React.useMemo(function () {
    return makeLabels();
  }, [CVData.hookObjs.yAxisObj.data.displayTickArr, CVData.hookObjs.yAxisObj.initArgs]);
  /* 创建ToolTip */

  var tooltip = React.useMemo(function () {
    return makeTooltip();
  }, [CVData.hookObjs.yAxisObj.data.tooltipState, CVData.hookObjs.yAxisObj.data.tooltipIsShow, CVData.hookObjs.yAxisObj.initArgs.tooltip]);
  return React__default.createElement(React__default.Fragment, null, yBackground, yAxis, yTicks, yLabels, React__default.createElement(DataToolTip, null), tooltip);
}; //使用memo不让其因为上级节点的更新而频繁更新


var YAxis$1 = /*#__PURE__*/React.memo(YAxis);

var Data = function Data(_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewPixiContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static===================

  var tooltipTextRef = React.useRef(null);

  var getColor = function getColor(status, type) {
    if (status === "rise" && type === "wick") {
      var _CVData$initArgs$data, _CVData$initArgs$data2;

      return (_CVData$initArgs$data = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data2 = _CVData$initArgs$data.candleStyles) == null ? void 0 : _CVData$initArgs$data2.wickRiseColor;
    }

    if (status === "fall" && type === "wick") {
      var _CVData$initArgs$data3, _CVData$initArgs$data4;

      return (_CVData$initArgs$data3 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data4 = _CVData$initArgs$data3.candleStyles) == null ? void 0 : _CVData$initArgs$data4.wickFallColor;
    }

    if (status === "rise" && type === "candle") {
      var _CVData$initArgs$data5, _CVData$initArgs$data6;

      return (_CVData$initArgs$data5 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data6 = _CVData$initArgs$data5.candleStyles) == null ? void 0 : _CVData$initArgs$data6.candleRiseColor;
    }

    if (status === "fall" && type === "candle") {
      var _CVData$initArgs$data7, _CVData$initArgs$data8;

      return (_CVData$initArgs$data7 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data8 = _CVData$initArgs$data7.candleStyles) == null ? void 0 : _CVData$initArgs$data8.candleFallColor;
    }

    return "";
  }; //===============function=================

  /* 创建candle */


  var makeCandle = function makeCandle() {
    var result = [];

    for (var _iterator = _createForOfIteratorHelperLoose(CVData.hookObjs.candleObj.data.displayCandleData), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      result.push(React__default.createElement(Rectangle, {
        key: item.time + "_candle",
        color: PIXI.utils.string2hex(getColor(item.candleStateus, "candle")),
        size: {
          width: item.candleWidth,
          height: item.candleLength
        },
        position: {
          x: item.currentTick.cPosition.x,
          y: item.candlePixPosition.y
        },
        alignX: "center",
        alignY: "top"
      }));
    }

    return result;
  };
  /* 创建wick */


  var makeWick = function makeWick() {
    var result = [];

    for (var _iterator2 = _createForOfIteratorHelperLoose(CVData.hookObjs.candleObj.data.displayCandleData), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;

      if (!item.isEscaped) {
        result.push(React__default.createElement(Rectangle, {
          key: item.time + "_wick",
          color: PIXI.utils.string2hex(getColor(item.candleStateus, "wick")),
          size: {
            width: item.wickWidth,
            height: item.wickLength
          },
          position: {
            x: item.currentTick.cPosition.x,
            y: item.wickPixPosition.y
          },
          alignX: "center",
          alignY: "top"
        }));
      } else {
        result.push(React__default.createElement(Rectangle, {
          key: item.time + "_wick",
          color: 0,
          size: {
            width: 0,
            height: 0
          },
          position: {
            x: 0,
            y: 0
          },
          alignX: "center",
          alignY: "top"
        }));
      }
    }

    return result;
  };
  /* 创建批渲染 */


  var makeBatchKline = function makeBatchKline() {
    var _CVData$initArgs$data9, _CVData$initArgs$data10, _CVData$initArgs$data11, _CVData$initArgs$data12, _CVData$initArgs$data13, _CVData$initArgs$data14, _CVData$initArgs$data15, _CVData$initArgs$data16;

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(KlineBatching, Object.assign({}, {
      isDQuickUpdateing: CVData.hookObjs.candleObj.data.isDQuickUpdateing,
      wickRiseColor: (_CVData$initArgs$data9 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data10 = _CVData$initArgs$data9.candleStyles) == null ? void 0 : _CVData$initArgs$data10.wickRiseColor,
      wickFallColor: (_CVData$initArgs$data11 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data12 = _CVData$initArgs$data11.candleStyles) == null ? void 0 : _CVData$initArgs$data12.wickFallColor,
      candleRiseColor: (_CVData$initArgs$data13 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data14 = _CVData$initArgs$data13.candleStyles) == null ? void 0 : _CVData$initArgs$data14.candleRiseColor,
      candleFallColor: (_CVData$initArgs$data15 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data16 = _CVData$initArgs$data15.candleStyles) == null ? void 0 : _CVData$initArgs$data16.candleFallColor,
      data: CVData.hookObjs.candleObj.data.displayCandleData
    })));
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);
  var wc = {
    wick: [],
    candle: []
  };
  var batchKLine = React__default.createElement(React__default.Fragment, null);

  if (CVData.hookObjs.xAxisObj.data.tickArr.length > 120) {
    batchKLine = React.useMemo(function () {
      return makeBatchKline();
    }, [CVData.hookObjs.candleObj.data.displayCandleData, CVData.hookObjs.candleObj.data.isDQuickUpdateing, CVData.initArgs.data.candleStyles.wickFallColor, CVData.initArgs.data.candleStyles.wickFallColor, CVData.initArgs.data.candleStyles.candleFallColor, CVData.initArgs.data.candleStyles.candleRiseColor, _extends({}, CVData.initArgs.timeZone)]);
  } else {
    wc = React.useMemo(function () {
      var result = {
        wick: [],
        candle: []
      };

      if (CVData.hookObjs.candleObj.data.displayCandleData.length === 0) {
        result.wick = [];
        result.candle = [];
        return result;
      }

      if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
        result.candle = makeCandle();
      }

      result.wick = makeWick();
      return result;
    }, [CVData.hookObjs.candleObj.data.displayCandleData, CVData.hookObjs.candleObj.data.isDQuickUpdateing, CVData.initArgs.data.candleStyles.wickFallColor, CVData.initArgs.data.candleStyles.wickFallColor, CVData.initArgs.data.candleStyles.candleFallColor, CVData.initArgs.data.candleStyles.candleRiseColor, _extends({}, CVData.initArgs.timeZone)]);
  }

  return React__default.createElement(React__default.Fragment, null, React__default.createElement(react.Container, {
    x: CVData.hookObjs.xAxisObj.data.x,
    y: CVData.hookObjs.candleObj.data.miny,
    scale: {
      x: 1,
      y: CVData.hookObjs.candleObj.data.yScale
    }
  }, function () {
    if (CVData.hookObjs.xAxisObj.data.tickArr.length > 120) {
      return batchKLine;
    } else {
      return React__default.createElement(React__default.Fragment, null, wc.wick, wc.candle);
    }
  }()));
}; //使用memo不让其因为上级节点的更新而频繁更新


var Data$1 = /*#__PURE__*/React.memo(Data);

var NetLines = function NetLines(_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewPixiContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static===================
  //===============ref======================
  //===============function=================

  /* 创建网格线 */


  var makeNetLinesx = function makeNetLinesx() {
    var result = [];
    var index = 0;

    for (var _iterator = _createForOfIteratorHelperLoose(CVData.hookObjs.xAxisObj.data.netLineArr), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      result.push(React__default.createElement(React__default.Fragment, {
        key: index + "_c"
      }, React__default.createElement(Rectangle, {
        color: PIXI.utils.string2hex(CVData.hookObjs.xAxisObj.initArgs.netLineColor),
        size: {
          width: item.size,
          height: item.length
        },
        position: item.cPosition,
        alignX: "center",
        alignY: "top"
      })));
      index++;
    }

    return result;
  };

  var makeNetLinesy = function makeNetLinesy() {
    var result = [];
    var index = 0;

    for (var _iterator2 = _createForOfIteratorHelperLoose(CVData.hookObjs.yAxisObj.data.netLineArr), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;
      result.push(React__default.createElement(React__default.Fragment, {
        key: index + "_b"
      }, React__default.createElement(Rectangle, {
        color: PIXI.utils.string2hex(CVData.hookObjs.yAxisObj.initArgs.netLineColor),
        size: {
          width: item.length,
          height: item.size
        },
        position: item.cPosition,
        alignX: "left",
        alignY: "center"
      })));
      index++;
    }

    return result;
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);
  var netLinesx = React.useMemo(function () {
    return makeNetLinesx();
  }, [CVData.hookObjs.xAxisObj.data.netLineArr, CVData.hookObjs.xAxisObj.initArgs.netLineColor]);
  var netLinesy = React.useMemo(function () {
    return makeNetLinesy();
  }, [CVData.hookObjs.yAxisObj.data.netLineArr, CVData.hookObjs.yAxisObj.initArgs.netLineColor]);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement(react.Container, {
    x: CVData.hookObjs.xAxisObj.data.x
  }, React__default.createElement(React__default.Fragment, null, netLinesx)), netLinesy);
}; //使用memo不让其因为上级节点的更新而频繁更新


var NetLines$1 = /*#__PURE__*/React.memo(NetLines);

var VolumChat = function VolumChat(_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewPixiContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static====================


  var staticMax = 1; //===============function=================

  /* 创建volume */

  var makeChat = function makeChat() {
    if (!CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.enabled) {
      return [];
    }

    var result = [];

    var _loop = function _loop() {
      var _CVData$hookObjs$cand, _CVData$hookObjs$cand2;

      item = _step.value;
      var alpha = (_CVData$hookObjs$cand = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand2 = _CVData$hookObjs$cand.volumChart) == null ? void 0 : _CVData$hookObjs$cand2.alpha;
      var currentHeight = CVData.hookObjs.candleObj.data.volumChartPixHeight * (Number(item.volume) / staticMax);

      if (!item.isEscaped) {
        result.push(React__default.createElement(Rectangle, {
          key: item.time + "_volume",
          color: PIXI.utils.string2hex(function () {
            if (item.candleStateus === "rise") {
              return CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.riseColor;
            }

            return CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.fallColor;
          }()),
          opacity: function () {
            if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
              return alpha;
            }

            return 1;
          }(),
          size: {
            width: function () {
              if (!CVData.hookObjs.candleObj.data.isDQuickUpdateing) {
                return item.candleWidth;
              }

              return 1;
            }(),
            height: currentHeight
          },
          position: {
            x: item.currentTick.cPosition.x,
            y: CVData.hookObjs.xAxisObj.data.linePosition.y
          },
          alignX: "center",
          alignY: "bottom"
        }));
      } else {
        result.push(React__default.createElement(React__default.Fragment, {
          key: item.time + "_volume"
        }));
      }
    };

    for (var _iterator = _createForOfIteratorHelperLoose(CVData.hookObjs.candleObj.data.displayCandleData), _step; !(_step = _iterator()).done;) {
      var item;

      _loop();
    }

    return result;
  };
  /* 批量创建volume */


  var makeChatBatching = function makeChatBatching() {
    var _CVData$hookObjs$cand3, _CVData$hookObjs$cand4;

    if (!CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.enabled) {
      return [];
    }

    return React__default.createElement(React__default.Fragment, null, React__default.createElement(VolumeBatching, Object.assign({}, {
      alpha: (_CVData$hookObjs$cand3 = CVData.hookObjs.candleObj.initArgs.candleStyles) == null ? void 0 : (_CVData$hookObjs$cand4 = _CVData$hookObjs$cand3.volumChart) == null ? void 0 : _CVData$hookObjs$cand4.alpha,
      staticMax: staticMax,
      volumChartPixHeight: CVData.hookObjs.candleObj.data.volumChartPixHeight,
      riseColor: CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.riseColor,
      fallColor: CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.fallColor,
      isDQuickUpdateing: CVData.hookObjs.candleObj.data.isDQuickUpdateing,
      linePositionY: CVData.hookObjs.xAxisObj.data.linePosition.y,
      data: CVData.hookObjs.candleObj.data.displayCandleData
    })));
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);
  var chat = React.useMemo(function () {
    if (CVData.hookObjs.xAxisObj.data.tickArr.length > 120) {
      return makeChatBatching();
    } else {
      return makeChat();
    }
  }, [CVData.hookObjs.candleObj.data.displayCandleData, CVData.hookObjs.candleObj.data.isDQuickUpdateing, CVData.hookObjs.candleObj.data.volumChartViewMax, CVData.hookObjs.candleObj.data.volumChartPixHeight, CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.riseColor, CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.fallColor, CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.alpha, CVData.hookObjs.candleObj.initArgs.candleStyles.volumChart.enabled]);
  var scale = //用允许的最大高度 / 当前图像里的最大高度 = 需要缩放的值
  CVData.hookObjs.candleObj.data.volumChartPixHeight / (CVData.hookObjs.candleObj.data.volumChartPixHeight * (Number(CVData.hookObjs.candleObj.data.volumChartViewMax) / staticMax)); //y轴位置也要减去刚刚计算的缩放

  var containerY = CVData.hookObjs.xAxisObj.data.linePosition.y - CVData.hookObjs.xAxisObj.data.linePosition.y * scale;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement(react.Container, {
    x: CVData.hookObjs.xAxisObj.data.x,
    y: containerY,
    scale: {
      x: 1,
      y: scale
    }
  }, chat));
}; //使用memo不让其因为上级节点的更新而频繁更新


var VolumChart = /*#__PURE__*/React.memo(VolumChat);

var Info = function Info(_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static===================
  //===============ref======================
  //===============function=================


  var makeInfo = function makeInfo() {
    if (!CVData.initArgs.enableinfo) {
      return null;
    }

    if (CVData.hookObjs.xAxisObj.data.tooltipState !== null && CVData.hookObjs.xAxisObj.data.tooltipIsShow && typeof CVData.hookObjs.candleObj.data.cursorCandleItem !== "undefined" && CVData.hookObjs.candleObj.data.cursorCandleItem !== null) {
      var _CVData$hookObjs$xAxi, _CVData$hookObjs$xAxi2, _CVData$hookObjs$xAxi3, _CVData$initArgs$time;

      var _tooltipState = CVData.hookObjs.xAxisObj.data.tooltipState;
      var item = CVData.hookObjs.candleObj.data.cursorCandleItem;
      return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
        className: "info"
      }, React__default.createElement("div", {
        className: "timetype"
      }, React__default.createElement("label", null, LANGUAGES[CVData.initArgs.language].timeFormat[(_CVData$hookObjs$xAxi = CVData.hookObjs.xAxisObj.data.currentTimeType) == null ? void 0 : _CVData$hookObjs$xAxi.lang])), React__default.createElement("div", null, React__default.createElement("span", null, "Date:"), React__default.createElement("label", null, (_CVData$hookObjs$xAxi2 = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi3 = _CVData$hookObjs$xAxi2.label) == null ? void 0 : _CVData$hookObjs$xAxi3.formatter(_tooltipState.relatedTickItem)), React__default.createElement("label", null, "GMT +", (_CVData$initArgs$time = CVData.initArgs.timeZone) == null ? void 0 : _CVData$initArgs$time.displayTimeZone)), React__default.createElement("div", null, React__default.createElement("span", null, "Open:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(item.open).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "Close:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(item.close).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "High:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(item.high).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "Low:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(item.low).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "Volume:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(item.volume).toFixed(3)))))));
    } else if (CVData.hookObjs.candleObj.data.latestCandleItem !== null) {
      var _CVData$hookObjs$xAxi4, _CVData$hookObjs$xAxi5, _CVData$hookObjs$xAxi6, _CVData$initArgs$time2;

      var currentItem = CVData.hookObjs.candleObj.data.latestCandleItem;
      return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
        className: "info"
      }, React__default.createElement("div", {
        className: "timetype"
      }, React__default.createElement("label", null, LANGUAGES[CVData.initArgs.language].timeFormat[(_CVData$hookObjs$xAxi4 = CVData.hookObjs.xAxisObj.data.currentTimeType) == null ? void 0 : _CVData$hookObjs$xAxi4.lang])), React__default.createElement("div", null, React__default.createElement("span", null, "Date:"), React__default.createElement("label", null, (_CVData$hookObjs$xAxi5 = CVData.hookObjs.xAxisObj.initArgs.tooltip) == null ? void 0 : (_CVData$hookObjs$xAxi6 = _CVData$hookObjs$xAxi5.label) == null ? void 0 : _CVData$hookObjs$xAxi6.formatter({
        value: currentItem.time
      })), React__default.createElement("label", null, "GMT +", (_CVData$initArgs$time2 = CVData.initArgs.timeZone) == null ? void 0 : _CVData$initArgs$time2.displayTimeZone)), React__default.createElement("div", null, React__default.createElement("span", null, "Open:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(currentItem.open).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "Current:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(currentItem.close).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "High:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(currentItem.high).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "Low:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(currentItem.low).toFixed(3))))), React__default.createElement("div", null, React__default.createElement("span", null, "Volume:"), React__default.createElement("label", null, thousandsSplit(Number(new _bigNumber(currentItem.volume).toFixed(3)))))));
    }

    return null;
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);
  var title = React.useMemo(function () {
    if (CVData.initArgs.enableTitle) {
      return React__default.createElement("div", {
        className: "title"
      }, CVData.initArgs.title);
    }

    return null;
  }, [CVData.initArgs.title]);
  var infoLayer = React.useMemo(function () {
    return makeInfo();
  }, [CVData.hookObjs.candleObj.data.latestCandleItem, CVData.hookObjs.xAxisObj.data.tooltipIsShow, CVData.hookObjs.candleObj.data.cursorCandleItem]);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    className: "infoDisplayLayer"
  }, React__default.createElement(React__default.Fragment, null, title, infoLayer)));
};

var css_248z$1 = ".cdcdv_l_container {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tleft: 0;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\t-webkit-backdrop-filter: blur(3px);\r\n\t        backdrop-filter: blur(3px);\r\n\tbackground-repeat: no-repeat;\r\n\tbackground-size: 20%;\r\n\tbackground-position: center;\r\n\tbackground-color: rgba(0, 0, 0, 0.6);\r\n\tz-index: 99;\r\n}\r\n.cdcdv_l_container.black {\r\n\tbackground-image: url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22 style%3D%22margin%3A auto%3B background%3A rgba(255%2C 255%2C 255%2C0)%3B display%3A block%3B shape-rendering%3A auto%3B%22 width%3D%22150px%22 height%3D%22150px%22 viewBox%3D%220 0 100 100%22 preserveAspectRatio%3D%22xMidYMid%22%3E%0D%3Ccircle cx%3D%2250%22 cy%3D%2250%22 r%3D%2230%22 stroke-width%3D%228%22 stroke%3D%22%23ffffff%22 stroke-dasharray%3D%2247.12388980384689 47.12388980384689%22 fill%3D%22none%22 stroke-linecap%3D%22round%22%3E%0D  %3CanimateTransform attributeName%3D%22transform%22 type%3D%22rotate%22 repeatCount%3D%22indefinite%22 dur%3D%221s%22 keyTimes%3D%220%3B1%22 values%3D%220 50 50%3B360 50 50%22%3E%3C%2FanimateTransform%3E%0D%3C%2Fcircle%3E%0D%3C!-- %5Bldio%5D generated by https%3A%2F%2Floading.io%2F --%3E%3C%2Fsvg%3E\");\r\n\tbackground-color: rgba(0, 0, 0, 0.6);\r\n}\r\n.cdcdv_l_container.white {\r\n\tbackground-image: url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22 style%3D%22margin%3A auto%3B background%3A rgba(0%2C 0%2C 0%2C0)%3B display%3A block%3B shape-rendering%3A auto%3B%22 width%3D%22150px%22 height%3D%22150px%22 viewBox%3D%220 0 100 100%22 preserveAspectRatio%3D%22xMidYMid%22%3E%0D%3Ccircle cx%3D%2250%22 cy%3D%2250%22 r%3D%2230%22 stroke-width%3D%228%22 stroke%3D%22%23000%22 stroke-dasharray%3D%2247.12388980384689 47.12388980384689%22 fill%3D%22none%22 stroke-linecap%3D%22round%22%3E%0D  %3CanimateTransform attributeName%3D%22transform%22 type%3D%22rotate%22 repeatCount%3D%22indefinite%22 dur%3D%221s%22 keyTimes%3D%220%3B1%22 values%3D%220 50 50%3B360 50 50%22%3E%3C%2FanimateTransform%3E%0D%3C%2Fcircle%3E%0D%3C!-- %5Bldio%5D generated by https%3A%2F%2Floading.io%2F --%3E%3C%2Fsvg%3E\");\r\n\tbackground-color: rgba(255, 255, 255, 0.6);\r\n}\r\n";
styleInject(css_248z$1);

/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
 */

var Loading = function Loading(_ref2, _ref) {
  var _CVData$initArgs$data, _CVData$initArgs$data2;

  var _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? "black" : _ref2$color;
  //===============useHooks=================
  var CVData = useCandleViewContext(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1]; //===============static===================
  //===============ref======================
  //===============function=================
  //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
    };
  }, []);

  if ((_CVData$initArgs$data = CVData.initArgs.data) != null && (_CVData$initArgs$data2 = _CVData$initArgs$data.dynamicData) != null && _CVData$initArgs$data2.showLoading && CVData.hookObjs.candleObj.data.isFetchingData) {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
      className: "cdcdv_l_container" + " " + color
    }));
  } else if (!CVData.hookObjs.candleObj.data.isFinishedInit) {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
      className: "cdcdv_l_container" + " " + color
    }));
  }

  {
    return React__default.createElement(React__default.Fragment, null);
  }
};

/**
 * 创建一个需要全局使用的context
 **/

var candleViewPixiContext = /*#__PURE__*/React.createContext({});
var useCandleViewPixiContext = function useCandleViewPixiContext() {
  var r = React.useContext(candleViewPixiContext);
  return r;
};
var CandleView = /*#__PURE__*/React.memo(function (_ref2, _ref) {
  _objectDestructuringEmpty(_ref2);

  //===============useHooks=================
  var CVData = useCandleViewContext();
  var $ = useJquery();
  var resizeDebounce = useDebounce(); //===============state====================

  var _useState = React.useState(false),
      isMounted = _useState[0],
      setIsMounted = _useState[1];
  /**
   *组件当前位置
   */


  var _useState2 = React.useState({
    x: 0,
    y: 0
  }),
      offset = _useState2[0],
      setoffset = _useState2[1];
  /* 鼠标在组件中的位置 */


  var _useState3 = React.useState({
    x: 0,
    y: 0
  }),
      setrelativePosition = _useState3[1];
  /**
   *鼠标是否按下
   */


  var _useState4 = React.useState(false),
      isMouseDown = _useState4[0],
      setisMouseDown = _useState4[1];
  /**
   *鼠标按下时的位置
   */


  var _useState5 = React.useState({
    x: 0,
    y: 0
  }),
      mouseDownPosition = _useState5[0],
      setmouseDownPosition = _useState5[1];
  /**
   *鼠标实时位置
   */


  var _useState6 = React.useState({
    x: 0,
    y: 0
  }),
      mousePosition = _useState6[0],
      setmousePosition = _useState6[1];

  var _useState7 = React.useState(0),
      touchScaleStartLength = _useState7[0],
      settouchScaleStartLength = _useState7[1];
  /**
   *是否触摸缩放
   */


  var _useState8 = React.useState(false),
      isTouchScale = _useState8[0],
      setisTouchScale = _useState8[1]; //===============static===================
  //===============ref======================


  var canvasConatiner = React.useRef(null);
  var resizeObserverRef = React.useRef(null); //===============function=================

  /**
   *初始化CandleView
   */

  var initCandleView = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //获得画布尺寸
              getCanvasSize(); //创建resize

              createResizeObserver(); //初始化背景颜色

              CVData.funcs.setcanvasBackgroundColor(CVData.initArgs.backgroundColor);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function initCandleView() {
      return _ref3.apply(this, arguments);
    };
  }();
  /**
   *获得画布尺寸
   */


  var getCanvasSize = function getCanvasSize() {
    if (CVData.initArgs.height === "auto") {
      $(canvasConatiner.current).parent().css("overflow", "hidden");
      $(canvasConatiner.current).parent().css("position", "relative");
    } //如果放在容器里但是没指定容器高度


    if ($(canvasConatiner.current).parent().height() === 0 && CVData.initArgs.height === "auto") {
      $(canvasConatiner.current).parent().height(500);
    } //如果没有放在特定容器里


    if ($(canvasConatiner.current).parent() !== 0 && CVData.initArgs.height === "auto" && ($(canvasConatiner.current).next().length !== 0 || $(canvasConatiner.current).prev().length !== 0)) {
      CVData.initArgs.height = 500;
    } //设置宽度


    CVData.funcs.setcanvasWidth( //
    getSpaceSize( //
    CVData.initArgs.width, $(canvasConatiner.current).parent().width())); //设置高度

    CVData.funcs.setcanvasHeight( //
    getSpaceSize( //
    CVData.initArgs.height, $(canvasConatiner.current).parent().height()));
    var offset = $(canvasConatiner.current).offset(); //获得组件当前位置

    setoffset({
      x: offset.left,
      y: offset.top
    });
  };
  /**
   *创建reasize
   */


  var createResizeObserver = function createResizeObserver() {
    if (canvasConatiner.current !== null) {
      resizeObserverRef.current = new ResizeObserver(function (entries) {
        if (entries.length > 0) {
          if (CVData.initArgs.resizeDebounceTime !== 0) {
            resizeDebounce(function () {
              getCanvasSize();
            }, CVData.initArgs.resizeDebounceTime);
          } else {
            getCanvasSize();
          }
        }
      }); //监听它的上级的大小变化

      resizeObserverRef.current.observe($(canvasConatiner.current).parent()[0]);
    }
  };
  /**
   *清除resize
   */


  var clearObserver = function clearObserver() {
    if (resizeObserverRef.current !== null) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
  };
  /* 触摸 */


  var onTouchStartContainer = function onTouchStartContainer(event) {
    var _CVData$initArgs$data, _CVData$initArgs$data2;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data2 = _CVData$initArgs$data.dynamicData) == null ? void 0 : _CVData$initArgs$data2.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    if (typeof event.targetTouches[0] !== "undefined" && typeof event.targetTouches[1] !== "undefined") {
      setisTouchScale(true);
      settouchScaleStartLength(getLength({
        x: event.targetTouches[0].pageX,
        y: event.targetTouches[0].pageY
      }, {
        x: event.targetTouches[1].pageX,
        y: event.targetTouches[1].pageY
      }));
      return;
    }

    setisMouseDown(true);
    setmouseDownPosition({
      x: event.targetTouches[0].pageX,
      y: event.targetTouches[0].pageY
    });
    setmousePosition({
      x: event.targetTouches[0].pageX,
      y: event.targetTouches[0].pageY
    });
    setrelativePosition({
      x: event.targetTouches[0].pageX - offset.x,
      y: event.targetTouches[0].pageY - offset.y
    });
  };

  var onTouchMoveContainer = function onTouchMoveContainer(event) {
    var _CVData$initArgs$data3, _CVData$initArgs$data4;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data3 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data4 = _CVData$initArgs$data3.dynamicData) == null ? void 0 : _CVData$initArgs$data4.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    if (typeof event.targetTouches[0] !== "undefined" && typeof event.targetTouches[1] !== "undefined") {
      var left = Math.min(event.targetTouches[0].pageX, event.targetTouches[1].pageX);
      var right = Math.max(event.targetTouches[0].pageX, event.targetTouches[1].pageX);
      var point = (right - left) / 2 + left;
      var length = getLength({
        x: event.targetTouches[0].pageX,
        y: event.targetTouches[0].pageY
      }, {
        x: event.targetTouches[1].pageX,
        y: event.targetTouches[1].pageY
      });

      if (Math.abs(length - touchScaleStartLength) > 3) {
        settouchScaleStartLength(getLength({
          x: event.targetTouches[0].pageX,
          y: event.targetTouches[0].pageY
        }, {
          x: event.targetTouches[1].pageX,
          y: event.targetTouches[1].pageY
        }));
        var movement = "zoomIn";

        if (length - touchScaleStartLength < 0) {
          movement = "zoomOut";
        }

        CVData.hookObjs.xAxisObj.funcs.scale(point, CVData.hookObjs.xAxisObj.data.scaleStep, movement);
      }

      return;
    }

    if (isMouseDown) {
      CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, event.targetTouches[0].pageX, false);
    } else {
      CVData.hookObjs.xAxisObj.funcs.tooltipMove({
        x: event.targetTouches[0].pageX - offset.x,
        y: event.targetTouches[0].pageY - offset.y
      }, true);
    }

    CVData.hookObjs.yAxisObj.funcs.tooltipMove({
      x: event.targetTouches[0].pageX - offset.x,
      y: event.targetTouches[0].pageY - offset.y
    }, true);
    setrelativePosition({
      x: event.targetTouches[0].pageX - offset.x,
      y: event.targetTouches[0].pageY - offset.y
    });
    setmousePosition({
      x: event.targetTouches[0].pageX,
      y: event.targetTouches[0].pageY
    });
    event.cancelable = true;
    event.stopPropagation();
  };

  var onTouchEndtContainer = function onTouchEndtContainer(event) {
    var _CVData$initArgs$data5, _CVData$initArgs$data6;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data5 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data6 = _CVData$initArgs$data5.dynamicData) == null ? void 0 : _CVData$initArgs$data6.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    if (isTouchScale) {
      setisTouchScale(false);
      return;
    }

    CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, mousePosition.x, true);
    setisMouseDown(false);
    setmouseDownPosition({
      x: 0,
      y: 0
    });
    setrelativePosition({
      x: mousePosition.x - offset.x,
      y: mousePosition.y - offset.y
    });
  };
  /* 鼠标进入 */


  var onMouseEnterContainer = function onMouseEnterContainer(event) {
    var _CVData$initArgs$data7, _CVData$initArgs$data8;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data7 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data8 = _CVData$initArgs$data7.dynamicData) == null ? void 0 : _CVData$initArgs$data8.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    setrelativePosition({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    });
    CVData.hookObjs.xAxisObj.funcs.tooltipMove({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    }, true);
    CVData.hookObjs.yAxisObj.funcs.tooltipMove({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    }, true);
  };
  /* 鼠标按下 */


  var onMouseDownContainer = function onMouseDownContainer(event) {
    var _CVData$initArgs$data9, _CVData$initArgs$data10;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data9 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data10 = _CVData$initArgs$data9.dynamicData) == null ? void 0 : _CVData$initArgs$data10.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    setisMouseDown(true);
    setmouseDownPosition({
      x: event.pageX,
      y: event.pageY
    });
    setrelativePosition({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    });
  };
  /* 鼠标移动 */


  var onMouseMoveContainer = function onMouseMoveContainer(event) {
    var _CVData$initArgs$data11, _CVData$initArgs$data12;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data11 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data12 = _CVData$initArgs$data11.dynamicData) == null ? void 0 : _CVData$initArgs$data12.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    if (isMouseDown) {
      CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, event.pageX, false);
    } else {
      CVData.hookObjs.xAxisObj.funcs.tooltipMove({
        x: event.pageX - offset.x,
        y: event.pageY - offset.y
      }, true);
    }

    CVData.hookObjs.yAxisObj.funcs.tooltipMove({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    }, true);
    setrelativePosition({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    });
  };
  /* 鼠标弹起 */


  var onMouseUpContainer = function onMouseUpContainer(event) {
    var _CVData$initArgs$data13, _CVData$initArgs$data14;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data13 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data14 = _CVData$initArgs$data13.dynamicData) == null ? void 0 : _CVData$initArgs$data14.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    CVData.hookObjs.xAxisObj.funcs.moveContainer(mouseDownPosition.x, event.pageX, true);
    setisMouseDown(false);
    setmouseDownPosition({
      x: 0,
      y: 0
    });
    setrelativePosition({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    });
  };
  /* 鼠标离开 */


  var onMouseLeaveContainer = function onMouseLeaveContainer(event) {
    var _CVData$initArgs$data15, _CVData$initArgs$data16;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data15 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data16 = _CVData$initArgs$data15.dynamicData) == null ? void 0 : _CVData$initArgs$data16.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    setrelativePosition({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    });
    CVData.hookObjs.xAxisObj.funcs.tooltipMove({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    }, false);
    CVData.hookObjs.yAxisObj.funcs.tooltipMove({
      x: event.pageX - offset.x,
      y: event.pageY - offset.y
    }, false);
  };
  /* 鼠标滚动 */


  var onWheelContainer = function onWheelContainer(e) {
    var _CVData$initArgs$data17, _CVData$initArgs$data18;

    //开启了正在加载时阻止用户操作
    if (((_CVData$initArgs$data17 = CVData.initArgs.data) == null ? void 0 : (_CVData$initArgs$data18 = _CVData$initArgs$data17.dynamicData) == null ? void 0 : _CVData$initArgs$data18.stopUserOperateWhenLoading) === true && CVData.hookObjs.candleObj.data.isFetchingData) {
      return;
    }

    var movement = "zoomIn";

    if (e.deltaY > 0) {
      movement = "zoomOut";
    }

    CVData.hookObjs.xAxisObj.funcs.scale(e.pageX, CVData.hookObjs.xAxisObj.data.scaleStep, movement);
    e.nativeEvent.stopPropagation();
    return false;
  };

  var preventDefault = function preventDefault(e) {
    return e.preventDefault();
  }; //===============effects==================


  React.useEffect(function () {
    if (isMounted === false) {
      setIsMounted(true);
      initCandleView();
      canvasConatiner.current.addEventListener("wheel", preventDefault);
    }
  }, [isMounted]);
  React.useEffect(function () {
    return function () {
      setIsMounted(false);
      clearObserver();
      canvasConatiner.current.removeEventListener("wheel", preventDefault);
    };
  }, []);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    className: "cvcv_container",
    ref: canvasConatiner,
    style: {
      width: CVData.data.canvasWidth + "px",
      height: CVData.data.canvasHeight + "px",
      backgroundColor: CVData.initArgs.backgroundColor
    },
    onMouseDown: onMouseDownContainer,
    onMouseMove: onMouseMoveContainer,
    onMouseUp: onMouseUpContainer,
    onWheel: onWheelContainer,
    onMouseEnter: onMouseEnterContainer,
    onMouseLeave: onMouseLeaveContainer,
    onTouchStart: onTouchStartContainer,
    onTouchMove: onTouchMoveContainer,
    onTouchEnd: onTouchEndtContainer
  }, React__default.createElement(Loading, {
    color: "white"
  }), React__default.createElement(Info, null), React__default.createElement(react.Stage, {
    options: {
      backgroundAlpha: 0,
      width: CVData.data.canvasWidth,
      height: CVData.data.canvasHeight,
      resolution: 2
    },
    style: {
      width: CVData.data.canvasWidth,
      height: CVData.data.canvasHeight,
      backgroundColor: CVData.initArgs.backgroundColor
    },
    width: CVData.data.canvasWidth,
    height: CVData.data.canvasHeight,
    raf: false,
    renderOnComponentChange: true
  }, React__default.createElement(candleViewPixiContext.Provider, {
    value: CVData
  }, React__default.createElement(NetLines$1, null), React__default.createElement(VolumChart, null), React__default.createElement(Data$1, null), React__default.createElement(XAxis$1, null), React__default.createElement(YAxis$1, null)))));
});

exports.CandleView = CandleView;
exports.candleViewContext = candleViewContext;
exports.useCandleView = useCandleView;
exports.useCandleViewContext = useCandleViewContext;
//# sourceMappingURL=candle-view.cjs.development.js.map
