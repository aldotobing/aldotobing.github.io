// 2021-01-14
// GenerateQRCodeWeb
// https://github.com/BaseMax/GenerateQRCodeWeb

// Elements
const qrdata_elm = document.querySelector("#qr-data");
const qrcode_elm = document.querySelector("#qr-code");

// QRCode
// const qrcode = new QRCode(qrcode_elm);
// // QR-Code generator
// const generateQrCode = (value) => {
//   qrcode.makeCode(value);
// };

// Events
qrdata_elm.addEventListener("change", () => {
  generateQrCode(qrdata_elm.value);
});
qrdata_elm.addEventListener("input", () => {
  generateQrCode(qrdata_elm.value);
});

// Get the elements
const qrData = document.getElementById("qr-data");
const qrCode = document.getElementById("qr-code");
const saveBtn = document.getElementById("save-btn");

// Create a new QRCode object
const qrcode = new QRCode(qrCode, {
  text: "",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

// Add an event listener to the input element
qrData.addEventListener("input", () => {
  // Clear the previous QR code
  qrcode.clear();
  // Show a loading message
  qrCode.innerHTML = "Generating QR...";
  // Set a timeout to simulate some delay
  setTimeout(() => {
    // Generate a new QR code with the input value
    qrcode.makeCode(qrData.value);
  }, 1000);
});

// Add an event listener to the save button
saveBtn.addEventListener("click", () => {
  // Get the canvas element inside the QR code element
  const canvas = qrCode.querySelector("canvas");
  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL("image/png");
  // Create a link element
  const link = document.createElement("a");
  // Set the link attributes
  link.href = dataURL;
  link.download = "qr-code.png";
  // Append the link to the body
  document.body.appendChild(link);
  // Click the link
  link.click();
  // Remove the link from the body
  document.body.removeChild(link);
});
