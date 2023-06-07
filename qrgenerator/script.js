// Elements
const qrdata_elm = document.querySelector("#qr-data");
const qrcode_elm = document.querySelector("#qr-code");

// QRCode
const qrcode = new QRCode(qrcode_elm);
// QR-Code generator
const generateQrCode = (value) => {
  // Show loading message
  const loadingMessage = document.createElement("div");
  loadingMessage.textContent = "Generating QR code...";
  document.body.appendChild(loadingMessage);

  // Generate QR code
  qrcode.makeCode(value);

  // Remove loading message
  loadingMessage.remove();
};

// Events
qrdata_elm.addEventListener("change", () => {
  generateQrCode(qrdata_elm.value);
});
qrdata_elm.addEventListener("input", () => {
  generateQrCode(qrdata_elm.value);
});
