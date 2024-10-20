setInterval(() => {
  const button = document.getElementById("chat-toggle");
  button.classList.add("jiggle");

  // Hapus kelas jiggle setelah 1 detik untuk reset
  setTimeout(() => {
    button.classList.remove("jiggle");
  }, 1000); // 1000ms = 1 detik
}, 2000); // 2000ms = 2 detik
