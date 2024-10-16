const modeSwitch = document.getElementById("mode-switch");
const body = document.body;

// Cek preferensi yang tersimpan
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  modeSwitch.checked = true;
}

modeSwitch.addEventListener("change", () => {
  if (modeSwitch.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});
