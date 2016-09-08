<map>

  <div id='map'></div>

  <script>
    import L from 'leaflet'
    import 'core-js/fn/array/find'

    this.on('mount', () => {
      const currentItem = opts.items.find(item => item.current)
      const center = currentItem.latlng.coordinates
      const maxBounds = opts.items.map(item => item.latlng.coordinates.reverse())
      const map = renderMap(center, maxBounds, opts)

      renderItems(map, opts)
      applyViewportOffset(map, opts.viewportOffset)
    })

    function renderMap (center, maxBounds, { zoom, minZoom, maxZoom, attribution }) {
      const map = L.map('map', { center, zoom, minZoom, maxZoom, maxBounds })
      const tileLayer = L.tileLayer(opts.tiles, { maxZoom, attribution })

      map.addLayer(tileLayer)
      map.zoomControl.setPosition('topright')
      map.scrollWheelZoom.disable()

      return map
    }

    function renderItems (map, { items, icons, iconOptions }) {
      const Icon = L.Icon.extend({ options: iconOptions })
      const defaultIcon = new Icon({ iconUrl: icons.default })
      const hilightIcon = new Icon({ iconUrl: icons.hilight })

      items.forEach( item => {
        const coordinates = item.latlng.coordinates
        const icon = item.current ? hilightIcon : defaultIcon
        const marker = L.marker(coordinates, {icon: icon})
        marker.addTo(map)
      })
    }

    function applyViewportOffset (map, { smallScreen, bigScreen, breakpoint }) {
      const clientWidth = document.documentElement.clientWidth
      const offset = clientWidth < breakpoint ? smallScreen : bigScreen

      // Offset the map to make space for the title:
      map.panBy(offset, {animate: false})
    }
  </script>

</map>
