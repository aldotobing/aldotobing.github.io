function generateQRCode(data) {
  var loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "block";
  loadingMessage.innerHTML = "Generating QR...";
  var qrcode = new QRCode("qrcode", {
    text: data,
    width: 200,
    height: 200,
  });
  setTimeout(function () {
    loadingMessage.style.display = "none";
    qrcode.show();
  }, 1000);
}

function smoothLoading() {
  var input = document.getElementById("qr-data");
  input.addEventListener("input", function () {
    var data = input.value;
    generateQRCode(data);
  });
}

smoothLoading();
