document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatClose = document.getElementById("chat-close");
  const userInput = document.getElementById("user-input");
  const sendMessage = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");

  chatToggle.addEventListener("click", () => {
    chatContainer.classList.toggle("active");
    // Tambahin efek bubble
    chatToggle.classList.add("bubble");
    // Hapus class setelah animasi selesai (0.5s)
    setTimeout(() => {
      chatToggle.classList.remove("bubble");
    }, 500);
  });

  chatClose.addEventListener("click", () => {
    chatContainer.classList.remove("active");
  });

  async function sendChatMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput) {
      addMessage(userInput, "user-message");
      document.getElementById("user-input").value = "";

      try {
        const response = await fetch("https://ai.aldo-tobing.workers.dev/", {
          // Replace with your actual Cloudflare Worker URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are a be a helpful and friendly virtual assistant, \
                  created by Aldo Tobing. \
                  You will act like a customer cares level emotions, \
                  showing empathy, patience, \
                  and attentiveness while assisting users in a warm and supportive manner.",
              },
              { role: "user", content: userInput },
            ],
          }),
        });

        console.log("Response status:", response.status); // Debugging

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data); // Debugging

        // Extract joke response from backend
        const prompt = data[1]?.response?.response || "No joke found!";
        typeWriterEffect(prompt); // Call typing effect
      } catch (error) {
        console.error("Error:", error);
        addMessage(
          "Sorry, there was an error processing your request.",
          "bot-message"
        );
      }
    }
  }

  document
    .getElementById("send-message")
    .addEventListener("click", sendChatMessage);
  document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChatMessage();
    }
  });

  function addMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Typing effect function
  function typeWriterEffect(text) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "bot-message");
    chatMessages.appendChild(messageElement);
    let index = 0;
    function type() {
      if (index < text.length) {
        messageElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 50); // Typing speed, can be adjusted
      } else {
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
      }
    }
    type(); // Start typing effect
  }
});
