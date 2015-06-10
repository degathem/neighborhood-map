var mapViewModel = function (poiArray) {
  var self = this;
  var lastinfowindow;
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  map.data.setStyle({icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/red.png'});

  google.maps.event.addDomListener(window, 'load', [map]);
  var centerlatlng = map.getCenter();

  self.searchTerm = '';

  self.renderMapList = function (activePois) {
    self.featureArray = ko.observableArray(map.data.addGeoJson(activePois));
    for (var i = 0; i < self.featureArray().length; i++) {
      self.featureArray()[i].active = ko.observable(true);
      self.featureArray()[i].clicked = ko.observable(false);
    }
  };

  self.closeInfowindow = function () {
    if (typeof lastinfowindow != 'undefined'){
      lastinfowindow.close();
    }
  };

  self.search = function () {
    closeInfowindow();
    self.resetMap();
    for (var i = 0; i < self.featureArray().length; i++) {
      if (self.featureArray()[i].getProperty('name').search(self.searchTerm) === -1) {
        self.featureArray()[i].active(false);
        map.data.overrideStyle(self.featureArray()[i],{visible:false});
      }
    }
  };

  self.highlightLocation = function (poi){
    map.data.overrideStyle(poi,{icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/green.png'});
  };

  self.unhighlightLocation = function (poi){
    map.data.revertStyle(poi);
  };

  self.resetMap = function (){
    map.panTo(centerlatlng);
    map.setZoom(14);
    closeInfowindow();

    for (var i = 0; i < self.featureArray().length; i++) {
      self.featureArray()[i].active(true);
      map.data.overrideStyle(self.featureArray()[i],{visible:true});
    }

  };
  var lastpoi;
  self.showInfo = function (poi){
    
    if ($(window).width() <= 992) {
      $('.navmenu').offcanvas('toggle');
    }

    if (typeof lastpoi != 'undefined'){
      lastpoi.clicked(false);
    }
    poi.clicked(true);
    lastpoi = poi;
    closeInfowindow();
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
          list: 'search',
          format: 'json',
          srsearch: currentname,
          srlimit: 1
        },
        dataType: 'jsonp',
      })
      .fail(function(data) {
        wikiinfo = 'Wikipedia data unavailable.';
      })
      .done(function(data){
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
          page: 1,
          per_page: 5,
          nojsoncallback: 0
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback'
      })
      .fail(function(data){
        flickrinfo += 'Flickr Photos unavailable';
      })
      .done(function(data) {
        var photos = data.photos.photo;
        var photourl;
        var photoimg;
        flickrinfo += '<h4>Photos from Flickr</h4>';
        for (var i = 0; i < photos.length; i++) {

          photourl = 'https://farm' +
                    photos[i].farm +
                    '.staticflickr.com/' +
                    photos[i].server + '/' +
                    photos[i].id +
                    '_' +
                    photos[i].secret +
                    '_m.jpg';
          photoimg = '<img class="img-flickr" src="' + photourl + '">';
          photolink = 'https://www.flickr.com/photos/' +
                      photos[i].owner + '/' +
                      photos[i].id;
          flickrinfo += '<a href="' + photolink + '">' + photoimg +'</a>';}

      })
    };

    //Jquery 'when' function used to ensure wiki content loads before
    //flickr content in infowindow. Because Asynchronous nature of web, flickr content
    //could arrive before wiki. Nested whens enable failure messages in map infowindow
    $.when(wikiCall()
    .always(function(){
      $.when(jsonFlickrApi())
      .always(function(){
        infowindowcontent += wikiinfo + '<br>' + flickrinfo;
        infowindow.setContent(infowindowcontent);
      })
    }));

    //Hacky workaround to ensure entire infowindow shows
    //pan map to northmost bound after panning to point
    map.panTo({lat:map.getBounds().getNorthEast().lat(),lng:currentlatlng.lng()});

    infowindow.open(map);

    // Set current window to be last info window, this ensures it will close when
    //another location is selected
    lastinfowindow = infowindow;
  };

  // Clicking a point feature opens an info window 
  map.data.addListener('click',function(event){
    var featureName = event.feature.getProperty('name');
    for (var i = 0; i < self.featureArray().length; i++) {
      if (self.featureArray()[i].getProperty('name') ===  featureName){
        self.showInfo(self.featureArray()[i]);
      }
    }
  });
  renderMapList(poiArray);
};

// Pass in the Bangkok Lanmarks geojson into viewmodel
ko.applyBindings(mapViewModel(bangkokLandmarks));
