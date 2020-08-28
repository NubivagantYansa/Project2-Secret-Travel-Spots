// class APIHandler {
//   constructor(baseUrl) {
//     this.BASE_URL = baseUrl;
//   }

//   getByCategory() {
//     return axios.get(`${this.BASE_URL}/explore/`);
//   }
// }

// const spotsAPI = new APIHandler(`http://localhost:3000`);

// document
//   .getElementById("fetch-by-cat")
//   .addEventListener("click", function (event) {
//     event.preventDefault();
//     const category = document.getElementById("fetch-by-category-input").value; // input id of item to be retrived

//     spotsAPI
//       .getByCategory(category)
//       .then((response) => {
//         const spots = response.data;
//         console.log(spots);
//       })
//       .catch((err) => {
//         console.log("Unable to retrieve the selected character", err);
//       });
//   });
