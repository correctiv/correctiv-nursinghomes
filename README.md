# Correctiv Nursing Home Platform

Django / Django CMS App powering our [“Wegweiser Pflege” news app](https://correctiv.org/recherchen/pflege/).

## Installation

Clone and install via

    pip install -e .

Add `correctiv_nursinghomes` to your `INSTALLED_APPS`, then hook the
`urls.py` with a `'nursinghomes'` namespace or add the CMS App into your CMS page tree.

Templates are made to work within our `correctiv.org` environment:

- a `CMS_TEMPLATE` variable is used as a base template location
- `django-sekizai` is used to add css / js
- a `number_utils` template tag is used

You might need to overwrite them, if you want to run this project in a different
environment.


## Configuration

`correctiv_nursinghomes` requires a PostgreSQL database with Vector Field support.

Load in data and don't forget to run:

    ./manage.py update_search_field correctiv_nursinghomes

## Client-side code

Use NPM to install client-side dependencies:

    npm install

During development, use Gulp for transpiling CSS and JavaScript, and running a [livereload server](https://www.npmjs.com/package/gulp-livereload):

    gulp

Use the `deploy` task to create minified CSS and JavaScript bundles:

    gulp deploy
