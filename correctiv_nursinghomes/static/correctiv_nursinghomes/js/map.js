function initMap(opts) {
  var items = opts.items
  var map = opts.map

  var currentItem = items.filter(function(item) {
    return item.current
  })[0]

  var Icon = L.Icon.extend({
    options: {
      iconSize: [18, 30],
      iconAnchor: [9, 26]
    }
  })

  var defaultIcon = new Icon({ iconUrl: opts.icons.default })
  var hilightIcon = new Icon({ iconUrl: opts.icons.hilight })

  // Apply custom marker icons:
  items.forEach(function(item) {
    var coordinates = item.latlng.coordinates.reverse()
    var icon = item.current ? hilightIcon : defaultIcon
    var marker = L.marker(coordinates, {icon: icon})
    marker.addTo(map)
  })

  // Additional map config:
  map.zoomControl.setPosition('topright')
  map.scrollWheelZoom.disable()
  map.options.maxZoom = 16
  map.options.minZoom = 12
  map.setView(currentItem.latlng.coordinates, 14)
  map.setMaxBounds(items.map(function(item) {
    return item.latlng.coordinates
  }))

  // Offset the map to make space for the title:
  if (document.documentElement.clientWidth < 768) {
    map.panBy(new L.Point(0, 60), {animate: false})
  } else {
    map.panBy(new L.Point(-250, 0), {animate: false})
  }
}
