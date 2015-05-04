var mapViewModel = function (poiArray) {
  var self = this;

  self.poiArray = poiArray;

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  //var features = map.data.addGeoJson(this.poiArray);


  self.pois = ko.observableArray(map.data.addGeoJson(self.poiArray));
  map.data.setStyle({icon:'https://maps.gstatic.com/mapfiles/ms2/micons/red.png'});
  //console.dir(features);
  //self.pois = ko.observableArray(features);

  google.maps.event.addDomListener(window, 'load', [map]);
  var centerlatlng = map.getCenter();

  var lastinfowindow;
  //var highlightMarker = new google.maps.Marker;
  self.closeInfowindow = function () {
    if (typeof lastinfowindow != 'undefined'){
      lastinfowindow.close();
    };
  }
  self.highlightLocation = function (poi){
    map.data.overrideStyle(poi,{icon:'https://maps.gstatic.com/mapfiles/ms2/micons/green.png'});
  }

  self.unhighlightLocation = function (poi){
    map.data.revertStyle(poi);
  }

  self.centerMap = function (){
    map.panTo(centerlatlng);
    map.setZoom(14);
    closeInfowindow();
  }

  self.showInfo = function (poi){
    closeInfowindow();
    console.log(map.data.getStyle());
    self.highlightLocation(poi);
    var currentlatlng = poi.getGeometry().get();
    var currentname = poi.getProperty('name');
    var currentcategory = poi.getProperty('category')
    var infowindowcontent = '<h3>' + currentname + ' - ' + currentcategory+'</h3>';

    var infowindow = new google.maps.InfoWindow({
      position: currentlatlng,
      pixelOffset: new google.maps.Size(-2,-20),
    });
    map.panTo(currentlatlng);
    var wikiinfo = '';
    function wikiCall () {

      return $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
          action: 'query',
          list:'search',
          format:'json',
          srsearch: currentname,
          srlimit: 1
        },
        dataType: 'jsonp',
      })
      .done(function(data){
        console.dir(data);
        var url = '<a href="http://en.wikipedia.org/wiki/' + data.query.search[0].title + '">' +
                  'More on Wikipedia</a>';
        wikiinfo += data.query.search[0].snippet + '...';
        wikiinfo += url;
      })
    };

    var flickrinfo = '';
    function jsonFlickrApi () {
      return $.ajax({
        url: 'https://api.flickr.com/services/rest/',
        data: {
          method: 'flickr.photos.search',
          api_key: '32568a779cf80facd0458781d8f9cf02',
          radius: '0.1',
          radius_units: 'km',
          lat: currentlatlng.lat(),
          lon: currentlatlng.lng(),
          text: currentname,
          sort: 'interestingness-asc',
          format: 'json',
          iscommons: true,
          per_page: 5,
          nojsoncallback: 0
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback'
      })
      .done(function(data) {
        console.dir(data);
        var photos = data.photos.photo;
        var photourl;
        var photoimg;
        flickrinfo += '<h4>Photos from Flickr</h4>';
        for (var i = 0; i < photos.length; i++) {
          console.log(photos[i]);
          photourl = 'https://farm'
                    + photos[i].farm
                    + '.staticflickr.com/'
                    + photos[i].server + '/'
                    + photos[i].id
                    + '_'
                    + photos[i].secret
                    + '_m.jpg';
          photoimg = '<img class="img-flickr" src="' + photourl + '">';
          photolink = 'https://www.flickr.com/photos/'
                    + photos[i].owner + '/'
                    + photos[i].id;
          flickrinfo += '<a href="' + photolink + '">' + photoimg +'</a>';
        };
      })
    };

    //Jquery 'when' function used to ensure wiki content loads
    //flickr content. Because Asynchronous nature of web, flickr content
    //could arrive before wiki.
    $.when(wikiCall(),jsonFlickrApi()).done(function(){
      infowindowcontent += wikiinfo + '<br>' + flickrinfo;
      infowindow.setContent(infowindowcontent);

    });

    //Hacky workaround to ensure entire infowindow shows
    //pan map to northmost bound after panning to point
    map.panTo({lat:map.getBounds().getNorthEast().lat(),lng:currentlatlng.lng()});

    infowindow.open(map);

    // Set current window to be last info window, this ensures it will close when
    //another location is selected
    lastinfowindow = infowindow;
  };

};


ko.applyBindings(mapViewModel(bangkokLandmarks));
