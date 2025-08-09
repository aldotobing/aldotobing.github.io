const modeSwitch = document.getElementById("mode-switch");
const body = document.body;
const frameContact = document.querySelector(".frame-contact"); // Ambil elemen frame-contact

// Check saved theme preference (default to dark if no preference set)
if (localStorage.getItem("theme") !== "light") {
  body.classList.add("dark-mode");
  frameContact.classList.add("dark-mode");
  modeSwitch.checked = true;
  localStorage.setItem("theme", "dark");
}

// Handle theme switch and update chart if it exists
modeSwitch.addEventListener("change", () => {
  if (modeSwitch.checked) {
    body.classList.add("dark-mode");
    frameContact.classList.add("dark-mode"); // Tambahkan dark-mode ke frame-contact
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    frameContact.classList.remove("dark-mode"); // Hapus dark-mode dari frame-contact
    localStorage.setItem("theme", "light");
  }

  // Update chart legend color dynamically
  const chartInstance = Chart.getChart("wakatimeChart"); // Get existing chart instance
  if (chartInstance) {
    chartInstance.options.plugins.legend.labels.color = body.classList.contains(
      "dark-mode"
    )
      ? "#e0e0e0"
      : "#333";
    chartInstance.update();
  }
});
