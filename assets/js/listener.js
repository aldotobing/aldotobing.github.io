document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah reload halaman

    // Ambil nilai input dari form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.querySelector('textarea[name="message"]').value;

    // Cek apakah ada field yang kosong
    if (!name || !email || !subject || !message) {
      showAlert("Please fill out this field");
      return; // Hentikan eksekusi jika ada field yang kosong
    }

    // Tampilkan loader dan sembunyikan pesan error/sukses
    document.querySelector(".loading").style.display = "block";
    document.querySelector(".error-message").style.display = "none";
    document.querySelector(".sent-message").style.display = "none";

    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json();

      if (response.ok) {
        // Tampilkan pesan sukses
        document.querySelector(".loading").style.display = "none";
        document.querySelector(".sent-message").style.display = "block";
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      // Tampilkan pesan error
      document.querySelector(".loading").style.display = "none";
      document.querySelector(".error-message").textContent = error.message;
      document.querySelector(".error-message").style.display = "block";
    }
  });

// Fungsi untuk menampilkan alert
function showAlert(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "alert-message";
  alertBox.textContent = message;
  document.body.appendChild(alertBox);

  // Style alert
  alertBox.style.position = "fixed";
  alertBox.style.top = "20px";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translateX(-50%)";
  alertBox.style.backgroundColor = "rgba(255, 0, 0, 0.8)"; // Merah transparan
  alertBox.style.color = "#fff"; // Teks putih
  alertBox.style.padding = "10px 20px";
  alertBox.style.borderRadius = "5px";
  alertBox.style.zIndex = "1000";
  alertBox.style.transition = "opacity 0.5s ease";

  // Tampilkan alert
  alertBox.style.opacity = "1";

  // Hilangkan alert setelah beberapa detik
  setTimeout(() => {
    alertBox.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(alertBox);
    }, 500); // Durasi fade out
  }, 3000); // Tampilkan selama 3 detik
}
