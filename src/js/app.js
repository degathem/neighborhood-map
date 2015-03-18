function initialize() {
        var mapOptions = {
          center: { lat: 13.753558, lng: 100.497171},
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
      }
google.maps.event.addDomListener(window, 'load', initialize);