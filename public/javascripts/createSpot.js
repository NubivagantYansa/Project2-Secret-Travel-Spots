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

  document.getElementById("get-location").addEventListener("click", (event) => {
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

  let image;

  document.getElementById("create-spot").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name-input").value;
    const description = document.getElementById("description-input").value;
    const category = document.getElementById("category-input").value;
    const input = document.querySelector(".mapboxgl-ctrl-geocoder input").value;
    //console.log(image);
    console.log("random test", input, image, name, description, category);
    sendInput(input, image, name, description, category);
  });

  const sendInput = (input, image, name, description, category) => {
    // const uploadData = new FormData();
    // uploadData.append("image", image);
    axios
      .post(`${window.location.origin}/user-profile/create-spot`, {
        name: name,
        description: description,
        address: input,
        category: category,
        imageUrl: image,
      })
      .then((response) => {
        console.log(response);
        // if (response.data.errorMessage) {
        //   //dom manipulation for error
        //   return;
        // }

        window.location = response.data.path;
      })
      .catch((err) => {
        console.log("these was an error with your axios request", err);
      });
  };

  document.getElementById("image-input").addEventListener("change", (event) => {
    console.log(event.target.files);
    //  image = event.target.files[0];
    // axios.post (headers above uploadData, bla bla bla).then(response.data.path -> image url
    const uploadData = new FormData();
    uploadData.append("image", image);
    axios
      .post(`${window.location.origin}/user-profile/image-upload`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        // image = response.data.path)
        image = response.data.path;
      })
      .catch((err) => {
        console.log("Error while preparing image for Cloudinary", err);
      });
  });
});
