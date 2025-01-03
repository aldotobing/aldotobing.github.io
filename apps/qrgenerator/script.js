// Elements
const qrdata_elm = document.querySelector("#qr-data");
const qrcode_elm = document.querySelector("#qr-code");
const downloadBtn = document.querySelector("#download-btn");
const styleButtons = document.querySelectorAll(".style-btn");

// Initialize QRCode
let qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  data: "", // Initial data (empty)
  image: "", // Optional: Add a logo in the center
  dotsOptions: {
    color: "#000000", // Default color
    type: "square", // Default shape
  },
  backgroundOptions: {
    color: "#ffffff", // Background color
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10, // Margin around the image
  },
});

// Append QR code to the container
qrCode.append(qrcode_elm);

// QR-Code generator
const generateQrCode = (value) => {
  if (!value) {
    qrcode_elm.innerHTML = ""; // Clear the QR code
    downloadBtn.disabled = true; // Disable download button
    return;
  }

  // Show loading message
  qrcode_elm.innerHTML = "<div class='loading'>Generating QR code...</div>";

  // Update QR code data
  qrCode.update({
    data: value,
  });

  // Remove loading message and enable download button
  setTimeout(() => {
    qrcode_elm.querySelector(".loading")?.remove();
    downloadBtn.disabled = false; // Enable download button
  }, 500);
};

// Change QR code style
styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    styleButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to the clicked button
    button.classList.add("active");

    // Update QR code style based on the selected button
    switch (button.id) {
      case "style-default":
        qrCode.update({
          dotsOptions: {
            color: "#000000", // Solid black color
            type: "square", // Square dots
          },
        });
        break;
      case "style-rounded":
        qrCode.update({
          dotsOptions: {
            color: "#000000", // Solid black color
            type: "rounded", // Rounded dots
          },
        });
        break;
      case "style-gradient":
        qrCode.update({
          dotsOptions: {
            gradient: {
              type: "linear", // Linear gradient
              rotation: 45, // Gradient rotation angle
              colorStops: [
                { offset: 0, color: "#6a11cb" }, // Start color
                { offset: 1, color: "#2575fc" }, // End color
              ],
            },
            type: "square", // Square dots
          },
        });
        break;
    }
  });
});

// Download QR Code
downloadBtn.addEventListener("click", () => {
  const inputValue = qrdata_elm.value.trim(); // Get the input value
  let fileName = "qrcode"; // Default base name

  // Use the input value as part of the file name (if available)
  if (inputValue) {
    // Sanitize the input value to make it a valid file name
    const sanitizedValue = inputValue
      .replace(/[^a-zA-Z0-9]/g, "-") // Replace special characters with hyphens
      .toLowerCase() // Convert to lowercase
      .substring(0, 50); // Limit the length to 50 characters

    // Append the sanitized value to the base name
    fileName = `qrcode-${sanitizedValue}`;
  }

  // Download the QR code with the custom file name
  qrCode.download({ name: fileName, extension: "png" });
});

// Events
qrdata_elm.addEventListener("input", () => {
  generateQrCode(qrdata_elm.value);
});
