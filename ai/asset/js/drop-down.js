// Ambil elemen dropdown dan tombol
const dropdown = document.querySelector(".dropdown");
const dropbtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");

// Tambahkan event listener untuk klik pada tombol dropdown
dropbtn.addEventListener("click", () => {
  // Toggle class 'show' untuk menampilkan/menyembunyikan dropdown
  dropdownContent.classList.toggle("show");
});

// Tutup dropdown jika klik di luar dropdown
window.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    dropdownContent.classList.remove("show");
  }
});

// Ambil semua item dropdown
const dropdownItems = document.querySelectorAll(".dropdown-item");
const selectedItem = document.getElementById("selected-item");

// Tambahkan event listener untuk setiap item
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault(); // Menghindari refresh halaman
    selectedItem.textContent = this.dataset.value; // Update teks dengan value yang dipilih
  });
});
