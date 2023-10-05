const meals = {
  breakfast: [
    "Bubur Ayam",
    "Serabi",
    "Lontong Sayur",
    "Nasi Uduk",
    "Pisang Goreng",
    "Kue Lapis",
    "Roti Bakar",
    "Mie Goreng",
    "Ketoprak",
    "Kue Cucur",
    "Soto Ayam",
    "Kue Dadar",
    "Nasi Goreng",
    "Tape Ketan",
    "Omelet",
    "Jajan Pasar",
    "Sayur Lodeh",
    "Tahu Gejrot",
    "Sate Ayam",
    "Nasi Bakar",
  ],
  lunch: [
    "Nasi Campur",
    "Soto Ayam",
    "Bakso",
    "Nasi Padang",
    "Mie Ayam",
    "Gado-Gado",
    "Nasi Kuning",
    "Pecel Lele",
    "Rawon",
    "Laksa",
    "Nasi Pecel",
    "Bebek Goreng",
    "Rujak Cingur",
    "Sate Ayam",
    "Tahu Tek",
    "Soto Betawi",
    "Nasi Goreng",
    "Sate Kambing",
    "Nasi Goreng Kambing",
    "Ayam Bakar",
    "Ikan Bakar",
    "Gudeg",
    "Opor Ayam",
    "Rendang",
    "Soto Betawi",
    "Sayur Asem",
    "Sayur Lodeh",
    "Karedok",
    "Ketoprak",
    "Tape Ketan",
    "Omelet",
    "Jajan Pasar",
    "Tahu Gejrot",
    "Sate Ayam",
    "Nasi Bakar",
  ],
  dinner: [
    "Ayam Bakar",
    "Rendang",
    "Ikan Pepes",
    "Nasi Goreng",
    "Soto Betawi",
    "Kare Ayam",
    "Sate Kambing",
    "Ayam Penyet",
    "Babi Panggang Bali",
    "Mie Bakso",
    "Sate Padang",
    "Coto Makassar",
    "Sate Lilit",
    "Babi Guling",
    "Nasi Padang",
    "Tongseng",
    "Mi Gacoan",
    "Mc D",
  ],
};

function randomMeal(type) {
  const choices = meals[type];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function updateMeals() {
  // Get the meal elements
  const breakfastEl = document.getElementById("breakfast");
  const lunchEl = document.getElementById("lunch");
  const dinnerEl = document.getElementById("dinner");

  // Reset animations
  breakfastEl.style.animation = "none";
  lunchEl.style.animation = "none";
  dinnerEl.style.animation = "none";

  // Force a reflow, flushing the CSS changes
  void breakfastEl.offsetWidth;
  void lunchEl.offsetWidth;
  void dinnerEl.offsetWidth;

  // Re-apply the animation
  breakfastEl.style.animation = "";
  lunchEl.style.animation = "";
  dinnerEl.style.animation = "";

  // Update the meals
  breakfastEl.innerText = randomMeal("breakfast");
  lunchEl.innerText = randomMeal("lunch");
  dinnerEl.innerText = randomMeal("dinner");
}

document.getElementById("randomize").addEventListener("click", updateMeals);

// Function to trigger the animation
function triggerAnimation() {
  refreshButton.classList.add("demanding-click");
  setTimeout(() => {
    refreshButton.classList.remove("demanding-click");
  }, 5000); // The animation will last for 5 seconds because of the 'infinite' keyword in the CSS
}

// Apply the animation every 5 seconds
setInterval(triggerAnimation, 5000);

// Initialize meals on page load
updateMeals();

function setClock() {
  const localTime = new Date();

  const seconds = localTime.getSeconds();
  const minutes = localTime.getMinutes();
  const hours = localTime.getHours();

  const secondHandRotation = 6 * seconds;
  const minuteHandRotation = 6 * (minutes + seconds / 60);
  const hourHandRotation = 30 * ((hours % 12) + minutes / 60);

  document.querySelector(
    ".second-hand"
  ).style.transform = `rotate(${secondHandRotation}deg)`;
  document.querySelector(
    ".minute-hand"
  ).style.transform = `rotate(${minuteHandRotation}deg)`;
  document.querySelector(
    ".hour-hand"
  ).style.transform = `rotate(${hourHandRotation}deg)`;
}

setInterval(setClock, 1000);
setClock();
