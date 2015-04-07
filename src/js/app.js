var mapViewModel = function (poiArray) {
  var self = this;

  self.poiArray = poiArray;

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  //var features = map.data.addGeoJson(this.poiArray);


  self.pois = ko.observableArray(map.data.addGeoJson(self.poiArray));

  //console.dir(features);
  //self.pois = ko.observableArray(features);

  google.maps.event.addDomListener(window, 'load', [map]);


  var lastinfowindow;
  //var highlightMarker = new google.maps.Marker;

  self.highlightLocation = function (poi){
    map.data.overrideStyle(poi,{icon:'https://maps.gstatic.com/mapfiles/ms2/micons/green.png'});


  }
  self.unhighlightLocation = function (poi){
    map.data.revertStyle(poi);
  }

  self.showInfo = function (poi){
    if (typeof lastinfowindow != 'undefined'){
      lastinfowindow.close();
    };
    console.log(map.data.getStyle());
    var currentlatlng = poi.getGeometry().get();
    var currentname = poi.getProperty('name');
    var infowindowcontent = '<h3>' + currentname +'</h3>';

    var infowindow = new google.maps.InfoWindow({
      position: currentlatlng,
      pixelOffset: new google.maps.Size(0,-25),
    });

    function wikiCall () {
      $.ajax({
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
        infowindowcontent += data.query.search[0].snippet + '...';
        infowindowcontent += url;
        infowindow.setContent(infowindowcontent);
      })
    };

    function flickrCall () {
      $.ajax({
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
          nojsoncallback: 1
        },
        dataType: 'jsonp',
        success:function (data) {
          console.dir(data);
        }
      })
      .done(function(data) {
        console.dir(data);
      })
    };



    wikiCall();
    flickrCall();

    //flickr api key 32568a779cf80facd0458781d8f9cf02
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    //https://farm8.staticflickr.com/7592/16810156278_69184a3ff9.jpg
    //https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4cf0f2a9efa040d39018e0ee4c7c06a3&lat=&lon=&radius=100&radius_units=m&format=json&auth_token=72157649370509514-1d07ab64f2100eb1&api_sig=18c3d42db208421e4b2deb9b7d247e44

    //$.ajax({url:'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json|callback&titles=' + name});
    //console.dir(flickr);





    map.panTo(currentlatlng);
    infowindow.open(map);
    lastinfowindow = infowindow;
  };

};


ko.applyBindings(mapViewModel(bangkokLandmarks));
