function setThemeBasedOnTime() {
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18; // Jam 6 pagi sampai 6 sore

  if (isDayTime) {
    document.body.classList.remove("dark-mode"); // Hapus dark-mode
  } else {
    document.body.classList.add("dark-mode"); // Tambahkan dark-mode
  }
}

// Panggil fungsi saat halaman dimuat
window.onload = setThemeBasedOnTime;
