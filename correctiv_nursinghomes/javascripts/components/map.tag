<map class='nursinghomes__map'>

  <div id='map'></div>

  <script>

    import L from 'leaflet'

    this.on('mount', () => {
      // Create the map
      const map = L.map('map').setView([41.3921, 2.1705], 13)

      // Indicate leaflet the specific location of the images folder that it needs to render the page
      L.Icon.Default.imagePath = 'lib/leaflet/images/'

      // Use OpenStreetMap tiles and attribution
      const osmTiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      const attribution = '© OpenStreetMap contributors'

      // Create the basemap and add it to the map
      L.tileLayer(osmTiles, {
          maxZoom: 18,
          attribution: attribution
      }).addTo(map)
    })

  </script>

</map>
