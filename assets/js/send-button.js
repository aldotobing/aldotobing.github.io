// Contoh menggunakan jQuery untuk menambah interaktivitas
$(document).ready(function () {
  $("#sendButton").on("click", function () {
    // Tampilkan animasi dan status pengiriman
    $(this).addClass("sending");
    $("#sendingStatus").text("Mengirim...").fadeIn();

    // Simulasi waktu pengiriman (ganti dengan proses pengiriman sebenarnya)
    setTimeout(function () {
      // Setelah pengiriman selesai
      $("#sendButton").removeClass("sending");
      $("#sendingStatus").text("Terkirim!").delay(2000).fadeOut();
    }, 2000); // Waktu simulasi pengiriman dalam milidetik
  });
});
