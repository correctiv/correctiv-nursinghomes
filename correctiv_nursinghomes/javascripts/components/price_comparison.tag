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
