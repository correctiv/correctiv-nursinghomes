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

},{"riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map-popup.tag":[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('map-popup', '<a href="{opts.url}">{opts.name}</a>', '', 'class="nursinghomes__map-popup"', function(opts) {
});

},{"riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map.tag":[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('map', '<div id="map"></div>', '', '', function(opts) {
'use strict';

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

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
  var popupOffset = _ref2.popupOffset;

  var Icon = _leaflet2.default.Icon.extend({ options: iconOptions });
  var defaultIcon = new Icon({ iconUrl: icons.default });
  var hilightIcon = new Icon({ iconUrl: icons.hilight });

  items.forEach(function (item) {
    var coordinates = item.latlng.coordinates;
    var icon = item.current ? hilightIcon : defaultIcon;
    var marker = _leaflet2.default.marker(coordinates, { icon: icon, item: item });

    marker.addTo(map);
    marker.bindPopup(initializePopup.bind(item), {
      offset: popupOffset,
      closeButton: false,
      maxWidth: 200
    });
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

function initializePopup(marker) {
  var tagName = 'map-popup';
  var mapPopup = document.createElement(tagName);

  _riot2.default.mount(mapPopup, tagName, marker.options.item);

  return mapPopup;
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

require('./components/map-popup.tag');

exports.mount = _riot.mount;

},{"./components/bar_chart.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/bar_chart.tag","./components/map-popup.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map-popup.tag","./components/map.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map.tag","./components/price_comparison.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/price_comparison.tag","riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/node_modules/core-js/fn/array/find.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3JyZWN0aXZfbnVyc2luZ2hvbWVzL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvYmFyX2NoYXJ0LnRhZyIsImNvcnJlY3Rpdl9udXJzaW5naG9tZXMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9tYXAtcG9wdXAudGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL21hcC50YWciLCJjb3JyZWN0aXZfbnVyc2luZ2hvbWVzL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvcHJpY2VfY29tcGFyaXNvbi50YWciLCJjb3JyZWN0aXZfbnVyc2luZ2hvbWVzL2phdmFzY3JpcHRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2hhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL191aWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2xDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7UUFFUyxLOzs7QUNQVDtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnMignYmFyLWNoYXJ0JywgJzxiYXItY2hhcnQtaXRlbSBjbGFzcz1cImJhci1jaGFydF9faXRlbSB7LWhpbGlnaHQ6IGN1cnJlbnR9XCIgZWFjaD1cIntvcHRzLml0ZW1zfVwiPiA8YSBocmVmPVwie3VybH1cIiB0aXRsZT1cIntuYW1lfVwiIGNsYXNzPVwiYmFyLWNoYXJ0X19sYWJlbFwiPntuYW1lfTwvYT4gPGRpdiBjbGFzcz1cImJhci1jaGFydF9fZGF0YVwiPiA8c3BhbiBjbGFzcz1cImJhci1jaGFydF9fYmFyXCIgcmlvdC1zdHlsZT1cIndpZHRoOiB7cGVyY2VudGFnZSh2YWx1ZSl9JVwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJiYXItY2hhcnRfX3ZhbHVlXCI+e2N1cnJlbmN5KHZhbHVlKX08L3NwYW4+IDwvZGl2PiA8L2Jhci1jaGFydC1pdGVtPicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG50aGlzLnBlcmNlbnRhZ2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIDEwMCAvIG9wdHMubWF4ICogdmFsdWU7XG59O1xuXG50aGlzLmN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IEludGwuTnVtYmVyRm9ybWF0KG9wdHMubG9jYWxlLCB7XG4gICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgY3VycmVuY3k6IG9wdHMuY3VycmVuY3lcbiAgfSkuZm9ybWF0KHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWUgPyBmb3JtYXR0ZWRWYWx1ZSA6IG9wdHMubmE7XG59O1xufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcyKCdtYXAtcG9wdXAnLCAnPGEgaHJlZj1cIntvcHRzLnVybH1cIj57b3B0cy5uYW1lfTwvYT4nLCAnJywgJ2NsYXNzPVwibnVyc2luZ2hvbWVzX19tYXAtcG9wdXBcIicsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnMignbWFwJywgJzxkaXYgaWQ9XCJtYXBcIj48L2Rpdj4nLCAnJywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9sZWFmbGV0ID0gcmVxdWlyZSgnbGVhZmxldCcpO1xuXG52YXIgX2xlYWZsZXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGVhZmxldCk7XG5cbnZhciBfcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxudmFyIF9yaW90MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Jpb3QpO1xuXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2ZpbmQnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBjdXJyZW50SXRlbSA9IG9wdHMuaXRlbXMuZmluZChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmN1cnJlbnQ7XG4gIH0pO1xuICB2YXIgY2VudGVyID0gY3VycmVudEl0ZW0ubGF0bG5nLmNvb3JkaW5hdGVzO1xuICB2YXIgbWF4Qm91bmRzID0gb3B0cy5pdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5sYXRsbmcuY29vcmRpbmF0ZXMucmV2ZXJzZSgpO1xuICB9KTtcbiAgdmFyIG1hcCA9IHJlbmRlck1hcChjZW50ZXIsIG1heEJvdW5kcywgb3B0cyk7XG5cbiAgcmVuZGVySXRlbXMobWFwLCBvcHRzKTtcbiAgYXBwbHlWaWV3cG9ydE9mZnNldChtYXAsIG9wdHMudmlld3BvcnRPZmZzZXQpO1xufSk7XG5cbmZ1bmN0aW9uIHJlbmRlck1hcChjZW50ZXIsIG1heEJvdW5kcywgX3JlZikge1xuICB2YXIgem9vbSA9IF9yZWYuem9vbTtcbiAgdmFyIG1pblpvb20gPSBfcmVmLm1pblpvb207XG4gIHZhciBtYXhab29tID0gX3JlZi5tYXhab29tO1xuICB2YXIgYXR0cmlidXRpb24gPSBfcmVmLmF0dHJpYnV0aW9uO1xuXG4gIHZhciBtYXAgPSBfbGVhZmxldDIuZGVmYXVsdC5tYXAoJ21hcCcsIHsgY2VudGVyOiBjZW50ZXIsIHpvb206IHpvb20sIG1pblpvb206IG1pblpvb20sIG1heFpvb206IG1heFpvb20sIG1heEJvdW5kczogbWF4Qm91bmRzIH0pO1xuICB2YXIgdGlsZUxheWVyID0gX2xlYWZsZXQyLmRlZmF1bHQudGlsZUxheWVyKG9wdHMudGlsZXMsIHsgbWF4Wm9vbTogbWF4Wm9vbSwgYXR0cmlidXRpb246IGF0dHJpYnV0aW9uIH0pO1xuXG4gIG1hcC5hZGRMYXllcih0aWxlTGF5ZXIpO1xuICBtYXAuem9vbUNvbnRyb2wuc2V0UG9zaXRpb24oJ3RvcHJpZ2h0Jyk7XG4gIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xuXG4gIHJldHVybiBtYXA7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckl0ZW1zKG1hcCwgX3JlZjIpIHtcbiAgdmFyIGl0ZW1zID0gX3JlZjIuaXRlbXM7XG4gIHZhciBpY29ucyA9IF9yZWYyLmljb25zO1xuICB2YXIgaWNvbk9wdGlvbnMgPSBfcmVmMi5pY29uT3B0aW9ucztcbiAgdmFyIHBvcHVwT2Zmc2V0ID0gX3JlZjIucG9wdXBPZmZzZXQ7XG5cbiAgdmFyIEljb24gPSBfbGVhZmxldDIuZGVmYXVsdC5JY29uLmV4dGVuZCh7IG9wdGlvbnM6IGljb25PcHRpb25zIH0pO1xuICB2YXIgZGVmYXVsdEljb24gPSBuZXcgSWNvbih7IGljb25Vcmw6IGljb25zLmRlZmF1bHQgfSk7XG4gIHZhciBoaWxpZ2h0SWNvbiA9IG5ldyBJY29uKHsgaWNvblVybDogaWNvbnMuaGlsaWdodCB9KTtcblxuICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0gaXRlbS5sYXRsbmcuY29vcmRpbmF0ZXM7XG4gICAgdmFyIGljb24gPSBpdGVtLmN1cnJlbnQgPyBoaWxpZ2h0SWNvbiA6IGRlZmF1bHRJY29uO1xuICAgIHZhciBtYXJrZXIgPSBfbGVhZmxldDIuZGVmYXVsdC5tYXJrZXIoY29vcmRpbmF0ZXMsIHsgaWNvbjogaWNvbiwgaXRlbTogaXRlbSB9KTtcblxuICAgIG1hcmtlci5hZGRUbyhtYXApO1xuICAgIG1hcmtlci5iaW5kUG9wdXAoaW5pdGlhbGl6ZVBvcHVwLmJpbmQoaXRlbSksIHtcbiAgICAgIG9mZnNldDogcG9wdXBPZmZzZXQsXG4gICAgICBjbG9zZUJ1dHRvbjogZmFsc2UsXG4gICAgICBtYXhXaWR0aDogMjAwXG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhcHBseVZpZXdwb3J0T2Zmc2V0KG1hcCwgX3JlZjMpIHtcbiAgdmFyIHNtYWxsU2NyZWVuID0gX3JlZjMuc21hbGxTY3JlZW47XG4gIHZhciBiaWdTY3JlZW4gPSBfcmVmMy5iaWdTY3JlZW47XG4gIHZhciBicmVha3BvaW50ID0gX3JlZjMuYnJlYWtwb2ludDtcblxuICB2YXIgY2xpZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHZhciBvZmZzZXQgPSBjbGllbnRXaWR0aCA8IGJyZWFrcG9pbnQgPyBzbWFsbFNjcmVlbiA6IGJpZ1NjcmVlbjtcblxuICAvLyBPZmZzZXQgdGhlIG1hcCB0byBtYWtlIHNwYWNlIGZvciB0aGUgdGl0bGU6XG4gIG1hcC5wYW5CeShvZmZzZXQsIHsgYW5pbWF0ZTogZmFsc2UgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQb3B1cChtYXJrZXIpIHtcbiAgdmFyIHRhZ05hbWUgPSAnbWFwLXBvcHVwJztcbiAgdmFyIG1hcFBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcblxuICBfcmlvdDIuZGVmYXVsdC5tb3VudChtYXBQb3B1cCwgdGFnTmFtZSwgbWFya2VyLm9wdGlvbnMuaXRlbSk7XG5cbiAgcmV0dXJuIG1hcFBvcHVwO1xufVxufSk7XG5cbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZzIoJ3ByaWNlLWNvbXBhcmlzb24nLCAnPHlpZWxkPjwveWllbGQ+IDxzZWxlY3QgY2xhc3M9XCJudXJzaW5naG9tZXNfX3ByaWNlLWNvbXBhcmlzb25fX3NlbGVjdFwiIG9uY2hhbmdlPVwie29uU2VsZWN0Q2hhbmdlfVwiPiA8b3B0aW9uIGVhY2g9XCJ7aWQsIG5hbWUgaW4gb3B0cy5vcHRpb25zfVwiIF9fc2VsZWN0ZWQ9XCJ7c2VsZWN0ZWRTZXQgPT0gaWR9XCIgdmFsdWU9XCJ7aWR9XCI+IHtuYW1lfSA8L29wdGlvbj4gPC9zZWxlY3Q+IDxiYXItY2hhcnQgY3VycmVuY3k9XCJ7b3B0cy5jdXJyZW5jeX1cIiBsb2NhbGU9XCJ7b3B0cy5sb2NhbGV9XCIgbmE9XCJ7b3B0cy5uYX1cIiBpdGVtcz1cIntpdGVtc31cIiBtYXg9XCJ7bWF4VmFsdWV9XCI+PC9iYXItY2hhcnQ+JywgJycsICdjbGFzcz1cIm51cnNpbmdob21lc19fcHJpY2UtY29tcGFyaXNvblwiJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLnNlbGVjdGVkU2V0ID0gb3B0cy5pbml0aWFsT3B0aW9uO1xuXG50aGlzLm9uU2VsZWN0Q2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIF90aGlzLnNlbGVjdGVkU2V0ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICBfdGhpcy51cGRhdGUoKTtcbn07XG5cbnRoaXMub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGVjdGVkID0gX3RoaXMuc2VsZWN0ZWRTZXQ7XG5cbiAgX3RoaXMuaXRlbXMgPSBvcHRzLml0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICB1cmw6IGl0ZW0udXJsLFxuICAgICAgdmFsdWU6IGl0ZW0ucHJpY2VzW3NlbGVjdGVkXSxcbiAgICAgIGN1cnJlbnQ6IGl0ZW0uY3VycmVudFxuICAgIH07XG4gIH0pO1xuXG4gIF90aGlzLml0ZW1zID0gX3RoaXMuaXRlbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhLnZhbHVlIDwgYi52YWx1ZTtcbiAgfSk7XG5cbiAgX3RoaXMubWF4VmFsdWUgPSBfdGhpcy5pdGVtcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgYi52YWx1ZSk7XG4gIH0sIDApO1xufSk7XG59KTtcbiIsImltcG9ydCB7IG1vdW50IH0gZnJvbSAncmlvdCdcblxuaW1wb3J0ICcuL2NvbXBvbmVudHMvcHJpY2VfY29tcGFyaXNvbi50YWcnXG5pbXBvcnQgJy4vY29tcG9uZW50cy9iYXJfY2hhcnQudGFnJ1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbWFwLnRhZydcbmltcG9ydCAnLi9jb21wb25lbnRzL21hcC1wb3B1cC50YWcnXG5cbmV4cG9ydCB7IG1vdW50IH07XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5maW5kOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vX3drcycpKCd1bnNjb3BhYmxlcycpXG4gICwgQXJyYXlQcm90byAgPSBBcnJheS5wcm90b3R5cGU7XG5pZihBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpcmVxdWlyZSgnLi9faGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBhc2MgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRZUEUsICRjcmVhdGUpe1xuICB2YXIgSVNfTUFQICAgICAgICA9IFRZUEUgPT0gMVxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxuICAgICwgSVNfU09NRSAgICAgICA9IFRZUEUgPT0gM1xuICAgICwgSVNfRVZFUlkgICAgICA9IFRZUEUgPT0gNFxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxuICAgICwgTk9fSE9MRVMgICAgICA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYXG4gICAgLCBjcmVhdGUgICAgICAgID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBzZWxmICAgPSBJT2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkXG4gICAgICAsIHZhbCwgcmVzO1xuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZil7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZihUWVBFKXtcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgICAgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBpc0FycmF5ICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwpe1xuICB2YXIgQztcbiAgaWYoaXNBcnJheShvcmlnaW5hbCkpe1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSlDID0gdW5kZWZpbmVkO1xuICAgIGlmKGlzT2JqZWN0KEMpKXtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYoQyA9PT0gbnVsbClDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTsiLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsZW5ndGgpe1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmUgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pXG4gICAgLCBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYodGFyZ2V0KXJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgU1JDICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpXG4gICwgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJ1xuICAsICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR11cbiAgLCBUUEwgICAgICAgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywga2V5LCB2YWwsIHNhZmUpe1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYoaXNGdW5jdGlvbiloYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmKE9ba2V5XSA9PT0gdmFsKXJldHVybjtcbiAgaWYoaXNGdW5jdGlvbiloYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYoTyA9PT0gZ2xvYmFsKXtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaWYoIXNhZmUpe1xuICAgICAgZGVsZXRlIE9ba2V5XTtcbiAgICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihPW2tleV0pT1trZXldID0gdmFsO1xuICAgICAgZWxzZSBoaWRlKE8sIGtleSwgdmFsKTtcbiAgICB9XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pOyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGZpbmQgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSg1KVxuICAsIEtFWSAgICAgPSAnZmluZCdcbiAgLCBmb3JjZWQgID0gdHJ1ZTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kOiBmdW5jdGlvbiBmaW5kKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKShLRVkpOyJdfQ==
