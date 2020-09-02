document.addEventListener("DOMContentLoaded", () => {
  console.log("CREATE SPOT JS");

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
