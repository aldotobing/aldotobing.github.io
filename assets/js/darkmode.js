const modeSwitch = document.getElementById("mode-switch");
const body = document.body;

// Check saved theme preference
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  modeSwitch.checked = true;
}

// Handle theme switch and update chart if it exists
modeSwitch.addEventListener("change", () => {
  if (modeSwitch.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
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
