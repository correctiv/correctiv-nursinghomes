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

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

this.on('mount', function () {
  // Create the map
  var map = _leaflet2.default.map('map').setView([41.3921, 2.1705], 13);

  // Indicate leaflet the specific location of the images folder that it needs to render the page
  _leaflet2.default.Icon.Default.imagePath = 'lib/leaflet/images/';

  // Use OpenStreetMap tiles and attribution
  var osmTiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var attribution = '© OpenStreetMap contributors';

  // Create the basemap and add it to the map
  _leaflet2.default.tileLayer(osmTiles, {
    maxZoom: 18,
    attribution: attribution
  }).addTo(map);
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3JyZWN0aXZfbnVyc2luZ2hvbWVzL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvYmFyX2NoYXJ0LnRhZyIsImNvcnJlY3Rpdl9udXJzaW5naG9tZXMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9tYXAudGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL3ByaWNlX2NvbXBhcmlzb24udGFnIiwiY29ycmVjdGl2X251cnNpbmdob21lcy9qYXZhc2NyaXB0cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbENBOztBQUVBOztBQUNBOztBQUNBOztRQUVTLEsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnMignYmFyLWNoYXJ0JywgJzxiYXItY2hhcnQtaXRlbSBjbGFzcz1cImJhci1jaGFydF9faXRlbSB7LWhpbGlnaHQ6IGN1cnJlbnR9XCIgZWFjaD1cIntvcHRzLml0ZW1zfVwiPiA8YSBocmVmPVwie3VybH1cIiB0aXRsZT1cIntuYW1lfVwiIGNsYXNzPVwiYmFyLWNoYXJ0X19sYWJlbFwiPntuYW1lfTwvYT4gPGRpdiBjbGFzcz1cImJhci1jaGFydF9fZGF0YVwiPiA8c3BhbiBjbGFzcz1cImJhci1jaGFydF9fYmFyXCIgcmlvdC1zdHlsZT1cIndpZHRoOiB7cGVyY2VudGFnZSh2YWx1ZSl9JVwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJiYXItY2hhcnRfX3ZhbHVlXCI+e2N1cnJlbmN5KHZhbHVlKX08L3NwYW4+IDwvZGl2PiA8L2Jhci1jaGFydC1pdGVtPicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG50aGlzLnBlcmNlbnRhZ2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIDEwMCAvIG9wdHMubWF4ICogdmFsdWU7XG59O1xuXG50aGlzLmN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IEludGwuTnVtYmVyRm9ybWF0KG9wdHMubG9jYWxlLCB7XG4gICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgY3VycmVuY3k6IG9wdHMuY3VycmVuY3lcbiAgfSkuZm9ybWF0KHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWUgPyBmb3JtYXR0ZWRWYWx1ZSA6IG9wdHMubmE7XG59O1xufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcyKCdtYXAnLCAnPGRpdiBpZD1cIm1hcFwiPjwvZGl2PicsICcnLCAnY2xhc3M9XCJudXJzaW5naG9tZXNfX21hcFwiJywgZnVuY3Rpb24ob3B0cykge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2xlYWZsZXQgPSByZXF1aXJlKCdsZWFmbGV0Jyk7XG5cbnZhciBfbGVhZmxldDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sZWFmbGV0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gIC8vIENyZWF0ZSB0aGUgbWFwXG4gIHZhciBtYXAgPSBfbGVhZmxldDIuZGVmYXVsdC5tYXAoJ21hcCcpLnNldFZpZXcoWzQxLjM5MjEsIDIuMTcwNV0sIDEzKTtcblxuICAvLyBJbmRpY2F0ZSBsZWFmbGV0IHRoZSBzcGVjaWZpYyBsb2NhdGlvbiBvZiB0aGUgaW1hZ2VzIGZvbGRlciB0aGF0IGl0IG5lZWRzIHRvIHJlbmRlciB0aGUgcGFnZVxuICBfbGVhZmxldDIuZGVmYXVsdC5JY29uLkRlZmF1bHQuaW1hZ2VQYXRoID0gJ2xpYi9sZWFmbGV0L2ltYWdlcy8nO1xuXG4gIC8vIFVzZSBPcGVuU3RyZWV0TWFwIHRpbGVzIGFuZCBhdHRyaWJ1dGlvblxuICB2YXIgb3NtVGlsZXMgPSAnaHR0cDovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZyc7XG4gIHZhciBhdHRyaWJ1dGlvbiA9ICfCqSBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycyc7XG5cbiAgLy8gQ3JlYXRlIHRoZSBiYXNlbWFwIGFuZCBhZGQgaXQgdG8gdGhlIG1hcFxuICBfbGVhZmxldDIuZGVmYXVsdC50aWxlTGF5ZXIob3NtVGlsZXMsIHtcbiAgICBtYXhab29tOiAxOCxcbiAgICBhdHRyaWJ1dGlvbjogYXR0cmlidXRpb25cbiAgfSkuYWRkVG8obWFwKTtcbn0pO1xufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcyKCdwcmljZS1jb21wYXJpc29uJywgJzx5aWVsZD48L3lpZWxkPiA8c2VsZWN0IGNsYXNzPVwibnVyc2luZ2hvbWVzX19wcmljZS1jb21wYXJpc29uX19zZWxlY3RcIiBvbmNoYW5nZT1cIntvblNlbGVjdENoYW5nZX1cIj4gPG9wdGlvbiBlYWNoPVwie2lkLCBuYW1lIGluIG9wdHMub3B0aW9uc31cIiBfX3NlbGVjdGVkPVwie3NlbGVjdGVkU2V0ID09IGlkfVwiIHZhbHVlPVwie2lkfVwiPiB7bmFtZX0gPC9vcHRpb24+IDwvc2VsZWN0PiA8YmFyLWNoYXJ0IGN1cnJlbmN5PVwie29wdHMuY3VycmVuY3l9XCIgbG9jYWxlPVwie29wdHMubG9jYWxlfVwiIG5hPVwie29wdHMubmF9XCIgaXRlbXM9XCJ7aXRlbXN9XCIgbWF4PVwie21heFZhbHVlfVwiPjwvYmFyLWNoYXJ0PicsICcnLCAnY2xhc3M9XCJudXJzaW5naG9tZXNfX3ByaWNlLWNvbXBhcmlzb25cIicsIGZ1bmN0aW9uKG9wdHMpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF90aGlzID0gdGhpcztcblxudGhpcy5zZWxlY3RlZFNldCA9IG9wdHMuaW5pdGlhbE9wdGlvbjtcblxudGhpcy5vblNlbGVjdENoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICBfdGhpcy5zZWxlY3RlZFNldCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgX3RoaXMudXBkYXRlKCk7XG59O1xuXG50aGlzLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxlY3RlZCA9IF90aGlzLnNlbGVjdGVkU2V0O1xuXG4gIF90aGlzLml0ZW1zID0gb3B0cy5pdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgdXJsOiBpdGVtLnVybCxcbiAgICAgIHZhbHVlOiBpdGVtLnByaWNlc1tzZWxlY3RlZF0sXG4gICAgICBjdXJyZW50OiBpdGVtLmN1cnJlbnRcbiAgICB9O1xuICB9KTtcblxuICBfdGhpcy5pdGVtcyA9IF90aGlzLml0ZW1zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYS52YWx1ZSA8IGIudmFsdWU7XG4gIH0pO1xuXG4gIF90aGlzLm1heFZhbHVlID0gX3RoaXMuaXRlbXMucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGEsIGIudmFsdWUpO1xuICB9LCAwKTtcbn0pO1xufSk7XG4iLCJpbXBvcnQgeyBtb3VudCB9IGZyb20gJ3Jpb3QnXG5cbmltcG9ydCAnLi9jb21wb25lbnRzL3ByaWNlX2NvbXBhcmlzb24udGFnJ1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvYmFyX2NoYXJ0LnRhZydcbmltcG9ydCAnLi9jb21wb25lbnRzL21hcC50YWcnXG5cbmV4cG9ydCB7IG1vdW50IH07XG4iXX0=
