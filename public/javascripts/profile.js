document.addEventListener("DOMContentLoaded", () => {
  console.log("PROFILE JS");

  document
    .getElementById("delete-profile")
    .addEventListener("click", (event) => {
      event.preventDefault(); // <= !!! Prevent the refresh
      // add confirmation screen
      let str = "";
      str += `
      <div class="view text-center p-3 p-md-5 m-md-3">
        <h2>Are you sure you want to delete your profile?</h2>
        <br>
        <p>Once you delete your account, you can't recover it.</p>
        <br>
        <img class="rounded mx-auto d-block image-square" src="../images/sad-cat.gif">
        <div>
        <br>
        <a href="/user-profile" class="btn btn-primary">No, go back to Profile</a> <br><br>
        <form action="/user-profile/{{user._id}}/edit-profile/delete" method="post">
          <button type="submit" class="btn btn-danger">Yes, delete my Profile</button>
        </form>
        </div>
        </div>`;
      document.getElementById("main-container").innerHTML = str;
    });
});
