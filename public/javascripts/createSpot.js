document.addEventListener("DOMContentLoaded", () => {
  console.log("CREATE SPOT JS");
  mapboxgl.accessToken =
    "pk.eyJ1IjoibnViaXZhZ2FudCIsImEiOiJja2VoZzk0Y3cxOW1uMnFuN203MWh0NG02In0.okCi7PEhM2-3intp25elvQ";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-79.4512, 43.6568],
    zoom: 3,
  });

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );

  document
    .getElementById("get-location")
    .addEventListener("click", function (event) {
      event.preventDefault();
      // console.log("hello world!");
      getLocation();
    });

  const location = document.getElementById("address-input");

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  showPosition = (position) => {
    location.value = position.coords.latitude + " " + position.coords.longitude;
  };
});
