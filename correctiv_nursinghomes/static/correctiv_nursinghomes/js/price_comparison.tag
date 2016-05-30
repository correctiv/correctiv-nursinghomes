<price-comparison>

  <select onchange={ onSelectChange }>
    <option value="carelevel_1">
      Pflegestufe 1
    </option>
    <option value="carelevel_2">
      Pflegestufe 2
    </option>
    <option value="carelevel_3">
      Pflegestufe 3
    </option>
  </select>

  <bar-chart items={ items } max={ maxValue } />

  <script>
    var selectedSet = 'carelevel_1'

    onSelectChange(event) {
      selectedSet = event.target.value
      this.update()
    }

    this.on('update', function() {
      this.items = opts.items.map(function(item) {
        return {
          name: item.name,
          value: item.prices[selectedSet]
        }
      })

      this.items = this.items.sort(function(a, b) {
        return a.value < b.value
      })

      this.maxValue = this.items.reduce(function(a, b) {
        return Math.max(a, b.value)
      }, 0)
    })
  </script>

</price-comparison>

<bar-chart>

  <bar-chart-item class="bar-chart__item" each={ opts.items }>
    <a href="#" title="{ name }" class="bar-chart__label">{ name }</a>
    <div class="bar-chart__data">
      <span class="bar-chart__bar" style="width: { percentage(value) }%"></span>
      <span class="bar-chart__value">{ value || '–' }</span>
    </div>
  </bar-chart-item>

  <script>
    percentage(value) {
      return 100 / opts.max * value
    }
  </script>

</bar-chart>
