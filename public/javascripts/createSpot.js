document.addEventListener("DOMContentLoaded", () => {
  console.log("CREATE SPOT JS");

  /* MAPBOX settings */
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

  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  /*  GET 'name, description, category, geolocator' inputs from CREAT-SPOT form and send it to the server with AXIOS to create new spot */

  let image;

  document.getElementById("create-spot").addEventListener("submit", (event) => {
    event.preventDefault();

    // Inputs from form.
    const name = document.getElementById("name-input").value;
    const description = document.getElementById("description-input").value;
    const category = document.getElementById("category-input").value;
    const input = document.querySelector(".mapboxgl-ctrl-geocoder input").value;

    sendInput(input, image, name, description, category);
  });

  const sendInput = (input, image, name, description, category) => {
    axios
      .post(`${window.location.origin}/user-profile/create-spot`, {
        name: name,
        description: description,
        address: input,
        category: category,
        imageUrl: image,
      })
      .then((response) => {
        //  Show ERROR MESSAGE if there are missing inputs.
        if (response.data.errorMessage) {
          //dom manipulation for error
          let err = "";
          err += `
       
        <p>Some fields are mandatory. Please provide name, description, address and category!</p>
      `;

          document.getElementById("error-message").innerHTML = err;
          return;
        }
        window.location = response.data.path; //  Replaces the 'render page' of the backend.
      })
      .catch((err) => {
        console.log("these was an error with your axios request", err);
      });
  };

  /* GET the image from form and UPLOAD on Cloudinary with AXIOS */
  document.getElementById("image-input").addEventListener("change", (event) => {
    image = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append("image", image);

    axios
      .post(`${window.location.origin}/user-profile/image-upload`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        image = response.data.path; //Cloudinary URL
      })
      .catch((err) => {
        console.log("Error while preparing image for Cloudinary", err);
      });
  });
});

//USE MY LOCATION BUTTON
// document.getElementById("get-location").addEventListener("click", (event) => {
//   event.preventDefault();
//   getLocation();
// });

// const location = document.getElementById("address-input");

// getLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     alert("Geolocation is not supported by this browser.");
//   }
// };

// showPosition = (position) => {
//   location.value = position.coords.latitude + " " + position.coords.longitude;
// };
