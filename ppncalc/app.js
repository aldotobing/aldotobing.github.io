document.getElementById("calculate").addEventListener("click", () => {
  const price = parseFloat(document.getElementById("price").value);
  const basicType = document.getElementById("basicType").value;
  const itemType = document.getElementById("itemType").value;
  const transactionDate = new Date(
    document.getElementById("transactionDate").value
  );

  // Calculate base price
  const basePrice =
    itemType === "LUXURY" && transactionDate >= new Date(2025, 1, 1)
      ? price
      : (11 / 12) * price;

  // Get tax rate
  const taxRate = basicType === "BASIC" ? 0 : 0.12;

  // Calculate PPN
  const ppn = taxRate * basePrice;

  // Display result
  document.getElementById("result").innerText = `PPN: IDR ${ppn.toFixed(2)}`;
});
