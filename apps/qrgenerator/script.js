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
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    qrcode_elm.innerHTML = ""; // Clear the QR code
    qrCode.update({
      data: "", // Set empty data
    });
    return;
  }

  // Show loading message
  qrcode_elm.innerHTML = "<div class='loading'>Generating QR code...</div>";

  // Update QR code data
  qrCode.update({
    data: trimmedValue,
  });

  // Remove loading message
  setTimeout(() => {
    qrcode_elm.querySelector(".loading")?.remove();
  }, 500);
};

// Change QR code style
styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    styleButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to the clicked button
    button.classList.add("active");

    // Base options that reset any previous gradient
    const baseOptions = {
      dotsOptions: {
        color: "#000000",
        type: "square",
        gradient: null, // This explicitly removes any gradient
      },
    };

    // Update QR code style based on the selected button
    switch (button.id) {
      case "style-default":
        qrCode.update(baseOptions);
        break;
      case "style-rounded":
        qrCode.update({
          ...baseOptions,
          dotsOptions: {
            ...baseOptions.dotsOptions,
            type: "rounded",
          },
        });
        break;
      case "style-gradient":
        qrCode.update({
          dotsOptions: {
            type: "square",
            gradient: {
              type: "linear",
              rotation: 45,
              colorStops: [
                { offset: 0, color: "#6a11cb" },
                { offset: 1, color: "#2575fc" },
              ],
            },
          },
        });
        break;
    }
  });
});

// Download QR Code
downloadBtn.addEventListener("click", () => {
  const inputValue = qrdata_elm.value.trim(); // Get the input value

  // Prevent download if input is empty
  if (!inputValue) {
    downloadBtn.disabled = true;
    return;
  }

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

// Events - Update input event listener to handle all input cases
qrdata_elm.addEventListener("input", (e) => {
  const value = e.target.value.trim(); // Trim the input value
  generateQrCode(value); // Generate or clear QR code based on input
  downloadBtn.disabled = value === ""; // Correctly set the disabled state
});

// Update the focus/blur events to handle button state
qrdata_elm.addEventListener("blur", (e) => {
  const value = e.target.value.trim();
  downloadBtn.disabled = value === ""; // Disable the button if input is empty
});

// Remove the duplicate generateQRCode function and update style button handlers
styleButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Remove active class from all buttons
    styleButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    this.classList.add("active");

    // Generate QR code with current input value
    const text = qrdata_elm.value;
    if (text) {
      generateQrCode(text);
    }
  });
});
