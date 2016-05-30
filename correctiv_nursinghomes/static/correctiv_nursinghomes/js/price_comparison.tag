<price-comparison>

  <select onchange={ onSelectChange }>
    <option
      each={ id, name in opts.options }
      selected={ selectedSet == id}
      value={ id }>
      { name }
    </option>
  </select>

  <bar-chart items={ items } max={ maxValue } />

  <script>
    this.selectedSet = opts.initialOption;

    onSelectChange(event) {
      this.selectedSet = event.target.value
      this.update()
    }

    this.on('update', function() {
      var selected = this.selectedSet;

      this.items = opts.items.map(function(item) {
        return {
          name: item.name,
          value: item.prices[selected]
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
    <a href="#" title={ name } class="bar-chart__label">{ name }</a>
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
