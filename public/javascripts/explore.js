document.addEventListener("DOMContentLoaded", () => {
  console.log("EXPLORE JS");

  const filterById = (id) => {
    console.log("I AM BEING CLICKED");
    axios
      .get(`${window.location.origin}/explore/test`, { params: { id: id } })

      .then((spots) => {
        const obj = spots.data;
        const input = spots.config.params.id;
        console.log("json", obj);
        console.log("this is the input from view", spots.config.params.id);

        // DOM manupulation
        let item = "";

        // 1.loop through array of objects
        // 2. deconstruct properties name, location,category
        // 3. show only those with category = spots.config.params.id

        let result = obj.filter((spot) => {
          const { name, description, location, category, imageUrl } = spot;

          return spot.category == input;
        });

        result.forEach((obj) => {
          const { name, description, location, category, imageUrl } = obj;

          item += `
        <div class="card card-body">
        <h4>name: ${name}</h4>
        <p>location: ${location}</p>
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
});
