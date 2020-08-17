window.addEventListener("load", function(){
  //onload dropdown animation. see anime.js docs.
  anime({
    targets: '#wrapper',
    translateY: -100,
    duration: 0
  });
  anime({
    targets: '#wrapper',
    translateY: 0
  });
  
  //set variables.
  let long;
  let lat;
  let temp = document.getElementById('temp');
  let fahrenheit;
  let mins;
  
  //drag & move scroll.
  const slider = document.querySelector('#daily_box');
  let isDown = false;
  let startX;
  let scrollLeft;
  
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  
  slider.addEventListener('mouseleave', () => {
    isDown = false;
  })
  
  slider.addEventListener('mouseup', () => {
    isDown = false;
  })
  
  slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 1.2;
  })
  
  //if user enabled location tracking. see navigator docs.
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/3d5656d4a69a797781afeb0bed5f8abe/${lat},${long}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          //current day
          const {temperature, summary, time, icon} = data.currently;
          document.getElementById('sum').innerHTML = summary;
          fahrenheit = Math.round(temperature);
          temp.innerHTML = fahrenheit + " F";
          var date = new Date(time*1000);
          mins = date.getMinutes();
          mins = getRealMins();
          document.getElementById('time').innerHTML = "Local Time: " + date.getHours() + " : " + mins;
          setIcons(icon, document.getElementById('icon'));

          //daily forecast
          //days of week array
          var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

          var day;
          // loop through all elemets and edit their contents.
          for(var i = 0; i<=7; i++){
            day = new Date(data.daily.data[i].time*1000);
            document.getElementById('d' + i + '_name').innerHTML = weekday[day.getDay()] + " " + (day.getMonth() + 1) + "/" + day.getDate();
            document.getElementById('d' + i + '_sum').innerHTML = data.daily.data[i].summary;
            setIcons(data.daily.data[i].icon, document.getElementById('d' + i + '_icon'));
            document.getElementById('d' + i + '_temp_high').innerHTML = '<i class="fas fa-angle-up"></i> ' + ' ' + Math.round(data.daily.data[i].temperatureHigh) + " F";
            document.getElementById('d' + i + '_temp_low').innerHTML = '<i class="fas fa-angle-down"></i> ' + ' ' + Math.round(data.daily.data[i].temperatureLow) + " F";
            document.getElementById('d' + i + '_uv').innerHTML = 'UV <i class="far fa-sun"></i> ' + ' ' + data.daily.data[i].uvIndex;
            document.getElementById('d' + i + '_precip').innerHTML = '<i class="fas fa-cloud-rain"></i> ' + ' ' + Math.round(data.daily.data[i].precipProbability * 100) + '%';
          }
          });
    });


  }
  //add 0 to mins if mins < 10
  function getRealMins() {
    if(mins < 10)
      return "0" + mins;
    return mins;
  }

  //set icons. src: library docs
  function setIcons(icon, iconID) {
    var skycons = new Skycons({"color": "white"});
    var currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
})
