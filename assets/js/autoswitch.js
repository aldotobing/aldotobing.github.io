function setThemeBasedOnTime() {
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18; // Jam 6 pagi sampai 6 sore

  if (isDayTime) {
    document.body.classList.remove("dark-mode"); // Hapus dark-mode
    document.getElementById("mode-switch").checked = false; // Ubah status switch
  } else {
    document.body.classList.add("dark-mode"); // Tambahkan dark-mode
    document.getElementById("mode-switch").checked = true; // Ubah status switch
  }
}

// Panggil fungsi saat halaman dimuat
window.onload = setThemeBasedOnTime;

// Tambahkan event listener untuk switch
document.getElementById("mode-switch").addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});
