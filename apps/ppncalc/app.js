document.addEventListener("DOMContentLoaded", function () {
  const taxForm = document.getElementById("taxForm");
  const priceInput = document.getElementById("price");
  const dateInput = document.getElementById("date");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

  // Formatting input for "Price (IDR)"
  document.getElementById("formattedPrice").addEventListener("input", (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    const formattedValue = new Intl.NumberFormat("id-ID").format(rawValue); // Format as IDR
    e.target.value = formattedValue;

    // Update the hidden input with the raw value
    document.getElementById("price").value = rawValue;
  });

  // Initialize Flatpickr with Indonesian locale
  const fp = flatpickr("#date", {
    dateFormat: "d/m/Y",
    locale: "id",
    disableMobile: "true", // Prevents mobile devices from using native date picker
    defaultDate: "today",
    animate: true,
    position: "auto",
    monthSelectorType: "static",
    onChange: function (selectedDates, dateStr) {
      dateInput.dispatchEvent(new Event("change"));
    },
  });

  // Simulate Enum for BasicType
  const BasicType = {
    BASIC: "BASIC",
    NON_BASIC: "NON_BASIC",
  };

  // Simulate Enum for ItemType
  const ItemType = {
    LUXURY: "LUXURY",
    NON_LUXURY: "NON_LUXURY",
  };

  // Function to get tax rate based on basic type
  function getTaxRate(basicType) {
    return basicType === BasicType.BASIC ? 0.0 : 0.12;
  }

  // Function to calculate base price
  function calculateBase(price, itemType, transactionDate) {
    const thresholdDate = new Date(2025, 1, 1); // February 1, 2025
    if (itemType === ItemType.LUXURY && transactionDate >= thresholdDate) {
      return price;
    }
    return (11 / 12) * price;
  }

  // Function to calculate PPN
  function calculatePPN(price, basicType, itemType, transactionDate) {
    const base = calculateBase(price, itemType, transactionDate);
    const rate = getTaxRate(basicType);
    return rate * base;
  }

  // Function to format currency with floating-point precision
  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }

  // Function to format input value with thousand separators
  function formatNumberInput(input) {
    let value = input.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    if (value === "") {
      input.value = "";
      return;
    }
    let number = parseFloat(value);
    input.value = number.toLocaleString("id-ID"); // Format with thousand separators
  }

  // Event listener for input formatting
  priceInput.addEventListener("input", function () {
    formatNumberInput(this);
  });

  // Event listener for form submission
  taxForm.addEventListener("submit", function (event) {
    event.preventDefault();
    errorDiv.textContent = "";

    // Remove thousand separators and parse the value as a float
    const price = parseFloat(priceInput.value.replace(/\./g, ""));
    if (isNaN(price) || price <= 0) {
      errorDiv.textContent = "Mohon masukkan harga yang valid";
      return;
    }

    const basicType = document.querySelector(
      'input[name="basicType"]:checked'
    ).value;
    const itemType = document.querySelector(
      'input[name="itemType"]:checked'
    ).value;
    const transactionDate = fp.selectedDates[0];

    const ppn = calculatePPN(price, basicType, itemType, transactionDate);
    resultDiv.textContent = `Pajak: ${formatRupiah(ppn)}`;
  });

  // Prevent non-numeric input
  priceInput.addEventListener("keypress", function (event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  });

  // Ensure the value is not negative
  priceInput.addEventListener("input", function () {
    if (this.value < 0) this.value = 0;
  });
});
