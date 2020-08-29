document.addEventListener("DOMContentLoaded", () => {
  console.log("EXPLORE JS");

  const filterById = (id) => {
    console.log("I AM BEING CLICKED");
    axios
      .get(`${window.location.origin}/explore/test`)
      .then((response) => {
        const obj = response.data;
        console.log("json", obj);
        console.log("this is the input from view", response.config.params.id);

        //DOM manipulation
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
