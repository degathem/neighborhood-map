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

    //$.ajax({url:'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json|callback&titles=' + name});
    console.dir(wiki);
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
