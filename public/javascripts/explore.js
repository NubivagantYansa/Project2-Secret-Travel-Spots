document.addEventListener("DOMContentLoaded", () => {
  console.log("EXPLORE JS");

  const filterById = (id) => {
    console.log("I AM BEING CLICKED");
    axios
      .get(`${window.address.origin}/explore/search`, { params: { id: id } })

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
    zoom: 9,
    center: [-51.5074, 0.1278],
  });
});
