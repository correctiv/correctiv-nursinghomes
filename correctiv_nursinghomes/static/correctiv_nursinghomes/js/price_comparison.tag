<price-comparison>

  <h1> Hello World!</h1>

  <ul>
    <li each={ items }>
      { name } / { prices.carelevel_1 }
    </li>
  </ul>

  <script>

    this.on('update', function() {
      this.items = opts.items;
    })

  </script>

</price-comparison>
