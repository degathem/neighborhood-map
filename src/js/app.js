var mapViewModel = function (poiArray) {
  this.poiArray = poiArray;
  
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var features = map.data.addGeoJson(this.poiArray);

  //console.dir(features);
  google.maps.event.addDomListener(window, 'load', [map,features]);
  
  var self = this;

  self.pois = ko.observableArray(features);
  
  self.showInfo = function (poi){
    var infowindow = new google.maps.InfoWindow();
    console.dir(poi.getGeometry().get());
    infowindow.setPosition(poi.getGeometry().get())
    infowindow.open(map);
  };
  
};


ko.applyBindings(mapViewModel(pois));
