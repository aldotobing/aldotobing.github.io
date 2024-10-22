// Define currentMode in the global scope so it's accessible everywhere
let currentMode = "text";

const dropdown = document.querySelector(".dropdown");
const dropbtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const selectedItem = document.getElementById("selected-item");

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

// Handle dropdown item clicks and update `currentMode`
const dropdownItems = document.querySelectorAll(".dropdown-item");
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const selectedValue = this.dataset.value;

    // Update selected item text in the header
    selectedItem.textContent = selectedValue;
    dropdownContent.classList.remove("show");

    // Update the mode based on the selection
    if (this.id === "text-generation") {
      currentMode = "text";
    } else if (this.id === "image-generation") {
      currentMode = "image";
    }

    //console.log("Current Mode:", currentMode); // Debugging log
  });
});
