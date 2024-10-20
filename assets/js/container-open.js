document.addEventListener("DOMContentLoaded", function () {
  var toggleButton = document.getElementById("chat-toggle");
  var closeButton = document.getElementById("chat-close");
  var chatContainer = document.getElementById("chat-container");

  if (toggleButton && chatContainer) {
    toggleButton.addEventListener("click", function () {
      chatContainer.classList.toggle("active");
      chatContainer.classList.toggle("open");
    });
  } else {
    console.error(
      "Could not find one of the required elements for the chat toggle."
    );
  }

  if (closeButton && chatContainer) {
    closeButton.addEventListener("click", function () {
      chatContainer.classList.remove("open");
      setTimeout(function () {
        chatContainer.classList.remove("active");
      }, 500);
    });
  } else {
    console.error(
      "Could not find one of the required elements for the chat close."
    );
  }
});
