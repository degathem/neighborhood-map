var mapViewModel = function (poiArray) {
  this.poiArray = poiArray;
  
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var features = map.data.addGeoJson(this.poiArray);
  
  console.dir(features);
  google.maps.event.addDomListener(window, 'load', [map,features]);
  
  var self = this;

  self.pois = ko.observableArray(features);
  
  
  
};


ko.applyBindings(mapViewModel(pois));
