var mapViewModel = function (poiArray) {
  this.poiArray = poiArray;

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var features = map.data.addGeoJson(this.poiArray);

  //console.dir(features);


  var self = this;

  self.pois = ko.observableArray(features);
  google.maps.event.addDomListener(window, 'load', [map]);
  var lastinfowindow;
  self.showInfo = function (poi){
    if (typeof lastinfowindow != 'undefined'){
      lastinfowindow.close();
    };
    var currentlatlng = poi.getGeometry().get();
    var currentname = poi.getProperty('name');
    var wiki = $.ajax( {
      'url': 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&callback=wikiCallback&titles=' + currentname,
      'dataType': 'jsonp'
    } );
    //flickr api key 32568a779cf80facd0458781d8f9cf02
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    //https://farm8.staticflickr.com/7592/16810156278_69184a3ff9.jpg
    //https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4cf0f2a9efa040d39018e0ee4c7c06a3&lat=&lon=&radius=100&radius_units=m&format=json&auth_token=72157649370509514-1d07ab64f2100eb1&api_sig=18c3d42db208421e4b2deb9b7d247e44
    var flickr = $.ajax({
      url: 'https://api.flickr.com/services/rest/',
      data: {
        method: 'flickr.photos.search',
        api_key: '4cf0f2a9efa040d39018e0ee4c7c06a3',
        radius: '0.1',
        radius_units: 'km',
        lat: currentlatlng.lat(),
        lon: currentlatlng.lng(),
        text: currentname,
        sort: 'interestingness-asc',
        format: 'json',
        nojsoncallback: 1
      },
      dataType: 'jsonp'
    })
    //$.ajax({url:'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json|callback&titles=' + name});
    console.dir(wiki);
    console.dir(flickr);
    var infowindow = new google.maps.InfoWindow({
      position: currentlatlng,
      pixelOffset: new google.maps.Size(0,-25),
      content: currentname
    });

    map.panTo(currentlatlng);
    infowindow.open(map);
    lastinfowindow = infowindow;
  };

};


ko.applyBindings(mapViewModel(bangkokLandmarks));
