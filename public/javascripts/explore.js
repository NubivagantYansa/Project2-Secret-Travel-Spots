document.addEventListener("DOMContentLoaded", () => {
  console.log("EXPLORE JS");

  const filterById = (id) => {
    axios
      .get(`${window.location.origin}/explore/search`, { params: { id: id } })

      .then((spots) => {
        const obj = spots.data;
        const input = spots.config.params.id;
        console.log("json", obj);
        console.log("this is the input from view", spots.config.params.id);

        // DOM manupulation
        let item = "";

        // 1.loop through array of objects
        // 2. deconstruct properties name, address,category
        // 3. show only those with category = spots.config.params.id

        let result = obj.filter((spot) => spot.category == input);

        result.forEach((obj) => {
          const { name, description, address, category, imageUrl } = obj;

          item += `
        <div class="card card-body">
        <h4>name: ${name}</h4>
        <p>address: ${address}</p>
        <p>category: ${category}</p>
        <p>description: ${description}</p>
        <p><a href="/spot-details/${id}" class="btn btn-primary">See more</a>
      </div>
      <hr>`;
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

  document
    .getElementById("fetch-by-cat")
    .addEventListener("click", function (event) {
      event.preventDefault();
      // console.log("hello world!");
      const category = document.getElementById("fetch-by-category-input").value; // input id of item to be retrived
      filterById(category);
    });

  mapboxgl.accessToken =
    "pk.eyJ1IjoibnViaXZhZ2FudCIsImEiOiJja2VoZzk0Y3cxOW1uMnFuN203MWh0NG02In0.okCi7PEhM2-3intp25elvQ";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 3,
    center: [12.35804, 41.79284],
  });

  map.on("load", function () {
    map.loadImage("../images/secretLogo.png", async function (error, image) {
      const features = await getSpots();
      console.log("FEATURES IN DA HOUSE", features);
      if (error) throw error;
      map.addImage("pin", image);
      map.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point",
        layout: {
          "icon-image": "pin",
          "icon-size": 0.03,
          "text-field": "{spotId}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.9],
          "text-anchor": "top",
        },
      });
    });
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
        //loadMap(spotsList);
        return spotsList;
      })
      .catch((err) => {
        console.log(err);
        err.response.status === 404
          ? alert(`The id doesn't exist.`)
          : alert("Server error! Sorry.");
      });
  };

  //3. load map with points
  // const loadMap = (spots) => {
  //   /*     map.addSource({
  //     id: "points",
  //     type: "symbol",
  //     source: {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [
  //           {
  //             type: "Feature",
  //             geometry: {
  //               type: "Point",
  //               coordinates: [0, 0],
  //             },
  //             properties: {
  //               spotName: "Rome",
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     // layout: {
  //     //   "icon-image": "{icon-15}",
  //     //   "icon-size": 1.5,
  //     //   "text-field": "{spotId}",
  //     //   "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
  //     //   "text-offset": [0, 0.9],
  //     //   "text-anchor": "top",
  //     // },
  //   });
  //   map.addLayer({
  //     id: "points",
  //     type: "symbol",
  //     source: "point",
  //     layout: {
  //       "icon-image": "cat",
  //       "icon-size": 0.25,
  //     },
  //   }); */
  // };
  // getSpots();
});
