document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatClose = document.getElementById("chat-close");
  const userInput = document.getElementById("user-input");
  const sendMessage = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");

  sendMessage.disabled = true;

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

    // addMessage(
    // 'The AI has been moved to: <a href="https://kapal-lawd-ai.pages.dev" target="_blank" rel="noopener noreferrer">https://kapal-lawd-ai.pages.dev</a>',
    // "bot-message"
    //   );
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

  // Tambahkan event listener untuk memantau perubahan nilai input
  userInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      // Enable tombol send jika input tidak kosong
      sendMessage.disabled = false;
    } else {
      // Disable tombol send jika input kosong
      sendMessage.disabled = true;
    }
  });

  sendMessage.addEventListener("click", function () {
    // Disable tombol dan tambahkan spinner/loading
    this.disabled = true;
    this.classList.add("sending");

    const message = userInput.value.trim();
    userInput.value = ""; // Reset input biar kosong

    sendChatMessage(message)
      .then(() => {
        // Pastikan class 'sending' ada sebelum di-remove
        if (this.classList.contains("sending")) {
          this.classList.remove("sending");
        }

        // Kembali cek kalau input kosong, disable lagi tombolnya
        if (userInput.value.trim() === "") {
          sendMessage.disabled = true;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error dan aktifkan tombol kembali
        if (this.classList.contains("sending")) {
          //this.classList.remove("sending");
        }
        this.disabled = false;

        addMessage(
          "Sorry, there was an error processing your request.",
          "bot-message"
        );
      });
  });

  // async function sendChatMessage(userInput) {
  //   const userId = localStorage.getItem("user_id") || generateUniqueId();

  //   addMessage(userInput, "user-message");

  //   try {
  //     const response = await fetch("https://ai.aldo-tobing.workers.dev/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         user_id: userId,
  //         messages: [{ role: "user", content: userInput }],
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Network response was not ok: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     const result = data?.content || "The AI has been moved to: https://kapal-lawd-ai.pages.dev";

  //     const htmlResult = convertMarkdownToHtml(result);
  //     await typeWriterEffect(htmlResult, () => {
  //       //console.log("Done");
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     addMessage(
  //       "Sorry, there was an error processing your request.",
  //       "bot-message"
  //     );
  //   }
  // }

  async function sendChatMessage(userInput) {
  const userId = localStorage.getItem("user_id") || generateUniqueId();

  addMessage(userInput, "user-message");

  // Static bot response with a link
  const staticResponse = 'The AI has been moved to: <a href="https://kapal-lawd-ai.pages.dev" target="_blank" rel="noopener noreferrer">https://kapal-lawd-ai.pages.dev</a>';
  
  // Use the typing effect with the static response
  await typeWriterEffect(staticResponse, () => {
    // Callback after typing effect is complete
    sendMessage.disabled = false; // Re-enable the send button
  });
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
        } else if (node.nodeName === "PRE" && node.querySelector("code")) {
          const codeBlock = node.cloneNode(true);
          messageElement.appendChild(codeBlock);
          nodeIndex++;
          setTimeout(() => {
            hljs.highlightElement(codeBlock.querySelector("code"));
          }, 0);
        } else {
          messageElement.appendChild(node.cloneNode(true));
          nodeIndex++;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(type, 25); // Speed typing
      } else {
        if (callback) callback();
      }
    }

    type();

    return new Promise((resolve) => {
      const originalCallback = callback;
      callback = () => {
        if (originalCallback) originalCallback();
        resolve();

        // Cek kembali input kosong atau tidak
        if (userInput.value.trim() === "") {
          sendMessage.disabled = true;
        }
      };
    });
  }

  function convertMarkdownToHtml(text) {
    // Convert code blocks (surrounded by ```)
    text = text.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      function (match, language, code) {
        // Hapus whitespace di awal dan akhir, tapi pertahankan indentasi relatif
        const lines = code.split("\n");
        const minIndent = lines.reduce((min, line) => {
          const indent = line.match(/^\s*/)[0].length;
          return line.trim().length > 0 ? Math.min(min, indent) : min;
        }, Infinity);

        const formattedCode = lines
          .map((line) => line.slice(minIndent))
          .join("\n")
          .trim()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        return `<pre class="code-block-wrapper"><code class="code-block language-${
          language || "plaintext"
        }">${formattedCode}</code></pre>`;
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
