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
    chatToggle.classList.add("bubble");
    setTimeout(() => {
      chatToggle.classList.remove("bubble");
    }, 500);
  });

  chatToggle.addEventListener("click", () => {
    chatContainer.style.display = "flex";
    chatToggle.style.display = "none";
  });

  document.addEventListener("click", (event) => {
    if (
      !chatContainer.contains(event.target) &&
      !chatToggle.contains(event.target)
    ) {
      chatContainer.style.display = "none";
      chatToggle.style.display = "flex";
    }
  });

  chatClose.addEventListener("click", () => {
    chatContainer.style.display = "none";
    chatToggle.style.display = "flex";
  });

  sendMessage.addEventListener("click", function () {
    // Disable button dan tambahkan class sending
    this.disabled = true; // Nonaktifkan tombol
    this.classList.add("sending"); // Tampilkan spinner

    // Ambil value dari userInput
    const message = userInput.value;

    // Simulasi pengiriman pesan (ganti dengan fungsi chat asli)
    sendChatMessage(message)
      .then(() => {
        // Reset input dan enable button setelah chat terkirim
        userInput.value = ""; // Kosongkan input
        this.disabled = false; // Enable button
        this.classList.remove("sending"); // Hapus class sending
      })
      .catch((error) => {
        console.error("Error:", error);
        this.disabled = false; // Enable button jika ada error33
        this.classList.remove("sending"); // Hapus class sending jika error
        addMessage(
          "Sorry, there was an error processing your request.",
          "bot-message"
        );
      });
  });

  async function sendChatMessage(userInput) {
    const userId = localStorage.getItem("user_id") || generateUniqueId();

    addMessage(userInput, "user-message");

    try {
      const response = await fetch("https://ai.aldo-tobing.workers.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          messages: [{ role: "user", content: userInput }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      const result = data?.content || "No response found!";

      const htmlResult = convertMarkdownToHtml(result);
      typeWriterEffect(htmlResult);
    } catch (error) {
      console.error("Error:", error);
      addMessage(
        "Sorry, there was an error processing your request.",
        "bot-message"
      );
    }
  }

  function generateUniqueId() {
    const id = `user-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("user_id", id);
    return id;
  }

  document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage.click(); // Memanggil event click pada button
    }
  });

  function addMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    messageElement.innerHTML = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function typeWriterEffect(html, callback) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "bot-message");
    chatMessages.appendChild(messageElement);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const nodes = Array.from(tempDiv.childNodes);

    let nodeIndex = 0;
    let charIndex = 0;

    function type() {
      if (nodeIndex < nodes.length) {
        const node = nodes[nodeIndex];
        if (node.nodeType === Node.TEXT_NODE) {
          if (charIndex < node.length) {
            messageElement.innerHTML += node.textContent[charIndex];
            charIndex++;
          } else {
            nodeIndex++;
            charIndex = 0;
          }
        } else {
          messageElement.appendChild(node.cloneNode(true));
          nodeIndex++;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(type, 25); // Adjust typing speed here
      } else {
        applyCodeHighlight(); // Terapkan highlight setelah selesai mengetik
        if (callback) callback(); // Panggil callback setelah selesai
      }
    }
    type();
  }

  function convertMarkdownToHtml(text) {
    // Convert code blocks (surrounded by ```)
    text = text.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      function (match, language, code) {
        return `<pre><code class="language-${
          language || "plaintext"
        }">${escapeHtml(code.trim())}</code></pre>`;
      }
    );

    // Convert inline code (surrounded by `)
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Convert bold text (surrounded by **)
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert italic text (surrounded by single *)
    text = text.replace(/\*([^\*]+)\*/g, "<em>$1</em>");

    // Convert bullet points
    text = text.replace(/^- (.+)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

    // Convert numbered lists
    text = text.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>\n?)+/g, "<ol>$&</ol>");

    // Convert headers
    text = text.replace(/^# (.*$)/gm, "<h1>$1</h1>");
    text = text.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    text = text.replace(/^### (.*$)/gm, "<h3>$1</h3>");

    // Convert links
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

    // Convert newlines to <br> tags (but not inside code blocks)
    text = text.replace(/\n(?!<\/(code|pre)>)/g, "<br>");

    return text;
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Fungsi untuk menerapkan highlight syntax pada blok kode
  function applyCodeHighlight() {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
});
