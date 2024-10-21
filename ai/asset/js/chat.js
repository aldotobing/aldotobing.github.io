document.addEventListener("DOMContentLoaded", function () {
  const aiChatContainer = document.getElementById("chat-container");
  const chatToggle = document.getElementById("chat-toggle"); // Pastikan ada elemen ini di HTML
  const aiUserInput = document.getElementById("user-input");
  const aiSendMessage = document.getElementById("send-message");
  const spinner = document.getElementById("spinner");
  const aiChatMessages = document.getElementById("chat-messages");

  aiSendMessage.disabled = true;

  document.addEventListener("click", (event) => {
    if (
      !aiChatContainer.contains(event.target) &&
      !chatToggle.contains(event.target)
    ) {
      aiChatContainer.style.display = "none";
      chatToggle.style.display = "flex";
    }
  });

  aiUserInput.addEventListener("input", function () {
    aiSendMessage.disabled = this.value.trim() === "";
  });

  aiSendMessage.addEventListener("click", function () {
    // Disable tombol, sembunyikan icon dan tampilkan spinner
    this.disabled = true;
    this.querySelector("i").style.display = "none"; // Sembunyikan icon
    spinner.style.display = "block"; // Tampilkan spinner

    const message = aiUserInput.value.trim();
    aiUserInput.value = ""; // Reset input

    // Menghilangkan focus dari input saat mengirim
    aiUserInput.blur();

    sendChatMessage(message)
      .then(() => {
        // Kembali tampilkan icon dan sembunyikan spinner
        this.querySelector("i").style.display = "block"; // Tampilkan icon
        spinner.style.display = "none"; // Sembunyikan spinner
        this.disabled = false; // Aktifkan tombol kembali
      })
      .catch((error) => {
        console.error("Error:", error);
        this.disabled = false; // Aktifkan tombol kembali
        spinner.style.display = "none"; // Sembunyikan spinner
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

      await typeWriterEffect(htmlResult); // Tunggu sampai typeWriterEffect selesai
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

  aiUserInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      aiSendMessage.click(); // Memanggil event click pada button
    }
  });

  function addMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    messageElement.innerHTML = text;
    aiChatMessages.appendChild(messageElement);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  async function typeWriterEffect(html) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "bot-message");
    aiChatMessages.appendChild(messageElement);

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
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        setTimeout(type, 25); // Speed typing
      } else {
        // Proses selesai, tampilkan icon dan sembunyikan spinner
        aiSendMessage.querySelector("i").style.display = "block"; // Tampilkan icon
        spinner.style.display = "none"; // Sembunyikan spinner
        aiSendMessage.disabled = false; // Aktifkan tombol kembali
      }
    }

    type();
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
});
