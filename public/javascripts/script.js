document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("JS static file loaded :)");
  },
  false
);

document.getElementById("delete-profile").addEventListener("click", (event) => {
  event.preventDefault(); // <= !!! Prevent the refresh
  // add confirmation screen
  let str = "";
  str += `
    <h2>Are you sure you want to delete your profile?</h2>
    <p>once you delete your account, you can't recover it.</p>
    <div>
    <a href="/user-profile" class="btn btn-primary">No, go back to Profile</a>
    <form action="/user-profile/{{user._id}}/edit-profile/delete" method="post">
      <button type="submit" class="btn btn-danger">Yes, delete my Profile</button>
    </form>
    </div>`;
  document.getElementById("main-container").innerHTML = str;
});
