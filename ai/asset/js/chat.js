document.addEventListener("DOMContentLoaded", function () {
  const aiUserInput = document.getElementById("user-input");
  const aiSendMessage = document.getElementById("send-message");
  const aiChatMessages = document.getElementById("chat-messages");

  // Disable tombol send message saat halaman load
  aiSendMessage.disabled = true;

  // Fungsi untuk ngecek status tombol send
  function toggleSendButton() {
    aiSendMessage.disabled = aiUserInput.value.trim() === ""; // Disable jika input kosong
    aiSendMessage.style.backgroundColor = aiSendMessage.disabled ? "grey" : ""; // Ganti warna tombol
  }

  // Panggil fungsi untuk set status tombol saat load
  toggleSendButton();

  // Tambahkan event listener untuk input
  aiUserInput.addEventListener("input", toggleSendButton);

  aiUserInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !aiSendMessage.disabled) {
      // Cek apakah tombol Enter ditekan
      event.preventDefault(); // Mencegah tindakan default (seperti baris baru)
      aiSendMessage.click(); // Simulasikan klik pada tombol kirim
    }
  });

  aiSendMessage.addEventListener("click", function () {
    const message = aiUserInput.value.trim(); // Ambil value input

    // Cek apakah pesan kosong
    if (message === "") {
      this.disabled = false; // Aktifkan tombol kembali jika pesan kosong
      return; // Keluar dari fungsi jika pesan kosong
    }

    // Kosongkan input setelah mengirim
    aiUserInput.value = "";

    //this.querySelector("i").style.display = "none"; // Sembunyikan icon
    this.disabled = true; // Nonaktifkan tombol kirim
    this.style.backgroundColor = "grey"; // Ganti warna tombol jadi abu-abu

    sendChatMessage(message)
      .then(() => {
        this.querySelector("i").style.display = "block"; // Tampilkan icon
        this.style.backgroundColor = ""; // Kembali ke warna default
      })
      .catch((error) => {
        console.error("Error:", error);
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

    // Nonaktifkan tombol kirim saat mengetik
    aiSendMessage.disabled = true;
    aiSendMessage.style.backgroundColor = "grey"; // Ganti warna tombol jadi abu-abu

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
        setTimeout(type, 50); // Speed typing
      } else {
        aiSendMessage.querySelector("i").style.display = "block"; // Tampilkan icon
        aiSendMessage.disabled = aiUserInput.value.trim() === ""; // Nonaktifkan jika input kosong
        aiSendMessage.style.backgroundColor = aiSendMessage.disabled
          ? "grey"
          : ""; // Ganti warna tombol

        // Tampilkan ikon dengan warna normal
        aiSendMessage.querySelector("i").style.color = aiSendMessage.disabled
          ? "rgba(255, 255, 255, 0.5)"
          : "white";
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
