var mapViewModel = function (poiArray) {
  this.poiArray = poiArray;

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var features = map.data.addGeoJson(this.poiArray);

  //console.dir(features);
  google.maps.event.addDomListener(window, 'load', [map,features]);

  var self = this;

  self.pois = ko.observableArray(features);

  var lastinfowindow;
  self.showInfo = function (poi){
    if (typeof lastinfowindow != 'undefined'){
      lastinfowindow.close();
    };
    var currentlatlng = poi.getGeometry().get();
    var infowindow = new google.maps.InfoWindow({
      position: currentlatlng,
      pixelOffset: new google.maps.Size(0,-25)
    });

    map.panTo(currentlatlng);
    infowindow.open(map);
    lastinfowindow = infowindow;
  };

};


ko.applyBindings(mapViewModel(bangkokLandmarks));
