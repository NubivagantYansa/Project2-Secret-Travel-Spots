document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("JS static file loaded :)");
  },
  false
);

document
  .getElementById("delete-profile")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // <= !!! Prevent the refresh
    const confirmation = () => {
      const result = confirm("Are you sure to delete?");
      if (result) {
        next();
      }
    };
  });
