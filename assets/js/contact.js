document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah reload halaman

    // Ambil nilai input dari form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.querySelector('textarea[name="message"]').value;

    // Tampilkan loader dan sembunyikan pesan error/sukses
    const loadingMessage = document.querySelector(".loading");
    const errorMessage = document.querySelector(".error-message");
    const sentMessage = document.querySelector(".sent-message");

    loadingMessage.style.display = "block";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";

    try {
      const response = await fetch(
        "https://mysidomuncul.sidomuncul.co.id/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Mengurai respons JSON dari server
        const responseData = await response.json();
        // Tampilkan pesan sukses
        loadingMessage.style.display = "none";
        sentMessage.style.display = "block";
        // Anda bisa menggunakan responseData jika perlu
        console.log(responseData);
    } else {
        try {
            // Mengurai respons JSON dari server untuk error
            const result = await response.json();
            throw new Error(result.message || "Failed to send message");
        } catch (error) {
            // Tampilkan pesan error
            loadingMessage.style.display = "none";
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    }
  });
