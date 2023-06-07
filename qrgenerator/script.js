// Get the input element and the qr-code element
var input = document.getElementById("qr-data");
var qrCode = document.getElementById("qr-code");

// Create a new QRCode object
var qrcode = new QRCode(qrCode, {
  text: "",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

// Add an event listener to the input element
input.addEventListener("input", function () {
  // Get the input value
  var data = input.value;

  // Clear the qr-code element
  qrCode.innerHTML = "";

  // Create a loading message
  var loading = document.createElement("p");
  loading.textContent = "Generating QR code...";
  loading.style.textAlign = "center";
  loading.style.color = "gray";

  // Append the loading message to the qr-code element
  qrCode.appendChild(loading);

  // Set a timeout of 1 second
  setTimeout(function () {
    // Remove the loading message
    qrCode.querySelector("qr-code").removeChild(loading);

    // Generate the QR code with the input value
    qrcode.makeCode(data);

    // Create a save image button
    // var saveButton = document.createElement("button");
    // saveButton.textContent = "Save image";
    // saveButton.style.display = "block";
    // saveButton.style.margin = "10px auto";

    // Add an event listener to the save button
    saveButton.addEventListener("click", function () {
      // Get the canvas element inside the qr-code element
      var canvas = qrCode.querySelector("canvas");

      // Get the canvas data as an image URL
      var imageURL = canvas.toDataURL("image/png");

      // Create a link element with the image URL as the href attribute
      var link = document.createElement("a");
      link.href = imageURL;

      // Set the download attribute to the file name
      link.download = "qr-code.png";

      // Append the link to the document body
      document.body.appendChild(link);

      // Click the link to download the image
      link.click();

      // Remove the link from the document body
      document.body.removeChild(link);
    });

    // Append the save button to the qr-code element
    qrCode.appendChild(saveButton);
  }, 100);
});
