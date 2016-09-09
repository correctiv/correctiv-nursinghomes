<bar-chart>

  <bar-chart-item class="bar-chart__item {-hilight: current}" each={ opts.items }>
    <a href="{ url }" title={ name } class="bar-chart__label">{ name }</a>
    <div class="bar-chart__data">
      <span class="bar-chart__bar" style="width: { percentage(value) }%"></span>
      <span class="bar-chart__value">{ currency(value) }</span>
    </div>
  </bar-chart-item>

  <script type="babel">
    this.percentage = (value) => {
      return (100 / opts.max) * value
    }

    this.currency = (value) => {
      const formattedValue = Intl.numberFormat(opts.locale, {
        style: 'currency',
        currency: opts.currency
      }).format(value)

      return value ? formattedValue : opts.na
    }
  </script>

</bar-chart>
