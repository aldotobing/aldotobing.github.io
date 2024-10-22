const dropdown = document.querySelector(".dropdown");
const dropbtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const selectedItem = document.getElementById("selected-item");

// Default mode
let currentMode = "text";

// Event listener for dropdown button click
dropbtn.addEventListener("click", (event) => {
  dropdownContent.classList.toggle("show");
  event.stopPropagation();
});

// Close dropdown if clicked outside
window.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    dropdownContent.classList.remove("show");
  }
});

// Handle dropdown item clicks
const dropdownItems = document.querySelectorAll(".dropdown-item");
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    selectedItem.textContent = this.dataset.value;
    dropdownContent.classList.remove("show");

    if (this.id === "text-generation") {
      currentMode = "text";
    } else if (this.id === "image-generation") {
      currentMode = "image";
    }
  });
});
