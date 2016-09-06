<price-comparison class="nursinghomes__price-comparison">

  <yield />

  <select class="nursinghomes__price-comparison__select" onchange={ onSelectChange }>
    <option
      each={ id, name in opts.options }
      selected={ selectedSet == id}
      value={ id }>
      { name }
    </option>
  </select>

  <bar-chart
    currency={ opts.currency }
    locale={ opts.locale }
    na={ opts.na }
    items={ items }
    max={ maxValue } />

  <script>
    this.selectedSet = opts.initialOption

    this.onSelectChange = event => {
      this.selectedSet = event.target.value
      this.update()
    }

    this.on('update', () => {
      var selected = this.selectedSet;

      this.items = opts.items.map( item => {
        return {
          name: item.name,
          url: item.url,
          value: item.prices[selected],
          current: item.current
        }
      })

      this.items = this.items.sort((a, b) => {
        return a.value < b.value
      })

      this.maxValue = this.items.reduce((a, b) => {
        return Math.max(a, b.value)
      }, 0)
    })
  </script>

</price-comparison>

<bar-chart>

  <bar-chart-item class="bar-chart__item {-hilight: current}" each={ opts.items }>
    <a href="{ url }" title={ name } class="bar-chart__label">{ name }</a>
    <div class="bar-chart__data">
      <span class="bar-chart__bar" style="width: { percentage(value) }%"></span>
      <span class="bar-chart__value">{ currency(value) }</span>
    </div>
  </bar-chart-item>

  <script>

    this.percentage = (value) => {
      return 100 / opts.max * value
    }

    this.currency = (value) => {
      const formattedValue = Intl.NumberFormat(opts.locale, {
        style: 'currency',
        currency: opts.currency
      }).format(value)

      return value ? formattedValue : opts.na
    }
  </script>

</bar-chart>
