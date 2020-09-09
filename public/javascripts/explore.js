document.addEventListener("DOMContentLoaded", () => {
  console.log("EXPLORE JS");

  /*  FILTER BUTTON   */
  const filterById = (id) => {
    axios
      .get(`${window.location.origin}/explore/search`, { params: { id: id } })

      .then((spots) => {
        const obj = spots.data;
        const input = spots.config.params.id;
        console.log("json", obj);
        console.log("this is the input from view", spots.config.params.id);

        let item = "";

        // 1.loop through array of objects - 2. deconstruct properties name, address,category - 3. show only those with category = spots.config.params.id
        let result = obj.filter((spot) => spot.category === input);

        result.forEach((spot) => {
          const { _id, name, description, address, category, imageUrl } = spot;

          item += `
          <div class="card card-body">
          <h4>${name}</h4>
          <p>${category}</p>
          <img class=" rounded mx-auto d-block image-square" src="${imageUrl}" class="card-img-top"
          alt="${name}">
          <p><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-geo-alt" fill="rgb(44,172,110)"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M12.166 8.94C12.696 7.867 13 6.862 13 6A5 5 0 0 0 3 6c0 .862.305 1.867.834 2.94.524 1.062 1.234 2.12 1.96 3.07A31.481 31.481 0 0 0 8 14.58l.208-.22a31.493 31.493 0 0 0 1.998-2.35c.726-.95 1.436-2.008 1.96-3.07zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
          <path fill-rule="evenodd" d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg> ${address}</p>
          <p><a href="/spot-details/${_id}" class="btn btn-primary">See more</a>
        </div>`;
        });

        document.getElementById("cont").innerHTML = item;
      })
      .catch((err) => {
        console.log(err);
        err.response.status === 404
          ? alert(`The id doesn't exist.`)
          : alert("Server error! Sorry.");
      });
  };

  //  Event Listener for FILTER Button
  document
    .getElementById("fetch-by-cat")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const category = document.getElementById("fetch-by-category-input").value; // input id of item to be retrived.
      filterById(category);
    });

  //. FILTER BY NAME
  // const filterByName = (id) => {
  //   axios
  //     .get(`${window.location.origin}/explore/search`, { params: { id: id } })

  //     .then((spots) => {
  //       const obj = spots.data;
  //       const input = spots.config.params.id;
  //       console.log("json", obj);
  //       console.log("this is the input from view", spots.config.params.id);

  //       // DOM manupulation
  //       let item = "";

  //       // 1.loop through array of objects
  //       // 2. deconstruct properties name, address,category
  //       // 3. show only those with category = spots.config.params.id

  //       let result = obj.filter((spot) => spot.category == input);

  //       result.forEach((obj) => {
  //         const { name, description, address, category, imageUrl } = obj;

  //         item += `
  //       <div class="card card-body">
  //       <h4>name: ${name}</h4>
  //       <p>address: ${address}</p>
  //       <p>category: ${category}</p>
  //       <p>description: ${description}</p>
  //       <p><a href="/spot-details/${id}" class="btn btn-primary">See more</a>
  //     </div>
  //     <hr>`;
  //       });

  //       document.getElementById("cont").innerHTML = item;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       err.response.status === 404
  //         ? alert(`The id doesn't exist.`)
  //         : alert("Server error! Sorry.");
  //     });
  // };

  // document
  //   .getElementById("fetch-by-cat")
  //   .addEventListener("click", function (event) {
  //     event.preventDefault();

  //     const category = document.getElementById("fetch-by-category-input").value; // input id of item to be retrived
  //     filterById(category);
  //   });

  /*   MAPBOX SETTINGS  */
  mapboxgl.accessToken =
    "pk.eyJ1IjoibnViaXZhZ2FudCIsImEiOiJja2VoZzk0Y3cxOW1uMnFuN203MWh0NG02In0.okCi7PEhM2-3intp25elvQ";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 4,
    center: [12.35804, 41.79284],
  });

  map.on("load", function () {
    map.loadImage("../images/secretLogo.png", async function (error, image) {
      const features = await getSpots();

      if (error) throw error;
      map.addImage("custom-marker", image);
      map.addSource("points", {
        // Collect data from spots.
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });
      map.addLayer({
        //  Add pins to the map.
        id: "symbols",
        type: "symbol",
        source: "points",
        layout: {
          "icon-image": "custom-marker",
          "icon-size": 0.03,
          "text-field": ["get", "spotName"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.5],
          "text-anchor": "top",
        },
      });
    });

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    map.on("click", "symbols", function (e) {
      map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on("mouseenter", "symbols", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "symbols", function () {
      map.getCanvas().style.cursor = "";
    });

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
  });

  // fetch spots from apI
  const getSpots = () => {
    // 1. use axios to retrieve the JSON of spots
    return axios
      .get(`${window.location.origin}/explore/search`)

      .then((spots) => {
        const obj = spots.data; // list of spots
        console.log("this is json", obj);

        // 2. use map to iterate and return in the right format the spots
        const spotsList = obj.map((spot) => {
          console.log("inside map", spot);
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                spot.location.coordinates[0], //dynamic, taken from the JSON
                spot.location.coordinates[1], //dynamic, taken from the JSON
              ],
            },
            properties: {
              spotName: spot.name,
            },
          };
        });
        return spotsList;
      })
      .catch((err) => {
        console.log(err);
        err.response.status === 404
          ? alert(`The id doesn't exist.`)
          : alert("Server error! Sorry.");
      });
  };
});
