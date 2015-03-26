

var initialize = function () {
    var mapOptions = {
      center: { lat: 13.753558, lng: 100.51},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.MAP,
      styles: styles
    };
    var map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);