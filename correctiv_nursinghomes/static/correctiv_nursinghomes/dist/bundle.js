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
module.exports = riot.tag2('map', '<div id="map"></div>', '', 'class="nursinghomes__map"', function(opts) {
'use strict';

var _leaflet = require('leaflet');
});

},{"leaflet":"leaflet","riot":"riot"}],"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/price_comparison.tag":[function(require,module,exports){
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

},{"./components/bar_chart.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/bar_chart.tag","./components/map.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/map.tag","./components/price_comparison.tag":"/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/components/price_comparison.tag","riot":"riot"}]},{},["/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/index.js"])("/Users/simon/Projekte/correctiv/correctiv-nursinghomes/correctiv_nursinghomes/javascripts/index.js")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3JyZWN0aXZfbnVyc2luZ2hvbWVzL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvYmFyX2NoYXJ0LnRhZyIsImNvcnJlY3Rpdl9udXJzaW5naG9tZXMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9tYXAudGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL3ByaWNlX2NvbXBhcmlzb24udGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbENBOztBQUVBOztBQUNBOztBQUNBOztRQUVTLEsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnMignYmFyLWNoYXJ0JywgJzxiYXItY2hhcnQtaXRlbSBjbGFzcz1cImJhci1jaGFydF9faXRlbSB7LWhpbGlnaHQ6IGN1cnJlbnR9XCIgZWFjaD1cIntvcHRzLml0ZW1zfVwiPiA8YSBocmVmPVwie3VybH1cIiB0aXRsZT1cIntuYW1lfVwiIGNsYXNzPVwiYmFyLWNoYXJ0X19sYWJlbFwiPntuYW1lfTwvYT4gPGRpdiBjbGFzcz1cImJhci1jaGFydF9fZGF0YVwiPiA8c3BhbiBjbGFzcz1cImJhci1jaGFydF9fYmFyXCIgcmlvdC1zdHlsZT1cIndpZHRoOiB7cGVyY2VudGFnZSh2YWx1ZSl9JVwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJiYXItY2hhcnRfX3ZhbHVlXCI+e2N1cnJlbmN5KHZhbHVlKX08L3NwYW4+IDwvZGl2PiA8L2Jhci1jaGFydC1pdGVtPicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG50aGlzLnBlcmNlbnRhZ2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIDEwMCAvIG9wdHMubWF4ICogdmFsdWU7XG59O1xuXG50aGlzLmN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IEludGwuTnVtYmVyRm9ybWF0KG9wdHMubG9jYWxlLCB7XG4gICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgY3VycmVuY3k6IG9wdHMuY3VycmVuY3lcbiAgfSkuZm9ybWF0KHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWUgPyBmb3JtYXR0ZWRWYWx1ZSA6IG9wdHMubmE7XG59O1xufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcyKCdtYXAnLCAnPGRpdiBpZD1cIm1hcFwiPjwvZGl2PicsICcnLCAnY2xhc3M9XCJudXJzaW5naG9tZXNfX21hcFwiJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2xlYWZsZXQgPSByZXF1aXJlKCdsZWFmbGV0Jyk7XG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZzIoJ3ByaWNlLWNvbXBhcmlzb24nLCAnPHlpZWxkPjwveWllbGQ+IDxzZWxlY3QgY2xhc3M9XCJudXJzaW5naG9tZXNfX3ByaWNlLWNvbXBhcmlzb25fX3NlbGVjdFwiIG9uY2hhbmdlPVwie29uU2VsZWN0Q2hhbmdlfVwiPiA8b3B0aW9uIGVhY2g9XCJ7aWQsIG5hbWUgaW4gb3B0cy5vcHRpb25zfVwiIF9fc2VsZWN0ZWQ9XCJ7c2VsZWN0ZWRTZXQgPT0gaWR9XCIgdmFsdWU9XCJ7aWR9XCI+IHtuYW1lfSA8L29wdGlvbj4gPC9zZWxlY3Q+IDxiYXItY2hhcnQgY3VycmVuY3k9XCJ7b3B0cy5jdXJyZW5jeX1cIiBsb2NhbGU9XCJ7b3B0cy5sb2NhbGV9XCIgbmE9XCJ7b3B0cy5uYX1cIiBpdGVtcz1cIntpdGVtc31cIiBtYXg9XCJ7bWF4VmFsdWV9XCI+PC9iYXItY2hhcnQ+JywgJycsICdjbGFzcz1cIm51cnNpbmdob21lc19fcHJpY2UtY29tcGFyaXNvblwiJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLnNlbGVjdGVkU2V0ID0gb3B0cy5pbml0aWFsT3B0aW9uO1xuXG50aGlzLm9uU2VsZWN0Q2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIF90aGlzLnNlbGVjdGVkU2V0ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICBfdGhpcy51cGRhdGUoKTtcbn07XG5cbnRoaXMub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGVjdGVkID0gX3RoaXMuc2VsZWN0ZWRTZXQ7XG5cbiAgX3RoaXMuaXRlbXMgPSBvcHRzLml0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICB1cmw6IGl0ZW0udXJsLFxuICAgICAgdmFsdWU6IGl0ZW0ucHJpY2VzW3NlbGVjdGVkXSxcbiAgICAgIGN1cnJlbnQ6IGl0ZW0uY3VycmVudFxuICAgIH07XG4gIH0pO1xuXG4gIF90aGlzLml0ZW1zID0gX3RoaXMuaXRlbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhLnZhbHVlIDwgYi52YWx1ZTtcbiAgfSk7XG5cbiAgX3RoaXMubWF4VmFsdWUgPSBfdGhpcy5pdGVtcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgYi52YWx1ZSk7XG4gIH0sIDApO1xufSk7XG59KTtcbiIsImltcG9ydCB7IG1vdW50IH0gZnJvbSAncmlvdCdcblxuaW1wb3J0ICcuL2NvbXBvbmVudHMvcHJpY2VfY29tcGFyaXNvbi50YWcnXG5pbXBvcnQgJy4vY29tcG9uZW50cy9iYXJfY2hhcnQudGFnJ1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbWFwLnRhZydcblxuZXhwb3J0IHsgbW91bnQgfTtcbiJdfQ==
