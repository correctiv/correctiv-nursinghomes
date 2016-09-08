(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.correctiv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/bar_chart.tag":[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('bar-chart', '<bar-chart-item class="bar-chart__item {-hilight: current}" each="{opts.items}"> <a href="{url}" title="{name}" class="bar-chart__label">{name}</a> <div class="bar-chart__data"> <span class="bar-chart__bar" riot-style="width: {percentage(value)}%"></span> <span class="bar-chart__value">{currency(value)}</span> </div> </bar-chart-item>', '', '', function(opts) {
'use strict';

this.percentage = function (value) {
  return 100 / opts.max * value;
};

this.currency = function (value) {
  var formattedValue = Intl.NumberFormat(opts.locale, {
    style: 'currency',
    currency: opts.currency
  }).format(value);

  return value ? formattedValue : opts.na;
};
});

},{"riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map.tag":[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('map', '<div id="map"></div>', '', '', function(opts) {
'use strict';

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

require('core-js/fn/array/find');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

this.on('mount', function () {
  var currentItem = opts.items.find(function (item) {
    return item.current;
  });
  var center = currentItem.latlng.coordinates;
  var maxBounds = opts.items.map(function (item) {
    return item.latlng.coordinates.reverse();
  });
  var map = renderMap(center, maxBounds, opts);

  renderItems(map, opts);
  applyViewportOffset(map, opts.viewportOffset);
});

function renderMap(center, maxBounds, _ref) {
  var zoom = _ref.zoom;
  var minZoom = _ref.minZoom;
  var maxZoom = _ref.maxZoom;
  var attribution = _ref.attribution;

  var map = _leaflet2.default.map('map', { center: center, zoom: zoom, minZoom: minZoom, maxZoom: maxZoom, maxBounds: maxBounds });
  var tileLayer = _leaflet2.default.tileLayer(opts.tiles, { maxZoom: maxZoom, attribution: attribution });

  map.addLayer(tileLayer);
  map.zoomControl.setPosition('topright');
  map.scrollWheelZoom.disable();

  return map;
}

function renderItems(map, _ref2) {
  var items = _ref2.items;
  var icons = _ref2.icons;
  var iconOptions = _ref2.iconOptions;

  var Icon = _leaflet2.default.Icon.extend({ options: iconOptions });
  var defaultIcon = new Icon({ iconUrl: icons.default });
  var hilightIcon = new Icon({ iconUrl: icons.hilight });

  items.forEach(function (item) {
    var coordinates = item.latlng.coordinates;
    var icon = item.current ? hilightIcon : defaultIcon;
    var marker = _leaflet2.default.marker(coordinates, { icon: icon });
    marker.addTo(map);
  });
}

function applyViewportOffset(map, _ref3) {
  var smallScreen = _ref3.smallScreen;
  var bigScreen = _ref3.bigScreen;
  var breakpoint = _ref3.breakpoint;

  var clientWidth = document.documentElement.clientWidth;
  var offset = clientWidth < breakpoint ? smallScreen : bigScreen;

  // Offset the map to make space for the title:
  map.panBy(offset, { animate: false });
}
});

},{"core-js/fn/array/find":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/fn/array/find.js","leaflet":"leaflet","riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/price_comparison.tag":[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('price-comparison', '<yield></yield> <select class="nursinghomes__price-comparison__select" onchange="{onSelectChange}"> <option each="{id, name in opts.options}" __selected="{selectedSet == id}" value="{id}"> {name} </option> </select> <bar-chart currency="{opts.currency}" locale="{opts.locale}" na="{opts.na}" items="{items}" max="{maxValue}"></bar-chart>', '', 'class="nursinghomes__price-comparison"', function(opts) {
'use strict';

var _this = this;

this.selectedSet = opts.initialOption;

this.onSelectChange = function (event) {
  _this.selectedSet = event.target.value;
  _this.update();
};

this.on('update', function () {
  var selected = _this.selectedSet;

  _this.items = opts.items.map(function (item) {
    return {
      name: item.name,
      url: item.url,
      value: item.prices[selected],
      current: item.current
    };
  });

  _this.items = _this.items.sort(function (a, b) {
    return a.value < b.value;
  });

  _this.maxValue = _this.items.reduce(function (a, b) {
    return Math.max(a, b.value);
  }, 0);
});
});

},{"riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/index.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = undefined;

var _riot = require('riot');

require('./components/price_comparison.tag');

require('./components/bar_chart.tag');

require('./components/map.tag');

exports.mount = _riot.mount;

},{"./components/bar_chart.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/bar_chart.tag","./components/map.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map.tag","./components/price_comparison.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/price_comparison.tag","riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/fn/array/find.js":[function(require,module,exports){
require('../../modules/es6.array.find');
module.exports = require('../../modules/_core').Array.find;
},{"../../modules/_core":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_core.js","../../modules/es6.array.find":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/es6.array.find.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_a-function.js":[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_add-to-unscopables.js":[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_hide.js","./_wks":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_wks.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_an-object.js":[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-object.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_array-methods.js":[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_array-species-create.js","./_ctx":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_ctx.js","./_iobject":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_iobject.js","./_to-length":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-length.js","./_to-object":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-object.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_array-species-constructor.js":[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-array.js","./_is-object":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-object.js","./_wks":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_wks.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_array-species-create.js":[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_array-species-constructor.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_cof.js":[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_core.js":[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_ctx.js":[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_a-function.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_defined.js":[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_descriptors.js":[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_fails.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_dom-create.js":[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_global.js","./_is-object":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-object.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_export.js":[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_core.js","./_ctx":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_ctx.js","./_global":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_global.js","./_hide":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_hide.js","./_redefine":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_redefine.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_fails.js":[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_global.js":[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_has.js":[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_hide.js":[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_descriptors.js","./_object-dp":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_object-dp.js","./_property-desc":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_property-desc.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_ie8-dom-define.js":[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_descriptors.js","./_dom-create":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_dom-create.js","./_fails":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_fails.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_iobject.js":[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_cof.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-array.js":[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_cof.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-object.js":[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_object-dp.js":[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_an-object.js","./_descriptors":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_descriptors.js","./_ie8-dom-define":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_ie8-dom-define.js","./_to-primitive":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-primitive.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_property-desc.js":[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_redefine.js":[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_core.js","./_global":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_global.js","./_has":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_has.js","./_hide":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_hide.js","./_uid":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_uid.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_shared.js":[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_global.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-integer.js":[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-length.js":[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-integer.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-object.js":[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_defined.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_to-primitive.js":[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_is-object.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_uid.js":[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_wks.js":[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_global.js","./_shared":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_shared.js","./_uid":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_uid.js"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/es6.array.find.js":[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_add-to-unscopables.js","./_array-methods":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_array-methods.js","./_export":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/modules/_export.js"}]},{},["/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/index.js"])("/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/index.js")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3JyZWN0aXZfbnVyc2luZ2hvbWVzL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvYmFyX2NoYXJ0LnRhZyIsImNvcnJlY3Rpdl9udXJzaW5naG9tZXMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9tYXAudGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL3ByaWNlX2NvbXBhcmlzb24udGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL2FycmF5L2ZpbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNsQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O1FBRVMsSzs7O0FDTlQ7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZzIoJ2Jhci1jaGFydCcsICc8YmFyLWNoYXJ0LWl0ZW0gY2xhc3M9XCJiYXItY2hhcnRfX2l0ZW0gey1oaWxpZ2h0OiBjdXJyZW50fVwiIGVhY2g9XCJ7b3B0cy5pdGVtc31cIj4gPGEgaHJlZj1cInt1cmx9XCIgdGl0bGU9XCJ7bmFtZX1cIiBjbGFzcz1cImJhci1jaGFydF9fbGFiZWxcIj57bmFtZX08L2E+IDxkaXYgY2xhc3M9XCJiYXItY2hhcnRfX2RhdGFcIj4gPHNwYW4gY2xhc3M9XCJiYXItY2hhcnRfX2JhclwiIHJpb3Qtc3R5bGU9XCJ3aWR0aDoge3BlcmNlbnRhZ2UodmFsdWUpfSVcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiYmFyLWNoYXJ0X192YWx1ZVwiPntjdXJyZW5jeSh2YWx1ZSl9PC9zcGFuPiA8L2Rpdj4gPC9iYXItY2hhcnQtaXRlbT4nLCAnJywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbid1c2Ugc3RyaWN0JztcblxudGhpcy5wZXJjZW50YWdlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAxMDAgLyBvcHRzLm1heCAqIHZhbHVlO1xufTtcblxudGhpcy5jdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgZm9ybWF0dGVkVmFsdWUgPSBJbnRsLk51bWJlckZvcm1hdChvcHRzLmxvY2FsZSwge1xuICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgIGN1cnJlbmN5OiBvcHRzLmN1cnJlbmN5XG4gIH0pLmZvcm1hdCh2YWx1ZSk7XG5cbiAgcmV0dXJuIHZhbHVlID8gZm9ybWF0dGVkVmFsdWUgOiBvcHRzLm5hO1xufTtcbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnMignbWFwJywgJzxkaXYgaWQ9XCJtYXBcIj48L2Rpdj4nLCAnJywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9sZWFmbGV0ID0gcmVxdWlyZSgnbGVhZmxldCcpO1xuXG52YXIgX2xlYWZsZXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGVhZmxldCk7XG5cbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZmluZCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGN1cnJlbnRJdGVtID0gb3B0cy5pdGVtcy5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uY3VycmVudDtcbiAgfSk7XG4gIHZhciBjZW50ZXIgPSBjdXJyZW50SXRlbS5sYXRsbmcuY29vcmRpbmF0ZXM7XG4gIHZhciBtYXhCb3VuZHMgPSBvcHRzLml0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmxhdGxuZy5jb29yZGluYXRlcy5yZXZlcnNlKCk7XG4gIH0pO1xuICB2YXIgbWFwID0gcmVuZGVyTWFwKGNlbnRlciwgbWF4Qm91bmRzLCBvcHRzKTtcblxuICByZW5kZXJJdGVtcyhtYXAsIG9wdHMpO1xuICBhcHBseVZpZXdwb3J0T2Zmc2V0KG1hcCwgb3B0cy52aWV3cG9ydE9mZnNldCk7XG59KTtcblxuZnVuY3Rpb24gcmVuZGVyTWFwKGNlbnRlciwgbWF4Qm91bmRzLCBfcmVmKSB7XG4gIHZhciB6b29tID0gX3JlZi56b29tO1xuICB2YXIgbWluWm9vbSA9IF9yZWYubWluWm9vbTtcbiAgdmFyIG1heFpvb20gPSBfcmVmLm1heFpvb207XG4gIHZhciBhdHRyaWJ1dGlvbiA9IF9yZWYuYXR0cmlidXRpb247XG5cbiAgdmFyIG1hcCA9IF9sZWFmbGV0Mi5kZWZhdWx0Lm1hcCgnbWFwJywgeyBjZW50ZXI6IGNlbnRlciwgem9vbTogem9vbSwgbWluWm9vbTogbWluWm9vbSwgbWF4Wm9vbTogbWF4Wm9vbSwgbWF4Qm91bmRzOiBtYXhCb3VuZHMgfSk7XG4gIHZhciB0aWxlTGF5ZXIgPSBfbGVhZmxldDIuZGVmYXVsdC50aWxlTGF5ZXIob3B0cy50aWxlcywgeyBtYXhab29tOiBtYXhab29tLCBhdHRyaWJ1dGlvbjogYXR0cmlidXRpb24gfSk7XG5cbiAgbWFwLmFkZExheWVyKHRpbGVMYXllcik7XG4gIG1hcC56b29tQ29udHJvbC5zZXRQb3NpdGlvbigndG9wcmlnaHQnKTtcbiAgbWFwLnNjcm9sbFdoZWVsWm9vbS5kaXNhYmxlKCk7XG5cbiAgcmV0dXJuIG1hcDtcbn1cblxuZnVuY3Rpb24gcmVuZGVySXRlbXMobWFwLCBfcmVmMikge1xuICB2YXIgaXRlbXMgPSBfcmVmMi5pdGVtcztcbiAgdmFyIGljb25zID0gX3JlZjIuaWNvbnM7XG4gIHZhciBpY29uT3B0aW9ucyA9IF9yZWYyLmljb25PcHRpb25zO1xuXG4gIHZhciBJY29uID0gX2xlYWZsZXQyLmRlZmF1bHQuSWNvbi5leHRlbmQoeyBvcHRpb25zOiBpY29uT3B0aW9ucyB9KTtcbiAgdmFyIGRlZmF1bHRJY29uID0gbmV3IEljb24oeyBpY29uVXJsOiBpY29ucy5kZWZhdWx0IH0pO1xuICB2YXIgaGlsaWdodEljb24gPSBuZXcgSWNvbih7IGljb25Vcmw6IGljb25zLmhpbGlnaHQgfSk7XG5cbiAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IGl0ZW0ubGF0bG5nLmNvb3JkaW5hdGVzO1xuICAgIHZhciBpY29uID0gaXRlbS5jdXJyZW50ID8gaGlsaWdodEljb24gOiBkZWZhdWx0SWNvbjtcbiAgICB2YXIgbWFya2VyID0gX2xlYWZsZXQyLmRlZmF1bHQubWFya2VyKGNvb3JkaW5hdGVzLCB7IGljb246IGljb24gfSk7XG4gICAgbWFya2VyLmFkZFRvKG1hcCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhcHBseVZpZXdwb3J0T2Zmc2V0KG1hcCwgX3JlZjMpIHtcbiAgdmFyIHNtYWxsU2NyZWVuID0gX3JlZjMuc21hbGxTY3JlZW47XG4gIHZhciBiaWdTY3JlZW4gPSBfcmVmMy5iaWdTY3JlZW47XG4gIHZhciBicmVha3BvaW50ID0gX3JlZjMuYnJlYWtwb2ludDtcblxuICB2YXIgY2xpZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHZhciBvZmZzZXQgPSBjbGllbnRXaWR0aCA8IGJyZWFrcG9pbnQgPyBzbWFsbFNjcmVlbiA6IGJpZ1NjcmVlbjtcblxuICAvLyBPZmZzZXQgdGhlIG1hcCB0byBtYWtlIHNwYWNlIGZvciB0aGUgdGl0bGU6XG4gIG1hcC5wYW5CeShvZmZzZXQsIHsgYW5pbWF0ZTogZmFsc2UgfSk7XG59XG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZzIoJ3ByaWNlLWNvbXBhcmlzb24nLCAnPHlpZWxkPjwveWllbGQ+IDxzZWxlY3QgY2xhc3M9XCJudXJzaW5naG9tZXNfX3ByaWNlLWNvbXBhcmlzb25fX3NlbGVjdFwiIG9uY2hhbmdlPVwie29uU2VsZWN0Q2hhbmdlfVwiPiA8b3B0aW9uIGVhY2g9XCJ7aWQsIG5hbWUgaW4gb3B0cy5vcHRpb25zfVwiIF9fc2VsZWN0ZWQ9XCJ7c2VsZWN0ZWRTZXQgPT0gaWR9XCIgdmFsdWU9XCJ7aWR9XCI+IHtuYW1lfSA8L29wdGlvbj4gPC9zZWxlY3Q+IDxiYXItY2hhcnQgY3VycmVuY3k9XCJ7b3B0cy5jdXJyZW5jeX1cIiBsb2NhbGU9XCJ7b3B0cy5sb2NhbGV9XCIgbmE9XCJ7b3B0cy5uYX1cIiBpdGVtcz1cIntpdGVtc31cIiBtYXg9XCJ7bWF4VmFsdWV9XCI+PC9iYXItY2hhcnQ+JywgJycsICdjbGFzcz1cIm51cnNpbmdob21lc19fcHJpY2UtY29tcGFyaXNvblwiJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLnNlbGVjdGVkU2V0ID0gb3B0cy5pbml0aWFsT3B0aW9uO1xuXG50aGlzLm9uU2VsZWN0Q2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIF90aGlzLnNlbGVjdGVkU2V0ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICBfdGhpcy51cGRhdGUoKTtcbn07XG5cbnRoaXMub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGVjdGVkID0gX3RoaXMuc2VsZWN0ZWRTZXQ7XG5cbiAgX3RoaXMuaXRlbXMgPSBvcHRzLml0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICB1cmw6IGl0ZW0udXJsLFxuICAgICAgdmFsdWU6IGl0ZW0ucHJpY2VzW3NlbGVjdGVkXSxcbiAgICAgIGN1cnJlbnQ6IGl0ZW0uY3VycmVudFxuICAgIH07XG4gIH0pO1xuXG4gIF90aGlzLml0ZW1zID0gX3RoaXMuaXRlbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhLnZhbHVlIDwgYi52YWx1ZTtcbiAgfSk7XG5cbiAgX3RoaXMubWF4VmFsdWUgPSBfdGhpcy5pdGVtcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgYi52YWx1ZSk7XG4gIH0sIDApO1xufSk7XG59KTtcbiIsImltcG9ydCB7IG1vdW50IH0gZnJvbSAncmlvdCdcblxuaW1wb3J0ICcuL2NvbXBvbmVudHMvcHJpY2VfY29tcGFyaXNvbi50YWcnXG5pbXBvcnQgJy4vY29tcG9uZW50cy9iYXJfY2hhcnQudGFnJ1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbWFwLnRhZydcblxuZXhwb3J0IHsgbW91bnQgfTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZpbmQnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZpbmQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJylcbiAgLCBBcnJheVByb3RvICA9IEFycmF5LnByb3RvdHlwZTtcbmlmKEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdID09IHVuZGVmaW5lZClyZXF1aXJlKCcuL19oaWRlJykoQXJyYXlQcm90bywgVU5TQ09QQUJMRVMsIHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgQXJyYXlQcm90b1tVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGFzYyAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSwgJGNyZWF0ZSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVhcbiAgICAsIGNyZWF0ZSAgICAgICAgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QoJHRoaXMpXG4gICAgICAsIHNlbGYgICA9IElPYmplY3QoTylcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGlzQXJyYXkgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCl7XG4gIHZhciBDO1xuICBpZihpc0FycmF5KG9yaWdpbmFsKSl7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKUMgPSB1bmRlZmluZWQ7XG4gICAgaWYoaXNPYmplY3QoQykpe1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZihDID09PSBudWxsKUMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59OyIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxlbmd0aCl7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZSAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSlcbiAgICAsIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZih0YXJnZXQpcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYoZXhwb3J0c1trZXldICE9IG91dCloaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZihJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dClleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBTUkMgICAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJylcbiAgLCBUT19TVFJJTkcgPSAndG9TdHJpbmcnXG4gICwgJHRvU3RyaW5nID0gRnVuY3Rpb25bVE9fU1RSSU5HXVxuICAsIFRQTCAgICAgICA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBrZXksIHZhbCwgc2FmZSl7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZihpc0Z1bmN0aW9uKWhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYoT1trZXldID09PSB2YWwpcmV0dXJuO1xuICBpZihpc0Z1bmN0aW9uKWhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZihPID09PSBnbG9iYWwpe1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBpZighc2FmZSl7XG4gICAgICBkZWxldGUgT1trZXldO1xuICAgICAgaGlkZShPLCBrZXksIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKE9ba2V5XSlPW2tleV0gPSB2YWw7XG4gICAgICBlbHNlIGhpZGUoTywga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkZmluZCAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDUpXG4gICwgS0VZICAgICA9ICdmaW5kJ1xuICAsIGZvcmNlZCAgPSB0cnVlO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKEtFWSk7Il19
