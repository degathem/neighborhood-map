# Neighborhood Map Project for Udacity Frontend Web Dev Nanodegree

Page can be reviewed on the github project page here: [http://degathem.github.io/neighborhood-map/](http://degathem.github.io/neighborhood-map/)

Code can be reviewed in the src folder in this repository.

The map presents the user with a list and map of interesting places to visit in the old part of Bangkok. It utilizes the [Wikipedia api](http://www.mediawiki.org/wiki/API:Main_page) to present a short snippet on the place with a link, and the [Flickr api](https://www.flickr.com/services/api/) to grab the first 10 pictures matching the place name within a 100 metre radius sorted by [interestingness](https://www.flickr.com/explore/interesting/).

Locations are stored in the [GeoJSON format](http://geojson.org/), which the Google maps api can read and render. [QGIS](http://www.qgis.org) an open source Geographical Information System (GIS) and mapping program was used to create the GeoJSON data.

[Bower](http://bower.io) is used to manage libraries used - [Bootstrap](http://getbootstrap.com/) and [Knockoutjs](http://knockoutjs.com)

[Gulp](http://www.gulp.com) is used to package the javascript and css files from src directory and move them into the dist directory. This means that opening index.html from either the src or dist folder will work, but the production version of the site will use the dist folder (after building using 'gulp usemin'.

Unfortunately the site is not optimized for mobile.

## Resources used:
* [KnockoutJS Documentation](http://knockoutjs.com/documentation/introduction.html)
* [JQuery Documentation](https://api.jquery.com/)
* [JQuery Deffered Object](https://api.jquery.com/category/deferred-object/)
* [Stackoverflow JQuery.when Understanding](http://stackoverflow.com/questions/5280699/jquery-when-understanding)
* [Google Maps Javascript API Reference](https://developers.google.com/maps/documentation/javascript/reference)
* Responsiveness Off Canvas Menu from Jasny Bootstrap [http://jasny.github.io/bootstrap/javascript/#offcanvas](http://jasny.github.io/bootstrap/javascript/#offcanvas)

