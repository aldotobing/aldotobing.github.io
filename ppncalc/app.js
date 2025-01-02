document.addEventListener("DOMContentLoaded", function () {
  const taxForm = document.getElementById("taxForm");
  const priceInput = document.getElementById("price");
  const dateInput = document.getElementById("date");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

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

  taxForm.addEventListener("submit", function (event) {
    event.preventDefault();
    errorDiv.textContent = "";

    const price = parseFloat(priceInput.value);
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

  priceInput.addEventListener("input", function () {
    if (this.value < 0) this.value = 0;
  });
});
