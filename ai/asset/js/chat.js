document.addEventListener("DOMContentLoaded", function () {
  const aiUserInput = document.getElementById("user-input");
  const aiSendMessage = document.getElementById("send-message");
  const aiChatMessages = document.getElementById("chat-messages");

  // Disable tombol send message saat halaman load
  aiSendMessage.disabled = true;

  // Menentukan teks yang akan ditampilkan
  const titleText = document.getElementById("title-text");
  const fullTitle = "Kapal Lawd GPT"; // Teks lengkap

  // Fungsi untuk menampilkan teks dengan animasi typing
  function typeWriter(text, i) {
    if (i < text.length) {
      titleText.innerHTML += text.charAt(i);
      setTimeout(() => typeWriter(text, i + 1), 100); // Kecepatan ketik
    }
  }

  // Memulai animasi typing saat halaman di-load
  window.onload = () => {
    titleText.innerHTML = ""; // Bersihkan teks saat mulai
    typeWriter(fullTitle, 0); // Mulai mengetik dari index 0
  };

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

    const loadingMessage = addLoadingIndicator();

    try {
      let endpointUrl;
      let requestBody;

      if (currentMode === "text") {
        endpointUrl = "https://ai.aldo-tobing.workers.dev/";
        requestBody = {
          user_id: userId,
          messages: [{ role: "user", content: userInput }],
        };
      } else if (currentMode === "image") {
        endpointUrl = "https://image-gen.aldo-tobing.workers.dev/";
        requestBody = { prompt: userInput };
      }

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      loadingMessage.remove(); // Hapus loading indikator

      if (!response.ok) {
        // Custom error handling biar nggak langsung ke console
        console.warn("Server returned an error:", response.status);
        throw new Error("Gagal terhubung ke server, coba lagi nanti.");
      }

      if (currentMode === "text") {
        const data = await response.json();
        const result = data?.content || "No response found!";
        const htmlResult = convertMarkdownToHtml(result);
        await typeWriterEffect(htmlResult);
      } else if (currentMode === "image") {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        addImageMessage(imageUrl);
      }
    } catch (error) {
      loadingMessage.remove(); // Pastikan loading indicator dihapus
      console.warn("Handled error:", error.message); // Console silent warning

      // Tambahkan pesan error ke UI, bukan console
      addMessage(
        "Maaf, ada masalah saat memproses permintaan lo. Coba lagi nanti ya!",
        "bot-message"
      );
    }
  }

  function addImageMessage(imageUrl) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "bot-message");
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = "Generated Image"; // Deskripsi untuk gambar
    imgElement.style.maxWidth = "100%"; // Responsif
    messageElement.appendChild(imgElement);
    aiChatMessages.appendChild(messageElement);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function generateUniqueId() {
    const id = `user-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("user_id", id);
    return id;
  }

  function addMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);

    // Create an image element for the bot icon
    if (className === "bot-message") {
      const botIcon = document.createElement("img");
      botIcon.src = "asset/img/kapal-lawd-logo.jpg"; // Ganti dengan path gambar yang sesuai
      botIcon.alt = "Chatbot Icon"; // Deskripsi untuk aksesibilitas
      botIcon.classList.add("bot-icon"); // Tambahkan kelas untuk styling
      messageElement.appendChild(botIcon); // Tambahkan ikon ke messageElement
    }

    messageElement.innerHTML += text; // Tambahkan teks setelah ikon
    aiChatMessages.appendChild(messageElement);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight; // Scroll ke bawah
  }

  async function typeWriterEffect(html) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "bot-message");

    // Bikin container buat isi icon dan teks biar align rapi
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("message-content");

    // Tambahin bot icon ke contentContainer
    const botIcon = document.createElement("img");
    botIcon.src = "asset/img/kapal-lawd-logo.jpg"; // Path ke icon lo
    botIcon.alt = "Chatbot Icon";
    botIcon.classList.add("bot-icon");

    contentContainer.appendChild(botIcon); // Append icon ke container

    // Tambahin div buat teks
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-content");
    contentContainer.appendChild(textContainer); // Masukin teks ke content

    messageElement.appendChild(contentContainer); // Append contentContainer ke message
    aiChatMessages.appendChild(messageElement); // Append message ke chat

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const nodes = Array.from(tempDiv.childNodes);

    let nodeIndex = 0;
    let charIndex = 0;

    // Disable tombol kirim pas animasi jalan
    aiSendMessage.disabled = true;
    aiSendMessage.style.backgroundColor = "grey";

    function type() {
      if (nodeIndex < nodes.length) {
        const node = nodes[nodeIndex];
        if (node.nodeType === Node.TEXT_NODE) {
          if (charIndex < node.length) {
            textContainer.innerHTML += node.textContent[charIndex];
            charIndex++;
          } else {
            nodeIndex++;
            charIndex = 0;
          }
        } else {
          textContainer.appendChild(node.cloneNode(true));
          nodeIndex++;
        }
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        setTimeout(type, 20); // Speed typing
      } else {
        // Kembalikan status tombol kirim
        aiSendMessage.querySelector("i").style.display = "block";
        aiSendMessage.disabled = aiUserInput.value.trim() === "";
        aiSendMessage.style.backgroundColor = aiSendMessage.disabled
          ? "grey"
          : "";
        aiSendMessage.querySelector("i").style.color = aiSendMessage.disabled
          ? "rgba(255, 255, 255, 0.5)"
          : "white";
      }
    }

    type(); // Mulai animasi typing
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

    // Convert bullet points with double tab
    text = text.replace(/^- (.+)$/gm, "\t\t<li>$1</li>");
    text = text.replace(
      /(<li>.*<\/li>\n?)+/g,
      "<ul style='padding-left: 2em;'>$&</ul>"
    );

    // Convert numbered lists with double tab
    text = text.replace(/^(\d+)\. (.+)$/gm, "\t\t<li value='$1'>$2</li>");
    text = text.replace(
      /(<li.*<\/li>\n?)+/g,
      "<ol style='padding-left: 2em;'>$&</ol>"
    );

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

  function addLoadingIndicator() {
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("loading-message", "typing-dots");

    // Menentukan teks yang ditampilkan berdasarkan currentMode
    const loadingText =
      currentMode === "image" ? "Generating image" : "Thinking";
    loadingMessage.innerHTML = `<span>${loadingText}</span><span>.</span><span>.</span><span>.</span>`; // Tambahkan titik-titik

    aiChatMessages.appendChild(loadingMessage); // Menambahkan di bagian bawah
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight; // Scroll ke bawah
    return loadingMessage;
  }
});
