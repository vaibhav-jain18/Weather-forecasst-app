window.addEventListener("load", function() {
  let loc = document.getElementById('location');
  $.ajax({
              url: "https://geoip-db.com/jsonp",
              jsonpCallback: "callback",
              dataType: "jsonp",
              success: function( location ) {
                  loc.innerHTML = location.country_name + ", " + location.city + ", " + location.state;
                }
  });
})
