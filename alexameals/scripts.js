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
  document.getElementById("breakfast").innerText = randomMeal("breakfast");
  document.getElementById("lunch").innerText = randomMeal("lunch");
  document.getElementById("dinner").innerText = randomMeal("dinner");
}

document.getElementById("randomize").addEventListener("click", updateMeals);

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
